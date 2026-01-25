from secrets import token_hex

from sqlalchemy import Column, String

from .base import Base
from .constants import API_KEY_LENGTH

class ApiKey(Base):
    __tablename__ = "api_keys"
    api_key = Column(String, default=token_hex(API_KEY_LENGTH))
