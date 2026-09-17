import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import tickets_router, users_router
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def read_root():
    return {"message": "App's healthy!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in [os.getenv("FRONTEND_URL"), "http://localhost:5173"] if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets_router, prefix="/api")
app.include_router(users_router, prefix="/api")
