from __future__ import annotations
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, DateTime, func, event

from .database import Base, gen_uuid

class BaseModel(Base):
    __abstract__ = True
    id: Mapped[str] = mapped_column(String(36), primary_key=True, index=True, default=gen_uuid)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    api_key: Mapped[str] = mapped_column(String(36), unique=True, index=True, nullable=False, default=gen_uuid)

    tickets: Mapped[list[Ticket]] = relationship(back_populates="author")

class Ticket(BaseModel):
    __tablename__ = "tickets"

    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    author: Mapped[User] = relationship(back_populates="tickets")
