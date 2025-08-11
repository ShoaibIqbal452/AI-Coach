from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

class ChatMessageBase(BaseModel):
    content: str
    role: Literal['user', 'assistant']
    is_plan: bool = False
    plan_type: Optional[Literal['workout', 'diet']] = None

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageUpdate(BaseModel):
    content: Optional[str] = None
    is_plan: Optional[bool] = None
    plan_type: Optional[Literal['workout', 'diet']] = None

class ChatMessageResponse(BaseModel):
    id: str
    user_id: int
    content: str
    role: str
    timestamp: datetime
    is_plan: bool
    plan_type: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    message_id: str
    response: str
    timestamp: datetime

class ChatHistoryItem(BaseModel):
    id: str
    user_id: int
    content: str
    role: str
    timestamp: datetime
    is_plan: bool
    plan_type: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChatHistory(BaseModel):
    messages: List[ChatHistoryItem]
