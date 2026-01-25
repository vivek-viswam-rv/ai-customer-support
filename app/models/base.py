from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, UUID, DateTime

from app.database import Base as DBBase

class Base(DBBase):
    __abstract__ = True
    id = Column(UUID, default=uuid4, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
