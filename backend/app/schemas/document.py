from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    file_path: str
    category: Optional[str]
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True
