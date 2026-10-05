import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_and_list_resources(client: AsyncClient, auth_headers: dict):
    # Create resource
    res = await client.post(
        "/api/v1/resources",
        headers=auth_headers,
        json={
            "title": "FastAPI Official Documentation",
            "description": "Interactive API reference and tutorials.",
            "resource_type": "doc",
            "url": "https://fastapi.tiangolo.com",
            "difficulty": "beginner",
            "is_free": True,
            "provider": "FastAPI"
        }
    )
    assert res.status_code == 201
    resource_id = res.json()["data"]["id"]

    # List resources with filter
    list_res = await client.get(
        "/api/v1/resources?resource_type=doc",
        headers=auth_headers
    )
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) >= 1

    # Get single resource
    single_res = await client.get(
        f"/api/v1/resources/{resource_id}",
        headers=auth_headers
    )
    assert single_res.status_code == 200
    assert single_res.json()["data"]["title"] == "FastAPI Official Documentation"
