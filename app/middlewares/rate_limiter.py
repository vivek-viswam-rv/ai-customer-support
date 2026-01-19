from fastapi import Request, Response, status
from fastapi.responses import PlainTextResponse

from .constants import MAX_REQUESTS, TIME_WINDOW
from app.database import redis

async def rate_limiter_middleware(request: Request, call_next):
    auth_token = request.headers.get("X-AUTH-TOKEN")
    request_count = redis.incr(auth_token)
    if request_count > MAX_REQUESTS:
        return PlainTextResponse(status_code=status.HTTP_429_TOO_MANY_REQUESTS, content="Too many requests")
    elif request_count == 1:
        redis.expire(auth_token, TIME_WINDOW)

    return await call_next(request)
