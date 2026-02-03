from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas import TicketCreate, TicketResponse
from app.database import get_db
from app.models import Ticket, User
from app.dependencies import api_authentication

router = APIRouter(prefix="/tickets")

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id, db: Annotated[Session, Depends(get_db)], user: Annotated[User, Depends(api_authentication)]):
    ticket = db.execute(select(Ticket).where(Ticket.id == ticket_id, Ticket.user_id == user.id)).scalars().first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

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

    return {"message": "Ticket created successfully"}
