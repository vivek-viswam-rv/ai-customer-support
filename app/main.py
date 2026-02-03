from fastapi import FastAPI

from .routers import tickets_router, users_router
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(tickets_router, prefix="/api")
app.include_router(users_router, prefix="/api")
