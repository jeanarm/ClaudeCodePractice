#!/usr/bin/env python3
"""Seed script to populate the database with sample data."""

import sys
sys.path.insert(0, '.')

from datetime import date, datetime, timedelta
import random
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.leave import Leave, LeaveType, LeaveStatus
from app.models.announcement import Announcement, Priority
from app.models.document import Document
from app.utils.auth import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Sample data
departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]
positions = {
    "Engineering": ["Software Engineer", "Senior Developer", "Tech Lead", "DevOps Engineer"],
    "Marketing": ["Marketing Manager", "Content Writer", "SEO Specialist", "Brand Manager"],
    "Sales": ["Sales Representative", "Account Manager", "Sales Director", "Business Development"],
    "HR": ["HR Manager", "Recruiter", "HR Coordinator", "Training Specialist"],
    "Finance": ["Accountant", "Financial Analyst", "Controller", "Bookkeeper"],
    "Operations": ["Operations Manager", "Project Manager", "Logistics Coordinator", "Admin Assistant"]
}

employees_data = [
    {"first_name": "John", "last_name": "Smith", "role": UserRole.ADMIN},
    {"first_name": "Sarah", "last_name": "Johnson", "role": UserRole.MANAGER},
    {"first_name": "Michael", "last_name": "Williams", "role": UserRole.MANAGER},
    {"first_name": "Emily", "last_name": "Brown", "role": UserRole.EMPLOYEE},
    {"first_name": "David", "last_name": "Jones", "role": UserRole.EMPLOYEE},
    {"first_name": "Jessica", "last_name": "Garcia", "role": UserRole.EMPLOYEE},
    {"first_name": "Daniel", "last_name": "Martinez", "role": UserRole.EMPLOYEE},
    {"first_name": "Ashley", "last_name": "Anderson", "role": UserRole.EMPLOYEE},
    {"first_name": "James", "last_name": "Taylor", "role": UserRole.EMPLOYEE},
    {"first_name": "Amanda", "last_name": "Thomas", "role": UserRole.EMPLOYEE},
    {"first_name": "Robert", "last_name": "Jackson", "role": UserRole.EMPLOYEE},
    {"first_name": "Sophia", "last_name": "White", "role": UserRole.EMPLOYEE},
    {"first_name": "William", "last_name": "Harris", "role": UserRole.EMPLOYEE},
    {"first_name": "Olivia", "last_name": "Martin", "role": UserRole.EMPLOYEE},
    {"first_name": "Christopher", "last_name": "Lee", "role": UserRole.EMPLOYEE},
]

announcements_data = [
    {"title": "Welcome to 2025!", "content": "Happy New Year to all employees! We're excited to kick off another great year together. Let's make it our best year yet!", "priority": Priority.HIGH},
    {"title": "Q1 Goals Announcement", "content": "Our Q1 objectives have been finalized. Please check with your department heads for specific team goals and KPIs.", "priority": Priority.HIGH},
    {"title": "New Health Benefits", "content": "We're pleased to announce enhanced health benefits starting next month. This includes dental and vision coverage improvements.", "priority": Priority.MEDIUM},
    {"title": "Office Holiday Schedule", "content": "Please note the upcoming holidays: Jan 1 (New Year), Jan 20 (MLK Day). The office will be closed on these dates.", "priority": Priority.MEDIUM},
    {"title": "Team Building Event", "content": "Join us for our quarterly team building event on January 15th. Activities include bowling and dinner. RSVP by Jan 10.", "priority": Priority.LOW},
    {"title": "IT System Maintenance", "content": "Scheduled maintenance this Saturday from 10 PM to 2 AM. Some systems may be temporarily unavailable.", "priority": Priority.MEDIUM},
    {"title": "Parking Lot Update", "content": "The east parking lot will be repaved next week. Please use the west lot during this time.", "priority": Priority.LOW},
]

