from typing import Annotated

from pydantic import BaseModel, Field

class TicketCreate(BaseModel):
    description: Annotated[str, Field(min_length=10, max_length=1000)]

class TicketResponse(BaseModel):
    id: Annotated[str, Field(min_length=36, max_length=36)]
    description: Annotated[str, Field(min_length=10, max_length=1000)]
    user_id: Annotated[str, Field(min_length=36, max_length=36)]
