from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from langchain.agents import create_agent
from langchain.messages import HumanMessage

from app.database import get_db
from app.dependencies import api_authentication, stream_authentication
from app.models import Ticket, User
from app.schemas import TicketCreate, TicketResponse
from app.agentic_tools import TOOLS

from .constants import SYSTEM_PROMPT, MODEL

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

@router.post("", status_code=status.HTTP_201_CREATED)
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
async def stream_events(request: Request, db: Annotated[Session, Depends(get_db)],
                        user: Annotated[User, Depends(stream_authentication)], ticket_id: str):

    description = db.execute(select(Ticket.description).where(Ticket.id == ticket_id, Ticket.user_id == user.id)).scalars().first()
    if not description:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found!")

    agent = create_agent(
        model=MODEL,
        tools=TOOLS,
        system_prompt= SYSTEM_PROMPT +
        f"Here's the ticket ID you are working on: {ticket_id}. And the user ID is: {user.id}"
    )

    async def event_stream():
        response = ""
        try:
            for token, metadata in agent.stream(
                {"messages": [HumanMessage(content=description)]},
                stream_mode="messages"
            ):
                if await request.is_disconnected():
                    break
                if token.content and metadata.get("langgraph_node") != "tools":
                    response += token.content
                    yield f"data: {token.content}\n\n"

            db.execute(update(Ticket).where(Ticket.id == ticket_id).values(response=response))
            db.commit()

            yield "event: done\ndata: Stream completed\n\n"
        except Exception as e:
            yield f"event: error\ndata: {str(e)}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")
