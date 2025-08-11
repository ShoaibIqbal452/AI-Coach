from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.schemas.chat import ChatMessageCreate, ChatResponse, ChatHistory, ChatHistoryItem, ChatMessageUpdate
from app.services.chat_service import process_user_message, get_chat_messages_by_user_id, get_chat_message_by_id, update_chat_message
from app.services.profile_service import get_profile_by_user_id
from app.services.plan_service import create_plan_from_message
from app.api.v1.routes.auth import oauth2_scheme
from app.utils.jwt import verify_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    from app.services.user_service import get_user_by_username
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/send", response_model=ChatResponse)
async def send_message(message: ChatMessageCreate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Send a message to the AI coach and get a response
    """
    user_profile = get_profile_by_user_id(db, user_id=current_user.id)
    
    response = process_user_message(db, message.content, current_user.id, user_profile=user_profile)
    
    return response

@router.get("/history", response_model=ChatHistory)
async def get_chat_history(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get chat history for the current user
    """
    chat_messages = get_chat_messages_by_user_id(db, user_id=current_user.id)
    
    return {
        "messages": chat_messages
    }

@router.put("/message/{message_id}/mark-plan", status_code=status.HTTP_200_OK)
async def mark_message_as_plan(
    message_id: str,
    message_update: ChatMessageUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a chat message as a plan and create a plan from it
    """
    message = get_chat_message_by_id(db, message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this message"
        )
    
    updated_message = update_chat_message(db, message_id, message_update)
    
    if message_update.is_plan and message_update.plan_type:
        plan = create_plan_from_message(db, message, current_user.id, message_update.plan_type)
        return {"message": "Message marked as plan and plan created", "plan_id": plan.id}
    
    return {"message": "Message updated successfully"}
