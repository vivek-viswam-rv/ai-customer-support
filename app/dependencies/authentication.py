from fastapi import Header, status, HTTPException

from app.database import session
from app.models import ApiKey

async def authentication(x_api_key: str = Header(default=None)):
    if x_api_key is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    api_key = session.query(ApiKey).first().api_key
    if x_api_key != api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
