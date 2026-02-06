
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid
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
    user_email: EmailStr
    u_role: Optional[str] = 'admin'
    joined_at: Optional[datetime] = None
    is_active: Optional[bool] = True

# Schema for creating a user
class UserCreate(UserBase):
    pass

# Schema for reading a user
class User(UserBase):
    user_id: uuid.UUID
    class Config:
        orm_mode = True                   

#schema for plan
class PlanBase(BaseModel):
    plan_name: str
    storage_limit: int
    api_limit: Optional[int] = None
    price_per_mnth: float
    ai_feature: Optional[List[str]] = None

class PlanCreate(PlanBase):
    pass

class Plan(PlanBase):
    plan_id: uuid.UUID
    class Config:
        orm_mode = True

#Schema for subscription
class SubscriptionBase(BaseModel):
    org_id: uuid.UUID
    plan_id: uuid.UUID
    start_date: datetime
    end_date: datetime
    status: str

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    subscrip_id: uuid.UUID
    class Config:
        orm_mode = True

#Schema for activity log
class ActivityLogBase(BaseModel):
    user_id: uuid.UUID
    file_id: uuid.UUID
    action_log: str
    log_time: datetime
    ip_add: Optional[str] = None
    descrp: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLog(ActivityLogBase):
    log_id: uuid.UUID
    class Config:
        orm_mode = True 

#Schema for file metadata
class FileMetadataBase(BaseModel):
    file_id: uuid.UUID
    ver_no: int
    storage_path: str
    created_at: datetime
    changelog: str

class FileMetadataCreate(FileMetadataBase):
    pass

class FileMetadata(FileMetadataBase):
    version_id: uuid.UUID
    class Config:
        orm_mode = True

#schema for file analytics
class FileAnalyticsBase(BaseModel):
    file_id: uuid.UUID
    view_count: int
    download_count: int
    last_accesed: Optional[datetime] = None
    unique_users: Optional[int] = None

class FileAnalyticsCreate(FileAnalyticsBase):
    pass

class FileAnalytics(FileAnalyticsBase):
    anly_id: uuid.UUID
    class Config:
        orm_mode = True

#schema for file access 
class FileAccessBase(BaseModel):
    file_id: uuid.UUID
    access_type: str
    shared_with: uuid.UUID
    expiry_date: Optional[datetime] = None
    max_download: Optional[int] = None
    pwd_protect: bool
    access_status: str

class FileAccessCreate(FileAccessBase):
    pass

class FileAccess(FileAccessBase):
    acces_id: uuid.UUID
    class Config:
        orm_mode = True

#schema for embedded data indexing
class EmbeddedDataBase(BaseModel):
    file_id: uuid.UUID
    vector_data: dict
    model_used: str
    created_at: datetime

class EmbeddedDataCreate(EmbeddedDataBase):
    pass

class EmbeddedData(EmbeddedDataBase):
    embed_id: uuid.UUID
    class Config:
        orm_mode = True

#schema for notification settings
class NotificationSettingsBase(BaseModel):  
    User_id: uuid.UUID
    notification_type: str
    Notification_message: str
    is_read: bool
    create_at: datetime

class NotificationSettingsCreate(NotificationSettingsBase):
    pass

class NotificationSettings(NotificationSettingsBase):
    notification_id: uuid.UUID
    class Config:
        orm_mode = True

#schema for webhook logs
class WebhookLogsBase(BaseModel):
    org_id: uuid.UUID
    url: str
    event_type: str
    secret_token: str
    is_active: datetime

class WebhookLogsCreate(WebhookLogsBase):
    pass

class WebhookLogs(WebhookLogsBase):
    webhook_id: uuid.UUID
    class Config:
        orm_mode = True 
