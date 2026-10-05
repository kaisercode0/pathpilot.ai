from uuid import UUID
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.roadmap import Roadmap
from app.models.milestone import Milestone
from app.models.resource import Resource
from app.models.goal import Goal
from app.models.profile import UserProfile
from app.schemas.roadmap import RoadmapGenerateRequest, AdaptRoadmapRequest
from app.ai.roadmap_generator import RoadmapGenerator
from app.services.assessment_service import AssessmentService
from app.services.user_service import UserService


class RoadmapService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.generator = RoadmapGenerator()
        self.assessment_service = AssessmentService(db)
        self.user_service = UserService(db)

    async def generate_roadmap(
        self,
        user_id: UUID,
        req: RoadmapGenerateRequest
    ) -> Roadmap:
        # 1. Retrieve goal with ownership check
        query_goal = select(Goal).where(Goal.id == req.goal_id, Goal.user_id == user_id)
        res_goal = await self.db.execute(query_goal)
        goal = res_goal.scalar_one_or_none()

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found or access forbidden."
            )

        # 2. Retrieve user profile
        profile = await self.user_service.get_user_profile(user_id)

        # 3. Retrieve latest assessment or create one if none exists
        assessment = await self.assessment_service.get_latest_for_goal(goal.id, user_id)
        if not assessment:
            assessment = await self.assessment_service.generate_assessment(goal.id, user_id)

        # Build profile and goal dicts for AI generator
        profile_dict = {
            "education_level": profile.education_level,
            "current_role": profile.current_role,
            "experience_level": profile.experience_level or "beginner",
            "current_skills": profile.current_skills or [],
            "interests": profile.interests or [],
            "preferred_learning_style": profile.preferred_learning_style or "balanced",
            "weekly_hours": req.weekly_hours or profile.weekly_hours or 15
        }

        goal_dict = {
            "title": goal.title,
            "description": goal.description,
            "target_role": goal.target_role,
            "target_domain": goal.target_domain,
            "target_duration": goal.target_duration
        }

        assessment_dict = {
            "skill_scores": assessment.skill_scores,
            "strengths": assessment.strengths,
            "weaknesses": assessment.weaknesses
        }

        # 4. Generate structured roadmap via AI/Mock Engine
        ai_roadmap = await self.generator.generate(
            user_profile=profile_dict,
            goal=goal_dict,
            assessment=assessment_dict,
            weekly_hours=req.weekly_hours or 15,
            duration_weeks=req.duration_weeks or 24
        )

        # 5. Persist Roadmap to Database
        roadmap = Roadmap(
            user_id=user_id,
            goal_id=goal.id,
            title=ai_roadmap.get("title", f"{goal.title} Roadmap"),
            description=ai_roadmap.get("description", ""),
            duration=ai_roadmap.get("duration", f"{req.duration_weeks or 24} weeks"),
            difficulty=ai_roadmap.get("difficulty", profile.experience_level or "beginner"),
            generated_by=ai_roadmap.get("generated_by", "mock"),
            career_insights=ai_roadmap.get("career_insights", {})
        )
        self.db.add(roadmap)
        await self.db.flush()

        # 6. Persist Milestones & attached Resources
        milestones_list = ai_roadmap.get("milestones", [])
        for idx, m_data in enumerate(milestones_list, 1):
            milestone = Milestone(
                roadmap_id=roadmap.id,
                title=m_data.get("title", f"Milestone {idx}"),
                description=m_data.get("description", ""),
                order_index=m_data.get("order_index", idx),
                estimated_hours=float(m_data.get("estimated_hours", 10.0)),
                skills=m_data.get("skills", []),
                status="not_started"
            )
            self.db.add(milestone)
            await self.db.flush()

            # Attach resources to milestone
            resources_list = m_data.get("resources", [])
            for r_data in resources_list:
                resource = Resource(
                    milestone_id=milestone.id,
                    title=r_data.get("title", "Learning Resource"),
                    description=r_data.get("description", ""),
                    resource_type=r_data.get("resource_type", "course"),
                    url=r_data.get("url", "https://example.com"),
                    difficulty=r_data.get("difficulty", "intermediate"),
                    estimated_time=r_data.get("estimated_time", "5 hours"),
                    is_free=r_data.get("is_free", True),
                    provider=r_data.get("provider", "Official Source")
                )
                self.db.add(resource)

        await self.db.commit()
        return await self.get_roadmap_by_id(roadmap.id, user_id)

    async def get_roadmap_by_id(self, roadmap_id: UUID, user_id: UUID) -> Roadmap:
        query = (
            select(Roadmap)
            .options(
                selectinload(Roadmap.milestones).selectinload(Milestone.resources)
            )
            .where(Roadmap.id == roadmap_id)
        )
        result = await self.db.execute(query)
        roadmap = result.scalar_one_or_none()

        if not roadmap:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Roadmap not found."
            )
        if roadmap.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden to this roadmap."
            )

        return roadmap

    async def list_user_roadmaps(self, user_id: UUID) -> List[Roadmap]:
        query = (
            select(Roadmap)
            .options(
                selectinload(Roadmap.milestones).selectinload(Milestone.resources)
            )
            .where(Roadmap.user_id == user_id)
            .order_by(Roadmap.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def delete_roadmap(self, roadmap_id: UUID, user_id: UUID) -> None:
        roadmap = await self.get_roadmap_by_id(roadmap_id, user_id)
        await self.db.delete(roadmap)
        await self.db.commit()

    async def adapt_roadmap(
        self,
        roadmap_id: UUID,
        user_id: UUID,
        req: AdaptRoadmapRequest
    ) -> Roadmap:
        roadmap = await self.get_roadmap_by_id(roadmap_id, user_id)

        # Convert roadmap to dict representation for AI provider adaptation engine
        milestones_dict = []
        for m in roadmap.milestones:
            milestones_dict.append({
                "id": str(m.id),
                "title": m.title,
                "description": m.description,
                "order_index": m.order_index,
                "estimated_hours": m.estimated_hours,
                "skills": m.skills,
                "status": m.status,
                "resources": [
                    {
                        "title": r.title,
                        "description": r.description,
                        "resource_type": r.resource_type,
                        "url": r.url,
                        "difficulty": r.difficulty,
                        "estimated_time": r.estimated_time,
                        "is_free": r.is_free,
                        "provider": r.provider
                    } for r in m.resources
                ]
            })

        roadmap_dict = {
            "title": roadmap.title,
            "milestones": milestones_dict
        }

        adapted_roadmap = await self.generator.adapt(
            roadmap=roadmap_dict,
            trigger=req.reason,
            params={
                "new_weekly_hours": req.new_weekly_hours,
                "assessment_score": req.assessment_score,
                "completed_milestone_id": req.completed_milestone_id,
                "notes": req.notes
            }
        )

        # Delete existing milestones and re-insert adapted milestones
        for m in list(roadmap.milestones):
            await self.db.delete(m)
        await self.db.flush()

        for idx, m_data in enumerate(adapted_roadmap.get("milestones", []), 1):
            milestone = Milestone(
                roadmap_id=roadmap.id,
                title=m_data.get("title", f"Adapted Milestone {idx}"),
                description=m_data.get("description", ""),
                order_index=m_data.get("order_index", idx),
                estimated_hours=float(m_data.get("estimated_hours", 10.0)),
                skills=m_data.get("skills", []),
                status=m_data.get("status", "not_started")
            )
            self.db.add(milestone)
            await self.db.flush()

            for r_data in m_data.get("resources", []):
                resource = Resource(
                    milestone_id=milestone.id,
                    title=r_data.get("title", "Resource"),
                    description=r_data.get("description", ""),
                    resource_type=r_data.get("resource_type", "course"),
                    url=r_data.get("url", "https://example.com"),
                    difficulty=r_data.get("difficulty", "intermediate"),
                    estimated_time=r_data.get("estimated_time", "5 hours"),
                    is_free=r_data.get("is_free", True),
                    provider=r_data.get("provider", "Official Source")
                )
                self.db.add(resource)

        await self.db.commit()
        return await self.get_roadmap_by_id(roadmap.id, user_id)
