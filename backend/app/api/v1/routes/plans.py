from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.db.session import SessionLocal
from app.schemas.plan import PlanCreate, PlanResponse, PlanList, PlanUpdate
from app.schemas.plan_analysis import PlanAnalysisResponse
from app.services.plan_service import create_plan, get_plans_by_user_id, get_plan_by_id, get_plans_by_type, delete_plan, update_plan
from app.services.openai_service import analyze_plan
from app.services.profile_service import get_profile_by_user_id
from app.api.v1.routes.chat import get_current_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_new_plan(plan: PlanCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a new workout or diet plan for the current user
    """
    return create_plan(db=db, plan=plan, user_id=current_user.id)

@router.get("/", response_model=PlanList)
async def get_all_plans(
    skip: int = 0, 
    limit: int = 100, 
    plan_type: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Get all plans for the current user, optionally filtered by type
    """
    if plan_type:
        plans = get_plans_by_type(db, user_id=current_user.id, plan_type=plan_type, skip=skip, limit=limit)
    else:
        plans = get_plans_by_user_id(db, user_id=current_user.id, skip=skip, limit=limit)
    
    return {"plans": plans}

@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan_details(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get detailed information about a specific plan
    """
    plan = get_plan_by_id(db, plan_id=plan_id)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this plan")
    
    return plan

@router.delete("/{plan_id}", status_code=status.HTTP_200_OK)
async def delete_plan_endpoint(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Delete a plan by ID
    """
    plan = get_plan_by_id(db, plan_id=plan_id)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this plan")
    
    result = delete_plan(db, plan_id=plan_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return {"message": "Plan deleted successfully"}

@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan_endpoint(plan_id: int, plan_data: PlanUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Update a plan by ID
    """
    plan = get_plan_by_id(db, plan_id=plan_id)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this plan")
    
    updated_plan = update_plan(db, plan_id=plan_id, plan_data=plan_data)
    
    if not updated_plan:
        raise HTTPException(status_code=404, detail="Failed to update plan")
    
    return updated_plan

@router.get("/{plan_id}/analyze", response_model=PlanAnalysisResponse)
async def analyze_plan_endpoint(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Analyze a plan and provide feedback based on user profile data
    """
    plan = get_plan_by_id(db, plan_id=plan_id)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to analyze this plan")
    
    user_profile = get_profile_by_user_id(db, user_id=current_user.id)
    
    analysis_result = analyze_plan(plan=plan, user_profile=user_profile)
    
    return analysis_result
