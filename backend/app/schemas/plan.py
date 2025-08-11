from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class PlanType(str, Enum):
    WORKOUT = "workout"
    DIET = "diet"

class PlanBase(BaseModel):
    type: str
    content: str

class PlanCreate(BaseModel):
    type: str
    content: str

class PlanUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    content: Optional[str] = None

class PlanResponse(PlanBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class PlanList(BaseModel):
    plans: list[PlanResponse]
