from typing import Union
from fastapi import FastAPI
from starlette.applications import Starlette


app = FastAPI()

@app.get("/")
async def init_api():
     return "hi , welcome to file tracker"