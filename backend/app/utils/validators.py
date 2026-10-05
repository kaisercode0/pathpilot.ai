import re
from typing import List
from fastapi import HTTPException, status


def validate_email_format(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))


def sanitize_skills(skills: List[str]) -> List[str]:
    cleaned = []
    for s in skills:
        item = s.strip()
        if item and item not in cleaned:
            cleaned.append(item)
    return cleaned


def validate_duration(duration_str: str) -> int:
    """Converts duration string (e.g. 1_month, 3_months, 6_months, 12_months) to number of weeks."""
    mapping = {
        "1_month": 4,
        "3_months": 12,
        "6_months": 24,
        "12_months": 52,
    }
    return mapping.get(duration_str, 24)
