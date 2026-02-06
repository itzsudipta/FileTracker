from typing import Annotated
import os
from fastapi import Depends, FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from dbConfig.database import SessionLocal as session
from sqlalchemy.orm import Session
from sqlalchemy import text

import hashlib, uuid
from models.schema import FileInfoCreate ,UserBase ,FileInfo
from database_model.database_model import file_info as file_data

import time




app = FastAPI()

def get_db():
     db = session()
     try:
          yield db
     finally:
          db.close()
#adding  middleware for CORS
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
     allow_methods=["*"],
    allow_headers=["*"],
)

#adding middleware for database session management
@app.middleware("http")
async def db_session_middleware(request, call_next):
    request.state.db = session()
    response = await call_next(request)
    request.state.db.close()
    return response
#adding middleware for response time
@app.middleware("http")
async def compression_middleware(request : Request, call_next):
     start_time = time.perf_counter()
     response = await call_next(request)
     process_time = time.perf_counter() - start_time
     response.headers["X-Process-Time"] = str(process_time) 
    
     return response

#test database connection with the api route
@app.get("/DBtest")
async def init_api(db:Session=Depends(get_db)):
     
     try:
          result = db.execute(text("SELECT current_database()"))
          db_name = result.scalar()
          return{"Database connected successfully" : db_name}
     except Exception as e:
          return {"message" : "Database connection failed", "error": str(e)}
     


#this route will accept file upload and return file info
@app.post("/uploadfile/",response_model=FileInfoCreate)
async def create_upload_file (
     file: UploadFile = File(...),
     db:Session=Depends(get_db)
     
     ):

     content = await file.read()
     checksum = hashlib.md5(content).hexdigest()

     db_file =file_data(
          owner_id="d05215f1-63be-49b9-8188-b6bf59e8b540", 
          org_id="3a833e58-514c-4643-bdff-1a3532e2f830",   
          filename = file.filename,
          storage_path="local",
          file_type = file.content_type,
          file_size = len(content) / 1024,
          checksum = checksum,
          is_deleted=False
     
     )

     db.add(db_file)
     db.commit()
     db.refresh(db_file)
     return db_file



#routes for create a new user
@app.post("/createuser/",response_model=UserBase)
async def create_user(db:Session=Depends(get_db)):
     from database_model.database_model import user as user_data
     new_user = user_data(
          user_id=uuid.uuid4(),
          org_id="3a833e58-514c-4643-bdff-1a3532e2f830",
          user_name="Sudipta Sarkar",
          user_email="abc@zoho.in",
          u_role="admin",
          joined_at="now()",
          is_active=True
     )

     db.add( new_user)
     db.commit()
     db.refresh(new_user)
     return  new_user
     
   #routes for create a new organization
@app.post("/createorg/")
async def create_org(db:Session=Depends(get_db)):
     from database_model.database_model import organization as org_data
     new_org = org_data(
          org_id=uuid.uuid4(),
          org_name="InnovateX.com",
          domain_name="@innovatex.com",
          plan_id=uuid.uuid4(),
          created_at="now()",
          storage_limit="50 GB"
     )

     db.add( new_org)
     db.commit()
     print("Organization created successfully")
     db.refresh(new_org)
     return  new_org
#route to get all files data
@app.get("/getfilesdata/",response_model=list[FileInfo])
async def get_files_data(db:Session=Depends(get_db)):
     files = db.query(file_data).all()
     if not files:
          return "No files found"
     else:
          return files
#route for fetch single user data 
@app.get("/getUserData/{user_id}",response_model=list[UserBase])
async def get_users_data (user_id:Annotated[uuid.UUID,None],db:Session=Depends(get_db)):
     from database_model.database_model import user as user_data
     userinfo = db.query(user_data).all()
     if not userinfo:
          return "no files found"
     else:
          return userinfo
     

#route for create a new plan
from models.schema import Plan,PlanCreate
@app.post("/createplan/",response_model=PlanCreate)
async def create_plan(db:Session=Depends(get_db)):
     from database_model.database_model import plan as plan_data
     new_plan = plan_data(
          plan_id=uuid.uuid4(),
          plan_name="Pro Plan",
          storage_limit=100,
          api_limit=10000,
          price_per_mnth=29.99,
          ai_feature=["Basic AI Integration"]
     )
     db.add( new_plan)
     db.commit()
     print("Plan created successfully")
     db.refresh(new_plan)
     return  new_plan

#route for fetching all  plan data
@app.get("/getplandata/",response_model=list[Plan])
async def get_plans_data (db:Session=Depends(get_db)):
     from database_model.database_model import plan as plan_data
     planinfo = db.query(plan_data).all()
     if not planinfo:
          return "no files found"
     else:
          return planinfo

