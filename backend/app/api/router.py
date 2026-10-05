from fastapi import APIRouter

from app.api.routes import (
    auth,
    users,
    goals,
    assessments,
    roadmaps,
    progress,
    resources,
    health,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(goals.router, prefix="/goals", tags=["Goals"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["Assessments"])
api_router.include_router(roadmaps.router, prefix="/roadmaps", tags=["Roadmaps"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
