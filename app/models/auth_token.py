from secrets import token_hex

from sqlalchemy import Column, String

from .base import Base
from .constants import AUTH_TOKEN_LENGTH

class AuthToken(Base):
    __tablename__ = "auth_tokens"
    auth_token = Column(String, default=token_hex(AUTH_TOKEN_LENGTH))
