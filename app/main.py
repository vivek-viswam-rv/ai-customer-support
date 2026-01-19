from fastapi import FastAPI

from .database import engine, Base
from .middlewares import authentication_middleware, rate_limiter_middleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.middleware("http")(rate_limiter_middleware)
app.middleware("http")(authentication_middleware)
