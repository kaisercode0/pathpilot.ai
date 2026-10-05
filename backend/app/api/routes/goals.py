from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.schemas.common import success_response
from app.services.goal_service import GoalService

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_goal(
    req: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    goal = await service.create_goal(current_user.id, req)
    return success_response(GoalResponse.model_validate(goal).model_dump(mode="json"))


@router.get("")
async def list_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    goals = await service.list_user_goals(current_user.id)
    return success_response([GoalResponse.model_validate(g).model_dump(mode="json") for g in goals])


@router.get("/{goal_id}")
async def get_goal(
    goal_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    goal = await service.get_goal_by_id(goal_id, current_user.id)
    return success_response(GoalResponse.model_validate(goal).model_dump(mode="json"))


@router.put("/{goal_id}")
async def update_goal(
    goal_id: UUID,
    req: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    goal = await service.update_goal(goal_id, current_user.id, req)
    return success_response(GoalResponse.model_validate(goal).model_dump(mode="json"))


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    await service.delete_goal(goal_id, current_user.id)
    return success_response({"message": "Goal deleted successfully."})
