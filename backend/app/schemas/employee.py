from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional


class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    hire_date: Optional[date] = None
    avatar_url: Optional[str] = None


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    hire_date: Optional[date] = None
    avatar_url: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    department: Optional[str]
    position: Optional[str]
    hire_date: Optional[date]
    avatar_url: Optional[str]

    class Config:
        from_attributes = True
