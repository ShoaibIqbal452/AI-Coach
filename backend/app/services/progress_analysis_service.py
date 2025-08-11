from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
from app.utils.json_encoder import DateTimeEncoder

from app.models.progress import Progress
from app.models.profile import UserProfile
from app.models.plan import Plan
from app.services.progress_service import get_recent_progress, get_progress_trends
from app.services.openai_service import get_openai_client

def analyze_progress_data(db: Session, user_id: int, days: int = 30) -> Dict[str, Any]:
    """
    Analyze user progress data using AI to provide insights and recommendations
    """
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    progress_entries = get_recent_progress(db, user_id, days)
    
    active_plans = db.query(Plan).filter(Plan.user_id == user_id).order_by(Plan.created_at.desc()).limit(3).all()
    
    if not progress_entries:
        return {
            "success": False,
            "message": "Not enough progress data for analysis. Please log more progress entries.",
            "insights": [],
            "recommendations": []
        }
    
    metrics = ["weight", "body_fat"]
    trends = {}
    
    for metric in metrics:
        trend_data = get_progress_trends(db, user_id, metric, days)
        if trend_data and trend_data.get("data"):
            trends[metric] = trend_data
    
    # Convert UserProfile to dictionary manually
    user_profile_dict = {}
    if user_profile:
        user_profile_dict = {
            "id": user_profile.id,
            "user_id": user_profile.user_id,
            "height": user_profile.height,
            "weight": user_profile.weight,
            "age": user_profile.age,
            "fitness_level": user_profile.fitness_level,
            "fitness_goal": user_profile.fitness_goal,
            "dietary_preferences": user_profile.dietary_preferences,
            "workout_preferences": user_profile.workout_preferences,
            "available_equipment": user_profile.available_equipment,
            "health_conditions": user_profile.health_conditions
        }
    
    analysis_data = {
        "user_profile": user_profile_dict,
        "progress_entries": [
            {
                "date": entry.date.isoformat(),
                "weight": entry.weight,
                "body_fat": entry.body_fat,
                "measurements": entry.measurements,
                "workout_performance": entry.workout_performance,
                "energy_level": entry.energy_level,
                "mood": entry.mood,
                "sleep_quality": entry.sleep_quality,
                "notes": entry.notes
            }
            for entry in progress_entries
        ],
        "active_plans": [
            {
                "type": plan.type,
                "content": plan.content,
                "created_at": plan.created_at.isoformat()
            }
            for plan in active_plans
        ],
        "trends": {
            metric: {
                "data": trend.get("data", []),
                "change": trend.get("change")
            }
            for metric, trend in trends.items()
        }
    }
    
    client = get_openai_client()
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are an AI fitness coach analyzing user progress data. 
                Provide insightful analysis of their progress, identify patterns, and make recommendations 
                for adjustments to their workout and diet plans. Focus on:
                1. Progress trends (weight, body fat, measurements, workout performance)
                2. Correlation with subjective metrics (energy, mood, sleep)
                3. Alignment with user's fitness goals
                4. Specific, actionable recommendations
                
                Format your response as JSON with the following structure:
                {
                    "analysis_summary": "Brief overall assessment of progress",
                    "insights": [
                        {"title": "Insight title", "description": "Detailed explanation"}
                    ],
                    "recommendations": [
                        {"title": "Recommendation title", "description": "Detailed explanation"}
                    ],
                    "plan_adjustments": {
                        "workout": ["Specific workout plan adjustments"],
                        "diet": ["Specific diet plan adjustments"]
                    }
                }
                """},
                {"role": "user", "content": f"Here is my progress data for analysis: {json.dumps(analysis_data, cls=DateTimeEncoder)}"}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        analysis_result = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "analysis_summary": analysis_result.get("analysis_summary", ""),
            "insights": analysis_result.get("insights", []),
            "recommendations": analysis_result.get("recommendations", []),
            "plan_adjustments": analysis_result.get("plan_adjustments", {})
        }
        
    except Exception as e:
        print(f"Error in AI progress analysis: {str(e)}")
        return {
            "success": False,
            "message": f"Error analyzing progress data: {str(e)}",
            "insights": [],
            "recommendations": []
        }

def generate_adaptive_plan(
    db: Session, 
    user_id: int, 
    plan_type: str, 
    original_plan_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Generate an adaptive plan based on user's progress data and profile
    """
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    progress_entries = get_recent_progress(db, user_id, 30)
    
    original_plan = None
    if original_plan_id:
        original_plan = db.query(Plan).filter(Plan.id == original_plan_id).first()
    
    # Convert UserProfile to dictionary manually
    user_profile_dict = {}
    if user_profile:
        user_profile_dict = {
            "id": user_profile.id,
            "user_id": user_profile.user_id,
            "height": user_profile.height,
            "weight": user_profile.weight,
            "age": user_profile.age,
            "fitness_level": user_profile.fitness_level,
            "fitness_goal": user_profile.fitness_goal,
            "dietary_preferences": user_profile.dietary_preferences,
            "workout_preferences": user_profile.workout_preferences,
            "available_equipment": user_profile.available_equipment,
            "health_conditions": user_profile.health_conditions
        }
    
    plan_data = {
        "user_profile": user_profile_dict,
        "progress_entries": [
            {
                "date": entry.date.isoformat(),
                "weight": entry.weight,
                "body_fat": entry.body_fat,
                "measurements": entry.measurements,
                "workout_performance": entry.workout_performance,
                "energy_level": entry.energy_level,
                "mood": entry.mood,
                "sleep_quality": entry.sleep_quality
            }
            for entry in progress_entries
        ],
        "original_plan": {
            "content": original_plan.content,
            "created_at": original_plan.created_at.isoformat()
        } if original_plan else None,
        "plan_type": plan_type
    }
    
    client = get_openai_client()
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"""You are an AI fitness coach creating an adaptive {plan_type} plan.
                Based on the user's profile, progress data, and previous plan (if any), create a personalized
                {plan_type} plan that addresses their current needs and helps them progress toward their goals.
                
                The plan should be:
                1. Tailored to their current fitness level as shown in their progress data
                2. Adjusted based on their recent performance and trends
                3. Aligned with their fitness goals
                4. Structured and detailed enough to be actionable
                
                Format your response as a complete {plan_type} plan with clear sections and instructions.
                """},
                {"role": "user", "content": f"Here is my data for creating an adaptive {plan_type} plan: {json.dumps(plan_data, cls=DateTimeEncoder)}"}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        plan_content = response.choices[0].message.content
        
        return {
            "success": True,
            "plan_type": plan_type,
            "content": plan_content,
            "based_on_progress": True,
            "original_plan_id": original_plan_id
        }
        
    except Exception as e:
        print(f"Error in adaptive plan generation: {str(e)}")
        return {
            "success": False,
            "message": f"Error generating adaptive plan: {str(e)}"
        }
