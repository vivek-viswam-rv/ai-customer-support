from typing import Annotated
from fastapi import Header, status, HTTPException

from .constants import MAX_REQUESTS, TIME_WINDOW
from app.database import redis

async def rate_limiter(x_api_key: str = Header(default=None)):
    request_count = redis.incr(x_api_key)
    if request_count > MAX_REQUESTS:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    elif request_count == 1:
        redis.expire(x_api_key, TIME_WINDOW)
