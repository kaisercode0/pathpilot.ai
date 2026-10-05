# PathPilot AI Backend Service

Production-ready, modular backend service for **PathPilot AI** — an AI-powered career and academic roadmap platform built with **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.x**, **Pydantic v2**, and **JWT Authentication**.

---

## 🏗️ Architecture Overview

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entrypoint & exception handlers
│   ├── core/                    # Security, logging, and environment settings
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   ├── api/                     # API routes & dependencies
│   │   ├── deps.py
│   │   ├── router.py
│   │   └── routes/              # Modular route handlers (v1)
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── goals.py
│   │       ├── assessments.py
│   │       ├── roadmaps.py
│   │       ├── progress.py
│   │       ├── resources.py
│   │       └── health.py
│   ├── db/                      # Database engine & session generator
│   │   ├── database.py
│   │   └── session.py
│   ├── models/                  # SQLAlchemy 2.0 ORM Models
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── goal.py
│   │   ├── assessment.py
│   │   ├── roadmap.py
│   │   ├── milestone.py
│   │   ├── resource.py
│   │   └── progress.py
│   ├── schemas/                 # Pydantic v2 Schemas & Envelope Wrappers
│   │   ├── common.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── goal.py
│   │   ├── assessment.py
│   │   ├── roadmap.py
│   │   ├── progress.py
│   │   └── resource.py
│   ├── services/                # Encapsulated Business Logic Services
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── goal_service.py
│   │   ├── assessment_service.py
│   │   ├── roadmap_service.py
│   │   ├── progress_service.py
│   │   └── resource_service.py
│   ├── ai/                      # Provider-Independent AI Layer
│   │   ├── provider.py
│   │   ├── prompts.py
│   │   ├── roadmap_generator.py
│   │   ├── skill_analyzer.py
│   │   └── evaluator.py
│   └── utils/                   # Shared Validators & Helpers
│       └── validators.py
├── alembic/                     # Database Migrations (Alembic)
├── tests/                       # Comprehensive pytest suite (16 tests)
├── seed.py                      # Database seed script for development
├── Dockerfile                   # Production Docker container definition
├── docker-compose.yml           # PostgreSQL + Backend container orchestrator
├── requirements.txt             # Python dependencies
└── .env.example                 # Example configuration
```

---

## ⚡ Tech Stack

- **Framework**: FastAPI (Async Python 3.12+)
- **Database**: PostgreSQL 16+ (SQLite fallback supported)
- **ORM**: SQLAlchemy 2.x (Async Engine via `asyncpg` / `aiosqlite`)
- **Migrations**: Alembic
- **Validation & Serialization**: Pydantic v2
- **Auth**: JWT Tokens (Passlib / Bcrypt password hashing)
- **External Calls**: `httpx` async HTTP client
- **Testing**: `pytest`, `pytest-asyncio`, `httpx.AsyncClient`
- **Containerization**: Docker & Docker Compose

---

## 📋 Standard API Response Envelope

All API endpoints strictly follow the uniform JSON envelope specification:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Response:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Roadmap not found",
    "details": null
  }
}
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.12+
- Virtualenv

### 2. Create Virtual Environment & Install Dependencies
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Seed Development Data
Run the automated seed script to populate sample skills, goals, resources, fallback blueprints, and a demo user (`demo@pathpilot.ai` / `Password123!`):
```bash
python seed.py
```

### 5. Run the Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs (Swagger): `http://localhost:8000/docs`
- ReDoc UI: `http://localhost:8000/redoc`
- Health Endpoint: `http://localhost:8000/api/v1/health`

---

## 🐳 Running with Docker & Docker Compose

To launch PostgreSQL and the FastAPI backend together:

```bash
docker compose up --build
```

Services:
- **PostgreSQL**: `localhost:5432`
- **FastAPI App**: `localhost:8000`

---

## 🧪 Running Tests

Run the unit and integration test suite:

```bash
pytest backend/tests
```

