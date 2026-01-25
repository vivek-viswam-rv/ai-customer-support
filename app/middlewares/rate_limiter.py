from fastapi import Request, status
from fastapi.responses import PlainTextResponse

from .constants import MAX_REQUESTS, TIME_WINDOW
from app.database import redis

async def rate_limiter_middleware(request: Request, call_next):
    api_key = request.headers.get("X-API-KEY")
    request_count = redis.incr(api_key)
    if request_count > MAX_REQUESTS:
        return PlainTextResponse(status_code=status.HTTP_429_TOO_MANY_REQUESTS, content="Too many requests")
    elif request_count == 1:
        redis.expire(api_key, TIME_WINDOW)

    return await call_next(request)
