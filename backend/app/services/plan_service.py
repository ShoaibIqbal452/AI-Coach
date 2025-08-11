from sqlalchemy.orm import Session
from app.models.plan import Plan
from app.models.chat import ChatMessage
from app.schemas.plan import PlanCreate, PlanUpdate
from typing import List, Optional, Dict, Any, Union
from uuid import uuid4

def create_plan(db: Session, plan: PlanCreate, user_id: int) -> Plan:
    """
    Create a new plan for a user
    """
    db_plan = Plan(
        user_id=user_id,
        type=plan.type,
        content=plan.content
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def get_plans_by_user_id(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Plan]:
    """
    Get all plans for a user
    """
    return db.query(Plan).filter(Plan.user_id == user_id).offset(skip).limit(limit).all()

def get_plan_by_id(db: Session, plan_id: int) -> Optional[Plan]:
    """
    Get a plan by ID
    """
    return db.query(Plan).filter(Plan.id == plan_id).first()

def get_plans_by_type(db: Session, user_id: int, plan_type: str, skip: int = 0, limit: int = 100) -> List[Plan]:
    """
    Get all plans of a specific type for a user
    """
    return db.query(Plan).filter(Plan.user_id == user_id, Plan.type == plan_type).offset(skip).limit(limit).all()

def delete_plan(db: Session, plan_id: int) -> Dict[str, Any]:
    """
    Delete a plan by ID
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        return {"success": False, "message": "Plan not found"}
    
    db.delete(plan)
    db.commit()
    return {"success": True, "message": "Plan deleted successfully"}

def update_plan(db: Session, plan_id: int, plan_data: Union[PlanUpdate, Dict[str, Any]]) -> Optional[Plan]:
    """
    Update a plan by ID
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        return None
    
    for key, value in plan_data.dict() if hasattr(plan_data, 'dict') else plan_data.items():
        if value is not None:
            setattr(plan, key, value)
    
    db.commit()
    db.refresh(plan)
    return plan

def create_plan_from_message(db: Session, message: ChatMessage, user_id: str, plan_type: str) -> Plan:
    """
    Create a new plan from a chat message
    """
    db_plan = Plan(
        user_id=user_id,
        type=plan_type,
        content=message.content
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan
