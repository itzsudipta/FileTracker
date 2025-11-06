from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from sqlalchemy import text
from dbConfig.database import SessionLocal
from database_model.database_model import file_info as file_data

router = APIRouter(prefix="/api", tags=["System & Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 11. GET /api/stats - Dashboard statistics
@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_files = db.query(file_data).filter(file_data.is_deleted == False).count()
    total_storage = db.query(file_data).filter(file_data.is_deleted == False).with_entities(text("SUM(file_size)")).scalar() or 0
    
    return {
        "total_files": total_files,
        "storage_used": total_storage,
        "storage_unit": "KB"
    }

# 12. GET /api/settings - Get user settings
@router.get("/settings")
async def get_settings(user_id: uuid.UUID):
    return {"theme": "light", "notifications": True, "user_id": str(user_id)}

# 12. PUT /api/settings - Update user settings
@router.put("/settings")
async def update_settings(user_id: uuid.UUID, theme: str = None, notifications: bool = None):
    return {"message": "Settings updated successfully", "theme": theme, "notifications": notifications}
