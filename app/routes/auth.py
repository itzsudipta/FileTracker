import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx

from dbConfig.database import SessionLocal
from database_model.database_model import user as user_data
from database_model.database_model import organization as org_data

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be set.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class LoginPayload(BaseModel):
    email: str
    password: str


class RegisterPayload(BaseModel):
    email: str
    password: str
    user_name: str
    org_name: str


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        "sb-access-token",
        access_token,
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60,
        path="/",
    )
    response.set_cookie(
        "sb-refresh-token",
        refresh_token,
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 30,
        path="/",
    )


async def _supabase_password_login(email: str, password: str) -> dict:
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"}
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json={"email": email, "password": password})
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return res.json()


async def _supabase_refresh(refresh_token: str) -> dict:
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=refresh_token"
    headers = {"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"}
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json={"refresh_token": refresh_token})
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Session expired")
    return res.json()


async def _supabase_get_user(access_token: str) -> dict:
    url = f"{SUPABASE_URL}/auth/v1/user"
    headers = {"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=headers)
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    return res.json()


async def _supabase_admin_create_user(email: str, password: str) -> dict:
    if not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="SUPABASE_SERVICE_ROLE_KEY is not configured")
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, headers=headers, json={"email": email, "password": password, "email_confirm": True})
    if res.status_code not in (200, 201):
        raise HTTPException(status_code=400, detail="Failed to create user")
    return res.json()


def _get_profile(db: Session, email: str):
    profile = db.query(
        user_data.user_id,
        user_data.user_name,
        user_data.org_id,
        user_data.user_email,
        user_data.u_role,
    ).filter(user_data.user_email == email).first()
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    org = db.query(org_data).filter(org_data.org_id == profile.org_id).first()
    return {
        "user_id": str(profile.user_id),
        "user_name": profile.user_name,
        "user_email": profile.user_email,
        "u_role": profile.u_role,
        "org_id": str(profile.org_id),
        "org_name": org.org_name if org else "Unknown Org",
    }


@router.post("/login")
async def login_user(payload: LoginPayload, response: Response, db: Session = Depends(get_db)):
    auth_data = await _supabase_password_login(payload.email, payload.password)
    _set_auth_cookies(response, auth_data["access_token"], auth_data["refresh_token"])
    profile = _get_profile(db, payload.email)
    return {"message": "Login successful", "user": profile}


@router.post("/register")
async def register_user(payload: RegisterPayload, response: Response, db: Session = Depends(get_db)):
    created = await _supabase_admin_create_user(payload.email, payload.password)
    new_org = org_data(
        org_name=payload.org_name,
        domain_name=f"@{payload.org_name.lower()}.com",
        storage_limit="10GB",
    )
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    new_user = user_data(
        user_id=uuid.UUID(created.get("id")),
        org_id=new_org.org_id,
        user_name=payload.user_name,
        user_email=payload.email,
        u_role="user",
        joined_at="now()",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    auth_data = await _supabase_password_login(payload.email, payload.password)
    _set_auth_cookies(response, auth_data["access_token"], auth_data["refresh_token"])
    profile = _get_profile(db, payload.email)
    return {"message": "User registered successfully", "user": profile}


@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("sb-access-token", path="/")
    response.delete_cookie("sb-refresh-token", path="/")
    return {"message": "Logout successful"}


@router.get("/me")
async def get_me(request: Request, response: Response, db: Session = Depends(get_db)):
    access_token = request.cookies.get("sb-access-token")
    refresh_token = request.cookies.get("sb-refresh-token")

    if not access_token and not refresh_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_email: Optional[str] = None
    if access_token:
        try:
            supa_user = await _supabase_get_user(access_token)
            user_email = supa_user.get("email")
        except HTTPException:
            user_email = None

    if not user_email and refresh_token:
        refreshed = await _supabase_refresh(refresh_token)
        _set_auth_cookies(response, refreshed["access_token"], refreshed["refresh_token"])
        supa_user = await _supabase_get_user(refreshed["access_token"])
        user_email = supa_user.get("email")

    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    profile = _get_profile(db, user_email)
    return {"user": profile}


async def get_current_user(request: Request, response: Response, db: Session = Depends(get_db)):
    data = await get_me(request, response, db)
    return data["user"]
