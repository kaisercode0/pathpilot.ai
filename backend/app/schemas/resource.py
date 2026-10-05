from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class ResourceCreate(BaseModel):
    milestone_id: Optional[UUID] = None
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    resource_type: str = Field(..., description="course, book, doc, video, project, article, practice")
    url: str
    difficulty: str = Field(default="intermediate")
    estimated_time: Optional[str] = None
    is_free: bool = True
    provider: Optional[str] = None


class ResourceResponse(BaseModel):
    id: UUID
    milestone_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    resource_type: str
    url: str
    difficulty: str
    estimated_time: Optional[str] = None
    is_free: bool
    provider: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
