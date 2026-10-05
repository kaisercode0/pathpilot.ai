from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, RefreshTokenRequest, TokenResponse
from app.schemas.user import UserResponse
from app.schemas.common import success_response
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    req: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    user = await service.register(req)
    user_response = UserResponse.model_validate(user).model_dump(mode="json")
    return success_response(user_response)


@router.post("/login")
async def login(
    req: UserLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    tokens = await service.login(req)
    return success_response(tokens.model_dump())


@router.post("/refresh")
async def refresh(
    req: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    tokens = await service.refresh_tokens(req.refresh_token)
    return success_response(tokens.model_dump())


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user)
):
    user_response = UserResponse.model_validate(current_user).model_dump(mode="json")
    return success_response(user_response)
