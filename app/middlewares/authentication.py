from fastapi import Request, status
from fastapi.responses import PlainTextResponse

from app.database import session
from app.models import ApiKey

async def authentication_middleware(request: Request, call_next):
    received_api_key = request.headers.get("X-API-KEY")
    api_key = session.query(ApiKey).first().api_key
    if received_api_key != api_key:
        return PlainTextResponse(status_code=status.HTTP_401_UNAUTHORIZED, content="Unauthorized")

    return await call_next(request)
