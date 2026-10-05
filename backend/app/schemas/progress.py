from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class ProgressUpdateRequest(BaseModel):
    progress_percentage: float = Field(..., ge=0.0, le=100.0)
    status: Optional[str] = Field(None, description="not_started, in_progress, completed")


class ProgressResponse(BaseModel):
    id: UUID
    user_id: UUID
    milestone_id: UUID
    progress_percentage: float
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RoadmapProgressOverview(BaseModel):
    roadmap_id: UUID
    total_milestones: int
    completed_milestones: int
    remaining_milestones: int
    total_hours: float
    completed_hours: float
    overall_progress_percentage: float
    current_learning_stage: str
    milestone_progresses: List[ProgressResponse] = Field(default_factory=list)
