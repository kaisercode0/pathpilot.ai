from typing import Generic, Optional, TypeVar, Any
from pydantic import BaseModel, Field

DataType = TypeVar("DataType")


class ErrorDetails(BaseModel):
    code: str = Field(..., json_schema_extra={"example": "RESOURCE_NOT_FOUND"})
    message: str = Field(..., json_schema_extra={"example": "The requested resource was not found."})
    details: Optional[Any] = None


class APIResponse(BaseModel, Generic[DataType]):
    success: bool = True
    data: Optional[DataType] = None
    error: Optional[ErrorDetails] = None


def success_response(data: Any = None) -> dict:
    return {
        "success": True,
        "data": data,
        "error": None
    }


def error_response(code: str, message: str, details: Any = None) -> dict:
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message,
            "details": details
        }
    }
