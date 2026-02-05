from fastapi import Header, status, HTTPException, Depends
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

async def api_authentication(x_api_key: Annotated[str | None, Header()], db: Annotated[Session, Depends(get_db)]):
    user = db.execute(select(User).where(User.api_key == x_api_key)).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access!")

    return user

async def stream_authentication(api_key: str, db: Annotated[Session, Depends(get_db)]):
    user = db.execute(select(User).where(User.api_key == api_key)).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access!")

    return user
