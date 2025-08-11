from sqlalchemy.orm import Session
from app.models.progress import Progress
from app.schemas.progress import ProgressCreate, ProgressUpdate
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta

def create_progress_entry(db: Session, progress_data: ProgressCreate, user_id: int) -> Progress:
    """
    Create a new progress entry for a user
    """
    db_progress = Progress(
        user_id=user_id,
        weight=progress_data.weight,
        body_fat=progress_data.body_fat,
        measurements=progress_data.measurements,
        workout_performance=progress_data.workout_performance,
        energy_level=progress_data.energy_level,
        mood=progress_data.mood,
        sleep_quality=progress_data.sleep_quality,
        notes=progress_data.notes
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

def get_progress_by_id(db: Session, progress_id: int) -> Optional[Progress]:
    """
    Get a progress entry by ID
    """
    return db.query(Progress).filter(Progress.id == progress_id).first()

def get_progress_by_user_id(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Progress]:
    """
    Get all progress entries for a user
    """
    return db.query(Progress).filter(Progress.user_id == user_id).order_by(Progress.date.desc()).offset(skip).limit(limit).all()

def get_progress_by_date_range(db: Session, user_id: int, start_date: datetime, end_date: datetime) -> List[Progress]:
    """
    Get progress entries for a user within a date range
    """
    return db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.date >= start_date,
        Progress.date <= end_date
    ).order_by(Progress.date.desc()).all()

def get_recent_progress(db: Session, user_id: int, days: int = 30) -> List[Progress]:
    """
    Get recent progress entries for a user (default: last 30 days)
    """
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return get_progress_by_date_range(db, user_id, start_date, end_date)

def update_progress(db: Session, progress_id: int, progress_data: Union[ProgressUpdate, Dict[str, Any]]) -> Optional[Progress]:
    """
    Update a progress entry by ID
    """
    progress = db.query(Progress).filter(Progress.id == progress_id).first()
    if not progress:
        return None
    
    for key, value in progress_data.dict() if hasattr(progress_data, 'dict') else progress_data.items():
        if value is not None:
            setattr(progress, key, value)
    
    db.commit()
    db.refresh(progress)
    return progress

def delete_progress(db: Session, progress_id: int) -> Dict[str, Any]:
    """
    Delete a progress entry by ID
    """
    progress = db.query(Progress).filter(Progress.id == progress_id).first()
    if not progress:
        return {"success": False, "message": "Progress entry not found"}
    
    db.delete(progress)
    db.commit()
    return {"success": True, "message": "Progress entry deleted successfully"}

def get_progress_trends(db: Session, user_id: int, metric: str, days: int = 90) -> Dict[str, Any]:
    """
    Get trends for a specific progress metric over time
    """
    progress_entries = get_recent_progress(db, user_id, days)
    
    trend_data = []
    for entry in progress_entries:
        if metric == "weight" and entry.weight is not None:
            trend_data.append({"date": entry.date, "value": entry.weight})
        elif metric == "body_fat" and entry.body_fat is not None:
            trend_data.append({"date": entry.date, "value": entry.body_fat})
        elif metric in ["energy_level", "mood", "sleep_quality"]:
            value = getattr(entry, metric, None)
            if value is not None:
                trend_data.append({"date": entry.date, "value": value})
        elif metric.startswith("measurement.") and entry.measurements:
            measurement_key = metric.split(".", 1)[1]
            if entry.measurements and measurement_key in entry.measurements:
                trend_data.append({"date": entry.date, "value": entry.measurements[measurement_key]})
        elif metric.startswith("workout.") and entry.workout_performance:
            workout_key = metric.split(".", 1)[1]
            if entry.workout_performance and workout_key in entry.workout_performance:
                trend_data.append({"date": entry.date, "value": entry.workout_performance[workout_key]})
    
    trend_data.sort(key=lambda x: x["date"])
    
    change = None
    if len(trend_data) >= 2:
        first_value = trend_data[0]["value"]
        last_value = trend_data[-1]["value"]
        change = last_value - first_value
    
    return {
        "metric": metric,
        "data": trend_data,
        "change": change,
        "period_days": days
    }
