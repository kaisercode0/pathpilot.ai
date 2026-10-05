from datetime import datetime
from typing import List, Dict, Any, Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.resource import ResourceResponse


class RoadmapGenerateRequest(BaseModel):
    goal_id: UUID
    weekly_hours: Optional[int] = Field(default=15, ge=1, le=100)
    duration_weeks: Optional[int] = Field(default=24, ge=1, le=104)


class AdaptRoadmapRequest(BaseModel):
    reason: str = Field(..., description="weekly_hours_changed, low_assessment_score, completed_early, goal_changed")
    new_weekly_hours: Optional[int] = None
    assessment_score: Optional[float] = None
    completed_milestone_id: Optional[UUID] = None
    notes: Optional[str] = None


class MilestoneResponse(BaseModel):
    id: UUID
    roadmap_id: UUID
    title: str
    description: Optional[str] = None
    order_index: int
    estimated_hours: float
    skills: List[str]
    status: str
    resources: List[ResourceResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RoadmapResponseSchema(BaseModel):
    id: UUID
    user_id: UUID
    goal_id: UUID
    title: str
    description: Optional[str] = None
    duration: str
    difficulty: str
    generated_by: str
    career_insights: Dict[str, Any] = Field(default_factory=dict)
    milestones: List[MilestoneResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
