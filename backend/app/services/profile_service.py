from sqlalchemy.orm import Session
from app.models.profile import UserProfile
from app.schemas.profile import ProfileCreate, ProfileUpdate
from typing import Optional, Dict, Any, Union

def get_profile_by_user_id(db: Session, user_id: int) -> Optional[UserProfile]:
    """
    Get a user's profile by user ID
    """
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def create_profile(db: Session, profile: ProfileCreate, user_id: int) -> UserProfile:
    """
    Create a new profile for a user
    """
    db_profile = UserProfile(
        user_id=user_id,
        height=profile.height,
        weight=profile.weight,
        age=profile.age,
        fitness_level=profile.fitness_level,
        fitness_goal=profile.fitness_goal,
        dietary_preferences=profile.dietary_preferences,
        workout_preferences=profile.workout_preferences,
        available_equipment=profile.available_equipment,
        health_conditions=profile.health_conditions
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def update_profile(db: Session, user_id: int, profile_data: Union[ProfileUpdate, Dict[str, Any]]) -> Optional[UserProfile]:
    """
    Update a user's profile
    """
    db_profile = get_profile_by_user_id(db, user_id)
    
    if not db_profile:
        if hasattr(profile_data, 'dict'):
            profile_dict = profile_data.dict(exclude_unset=True)
            return create_profile(db, ProfileCreate(**profile_dict), user_id)
        else:
            return create_profile(db, ProfileCreate(**profile_data), user_id)
    
    profile_dict = profile_data.dict(exclude_unset=True) if hasattr(profile_data, 'dict') else profile_data
    for key, value in profile_dict.items():
        if value is not None and hasattr(db_profile, key):
            setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

def delete_profile(db: Session, user_id: int) -> Dict[str, Any]:
    """
    Delete a user's profile
    """
    db_profile = get_profile_by_user_id(db, user_id)
    
    if not db_profile:
        return {"success": False, "message": "Profile not found"}
    
    db.delete(db_profile)
    db.commit()
    return {"success": True, "message": "Profile deleted successfully"}
