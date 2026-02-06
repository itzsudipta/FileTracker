import os
import hashlib
import uuid
import httpx
from urllib.parse import quote
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from dbConfig.database import SessionLocal
from database_model.database_model import file_info as file_data
from database_model.database_model import user as user_data
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/files", tags=["Files"])

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "filedata")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL must be set.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _storage_headers():
    if not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="SUPABASE_SERVICE_ROLE_KEY is not configured")
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }

def _encode_storage_path(storage_path: str) -> str:
    return quote(storage_path, safe="/")


def _serialize_file(file: file_data, owner_name: str | None = None) -> dict:
    return {
        "file_id": str(file.file_id),
        "filename": file.filename,
        "file_type": file.file_type,
        "file_size": file.file_size,
        "uploaded_at": file.uploaded_at,
        "storage_path": file.storage_path,
        "owner_name": owner_name or "Unknown",
    }


async def _upload_to_storage(storage_path: str, content: bytes, content_type: str):
    encoded_path = _encode_storage_path(storage_path)
    url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{encoded_path}"
    headers = _storage_headers()
    headers["Content-Type"] = content_type or "application/octet-stream"
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, content=content)
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Storage upload failed")


async def _delete_from_storage(storage_path: str):
    encoded_path = _encode_storage_path(storage_path)
    url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{encoded_path}"
    async with httpx.AsyncClient() as client:
        res = await client.delete(url, headers=_storage_headers())
    if res.status_code not in (200, 204):
        raise HTTPException(status_code=500, detail="Storage delete failed")


async def _create_signed_url(storage_path: str, expires_in: int = 60) -> str:
    encoded_path = _encode_storage_path(storage_path)
    url = f"{SUPABASE_URL}/storage/v1/object/sign/{STORAGE_BUCKET}/{encoded_path}"
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=_storage_headers(), json={"expiresIn": expires_in})
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to create signed URL")
    data = res.json()
    signed_path = data.get("signedURL")
    if not signed_path:
        raise HTTPException(status_code=500, detail="Signed URL missing")
    base = SUPABASE_URL.rstrip("/")
    if signed_path.startswith("/object/"):
        signed_path = "/storage/v1" + signed_path
    return f"{base}{signed_path}"


def _normalize_storage_path(storage_path: str) -> str:
    if not storage_path:
        return ""
    path = storage_path.strip()
    if path.startswith(SUPABASE_URL):
        parts = path.split("/storage/v1/object/", 1)
        if len(parts) == 2:
            path = parts[1]
    path = path.lstrip("/")
    if path.startswith(f"{STORAGE_BUCKET}/"):
        path = path[len(f"{STORAGE_BUCKET}/"):]
    return path


# 1. GET /api/files - Fetch all uploaded files
@router.get("")
async def get_all_files(search: str = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    query = db.query(file_data, user_data.user_name.label("owner_name")).join(
        user_data, user_data.user_id == file_data.owner_id, isouter=True
    ).filter(
        file_data.is_deleted == False,
        file_data.org_id == current_user["org_id"]
    )
    if search:
        query = query.filter(file_data.filename.ilike(f"%{search}%"))
    rows = query.all()
    return [_serialize_file(f, owner_name) for f, owner_name in rows]


# 2. GET /api/files/:id - Get single file metadata
@router.get("/{file_id}")
async def get_file_by_id(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    row = db.query(file_data, user_data.user_name.label("owner_name")).join(
        user_data, user_data.user_id == file_data.owner_id, isouter=True
    ).filter(
        file_data.file_id == file_id,
        file_data.is_deleted == False,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not row:
        return {"error": "File not found"}
    file, owner_name = row
    return _serialize_file(file, owner_name)


# 3. POST /api/files/upload - Upload new file
@router.post("/upload")
async def upload_file_api(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    content = await file.read()
    checksum = hashlib.md5(content).hexdigest()
    storage_path = _normalize_storage_path(f"{current_user['org_id']}/{uuid.uuid4()}_{file.filename}")

    await _upload_to_storage(storage_path, content, file.content_type or "application/octet-stream")

    db_file = file_data(
        owner_id=current_user["user_id"],
        org_id=current_user["org_id"],
        filename=file.filename,
        storage_path=storage_path,
        file_type=file.content_type,
        file_size=len(content),
        checksum=checksum,
        is_deleted=False
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return _serialize_file(db_file, current_user.get("user_name"))


# 4. GET /api/files/:id/download - Download a file
@router.get("/{file_id}/download")
async def download_file(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    storage_path = _normalize_storage_path(file.storage_path or "")
    if not storage_path or storage_path == "local":
        raise HTTPException(status_code=404, detail="File is not available in storage")
    signed_url = await _create_signed_url(storage_path, 60)
    return {"filename": file.filename, "signed_url": signed_url}


# 5. DELETE /api/files/:id - Delete a file
@router.delete("/{file_id}")
async def delete_file(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    storage_path = _normalize_storage_path(file.storage_path or "")
    if storage_path and storage_path != "local":
        await _delete_from_storage(storage_path)
    file.is_deleted = True
    db.commit()
    return {"message": "File deleted successfully"}


# 6. PATCH /api/files/:id/tags - Update file tags/metadata
@router.patch("/{file_id}/tags")
async def update_file_tags(file_id: uuid.UUID, filename: str = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    if filename:
        file.filename = filename
    db.commit()
    return {"message": "File updated successfully", "file": file}