All 16 tests run asynchronously against an in-memory SQLite database (`sqlite+aiosqlite:///:memory:`).

---

## 🔌 API Endpoints Summary

| Group | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Service and Database status |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user |
| | `POST` | `/api/v1/auth/login` | Login and receive JWT pair |
| | `POST` | `/api/v1/auth/refresh` | Refresh access token |
| | `GET` | `/api/v1/auth/me` | Fetch authenticated user |
| **Users** | `GET` | `/api/v1/users/me` | Fetch user info |
| | `PUT` | `/api/v1/users/me` | Update user info |
| | `GET` | `/api/v1/users/me/profile` | Fetch user profile |
| | `PUT` | `/api/v1/users/me/profile` | Update profile (skills, hours, style) |
| **Goals** | `POST` | `/api/v1/goals` | Create target goal |
| | `GET` | `/api/v1/goals` | List user goals |
| | `GET` | `/api/v1/goals/{id}` | Get goal by ID |
| | `PUT` | `/api/v1/goals/{id}` | Update goal |
| | `DELETE` | `/api/v1/goals/{id}` | Delete goal |
| **Assessment**| `POST` | `/api/v1/assessments/generate` | Generate skill gap assessment |
| | `GET` | `/api/v1/assessments/{id}` | Fetch assessment questions/scores |
| | `POST` | `/api/v1/assessments/{id}/submit`| Submit answers and score skills |
| **Roadmaps** | `POST` | `/api/v1/roadmaps/generate` | Generate complete structured roadmap |
| | `GET` | `/api/v1/roadmaps` | List user roadmaps |
| | `GET` | `/api/v1/roadmaps/{id}` | Get roadmap with milestones/resources |
| | `DELETE` | `/api/v1/roadmaps/{id}` | Delete roadmap |
| | `POST` | `/api/v1/roadmaps/{id}/adapt` | Adapt roadmap (rule/AI based) |
| **Progress** | `GET` | `/api/v1/progress/roadmap/{id}` | Get complete progress breakdown |
| | `PUT` | `/api/v1/progress/{milestone_id}` | Update milestone percentage/status |
| | `POST` | `/api/v1/progress/{milestone_id}/complete` | Mark milestone 100% complete |
| **Resources**| `POST` | `/api/v1/resources` | Add learning resource |
| | `GET` | `/api/v1/resources` | List resources (filter by milestone/type) |
| | `GET` | `/api/v1/resources/{id}` | Get resource details |

---

## 🤖 AI Provider Abstraction

The system uses a clean provider pattern defined in `app/ai/provider.py`. The active provider is controlled by the `AI_PROVIDER` environment variable:

- `AI_PROVIDER="mock"`: Deterministic, domain-tailored generation engine (default, no external API keys required).
- `AI_PROVIDER="openai"`: Live OpenAI GPT-4o generator via `httpx`.
- `AI_PROVIDER="anthropic"`: Live Anthropic Claude 3.5 Sonnet generator via `httpx`.
- `AI_PROVIDER="gemini"`: Live Google Gemini 1.5 Pro generator via `httpx`.

---

## 🌐 Connecting Next.js Frontend

To connect your Next.js frontend to this FastAPI backend:

1. Update `.env.local` in Next.js:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
2. Save JWT tokens received from `/api/v1/auth/login` in `localStorage` or HttpOnly cookies.
3. Attach `Authorization: Bearer <access_token>` to all protected request headers.

---

## 📈 MVP to Production Scaling Roadmap

1. **Redis Caching Layer**: Cache generated roadmaps and frequent skill queries using Redis.
2. **Asynchronous Background Workers**: Offload long AI generations to Celery / ARQ workers.
3. **Vector Database / RAG**: Integrate Qdrant / PgVector for semantic search across learning resources.
4. **Learning Analytics**: Add event tracking for milestone completions and velocity metrics.
5. **Rate Limiting**: Enable Redis-backed rate limiting via `slowapi`.
