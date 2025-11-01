from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String , Text , Integer, DateTime, Boolean, ForeignKey , DECIMAL as Decimal
from sqlalchemy.dialects.postgresql import UUID , ARRAY as Array
import uuid
from sqlalchemy.orm import relationship
from datetime import datetime

import hashlib,uuid,shutil

Base = declarative_base()

#Degine the file section model
class file_info(Base):
    __tablename__ = 'file_data'
    
    file_id= Column(UUID, primary_key=True , nullable=False,default=uuid.uuid4)
    filelog = relationship("activity_log", back_populates="fileid")
    filemd = relationship("file_metadata", back_populates="filemetadata")

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
    userlogdetail = relationship("activity_log", back_populates="userlog")

#Define the organization model
class organization(Base):
    __tablename__ = 'org'
    org_id = Column(UUID, primary_key=True, nullable=False,default=uuid.uuid4)
    org_name = Column(String, nullable=False)
    domain_name=Column(String, nullable=False,default='@abc.org')
    plan_id=Column(UUID)
    created_at=Column(DateTime, nullable=False, default='now()')
    storage_limit=Column(String, nullable=False) #10GB default limit
    orginfo = relationship("subscription", back_populates="orgidinfo")


#define the plan model
class plan(Base):
    __tablename__ = 'plan'
    plan_id = Column(UUID, primary_key=True, nullable=False,default=uuid.uuid4)
    planinfo = relationship("subscription", back_populates="planidinfo")
    plan_name = Column(Text, nullable=False)
    storage_limit = Column(Integer, nullable=False)
    api_limit= Column(Integer)
    price_per_mnth= Column(Decimal(10,2), nullable=False)
    ai_feature= Column(Array(Text))

#define the subscription model
class subscription(Base):
    __tablename__ = 'subscrip'
    subscrip_id= Column(UUID, primary_key=True, nullable=False,default=uuid.uuid4)
    org_id= Column(UUID, ForeignKey("org.org_id"), nullable=False)
    orgidinfo = relationship("organization", back_populates="orginfo")
    plan_id= Column(UUID, ForeignKey("plan.plan_id"), nullable=False)
    planidinfo = relationship("plan", back_populates="planinfo")
    start_date= Column(DateTime, nullable=False, default='now()')
    end_date= Column(DateTime, nullable=False)
    status= Column(Text, nullable=False)

#define the actvity log model
class activity_log(Base):
    __tablename__ = 'actv_log'
    log_id = Column(UUID, primary_key=True, nullable=False,default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("user_data.user_id"), nullable=False)
    userlog = relationship("user", back_populates="userlogdetail")
    file_id = Column(UUID,  ForeignKey("file_data.file_id"),nullable=False)
    fileid = relationship("file_info",back_populates="filelog")
    action_log = Column( Text,nullable=False) 
    log_time = Column(DateTime, nullable=False)
    ip_add = Column(Text) 
    descrp = Column(Text)

#define the file metadata
class file_metadata(Base):
    __tablename__ = 'file_md'
     
    version_id=Column(UUID, primary_key=True , nullable=False,default=uuid.uuid4)
    file_id=Column(UUID, ForeignKey("file_data.file_id"), nullable=False)
    filemetadata=relationship("file_info", back_populates="filemd")
    ver_no =Column(Integer, nullable=False, default=1)
    storage_path=Column(Text, nullable=False) 
    created_at =Column(DateTime, nullable=False, default='now()')
    changelog=Column(Text, nullable=False)
