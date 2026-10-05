from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.models.resource import Resource
from app.schemas.resource import ResourceCreate


class ResourceService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_resource(self, req: ResourceCreate) -> Resource:
        resource = Resource(
            milestone_id=req.milestone_id,
            title=req.title,
            description=req.description,
            resource_type=req.resource_type,
            url=req.url,
            difficulty=req.difficulty,
            estimated_time=req.estimated_time,
            is_free=req.is_free,
            provider=req.provider
        )
        self.db.add(resource)
        await self.db.commit()
        await self.db.refresh(resource)
        return resource

    async def get_resource_by_id(self, resource_id: UUID) -> Resource:
        query = select(Resource).where(Resource.id == resource_id)
        res = await self.db.execute(query)
        resource = res.scalar_one_or_none()
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found."
            )
        return resource

    async def list_resources(
        self,
        milestone_id: Optional[UUID] = None,
        resource_type: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> List[Resource]:
        query = select(Resource)
        if milestone_id:
            query = query.where(Resource.milestone_id == milestone_id)
        if resource_type:
            query = query.where(Resource.resource_type == resource_type)
        if difficulty:
            query = query.where(Resource.difficulty == difficulty)

        result = await self.db.execute(query.order_by(Resource.created_at.desc()))
        return list(result.scalars().all())
