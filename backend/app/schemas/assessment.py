from datetime import datetime
from typing import List, Dict, Any, Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class AssessmentGenerateRequest(BaseModel):
    goal_id: UUID


class AnswerSubmission(BaseModel):
    question_id: str
    answer: Any


class AssessmentSubmitRequest(BaseModel):
    answers: List[AnswerSubmission]


class AssessmentQuestion(BaseModel):
    id: str
    question: str
    category: str
    skill: str
    options: Optional[List[str]] = None


class SkillGapAnalysis(BaseModel):
    existing_skills: List[str]
    missing_skills: List[str]
    skill_proficiency: Dict[str, float]
    priority_skills: List[str]
    recommended_learning_sequence: List[str]


class AssessmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    goal_id: UUID
    questions: List[Dict[str, Any]]
    answers: List[Dict[str, Any]]
    skill_scores: Dict[str, float]
    strengths: List[str]
    weaknesses: List[str]
    skill_gap_analysis: Optional[SkillGapAnalysis] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
