from uuid import UUID
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.models.assessment import Assessment
from app.models.goal import Goal
from app.models.profile import UserProfile
from app.schemas.assessment import AnswerSubmission, SkillGapAnalysis
from app.ai.skill_analyzer import SkillAnalyzer


class AssessmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.skill_analyzer = SkillAnalyzer()

    async def generate_assessment(self, goal_id: UUID, user_id: UUID) -> Assessment:
        # 1. Retrieve goal with ownership check
        query_goal = select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
        result_goal = await self.db.execute(query_goal)
        goal = result_goal.scalar_one_or_none()

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found or access forbidden."
            )

        # 2. Retrieve user profile
        query_prof = select(UserProfile).where(UserProfile.user_id == user_id)
        res_prof = await self.db.execute(query_prof)
        profile = res_prof.scalar_one_or_none()
        current_skills = profile.current_skills if profile else []

        # 3. Perform skill gap analysis via AI/Mock analyzer
        analysis_data = await self.skill_analyzer.analyze(
            current_skills=current_skills,
            target_role=goal.target_role or goal.title,
            goal_title=goal.title
        )

        # 4. Generate questions based on target skills
        questions = [
            {
                "id": "q1",
                "question": f"How experienced are you with {analysis_data['priority_skills'][0] if analysis_data['priority_skills'] else 'Core Programming'}?",
                "category": "technical",
                "skill": analysis_data['priority_skills'][0] if analysis_data['priority_skills'] else "Core Programming",
                "options": ["No experience", "Beginner", "Intermediate", "Advanced / Expert"]
            },
            {
                "id": "q2",
                "question": f"Have you built production projects using {analysis_data['recommended_learning_sequence'][-1] if len(analysis_data['recommended_learning_sequence']) > 1 else 'Modern Frameworks'}?",
                "category": "practical",
                "skill": analysis_data['recommended_learning_sequence'][-1] if len(analysis_data['recommended_learning_sequence']) > 1 else "Modern Frameworks",
                "options": ["Never", "Explored in tutorials", "Built personal projects", "Shipped in production"]
            },
            {
                "id": "q3",
                "question": "What is your primary focus when tackling new complex concepts?",
                "category": "preference",
                "skill": "Learning Methodology",
                "options": ["Hands-on project building", "Deep theoretical understanding", "Certification prep", "Code katas & practice"]
            }
        ]

        assessment = Assessment(
            user_id=user_id,
            goal_id=goal.id,
            questions=questions,
            answers=[],
            skill_scores=analysis_data.get("skill_proficiency", {}),
            strengths=analysis_data.get("strengths", []),
            weaknesses=analysis_data.get("weaknesses", [])
        )

        self.db.add(assessment)
        await self.db.commit()
        await self.db.refresh(assessment)
        return assessment

    async def get_assessment(self, assessment_id: UUID, user_id: UUID) -> Assessment:
        query = select(Assessment).where(Assessment.id == assessment_id)
        result = await self.db.execute(query)
        assessment = result.scalar_one_or_none()

        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found."
            )
        if assessment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this assessment."
            )

        return assessment

    async def submit_answers(self, assessment_id: UUID, user_id: UUID, answers: List[AnswerSubmission]) -> Assessment:
        assessment = await self.get_assessment(assessment_id, user_id)

        answers_json = [a.model_dump() for a in answers]
        assessment.answers = answers_json

        # Recalculate scores based on submitted answers
        scores = dict(assessment.skill_scores)
        for ans in answers:
            val = ans.answer
            # Increase/adjust scores based on answers
            if val in ["Intermediate", "Built personal projects"]:
                scores[ans.question_id] = 0.70
            elif val in ["Advanced / Expert", "Shipped in production"]:
                scores[ans.question_id] = 0.95
            elif val in ["Beginner", "Explored in tutorials"]:
                scores[ans.question_id] = 0.40
            else:
                scores[ans.question_id] = 0.15

        assessment.skill_scores = scores
        await self.db.commit()
        await self.db.refresh(assessment)
        return assessment

    async def get_latest_for_goal(self, goal_id: UUID, user_id: UUID) -> Optional[Assessment]:
        query = select(Assessment).where(
            Assessment.goal_id == goal_id,
            Assessment.user_id == user_id
        ).order_by(Assessment.created_at.desc())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
