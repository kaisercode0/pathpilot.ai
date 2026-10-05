from datetime import timedelta
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.user import User
from app.models.profile import UserProfile
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, req: UserRegisterRequest) -> User:
        # Check if email already registered
        query = select(User).where(User.email == req.email)
        result = await self.db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )

        user = User(
            email=req.email,
            password_hash=hash_password(req.password),
            full_name=req.full_name
        )
        self.db.add(user)
        await self.db.flush()

        # Create default empty profile for user
        profile = UserProfile(
            user_id=user.id,
            experience_level="beginner",
            preferred_learning_style="balanced",
            weekly_hours=15,
            current_skills=[],
            interests=[]
        )
        self.db.add(profile)
        await self.db.commit()

        # Eagerly load user with profile
        query_user = select(User).options(selectinload(User.profile)).where(User.id == user.id)
        res_user = await self.db.execute(query_user)
        return res_user.scalar_one()

    async def login(self, req: UserLoginRequest) -> TokenResponse:
        query = select(User).where(User.email == req.email)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        access_token = create_access_token(subject=str(user.id))
        refresh_token = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )

        user_id_str = payload.get("sub")
        query = select(User).where(User.id == UUID(user_id_str))
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found."
            )

        new_access_token = create_access_token(subject=str(user.id))
        new_refresh_token = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
