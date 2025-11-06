from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from dbConfig.database import SessionLocal
from database_model.database_model import user as user_data

router = APIRouter(prefix="/api/user", tags=["User"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
async def get_user_profile(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = db.query(user_data).filter(user_data.user_id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user
