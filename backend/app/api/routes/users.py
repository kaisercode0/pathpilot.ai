from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserProfileResponse, UserProfileUpdate
from app.schemas.common import success_response
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me")
async def get_user_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    user = await service.get_user_by_id(current_user.id)
    return success_response(UserResponse.model_validate(user).model_dump(mode="json"))


@router.put("/me")
async def update_user_me(
    req: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    user = await service.update_user(current_user.id, req)
    return success_response(UserResponse.model_validate(user).model_dump(mode="json"))


@router.get("/me/profile")
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    profile = await service.get_user_profile(current_user.id)
    return success_response(UserProfileResponse.model_validate(profile).model_dump(mode="json"))


@router.put("/me/profile")
async def update_user_profile(
    req: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    profile = await service.update_user_profile(current_user.id, req)
    return success_response(UserProfileResponse.model_validate(profile).model_dump(mode="json"))
