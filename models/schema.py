
from pydantic import BaseModel ,EmailStr
from typing import Optional
import hashlib,uuid,shutil
from datetime import datetime

#Schema for file info

class FileInfoBase(BaseModel):
    org_id: uuid.UUID
    filename: str
    storage_path: str
    file_type: str
    file_size: int
    checksum: str
    uploaded_at: datetime
    is_deleted: bool

class FileInfoCreate(FileInfoBase):
    pass
class FileInfo(FileInfoBase):    
    file_id: uuid.UUID
    owner_id: uuid.UUID

    class Config:
        orm_mode = True  

#Schema for user
# Base schema
class UserBase(BaseModel):
    org_id: uuid.UUID
    user_name: str
    user_emain: EmailStr
    u_password: str
    u_role: Optional[str] = 'admin'
    joined_at: Optional[datetime] = None
    login_at: Optional[datetime] = None
    is_active: Optional[bool] = True

# Schema for creating a user
class UserCreate(UserBase):
    pass

# Schema for reading a user
class User(UserBase):
    user_id: uuid.UUID
    class Config:
        orm_mode = True                   
