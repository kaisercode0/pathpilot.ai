from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.resource import ResourceCreate, ResourceResponse
from app.schemas.common import success_response
from app.services.resource_service import ResourceService

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_resource(
    req: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ResourceService(db)
    resource = await service.create_resource(req)
    return success_response(ResourceResponse.model_validate(resource).model_dump(mode="json"))


@router.get("")
async def list_resources(
    milestone_id: Optional[UUID] = None,
    resource_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ResourceService(db)
    resources = await service.list_resources(
        milestone_id=milestone_id,
        resource_type=resource_type,
        difficulty=difficulty
    )
    return success_response([ResourceResponse.model_validate(r).model_dump(mode="json") for r in resources])


@router.get("/{resource_id}")
async def get_resource(
    resource_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ResourceService(db)
    resource = await service.get_resource_by_id(resource_id)
    return success_response(ResourceResponse.model_validate(resource).model_dump(mode="json"))
