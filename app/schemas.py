from typing import Annotated, Literal

from pydantic import BaseModel, EmailStr, Field

class TicketCreate(BaseModel):
    description: Annotated[str, Field(min_length=10, max_length=1000)]

class TicketResponse(BaseModel):
    id: Annotated[str, Field(min_length=36, max_length=36)]
    description: Annotated[str, Field(min_length=10, max_length=1000)]
    user_id: Annotated[str, Field(min_length=36, max_length=36)]

class UserCreate(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=6, max_length=100)]

class UserSignIn(UserCreate):
    pass

class UserSignInResponse(BaseModel):
    email: EmailStr
    api_key: str

class OrderStatus(BaseModel):
    status: Literal["delivered", "returned", "refunded"] = "delivered"

class Order(OrderStatus):
    id: int
    product_name: str
    user_id: str

class OrderHistory(OrderStatus):
    order_id: str
