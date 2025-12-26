from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.announcement import Priority


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    priority: Priority = Priority.MEDIUM
    expires_at: Optional[datetime] = None


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    priority: Priority
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True
