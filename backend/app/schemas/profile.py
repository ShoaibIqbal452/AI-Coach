from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class FitnessLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class FitnessGoal(str, Enum):
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    ENDURANCE = "endurance"
    GENERAL_FITNESS = "general_fitness"
    STRENGTH = "strength"
    FLEXIBILITY = "flexibility"

class ProfileBase(BaseModel):
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    fitness_level: Optional[str] = None
    fitness_goal: Optional[str] = None
    dietary_preferences: Optional[str] = None
    workout_preferences: Optional[str] = None
    available_equipment: Optional[str] = None
    health_conditions: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
