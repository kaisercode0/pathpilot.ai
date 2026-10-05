from typing import Dict, Any, Optional
from app.ai.provider import get_ai_provider


class RoadmapGenerator:
    def __init__(self, provider_name: str = None):
        self.provider = get_ai_provider(provider_name)

    async def generate(
        self,
        user_profile: Dict[str, Any],
        goal: Dict[str, Any],
        assessment: Optional[Dict[str, Any]] = None,
        weekly_hours: int = 15,
        duration_weeks: int = 24
    ) -> Dict[str, Any]:
        return await self.provider.generate_roadmap(
            user_profile=user_profile,
            goal=goal,
            assessment=assessment,
            weekly_hours=weekly_hours,
            duration_weeks=duration_weeks
        )

    async def adapt(
        self,
        roadmap: Dict[str, Any],
        trigger: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        return await self.provider.adapt_roadmap(
            roadmap=roadmap,
            trigger=trigger,
            params=params
        )
