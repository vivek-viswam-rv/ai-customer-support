from fastapi import FastAPI

from .database import engine, Base
from .middlewares import authentication_middleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.middleware("http")(authentication_middleware)
