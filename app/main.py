from fastapi import FastAPI

from .controllers import policy_router
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(policy_router)
