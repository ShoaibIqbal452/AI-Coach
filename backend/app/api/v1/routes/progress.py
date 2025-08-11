from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.schemas.progress import ProgressCreate, ProgressResponse, ProgressList, ProgressUpdate
from app.services.progress_service import (
    create_progress_entry, 
    get_progress_by_id, 
    get_progress_by_user_id,
    get_progress_by_date_range,
    get_recent_progress,
    update_progress,
    delete_progress,
    get_progress_trends
)
from app.services.progress_analysis_service import analyze_progress_data, generate_adaptive_plan
from app.services.plan_service import create_plan
from app.api.v1.routes.chat import get_current_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def create_new_progress(
    progress_data: ProgressCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Create a new progress entry for the current user
    """
    return create_progress_entry(db=db, progress_data=progress_data, user_id=current_user.id)

@router.get("/", response_model=ProgressList)
async def get_all_progress(
    skip: int = 0, 
    limit: int = 100,
    days: Optional[int] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Get all progress entries for the current user
    Optional: Filter by number of days (recent entries)
    """
    if days:
        progress = get_recent_progress(db, user_id=current_user.id, days=days)
    else:
        progress = get_progress_by_user_id(db, user_id=current_user.id, skip=skip, limit=limit)
    
    return {"progress": progress}

@router.get("/trends/{metric}")
async def get_metric_trends(
    metric: str,
    days: int = 90,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Get trends for a specific progress metric over time
    """
    return get_progress_trends(db, user_id=current_user.id, metric=metric, days=days)

@router.get("/analysis", status_code=status.HTTP_200_OK)
async def analyze_user_progress(
    days: int = 30,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Analyze user progress data using AI to provide insights and recommendations
    """
    analysis_result = analyze_progress_data(db, user_id=current_user.id, days=days)
    
    if not analysis_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=analysis_result["message"]
        )
    
    return analysis_result

@router.post("/adaptive-plan", status_code=status.HTTP_201_CREATED)
async def create_adaptive_plan(
    plan_type: str,
    original_plan_id: Optional[int] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate an adaptive plan based on user's progress data and profile
    """
    valid_plan_types = ["workout", "diet", "meditation"]
    if plan_type.lower() not in valid_plan_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan type. Must be one of: {', '.join(valid_plan_types)}"
        )
    
    plan_result = generate_adaptive_plan(
        db, 
        user_id=current_user.id, 
        plan_type=plan_type.lower(),
        original_plan_id=original_plan_id
    )
    
    if not plan_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=plan_result["message"]
        )
    
    new_plan = create_plan(
        db=db,
        user_id=current_user.id,
        plan_type=plan_type.lower(),
        content=plan_result["content"],
        is_ai_generated=True
    )
    
    return {
        "success": True,
        "message": "Adaptive plan created successfully",
        "plan": new_plan
    }

@router.get("/{progress_id}", response_model=ProgressResponse)
async def get_progress_details(
    progress_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific progress entry
    """
    progress = get_progress_by_id(db, progress_id=progress_id)
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress entry not found")
    
    if progress.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this progress entry")
    
    return progress

@router.put("/{progress_id}", response_model=ProgressResponse)
async def update_progress_entry(
    progress_id: int, 
    progress_data: ProgressUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Update a progress entry by ID
    """
    progress = get_progress_by_id(db, progress_id=progress_id)
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress entry not found")
    
    if progress.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this progress entry")
    
    updated_progress = update_progress(db, progress_id=progress_id, progress_data=progress_data)
    
    if not updated_progress:
        raise HTTPException(status_code=404, detail="Failed to update progress entry")
    
    return updated_progress

@router.delete("/{progress_id}", status_code=status.HTTP_200_OK)
async def delete_progress_entry(
    progress_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Delete a progress entry by ID
    """
    progress = get_progress_by_id(db, progress_id=progress_id)
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress entry not found")
    
    if progress.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this progress entry")
    
    result = delete_progress(db, progress_id=progress_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return {"message": "Progress entry deleted successfully"}

@router.get("/analysis", status_code=status.HTTP_200_OK)
async def analyze_user_progress(
    days: int = 30,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Analyze user progress data using AI to provide insights and recommendations
    """
    analysis_result = analyze_progress_data(db, user_id=current_user.id, days=days)
    
    if not analysis_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=analysis_result["message"]
        )
    
    return analysis_result

@router.post("/adaptive-plan", status_code=status.HTTP_201_CREATED)
async def create_adaptive_plan(
    plan_type: str,
    original_plan_id: Optional[int] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate an adaptive plan based on user's progress data and profile
    """
    valid_plan_types = ["workout", "diet", "meditation"]
    if plan_type.lower() not in valid_plan_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan type. Must be one of: {', '.join(valid_plan_types)}"
        )
    
    plan_result = generate_adaptive_plan(
        db, 
        user_id=current_user.id, 
        plan_type=plan_type.lower(),
        original_plan_id=original_plan_id
    )
    
    if not plan_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=plan_result["message"]
        )
    
    new_plan = create_plan(
        db=db,
        user_id=current_user.id,
        plan_type=plan_type.lower(),
        content=plan_result["content"],
        is_ai_generated=True
    )
    
    return {
        "success": True,
        "message": "Adaptive plan created successfully",
        "plan": new_plan
    }
