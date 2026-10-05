from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    target_role: Optional[str] = None
    target_domain: Optional[str] = None
    target_duration: Optional[str] = Field(default="6_months", description="1_month, 3_months, 6_months, 12_months")
    priority: str = Field(default="medium", description="low, medium, high")


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    target_role: Optional[str] = None
    target_domain: Optional[str] = None
    target_duration: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = Field(None, description="active, completed, archived")


class GoalResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str] = None
    target_role: Optional[str] = None
    target_domain: Optional[str] = None
    target_duration: Optional[str] = None
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
