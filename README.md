# Employee Hub

A full-stack employee management system built with FastAPI and React.

## Features

- **Authentication** - JWT-based user registration and login
- **Employee Management** - Add, edit, and view employee profiles
- **Leave Management** - Submit and approve leave requests
- **Announcements** - Company-wide announcements board
- **Documents** - Upload and manage employee documents
- **Dashboard** - Overview with charts and statistics

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (configurable to PostgreSQL)
- **JWT** - Token-based authentication
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## Project Structure

```
employee-hub/
├── backend/
│   ├── app/
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   ├── main.py        # FastAPI app entry
│   │   ├── config.py      # Configuration
│   │   └── database.py    # Database setup
│   ├── uploads/           # Uploaded files
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React context (auth)
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   └── hooks/         # Custom hooks
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:5173

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | User login |
| `/employees` | GET/POST | List/Create employees |
| `/employees/{id}` | GET/PUT/DELETE | Employee CRUD |
| `/leaves` | GET/POST | List/Create leave requests |
| `/leaves/{id}` | PUT | Update leave status |
| `/announcements` | GET/POST | List/Create announcements |
| `/documents` | GET/POST | List/Upload documents |
| `/health` | GET | Health check |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | SQLite |
| `SECRET_KEY` | JWT secret key | - |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | 30 |

## License

LynxSphere
