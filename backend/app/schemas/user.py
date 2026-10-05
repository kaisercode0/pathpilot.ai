from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserProfileBase(BaseModel):
    education_level: Optional[str] = None
    current_role: Optional[str] = None
    experience_level: Optional[str] = Field(default="beginner", description="beginner, intermediate, advanced")
    current_skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    preferred_learning_style: Optional[str] = Field(default="balanced", description="project_based, theory_first, balanced, certification")
    weekly_hours: Optional[int] = Field(default=15, ge=1, le=100)


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfileResponse(UserProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    profile: Optional[UserProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)
