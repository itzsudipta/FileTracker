from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from dbConfig.database import SessionLocal
from database_model.database_model import user as user_data

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
async def register_user(user_name: str, user_email: str, password: str, db: Session = Depends(get_db)):
    new_user = user_data(
        user_id=uuid.uuid4(),
        org_id="3a833e58-514c-4643-bdff-1a3532e2f830",
        user_name=user_name,
        user_emain=user_email,
        u_password=password,
        u_role="user",
        joined_at="now()",
        login_at="now()",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.user_id}

# 8. POST /api/auth/login - User login
@router.post("/login")
async def login_user(user_email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(user_data).filter(user_data.user_emain == user_email).first()
    if not user or user.u_password != password:
        return {"error": "Invalid credentials"}
    return {"message": "Login successful", "user_id": user.user_id, "token": "sample_token_123"}

# 9. POST /api/auth/logout - User logout
@router.post("/logout")
async def logout_user():
    return {"message": "Logout successful"}
