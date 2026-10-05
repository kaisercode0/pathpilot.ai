from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate


class GoalService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_goal(self, user_id: UUID, req: GoalCreate) -> Goal:
        goal = Goal(
            user_id=user_id,
            title=req.title,
            description=req.description,
            target_role=req.target_role,
            target_domain=req.target_domain,
            target_duration=req.target_duration,
            priority=req.priority,
            status="active"
        )
        self.db.add(goal)
        await self.db.commit()
        await self.db.refresh(goal)
        return goal

    async def list_user_goals(self, user_id: UUID) -> List[Goal]:
        query = select(Goal).where(Goal.user_id == user_id).order_by(Goal.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_goal_by_id(self, goal_id: UUID, user_id: UUID) -> Goal:
        query = select(Goal).where(Goal.id == goal_id)
        result = await self.db.execute(query)
        goal = result.scalar_one_or_none()

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found."
            )
        
        # Enforce user ownership check
        if goal.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this goal."
            )

        return goal

    async def update_goal(self, goal_id: UUID, user_id: UUID, req: GoalUpdate) -> Goal:
        goal = await self.get_goal_by_id(goal_id, user_id)

        if req.title is not None:
            goal.title = req.title
        if req.description is not None:
            goal.description = req.description
        if req.target_role is not None:
            goal.target_role = req.target_role
        if req.target_domain is not None:
            goal.target_domain = req.target_domain
        if req.target_duration is not None:
            goal.target_duration = req.target_duration
        if req.priority is not None:
            goal.priority = req.priority
        if req.status is not None:
            goal.status = req.status

        await self.db.commit()
        await self.db.refresh(goal)
        return goal

    async def delete_goal(self, goal_id: UUID, user_id: UUID) -> None:
        goal = await self.get_goal_by_id(goal_id, user_id)
        await self.db.delete(goal)
        await self.db.commit()
