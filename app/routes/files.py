import os
import hashlib
import uuid
import boto3
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from dbConfig.database import SessionLocal
from database_model.database_model import file_info as file_data
from database_model.database_model import user as user_data
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/files", tags=["Files"])

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")

if not S3_BUCKET:
    raise RuntimeError("AWS_S3_BUCKET must be set.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _s3_client():
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        raise HTTPException(status_code=500, detail="AWS credentials not configured")
    return boto3.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )


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
    client = _s3_client()
    client.put_object(
        Bucket=S3_BUCKET,
        Key=storage_path,
        Body=content,
        ContentType=content_type or "application/octet-stream",
    )


async def _delete_from_storage(storage_path: str):
    client = _s3_client()
    client.delete_object(Bucket=S3_BUCKET, Key=storage_path)


async def _create_signed_url(
    storage_path: str,
    expires_in: int = 60,
    filename: str | None = None,
    disposition: str | None = None,
) -> str:
    client = _s3_client()
    params = {"Bucket": S3_BUCKET, "Key": storage_path}
    if filename and disposition:
        params["ResponseContentDisposition"] = f'{disposition}; filename="{filename}"'
    return client.generate_presigned_url(
        "get_object",
        Params=params,
        ExpiresIn=expires_in,
    )


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
    storage_path = f"{current_user['org_id']}/{uuid.uuid4()}_{file.filename}"

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


# 4. GET /api/files/:id/open - Open a file in browser
@router.get("/{file_id}/open")
async def open_file(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    storage_path = (file.storage_path or "").strip()
    if not storage_path or storage_path == "local":
        raise HTTPException(status_code=404, detail="File is not available in storage")
    signed_url = await _create_signed_url(storage_path, 60, file.filename, "inline")
    return {"filename": file.filename, "signed_url": signed_url}


# 5. GET /api/files/:id/download - Download a file
@router.get("/{file_id}/download")
async def download_file(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    storage_path = (file.storage_path or "").strip()
    if not storage_path or storage_path == "local":
        raise HTTPException(status_code=404, detail="File is not available in storage")
    signed_url = await _create_signed_url(storage_path, 60, file.filename, "attachment")
    return {"filename": file.filename, "signed_url": signed_url}


# 6. DELETE /api/files/:id - Delete a file
@router.delete("/{file_id}")
async def delete_file(file_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    file = db.query(file_data).filter(
        file_data.file_id == file_id,
        file_data.org_id == current_user["org_id"]
    ).first()
    if not file:
        return {"error": "File not found"}
    storage_path = (file.storage_path or "").strip()
    if storage_path and storage_path != "local":
        await _delete_from_storage(storage_path)
    file.is_deleted = True
    db.commit()
    return {"message": "File deleted successfully"}


# 7. PATCH /api/files/:id/tags - Update file tags/metadata
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
