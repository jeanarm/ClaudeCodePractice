from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from ..models.leave import LeaveType, LeaveStatus


class LeaveCreate(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: Optional[str] = None


class LeaveUpdate(BaseModel):
    status: LeaveStatus


class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    leave_type: LeaveType
    start_date: date
    end_date: date
    status: LeaveStatus
    reason: Optional[str]
    approved_by: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
