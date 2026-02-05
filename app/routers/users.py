from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import get_db
from app.models import User, Order
from app.schemas import OrderStatus, UserCreate, UserSignIn, UserSignInResponse
from app.auth import verify_password

router = APIRouter(prefix="/users")

@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    does_user_exist = db.execute(select(User).where(User.email == user.email).limit(1)).first()

    if does_user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists!")

    password_hash = hash_password(user.password)
    new_user = User(email=user.email, password_hash=password_hash)

    db.add(new_user)
    db.flush()
    populate_orders(new_user, db)
    db.commit()

    return {"message": "Sign up successful!"}

@router.post("/signin", status_code=status.HTTP_200_OK)
def signin_user(user_details: UserSignIn, db: Annotated[Session, Depends(get_db)]):
    user = db.scalars(select(User).where(User.email == user_details.email).limit(1)).first()
    if not user or not verify_password(user_details.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password!")

    return UserSignInResponse(email=user.email, api_key=user.api_key)

def populate_orders(user: User, db: Session):
    db.add_all([
        Order(user_id=user.id, product_name="Wireless Mouse", status=OrderStatus(status="Delivered").status),
        Order(user_id=user.id, product_name="Bluetooth Headphones", status=OrderStatus(status="Refunded").status),
        Order(user_id=user.id, product_name="USB-C Charger", status=OrderStatus(status="Returned").status),
    ])
