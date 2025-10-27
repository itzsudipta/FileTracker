from typing import Union , Annotated
from fastapi import Depends,FastAPI , File, UploadFile
import multipart
from fastapi.middleware.cors import CORSMiddleware
from starlette.applications import Starlette
from dbConfig.database import SessionLocal as session ,engine
from sqlalchemy.orm import Session
from sqlalchemy import text

import hashlib,uuid,shutil
from models.schema import FileInfoCreate ,UserBase ,FileInfo
from database_model.database_model import file_info as file_data
app = FastAPI()

def get_db():
     db = session()
     try:
          yield db
     finally:
          db.close()

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
          user_emain="abc@zoho.in",
          u_password="password123",
          u_role="admin",
          joined_at="now()",
          login_at="now()",
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
