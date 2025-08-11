from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ProgressBase(BaseModel):
    """Base schema for progress data"""
    weight: Optional[float] = None
    body_fat: Optional[float] = None
    measurements: Optional[Dict[str, float]] = None
    workout_performance: Optional[Dict[str, float]] = None
    energy_level: Optional[int] = None
    mood: Optional[int] = None
    sleep_quality: Optional[int] = None
    notes: Optional[str] = None

class ProgressCreate(ProgressBase):
    """Schema for creating a new progress entry"""
    pass

class ProgressUpdate(ProgressBase):
    """Schema for updating an existing progress entry"""
    pass

class ProgressResponse(ProgressBase):
    """Schema for progress response with additional fields"""
    id: int
    user_id: int
    date: datetime

    class Config:
        orm_mode = True

class ProgressList(BaseModel):
    """Schema for a list of progress entries"""
    progress: list[ProgressResponse]
