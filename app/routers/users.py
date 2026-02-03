from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserSignIn, UserSignInResponse
from app.auth import verify_password

router = APIRouter(prefix="/users")

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    password_hash = hash_password(user.password)
    new_user = User(email=user.email, password_hash=password_hash)

    db.add(new_user)
    db.commit()

    return {"message": "Sign up successful!"}

@router.post("/signin", status_code=status.HTTP_200_OK)
def signin_user(user_details: UserSignIn, db: Annotated[Session, Depends(get_db)]):
    user = db.query(User).filter(User.email == user_details.email).first()
    if not user or not verify_password(user_details.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password!")

    return UserSignInResponse(email=user.email, api_key=user.api_key)
