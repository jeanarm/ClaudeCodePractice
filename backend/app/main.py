from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import (
    auth_router,
    employees_router,
    leaves_router,
    announcements_router,
    documents_router
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Employee Hub API",
    description="A comprehensive employee management system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(employees_router)
app.include_router(leaves_router)
app.include_router(announcements_router)
app.include_router(documents_router)


@app.get("/")
def root():
    return {"message": "Welcome to Employee Hub API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
