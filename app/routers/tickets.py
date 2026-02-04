import asyncio
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.dependencies import api_authentication
from app.models import Ticket, User
from app.schemas import TicketCreate, TicketResponse

router = APIRouter(prefix="/tickets")

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id, db: Annotated[Session, Depends(get_db)], user: Annotated[User, Depends(api_authentication)]):
    ticket = db.execute(select(Ticket).where(Ticket.id == ticket_id, Ticket.user_id == user.id)).scalars().first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found!")

    return {
        "id": ticket.id,
        "description": ticket.description,
        "user_id": ticket.user_id
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_ticket(ticket: TicketCreate,
                  db: Annotated[Session, Depends(get_db)],
                  user: Annotated[User, Depends(api_authentication)]):

    new_ticket = Ticket(user_id=user.id, description=ticket.description)
    db.add(new_ticket)
    db.commit()

    return {
        "message": "Ticket created successfully!",
        "ticket_id": new_ticket.id
        }

@router.get("/{ticket_id}/response")
async def stream_events(request: Request):
    async def event_stream():
        try:
            async for event in event_generator():
                if await request.is_disconnected():
                    break
                yield event
            yield "event: done\ndata: Stream completed\n\n"
        except Exception as e:
            yield f"event: error\ndata: {str(e)}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")



async def event_generator():
    for i in "Hello world, How are you doing doing today?":
        await asyncio.sleep(0.05)
        yield f"data: {i}\n\n"
