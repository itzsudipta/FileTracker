from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()

#database connection setup 
db_url = os.getenv("database_url")
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit = False,autoflush=False,bind = engine)
