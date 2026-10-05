from typing import Dict, Any, List
from app.ai.provider import get_ai_provider


class Evaluator:
    def __init__(self, provider_name: str = None):
        self.provider = get_ai_provider(provider_name)

    async def evaluate(
        self,
        roadmap: Dict[str, Any],
        user_progress: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        return await self.provider.evaluate_progress(
            roadmap=roadmap,
            user_progress=user_progress
        )