#create subscription route
from models.schema import SubscriptionBase ,SubscriptionCreate
@app.post("/createsubscription/",response_model=SubscriptionCreate)
async def create_subscription(db:Session=Depends(get_db)):
     from database_model.database_model import subscription as sub_data
     new_sub = sub_data(
          subscrip_id=uuid.uuid4(),
          org_id="3a833e58-514c-4643-bdff-1a3532e2f830",
          plan_id="8b7ef5d4-4182-4586-a819-596b217acf89",
          start_date="2024-06-01 00:00:00",
          end_date="2025-06-01 00:00:00",
          status="active"
     )
     db.add( new_sub)
     db.commit()
     print("Subscription created successfully")
     db.refresh(new_sub)
     return  new_sub

#route for create activity log
from models.schema import ActivityLogBase ,ActivityLogCreate
@app.post("/createactivitylog/",response_model=ActivityLogCreate)
async def create_activity_log(db:Session=Depends(get_db)):
     from database_model.database_model import activity_log as log_data
     new_log = log_data(
          log_id=uuid.uuid4(),
          user_id="d05215f1-63be-49b9-8188-b6bf59e8b540",
          file_id="09c99e53-af45-4bdd-a90f-9150d9653fe9",
          action_log="File uploaded successfully",
          log_time="2024-06-15 10:30:00",
          ip_add="192.168.1.1",
          descrp="File uploaded successfully"
     )
     db.add( new_log)
     db.commit()
     print("Activity log created successfully")
     db.refresh(new_log)
     return  new_log

#route for store or create file metadata
from models.schema import FileMetadataBase ,FileMetadataCreate
@app.post("/createfilemetadata/",response_model=FileMetadataCreate)
async def create_file_metadata(db:Session=Depends(get_db)):
     from database_model.database_model import file_metadata as md_data
     new_md = md_data(
          version_id=uuid.uuid4(),
          file_id="09c99e53-af45-4bdd-a90f-9150d9653fe9",
          ver_no=1,
          storage_path="local/v1/file.txt",
          created_at="2024-06-15 10:30:00",
          changelog="File uploaded successfully"
     )
     db.add( new_md)
     db.commit()
     print("File metadata created successfully")
     db.refresh(new_md)
     return  new_md 

#route for file analytics
from models.schema import FileAnalyticsBase ,FileAnalyticsCreate
@app.post("/createfileanalytics/",response_model=FileAnalyticsCreate)
async def create_file_analytics(db:Session=Depends(get_db)):
     from database_model.database_model import file_analytics as anly_data
     new_anly = anly_data(
          anly_id=uuid.uuid4(),
          file_id="09c99e53-af45-4bdd-a90f-9150d9653fe9",
          view_count=150,
          download_count=100,
          last_accesed="2024-06-15 10:30:00",
          unique_users=1000
     )
     db.add( new_anly)
     db.commit()
     print("File analytics created successfully")
     db.refresh(new_anly)
     return  new_anly

#route for create file access
from models.schema import FileAccessBase ,FileAccessCreate
@app.post("/createfileaccess/",response_model=FileAccessCreate)
async def create_file_access(db:Session=Depends(get_db)):   
     from database_model.database_model import file_access as access_data
     new_access = access_data(
          acces_id=uuid.uuid4(),
          file_id="09c99e53-af45-4bdd-a90f-9150d9653fe9",
          access_type="private",
          shared_with="d05215f1-63be-49b9-8188-b6bf59e8b540",
          expiry_date="2024-12-31 23:59:59",
          max_download=5,
          pwd_protect=True,
          access_status="Active"
     )
     db.add( new_access)
     db.commit()
     print("File access created successfully")
     db.refresh(new_access)
     return  new_access

#route for create embedded data indexing
from models.schema import EmbeddedDataBase ,EmbeddedDataCreate
@app.post("/createembeddeddata/",response_model=EmbeddedDataCreate)
async def create_embedded_data(db:Session=Depends(get_db)):
     from database_model.database_model import embedded_data as embed_data
     new_embed = embed_data(
          embed_id=uuid.uuid4(),
          file_id="09c99e53-af45-4bdd-a90f-9150d9653fe9",
          vector_data={"embedding": [0.1, 0.2, 0.3]},
          model_used="text-embedding-ada-002",
          created_at="2024-06-15 10:30:00"
     )
     db.add( new_embed)
     db.commit()
     print("Embedded data created successfully")
     db.refresh(new_embed)
     return  new_embed


# ============================================
# Include API Routers
# ============================================
from app.routes import files, auth, user, system

app.include_router(files.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(system.router)
