import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_progress_tracking_workflow(client: AsyncClient, auth_headers: dict):
    # 1. Create Goal & Roadmap
    goal_res = await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={"title": "Backend Architect"}
    )
    goal_id = goal_res.json()["data"]["id"]

    roadmap_res = await client.post(
        "/api/v1/roadmaps/generate",
        headers=auth_headers,
        json={"goal_id": goal_id, "weekly_hours": 20, "duration_weeks": 12}
    )
    roadmap = roadmap_res.json()["data"]
    milestone_id = roadmap["milestones"][0]["id"]

    # 2. Update Progress
    prog_res = await client.put(
        f"/api/v1/progress/{milestone_id}",
        headers=auth_headers,
        json={"progress_percentage": 50.0, "status": "in_progress"}
    )
    assert prog_res.status_code == 200
    assert prog_res.json()["data"]["progress_percentage"] == 50.0

    # 3. Mark Complete
    comp_res = await client.post(
        f"/api/v1/progress/{milestone_id}/complete",
        headers=auth_headers
    )
    assert comp_res.status_code == 200
    assert comp_res.json()["data"]["status"] == "completed"

    # 4. Get Roadmap Progress Overview
    overview_res = await client.get(
        f"/api/v1/progress/roadmap/{roadmap['id']}",
        headers=auth_headers
    )
    assert overview_res.status_code == 200
    overview_data = overview_res.json()["data"]
    assert overview_data["completed_milestones"] == 1
    assert overview_data["overall_progress_percentage"] > 0
