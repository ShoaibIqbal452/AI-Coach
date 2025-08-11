from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.db.session import SessionLocal
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import get_profile_by_user_id, create_profile, update_profile, delete_profile, get_or_create_profile
from app.api.v1.routes.chat import get_current_user
from app.models.user import User

router = APIRouter(tags=["profiles"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get the current user's profile or create a default one if it doesn't exist
    """
    profile, created = get_or_create_profile(db, user_id=current_user.id)
    
    if created:
        print(f"Created new default profile for user {current_user.id}")
    
    return profile

@router.post("/", response_model=ProfileResponse)
async def create_user_profile(profile: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a profile for the current user
    """
    existing_profile = get_profile_by_user_id(db, user_id=current_user.id)
    
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    return create_profile(db, profile=profile, user_id=current_user.id)

@router.put("/", response_model=ProfileResponse)
async def update_user_profile(profile: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Update the current user's profile
    """
    updated_profile = update_profile(db, user_id=current_user.id, profile_data=profile)
    
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Failed to update profile")
    
    return updated_profile

@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Delete the current user's profile
    """
    result = delete_profile(db, user_id=current_user.id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return {"message": "Profile deleted successfully"}
