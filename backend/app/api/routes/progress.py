from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.progress import ProgressUpdateRequest, ProgressResponse, RoadmapProgressOverview
from app.schemas.common import success_response
from app.services.progress_service import ProgressService

router = APIRouter()


@router.get("/roadmap/{roadmap_id}")
async def get_roadmap_progress(
    roadmap_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProgressService(db)
    overview = await service.get_roadmap_progress(current_user.id, roadmap_id)
    return success_response(overview.model_dump(mode="json"))


@router.get("")
async def get_progress(
    roadmap_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProgressService(db)
    if roadmap_id:
        overview = await service.get_roadmap_progress(current_user.id, roadmap_id)
        return success_response(overview.model_dump(mode="json"))
    return success_response({"message": "Please specify roadmap_id parameter to fetch detailed progress overview."})


@router.put("/{milestone_id}")
async def update_progress(
    milestone_id: UUID,
    req: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProgressService(db)
    progress = await service.update_progress(current_user.id, milestone_id, req)
    return success_response(ProgressResponse.model_validate(progress).model_dump(mode="json"))


@router.post("/{milestone_id}/complete")
async def mark_milestone_complete(
    milestone_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProgressService(db)
    progress = await service.mark_milestone_complete(current_user.id, milestone_id)
    return success_response(ProgressResponse.model_validate(progress).model_dump(mode="json"))
