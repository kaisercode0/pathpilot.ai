import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_user_me(client: AsyncClient, auth_headers: dict, test_user):
    response = await client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["email"] == test_user.email


@pytest.mark.asyncio
async def test_unauthorized_user_me_fails(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_user_profile(client: AsyncClient, auth_headers: dict):
    response = await client.put(
        "/api/v1/users/me/profile",
        headers=auth_headers,
        json={
            "education_level": "Master's Degree",
            "current_skills": ["Python", "FastAPI", "SQLAlchemy"],
            "weekly_hours": 20,
            "experience_level": "intermediate"
        }
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["education_level"] == "Master's Degree"
    assert "FastAPI" in body["data"]["current_skills"]
    assert body["data"]["weekly_hours"] == 20
