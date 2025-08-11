from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Progress(Base):
    """
    Model for tracking user fitness progress over time
    """
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    weight = Column(Float, nullable=True)
    body_fat = Column(Float, nullable=True)
    
    measurements = Column(JSON, nullable=True)
    
    workout_performance = Column(JSON, nullable=True)
    
    energy_level = Column(Integer, nullable=True)
    mood = Column(Integer, nullable=True)
    sleep_quality = Column(Integer, nullable=True)
    
    notes = Column(String(500), nullable=True)
    
    user = relationship("User", back_populates="progress")
