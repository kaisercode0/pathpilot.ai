import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import engine, AsyncSessionLocal, Base
from app.models import User, UserProfile, Goal, Assessment, Roadmap, Milestone, Resource, Progress
from app.core.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


async def seed_database():
    logger.info("Initializing database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if demo user already exists
        res = await session.execute(select(User).where(User.email == "demo@pathpilot.ai"))
        demo_user = res.scalar_one_or_none()

        if not demo_user:
            logger.info("Seeding demo user...")
            demo_user = User(
                email="demo@pathpilot.ai",
                password_hash=hash_password("Password123!"),
                full_name="Alex PathPilot"
            )
            session.add(demo_user)
            await session.flush()

            profile = UserProfile(
                user_id=demo_user.id,
                education_level="Bachelor's Degree",
                current_role="Junior Developer",
                experience_level="beginner",
                current_skills=["Python", "JavaScript", "HTML/CSS", "Git"],
                interests=["Machine Learning", "AI Agents", "Backend Architecture"],
                preferred_learning_style="project_based",
                weekly_hours=20
            )
            session.add(profile)
            await session.flush()

            # Seed sample Goal
            goal = Goal(
                user_id=demo_user.id,
                title="AI & Machine Learning Engineer",
                description="Master PyTorch, Transformers, LLM orchestration, and FastAPI MLOps microservices.",
                target_role="AI Engineer",
                target_domain="Artificial Intelligence",
                target_duration="6_months",
                priority="high",
                status="active"
            )
            session.add(goal)
            await session.flush()

            # Seed sample Assessment
            assessment = Assessment(
                user_id=demo_user.id,
                goal_id=goal.id,
                questions=[
                    {"id": "q1", "question": "Experience with PyTorch", "category": "technical", "skill": "PyTorch"},
                    {"id": "q2", "question": "Experience with Vector Databases", "category": "practical", "skill": "Qdrant/Pinecone"}
                ],
                answers=[{"question_id": "q1", "answer": "Beginner"}],
                skill_scores={"Python": 0.85, "PyTorch": 0.30, "FastAPI": 0.60, "RAG": 0.20},
                strengths=["Python Fundamentals", "REST API Development"],
                weaknesses=["Deep Learning Mathematics", "Vector Search"]
            )
            session.add(assessment)
            await session.flush()

            # Seed sample Roadmap
            roadmap = Roadmap(
                user_id=demo_user.id,
                goal_id=goal.id,
                title="AI Engineer Mastery Roadmap",
                description="6-month structured learning path for AI engineering mastery.",
                duration="24 weeks",
                difficulty="intermediate",
                generated_by="mock",
                career_insights={
                    "in_demand_skills": ["PyTorch", "RAG Systems", "FastAPI", "Docker"],
                    "recommended_certifications": ["AWS ML Specialty"],
                    "portfolio_tips": ["Build a multi-agent system with vector search"],
                    "interview_prep_focus": ["System design for AI inference"],
                    "potential_job_titles": ["AI Engineer", "ML Engineer"]
                }
            )
            session.add(roadmap)
            await session.flush()

            # Seed Milestones
            m1 = Milestone(
                roadmap_id=roadmap.id,
                title="Python & Data Science Foundations",
                description="Master core NumPy, Pandas, and data processing.",
                order_index=1,
                estimated_hours=25.0,
                skills=["Python", "NumPy", "Pandas"],
                status="completed"
            )
            m2 = Milestone(
                roadmap_id=roadmap.id,
                title="Deep Learning with PyTorch",
                description="Build neural networks and Transformers.",
                order_index=2,
                estimated_hours=40.0,
                skills=["PyTorch", "Transformers", "Neural Networks"],
                status="in_progress"
            )
            session.add_all([m1, m2])
            await session.flush()

            # Seed Resources
            r1 = Resource(
                milestone_id=m1.id,
                title="Python Data Science Handbook",
                description="Comprehensive reference for data analysis tools.",
                resource_type="book",
                url="https://jakevdp.github.io/PythonDataScienceHandbook/",
                difficulty="beginner",
                estimated_time="15 hours",
                is_free=True,
                provider="O'Reilly Open"
            )
            r2 = Resource(
                milestone_id=m2.id,
                title="PyTorch Official Deep Learning Tutorials",
                description="Official PyTorch step-by-step tutorial suite.",
                resource_type="tutorial",
                url="https://pytorch.org/tutorials/",
                difficulty="intermediate",
                estimated_time="20 hours",
                is_free=True,
                provider="PyTorch Foundation"
            )
            session.add_all([r1, r2])
            await session.flush()

            # Seed Progress
            p1 = Progress(
                user_id=demo_user.id,
                milestone_id=m1.id,
                progress_percentage=100.0,
                status="completed"
            )
            p2 = Progress(
                user_id=demo_user.id,
                milestone_id=m2.id,
                progress_percentage=40.0,
                status="in_progress"
            )
            session.add_all([p1, p2])

            await session.commit()
            logger.info("Seed completed successfully! Demo User: demo@pathpilot.ai / Password123!")
        else:
            logger.info("Seed data already present. Skipping.")


if __name__ == "__main__":
    asyncio.run(seed_database())
