import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_goal_success(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={
            "title": "Full Stack Engineer",
            "description": "Master React, FastAPI, and PostgreSQL",
            "target_role": "Full Stack Developer",
            "target_duration": "6_months",
            "priority": "high"
        }
    )
    assert response.status_code == 201
    body = response.json()
    assert body["success"] is True
    assert body["data"]["title"] == "Full Stack Engineer"
    assert body["data"]["status"] == "active"


@pytest.mark.asyncio
async def test_list_goals(client: AsyncClient, auth_headers: dict):
    await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={"title": "Goal 1", "priority": "medium"}
    )
    response = await client.get("/api/v1/goals", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert len(body["data"]) >= 1


@pytest.mark.asyncio
async def test_goal_ownership_isolation(
    client: AsyncClient,
    auth_headers: dict,
    second_auth_headers: dict
):
    # User 1 creates goal
    create_res = await client.post(
        "/api/v1/goals",
        headers=auth_headers,
        json={"title": "User 1 Secret Goal"}
    )
    goal_id = create_res.json()["data"]["id"]

    # User 2 attempts to fetch User 1's goal -> expect 403 Forbidden
    forbidden_res = await client.get(
        f"/api/v1/goals/{goal_id}",
        headers=second_auth_headers
    )
    assert forbidden_res.status_code == 403
    assert forbidden_res.json()["error"]["code"] == "FORBIDDEN"

    # User 2 attempts to delete User 1's goal -> expect 403 Forbidden
    del_res = await client.delete(
        f"/api/v1/goals/{goal_id}",
        headers=second_auth_headers
    )
    assert del_res.status_code == 403
