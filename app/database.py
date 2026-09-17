import os
from dotenv import load_dotenv
from uuid import uuid4

from redis import Redis
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

redis = Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=0)
# On Vercel every function instance would otherwise hold its own connection pool.
# Supabase's pooler (Supavisor, transaction mode, port 6543) does the pooling instead.
engine = create_engine(DATABASE_URL, poolclass=NullPool)

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine)

def get_db():
    with SessionLocal() as db:
        yield db

def gen_uuid():
    return str(uuid4())
