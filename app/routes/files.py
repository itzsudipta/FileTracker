from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
import hashlib
import uuid
from dbConfig.database import SessionLocal
from database_model.database_model import file_info as file_data

router = APIRouter(prefix="/api/files", tags=["Files"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. GET /api/files - Fetch all uploaded files
@router.get("")
async def get_all_files(search: str = None, db: Session = Depends(get_db)):
    query = db.query(file_data).filter(file_data.is_deleted == False)
    if search:
        query = query.filter(file_data.filename.ilike(f"%{search}%"))
    return query.all()

# 2. GET /api/files/:id - Get single file metadata
@router.get("/{file_id}")
async def get_file_by_id(file_id: uuid.UUID, db: Session = Depends(get_db)):
    file = db.query(file_data).filter(file_data.file_id == file_id, file_data.is_deleted == False).first()
    if not file:
        return {"error": "File not found"}
    return file

# 3. POST /api/files/upload - Upload new file
@router.post("/upload")
async def upload_file_api(file: UploadFile = File(...), owner_id: str = "d05215f1-63be-49b9-8188-b6bf59e8b540", db: Session = Depends(get_db)):
    content = await file.read()
    checksum = hashlib.md5(content).hexdigest()
    
    db_file = file_data(
        owner_id=owner_id,
        org_id="3a833e58-514c-4643-bdff-1a3532e2f830",
        filename=file.filename,
        storage_path="local",
        file_type=file.content_type,
        file_size=len(content) / 1024,
        checksum=checksum,
        is_deleted=False
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

# 4. GET /api/files/:id/download - Download a file
@router.get("/{file_id}/download")
async def download_file(file_id: uuid.UUID, db: Session = Depends(get_db)):
    file = db.query(file_data).filter(file_data.file_id == file_id).first()
    if not file:
        return {"error": "File not found"}
    return {"message": "Download file", "filename": file.filename, "path": file.storage_path}

# 5. DELETE /api/files/:id - Delete a file
@router.delete("/{file_id}")
async def delete_file(file_id: uuid.UUID, db: Session = Depends(get_db)):
    file = db.query(file_data).filter(file_data.file_id == file_id).first()
    if not file:
        return {"error": "File not found"}
    file.is_deleted = True
    db.commit()
    return {"message": "File deleted successfully"}

# 6. PATCH /api/files/:id/tags - Update file tags/metadata
@router.patch("/{file_id}/tags")
async def update_file_tags(file_id: uuid.UUID, filename: str = None, db: Session = Depends(get_db)):
    file = db.query(file_data).filter(file_data.file_id == file_id).first()
    if not file:
        return {"error": "File not found"}
    if filename:
        file.filename = filename
    db.commit()
    return {"message": "File updated successfully", "file": file}