documents_data = [
    {"name": "Employee Handbook 2025.pdf", "description": "Complete employee handbook with policies and procedures", "category": "Policy"},
    {"name": "Benefits Guide.pdf", "description": "Comprehensive guide to employee benefits", "category": "HR"},
    {"name": "Code of Conduct.pdf", "description": "Company code of conduct and ethics guidelines", "category": "Policy"},
    {"name": "Remote Work Policy.pdf", "description": "Guidelines for remote and hybrid work arrangements", "category": "Policy"},
    {"name": "Expense Report Template.xlsx", "description": "Template for submitting expense reports", "category": "Finance"},
    {"name": "Onboarding Checklist.pdf", "description": "New employee onboarding checklist", "category": "HR"},
    {"name": "Security Guidelines.pdf", "description": "IT security best practices", "category": "IT"},
    {"name": "Travel Policy.pdf", "description": "Business travel policies and procedures", "category": "Policy"},
]

def clear_data():
    """Clear existing data."""
    db.query(Leave).delete()
    db.query(Document).delete()
    db.query(Announcement).delete()
    db.query(Employee).delete()
    db.query(User).delete()
    db.commit()
    print("Cleared existing data")

def seed_users_and_employees():
    """Create users and their employee profiles."""
    created_users = []

    for i, emp_data in enumerate(employees_data):
        email = f"{emp_data['first_name'].lower()}.{emp_data['last_name'].lower()}@company.com"

        # Create user
        user = User(
            email=email,
            password_hash=get_password_hash("password123"),
            role=emp_data['role']
        )
        db.add(user)
        db.flush()

        # Create employee profile
        dept = random.choice(departments)
        employee = Employee(
            user_id=user.id,
            first_name=emp_data['first_name'],
            last_name=emp_data['last_name'],
            email=email,
            phone=f"+1-555-{random.randint(100,999)}-{random.randint(1000,9999)}",
            department=dept,
            position=random.choice(positions[dept]),
            hire_date=date.today() - timedelta(days=random.randint(30, 1500))
        )
        db.add(employee)
        created_users.append((user, employee))

    db.commit()
    print(f"Created {len(created_users)} users and employees")
    return created_users

def seed_announcements(admin_user):
    """Create announcements."""
    for i, ann_data in enumerate(announcements_data):
        announcement = Announcement(
            title=ann_data['title'],
            content=ann_data['content'],
            priority=ann_data['priority'],
            author_id=admin_user.id,
            created_at=datetime.now() - timedelta(days=i * 2)
        )
        db.add(announcement)

    db.commit()
    print(f"Created {len(announcements_data)} announcements")

def seed_leaves(employees):
    """Create leave requests."""
    leave_types = list(LeaveType)
    statuses = [LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.APPROVED, LeaveStatus.REJECTED]

    leaves_created = 0
    for user, employee in employees:
        # Each employee has 0-3 leave requests
        num_leaves = random.randint(0, 3)
        for _ in range(num_leaves):
            start = date.today() + timedelta(days=random.randint(-30, 60))
            duration = random.randint(1, 10)

            leave = Leave(
                employee_id=employee.id,
                leave_type=random.choice(leave_types),
                start_date=start,
                end_date=start + timedelta(days=duration),
                status=random.choice(statuses),
                reason=random.choice([
                    "Family vacation",
                    "Personal matters",
                    "Medical appointment",
                    "Wedding attendance",
                    "Home repairs",
                    None
                ])
            )
            db.add(leave)
            leaves_created += 1

    db.commit()
    print(f"Created {leaves_created} leave requests")

def seed_documents(admin_user):
    """Create documents."""
    for doc_data in documents_data:
        document = Document(
            name=doc_data['name'],
            description=doc_data['description'],
            file_path=f"uploads/{doc_data['name']}",
            category=doc_data['category'],
            uploaded_by=admin_user.id
        )
        db.add(document)

    db.commit()
    print(f"Created {len(documents_data)} documents")

def main():
    print("Starting database seed...")
    print("-" * 40)

    # Clear existing data
    clear_data()

    # Create users and employees
    users_employees = seed_users_and_employees()
    admin_user = users_employees[0][0]  # First user is admin

    # Create announcements
    seed_announcements(admin_user)

    # Create leaves
    seed_leaves(users_employees)

    # Create documents
    seed_documents(admin_user)

    print("-" * 40)
    print("Database seeded successfully!")
    print("\nSample login credentials:")
    print("  Admin: john.smith@company.com / password123")
    print("  Manager: sarah.johnson@company.com / password123")
    print("  Employee: emily.brown@company.com / password123")

if __name__ == "__main__":
    main()
    db.close()
