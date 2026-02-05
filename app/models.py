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
    orders: Mapped[list[Order]] = relationship(back_populates="buyer")

class Ticket(BaseModel):
    __tablename__ = "tickets"

    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    author: Mapped[User] = relationship(back_populates="tickets")

class Order(BaseModel):
    __tablename__ = "orders"

    product_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(60), nullable=False, default="Delivered")
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    buyer: Mapped[User] = relationship(back_populates="orders")
    history: Mapped[list[OrderHistory]] = relationship(back_populates="order", cascade="all, delete-orphan")

class OrderHistory(BaseModel):
    __tablename__ = "order_history"

    status: Mapped[str] = mapped_column(String(60), nullable=False, default="Delivered")
    order_id: Mapped[str] = mapped_column(
        ForeignKey("orders.id"),
        nullable=False
    )

    order: Mapped[Order] = relationship(back_populates="history")

def log_order_status_change(__, connection, target):
    history_table = OrderHistory.__table__
    connection.execute(
        history_table.insert().values(
            order_id=target.id,
            status=target.status,
            created_at=func.now()
        )
    )

event.listen(Order, "after_update", log_order_status_change)
event.listen(Order, "after_insert", log_order_status_change)
