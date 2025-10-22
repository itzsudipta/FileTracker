from typing import Union
from fastapi import Depends,FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.applications import Starlette
from dbConfig.database import SessionLocal as session ,engine
from sqlalchemy.orm import Session
from sqlalchemy import text
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
     