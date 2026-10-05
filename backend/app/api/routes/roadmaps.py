from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.roadmap import RoadmapGenerateRequest, AdaptRoadmapRequest, RoadmapResponseSchema
from app.schemas.common import success_response
from app.services.roadmap_service import RoadmapService

router = APIRouter()


@router.post("/generate", status_code=status.HTTP_201_CREATED)
async def generate_roadmap(
    req: RoadmapGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RoadmapService(db)
    roadmap = await service.generate_roadmap(current_user.id, req)
    return success_response(RoadmapResponseSchema.model_validate(roadmap).model_dump(mode="json"))


@router.get("")
async def list_roadmaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RoadmapService(db)
    roadmaps = await service.list_user_roadmaps(current_user.id)
    return success_response([RoadmapResponseSchema.model_validate(r).model_dump(mode="json") for r in roadmaps])


@router.get("/{roadmap_id}")
async def get_roadmap(
    roadmap_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RoadmapService(db)
    roadmap = await service.get_roadmap_by_id(roadmap_id, current_user.id)
    return success_response(RoadmapResponseSchema.model_validate(roadmap).model_dump(mode="json"))


@router.delete("/{roadmap_id}")
async def delete_roadmap(
    roadmap_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RoadmapService(db)
    await service.delete_roadmap(roadmap_id, current_user.id)
    return success_response({"message": "Roadmap deleted successfully."})


@router.post("/{roadmap_id}/adapt")
async def adapt_roadmap(
    roadmap_id: UUID,
    req: AdaptRoadmapRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RoadmapService(db)
    roadmap = await service.adapt_roadmap(roadmap_id, current_user.id, req)
    return success_response(RoadmapResponseSchema.model_validate(roadmap).model_dump(mode="json"))
