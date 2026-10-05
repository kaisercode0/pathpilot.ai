from datetime import datetime, timezone
from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.progress import Progress
from app.models.milestone import Milestone
from app.models.roadmap import Roadmap
from app.schemas.progress import ProgressUpdateRequest, RoadmapProgressOverview


def utc_now():
    return datetime.now(timezone.utc)


class ProgressService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_progress(self, user_id: UUID, milestone_id: UUID) -> Progress:
        # Check milestone existence and ownership
        query_m = select(Milestone).options(selectinload(Milestone.roadmap)).where(Milestone.id == milestone_id)
        res_m = await self.db.execute(query_m)
        milestone = res_m.scalar_one_or_none()

        if not milestone:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Milestone not found."
            )
        if milestone.roadmap.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this milestone."
            )

        query_p = select(Progress).where(
            Progress.user_id == user_id,
            Progress.milestone_id == milestone_id
        )
        res_p = await self.db.execute(query_p)
        progress = res_p.scalar_one_or_none()

        if not progress:
            progress = Progress(
                user_id=user_id,
                milestone_id=milestone_id,
                progress_percentage=0.0,
                status="not_started"
            )
            self.db.add(progress)
            await self.db.commit()
            await self.db.refresh(progress)

        return progress

    async def update_progress(
        self,
        user_id: UUID,
        milestone_id: UUID,
        req: ProgressUpdateRequest
    ) -> Progress:
        progress = await self.get_or_create_progress(user_id, milestone_id)

        progress.progress_percentage = req.progress_percentage
        if req.status:
            progress.status = req.status
        else:
            if req.progress_percentage >= 100.0:
                progress.status = "completed"
            elif req.progress_percentage > 0.0:
                progress.status = "in_progress"
            else:
                progress.status = "not_started"

        if progress.status == "completed" and not progress.completed_at:
            progress.completed_at = utc_now()
        elif progress.status != "completed":
            progress.completed_at = None

        # Update parent milestone status
        query_m = select(Milestone).where(Milestone.id == milestone_id)
        res_m = await self.db.execute(query_m)
        milestone = res_m.scalar_one_or_none()
        if milestone:
            milestone.status = progress.status

        await self.db.commit()
        await self.db.refresh(progress)
        return progress

    async def mark_milestone_complete(self, user_id: UUID, milestone_id: UUID) -> Progress:
        return await self.update_progress(
            user_id=user_id,
            milestone_id=milestone_id,
            req=ProgressUpdateRequest(progress_percentage=100.0, status="completed")
        )

    async def get_roadmap_progress(self, user_id: UUID, roadmap_id: UUID) -> RoadmapProgressOverview:
        query = (
            select(Roadmap)
            .options(
                selectinload(Roadmap.milestones).selectinload(Milestone.progresses)
            )
            .where(Roadmap.id == roadmap_id, Roadmap.user_id == user_id)
        )
        res = await self.db.execute(query)
        roadmap = res.scalar_one_or_none()

        if not roadmap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Roadmap not found."
            )

        total_milestones = len(roadmap.milestones)
        completed_milestones = 0
        total_hours = sum(m.estimated_hours for m in roadmap.milestones)
        completed_hours = 0.0
        milestone_progress_list = []

        current_stage = "Getting Started"

        for idx, m in enumerate(roadmap.milestones, 1):
            p = await self.get_or_create_progress(user_id, m.id)
            milestone_progress_list.append(p)

            if p.status == "completed" or p.progress_percentage >= 100.0:
                completed_milestones += 1
                completed_hours += m.estimated_hours
            else:
                completed_hours += m.estimated_hours * (p.progress_percentage / 100.0)

            if p.status == "in_progress" and current_stage == "Getting Started":
                current_stage = f"Stage {idx}: {m.title}"

        remaining_milestones = max(0, total_milestones - completed_milestones)
        overall_percentage = (completed_milestones / total_milestones * 100.0) if total_milestones > 0 else 0.0

        if completed_milestones == total_milestones and total_milestones > 0:
            current_stage = "Completed Mastery!"
        elif current_stage == "Getting Started" and completed_milestones > 0:
            current_stage = f"Stage {completed_milestones + 1}: Next Milestone"

        return RoadmapProgressOverview(
            roadmap_id=roadmap.id,
            total_milestones=total_milestones,
            completed_milestones=completed_milestones,
            remaining_milestones=remaining_milestones,
            total_hours=round(total_hours, 1),
            completed_hours=round(completed_hours, 1),
            overall_progress_percentage=round(overall_percentage, 1),
            current_learning_stage=current_stage,
            milestone_progresses=milestone_progress_list
        )
