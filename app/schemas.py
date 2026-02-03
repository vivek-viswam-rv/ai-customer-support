from typing import Annotated

from pydantic import BaseModel, EmailStr, Field

class TicketCreate(BaseModel):
    description: Annotated[str, Field(min_length=10, max_length=1000)]

class TicketResponse(BaseModel):
    id: Annotated[str, Field(min_length=36, max_length=36)]
    description: Annotated[str, Field(min_length=10, max_length=1000)]
    user_id: Annotated[str, Field(min_length=36, max_length=36)]

class UserCreate(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=100)]

class UserSignIn(UserCreate):
    pass

class UserSignInResponse(BaseModel):
    email: EmailStr
    api_key: str
