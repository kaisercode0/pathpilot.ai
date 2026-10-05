from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.assessment import AssessmentGenerateRequest, AssessmentSubmitRequest, AssessmentResponse
from app.schemas.common import success_response
from app.services.assessment_service import AssessmentService

router = APIRouter()


@router.post("/generate", status_code=status.HTTP_201_CREATED)
async def generate_assessment(
    req: AssessmentGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = await service.generate_assessment(req.goal_id, current_user.id)
    return success_response(AssessmentResponse.model_validate(assessment).model_dump(mode="json"))


@router.get("/{assessment_id}")
async def get_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = await service.get_assessment(assessment_id, current_user.id)
    return success_response(AssessmentResponse.model_validate(assessment).model_dump(mode="json"))


@router.post("/{assessment_id}/submit")
async def submit_assessment(
    assessment_id: UUID,
    req: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = await service.submit_answers(assessment_id, current_user.id, req.answers)
    return success_response(AssessmentResponse.model_validate(assessment).model_dump(mode="json"))
