from typing import List, Dict, Any
from app.ai.provider import get_ai_provider


class SkillAnalyzer:
    def __init__(self, provider_name: str = None):
        self.provider = get_ai_provider(provider_name)

    async def analyze(
        self,
        current_skills: List[str],
        target_role: str,
        goal_title: str
    ) -> Dict[str, Any]:
        return await self.provider.analyze_skills(
            current_skills=current_skills,
            target_role=target_role,
            goal_title=goal_title
        )
