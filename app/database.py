import os
from dotenv import load_dotenv
from uuid import uuid4

from redis import Redis
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

redis = Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=0)
engine = create_engine(os.getenv("DATABASE_URL"))

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine)

def get_db():
    with SessionLocal() as db:
        yield db

def gen_uuid():
    return str(uuid4())
