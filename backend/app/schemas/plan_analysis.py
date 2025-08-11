from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PlanAnalysisResponse(BaseModel):
    """
    Schema for the plan analysis response
    """
    analysis_id: str
    plan_id: int
    analysis: str
    timestamp: datetime
