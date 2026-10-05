import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_roadmap_generation_and_adaptation(client: AsyncClient, auth_headers: dict):
    # 1. Create Goal
    goal_res = await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={"title": "Cybersecurity Analyst", "target_role": "Cybersecurity Analyst"}
    )
    goal_id = goal_res.json()["data"]["id"]

    # 2. Generate Roadmap
    gen_res = await client.post(
        "/api/v1/roadmaps/generate",
        headers=auth_headers,
        json={
            "goal_id": goal_id,
            "weekly_hours": 15,
            "duration_weeks": 24
        }
    )
    assert gen_res.status_code == 201
    roadmap_data = gen_res.json()["data"]
    roadmap_id = roadmap_data["id"]
    assert len(roadmap_data["milestones"]) > 0
    assert "Wireshark" in str(roadmap_data) or "Linux" in str(roadmap_data) or "Security" in str(roadmap_data)

    # 3. Adapt Roadmap (Weekly hours changed)
    adapt_res = await client.post(
        f"/api/v1/roadmaps/{roadmap_id}/adapt",
        headers=auth_headers,
        json={
            "reason": "weekly_hours_changed",
            "new_weekly_hours": 10
        }
    )
    assert adapt_res.status_code == 200
    adapted_data = adapt_res.json()["data"]
    assert len(adapted_data["milestones"]) > 0
