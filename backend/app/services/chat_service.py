from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageUpdate
from app.services.openai_service import generate_ai_response
from uuid import uuid4

def create_chat_message(db: Session, message: ChatMessageCreate, user_id: str) -> ChatMessage:
    """
    Create a new chat message in the database
    """
    db_message = ChatMessage(
        id=str(uuid4()),
        user_id=user_id,
        role=message.role,
        content=message.content,
        is_plan=message.is_plan,
        plan_type=message.plan_type
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_messages_by_user_id(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[ChatMessage]:
    """
    Get all chat messages for a specific user
    """
    return db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.timestamp).offset(skip).limit(limit).all()

def get_chat_message_by_id(db: Session, message_id: str) -> Optional[ChatMessage]:
    """
    Get a specific chat message by ID
    """
    return db.query(ChatMessage).filter(ChatMessage.id == message_id).first()

def delete_chat_message(db: Session, message_id: str) -> bool:
    """
    Delete a chat message by ID
    """
    message = get_chat_message_by_id(db, message_id)
    if message:
        db.delete(message)
        db.commit()
        return True
    return False

def update_chat_message(db: Session, message_id: str, message_update: ChatMessageUpdate) -> Optional[ChatMessage]:
    """
    Update a chat message by ID
    """
    message = get_chat_message_by_id(db, message_id)
    if message:
        if message_update.content is not None:
            message.content = message_update.content
        if message_update.is_plan is not None:
            message.is_plan = message_update.is_plan
        if message_update.plan_type is not None:
            message.plan_type = message_update.plan_type
        
        db.commit()
        db.refresh(message)
        return message
    return None

def process_user_message(db: Session, message_content: str, user_id: str, user_profile=None):
    """
    Process a user message, store it in the database, generate an AI response, and store that too
    """
    user_message = ChatMessageCreate(
        content=message_content,
        role="user"
    )
    db_user_message = create_chat_message(db, user_message, user_id)
    
    ai_response = generate_ai_response(message_content, user_profile=user_profile)
    
    assistant_message = ChatMessageCreate(
        content=ai_response["response"],
        role="assistant"
    )
    db_assistant_message = create_chat_message(db, assistant_message, user_id)
    
    return {
        "message_id": db_assistant_message.id,
        "response": db_assistant_message.content,
        "timestamp": db_assistant_message.timestamp
    }
