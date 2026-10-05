import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_generate_and_submit_assessment(client: AsyncClient, auth_headers: dict):
    # 1. Create Goal
    goal_res = await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={"title": "AI Engineer", "target_role": "AI Engineer"}
    )
    goal_id = goal_res.json()["data"]["id"]

    # 2. Generate Assessment
    gen_res = await client.post(
        "/api/v1/assessments/generate",
        headers=auth_headers,
        json={"goal_id": goal_id}
    )
    assert gen_res.status_code == 201
    ass_data = gen_res.json()["data"]
    assessment_id = ass_data["id"]
    assert len(ass_data["questions"]) > 0

    # 3. Submit Answers
    sub_res = await client.post(
        f"/api/v1/assessments/{assessment_id}/submit",
        headers=auth_headers,
        json={
            "answers": [
                {"question_id": "q1", "answer": "Intermediate"},
                {"question_id": "q2", "answer": "Built personal projects"}
            ]
        }
    )
    assert sub_res.status_code == 200
    sub_data = sub_res.json()["data"]
    assert len(sub_data["answers"]) == 2
    assert "q1" in sub_data["skill_scores"]
