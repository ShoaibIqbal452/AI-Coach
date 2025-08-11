from openai import OpenAI
import uuid
from datetime import datetime
from typing import Optional
from app.core.config import settings
from app.models.profile import UserProfile
from app.models.plan import Plan

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def get_openai_client() -> OpenAI:
    """
    Returns the OpenAI client instance
    """
    return client

def generate_ai_response(message: str, user_profile: Optional[UserProfile] = None) -> dict:
    """
    Generate a response from the AI coach using OpenAI's GPT model
    """
    try:
        system_message = """
        You are an AI fitness coach assistant. Your role is to help users with:
        1. Creating personalized workout plans based on their goals, fitness level, and preferences
        2. Designing diet plans that align with their nutritional needs and goals
        3. Providing fitness advice and answering exercise-related questions
        4. Motivating users and helping them stay on track with their fitness journey
        
        Be supportive, knowledgeable, and provide detailed, actionable advice.
        """
        
        if user_profile:
            profile_info = f"""
            User Profile Information:
            - Height: {user_profile.height or 'Not specified'} cm
            - Weight: {user_profile.weight or 'Not specified'} kg
            - Age: {user_profile.age or 'Not specified'} years
            - Fitness Level: {user_profile.fitness_level or 'Not specified'}
            - Fitness Goal: {user_profile.fitness_goal or 'Not specified'}
            - Dietary Preferences: {user_profile.dietary_preferences or 'Not specified'}
            - Workout Preferences: {user_profile.workout_preferences or 'Not specified'}
            - Available Equipment: {user_profile.available_equipment or 'Not specified'}
            - Health Conditions: {user_profile.health_conditions or 'Not specified'}
            
            Use this information to provide highly personalized advice and plans tailored to the user's specific needs and circumstances.
            """
            
            system_message += "\n\n" + profile_info
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        message_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        
        return {
            "message_id": message_id,
            "response": ai_response,
            "timestamp": timestamp
        }
        
    except Exception as e:
        return {
            "message_id": str(uuid.uuid4()),
            "response": f"I apologize, but I'm having trouble processing your request. Please try again later. Error: {str(e)}",
            "timestamp": datetime.utcnow()
        }

def analyze_plan(plan: Plan, user_profile: Optional[UserProfile] = None) -> dict:
    """
    Analyze a workout or diet plan and provide feedback based on user profile data
    """
    try:
        system_message = """
        You are an AI fitness plan analyst. Your role is to analyze workout and diet plans and provide constructive feedback.
        For each plan, you should:
        1. Evaluate the plan's effectiveness for the user's goals and fitness level
        2. Identify strengths and potential areas for improvement
        3. Suggest modifications or adjustments to better align with the user's needs
        4. Consider any health conditions or limitations the user may have
        5. Provide a rating out of 10 for how well the plan matches the user's profile
        
        Structure your analysis in these sections:
        - Overall Assessment (brief summary)
        - Strengths (what works well)
        - Areas for Improvement (what could be better)
        - Suggested Modifications (specific changes)
        - Plan Rating (X/10)
        
        Be detailed, constructive, and provide actionable feedback.
        """
        
        if user_profile:
            profile_info = f"""
            User Profile Information:
            - Height: {user_profile.height or 'Not specified'} cm
            - Weight: {user_profile.weight or 'Not specified'} kg
            - Age: {user_profile.age or 'Not specified'} years
            - Fitness Level: {user_profile.fitness_level or 'Not specified'}
            - Fitness Goal: {user_profile.fitness_goal or 'Not specified'}
            - Dietary Preferences: {user_profile.dietary_preferences or 'Not specified'}
            - Workout Preferences: {user_profile.workout_preferences or 'Not specified'}
            - Available Equipment: {user_profile.available_equipment or 'Not specified'}
            - Health Conditions: {user_profile.health_conditions or 'Not specified'}
            
            Base your analysis on this profile information to ensure the plan is well-suited to the user's specific needs and circumstances.
            """
            
            system_message += "\n\n" + profile_info
        
        plan_info = f"""
        Plan Type: {plan.type}
        Plan Content:
        {plan.content}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Please analyze this {plan.type} plan:\n\n{plan_info}"}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        
        analysis_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        
        return {
            "analysis_id": analysis_id,
            "plan_id": plan.id,
            "analysis": analysis,
            "timestamp": timestamp
        }
        
    except Exception as e:
        return {
            "analysis_id": str(uuid.uuid4()),
            "plan_id": plan.id if plan else None,
            "analysis": f"I apologize, but I'm having trouble analyzing this plan. Please try again later. Error: {str(e)}",
            "timestamp": datetime.utcnow()
        }
