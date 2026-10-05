import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.goal import Goal


def utc_now():
    return datetime.now(timezone.utc)


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    goal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("goals.id", ondelete="CASCADE"), index=True, nullable=False
    )
    questions: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    answers: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    skill_scores: Mapped[Dict[str, float]] = mapped_column(JSON, default=dict, nullable=False)
    strengths: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    weaknesses: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="assessments")
    goal: Mapped["Goal"] = relationship("Goal", back_populates="assessments")
