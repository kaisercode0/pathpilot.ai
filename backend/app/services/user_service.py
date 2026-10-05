from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.user import User
from app.models.profile import UserProfile
from app.schemas.user import UserUpdate, UserProfileUpdate
from app.utils.validators import sanitize_skills


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: UUID) -> User:
        query = select(User).options(selectinload(User.profile)).where(User.id == user_id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
        return user

    async def update_user(self, user_id: UUID, req: UserUpdate) -> User:
        user = await self.get_user_by_id(user_id)
        if req.full_name is not None:
            user.full_name = req.full_name
        if req.email is not None:
            # Check unique email
            query = select(User).where(User.email == req.email, User.id != user_id)
            res = await self.db.execute(query)
            if res.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use."
                )
            user.email = req.email

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_user_profile(self, user_id: UUID) -> UserProfile:
        query = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await self.db.execute(query)
        profile = result.scalar_one_or_none()
        if not profile:
            # Create if missing
            profile = UserProfile(
                user_id=user_id,
                experience_level="beginner",
                preferred_learning_style="balanced",
                weekly_hours=15,
                current_skills=[],
                interests=[]
            )
            self.db.add(profile)
            await self.db.commit()
            await self.db.refresh(profile)
        return profile

    async def update_user_profile(self, user_id: UUID, req: UserProfileUpdate) -> UserProfile:
        profile = await self.get_user_profile(user_id)
        
        if req.education_level is not None:
            profile.education_level = req.education_level
        if req.current_role is not None:
            profile.current_role = req.current_role
        if req.experience_level is not None:
            profile.experience_level = req.experience_level
        if req.current_skills is not None:
            profile.current_skills = sanitize_skills(req.current_skills)
        if req.interests is not None:
            profile.interests = sanitize_skills(req.interests)
        if req.preferred_learning_style is not None:
            profile.preferred_learning_style = req.preferred_learning_style
        if req.weekly_hours is not None:
            profile.weekly_hours = req.weekly_hours

        await self.db.commit()
        await self.db.refresh(profile)
        return profile
