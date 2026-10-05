from app.schemas.common import APIResponse, ErrorDetails, success_response, error_response
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, RefreshTokenRequest, TokenResponse
from app.schemas.user import UserResponse, UserUpdate, UserProfileResponse, UserProfileUpdate
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.schemas.assessment import (
    AssessmentGenerateRequest,
    AssessmentSubmitRequest,
    AssessmentResponse,
    SkillGapAnalysis,
)
from app.schemas.roadmap import (
    RoadmapGenerateRequest,
    AdaptRoadmapRequest,
    MilestoneResponse,
    RoadmapResponseSchema,
)
from app.schemas.resource import ResourceCreate, ResourceResponse
from app.schemas.progress import ProgressUpdateRequest, ProgressResponse, RoadmapProgressOverview

__all__ = [
    "APIResponse",
    "ErrorDetails",
    "success_response",
    "error_response",
    "UserRegisterRequest",
    "UserLoginRequest",
    "RefreshTokenRequest",
    "TokenResponse",
    "UserResponse",
    "UserUpdate",
    "UserProfileResponse",
    "UserProfileUpdate",
    "GoalCreate",
    "GoalUpdate",
    "GoalResponse",
    "AssessmentGenerateRequest",
    "AssessmentSubmitRequest",
    "AssessmentResponse",
    "SkillGapAnalysis",
    "RoadmapGenerateRequest",
    "AdaptRoadmapRequest",
    "MilestoneResponse",
    "RoadmapResponseSchema",
    "ResourceCreate",
    "ResourceResponse",
    "ProgressUpdateRequest",
    "ProgressResponse",
    "RoadmapProgressOverview",
]
