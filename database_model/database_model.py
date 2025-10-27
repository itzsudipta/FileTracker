from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String , Text , Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

import hashlib,uuid,shutil

Base = declarative_base()

#Degine the file section model
class file_info(Base):
    __tablename__ = 'file_data'
    
    file_id= Column(UUID, primary_key=True , nullable=False,default=uuid.uuid4)
    owner_id = Column(UUID,ForeignKey("user_data.user_id"),nullable=False)
    
    fileinfo = relationship("user", back_populates="usernfo")
    org_id = Column(UUID, nullable=False,default=uuid.uuid4)
    filename = Column(Text, nullable=False)
    storage_path = Column(Text, nullable=False)
    file_type = Column(Text, nullable=False)
    file_size = Column(Integer, nullable=False)
    checksum = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, nullable=False,default=datetime.utcnow)
    is_deleted = Column(Boolean, nullable=False)

#Define the user model
class user(Base):
    __tablename__ = 'user_data'
    
    user_id = Column(UUID, primary_key=True, nullable=False)
    org_id = Column(UUID,nullable=False,default=uuid.uuid4)
    user_name= Column(Text, nullable=False)
    user_emain= Column(Text, nullable=False)
    u_password= Column(Text, nullable=False)
    u_role= Column(Text, nullable=False, default='admin')
    joined_at= Column(DateTime, nullable=False, default='now()')
    login_at= Column(DateTime, nullable=False, default='now()')
    is_active= Column(Boolean,nullable=False, default=True)
    usernfo = relationship("file_info", back_populates="fileinfo")

#Define the organization model
class organization(Base):
    __tablename__ = 'org'
    org_id = Column(UUID, primary_key=True, nullable=False,default=uuid.uuid4)
    org_name = Column(String, nullable=False)
    domain_name=Column(String, nullable=False,default='@abc.org')
    plan_id=Column(UUID)
    created_at=Column(DateTime, nullable=False, default='now()')
    storage_limit=Column(String, nullable=False) #10GB default limit



