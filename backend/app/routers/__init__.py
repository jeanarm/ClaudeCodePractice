from .auth import router as auth_router
from .employees import router as employees_router
from .leaves import router as leaves_router
from .announcements import router as announcements_router
from .documents import router as documents_router

__all__ = [
    "auth_router",
    "employees_router",
    "leaves_router",
    "announcements_router",
    "documents_router"
]
