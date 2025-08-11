from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, ARRAY
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class FitnessLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class FitnessGoal(str, enum.Enum):
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    ENDURANCE = "endurance"
    GENERAL_FITNESS = "general_fitness"
    STRENGTH = "strength"
    FLEXIBILITY = "flexibility"

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    age = Column(Integer, nullable=True)
    
    fitness_level = Column(String, nullable=True)
    fitness_goal = Column(String, nullable=True)
    
    dietary_preferences = Column(String, nullable=True)
    workout_preferences = Column(String, nullable=True)
    available_equipment = Column(String, nullable=True)
    
    health_conditions = Column(String, nullable=True)
    
    user = relationship("User", back_populates="profile")
