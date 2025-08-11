from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    plans = relationship("Plan", back_populates="user")
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    progress = relationship("Progress", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")
