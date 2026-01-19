from fastapi import Request
from fastapi.responses import PlainTextResponse

from app.database import session
from app.models import AuthToken

async def authentication_middleware(request: Request, call_next):
    received_auth_token = request.headers.get("X-AUTH-TOKEN")
    auth_token = session.query(AuthToken).first().auth_token
    if received_auth_token != auth_token:
        return PlainTextResponse(status_code=401, content="Unauthorized")

    return await call_next(request)
