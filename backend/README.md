# AI Gym Coach - Backend

A scalable and production-ready FastAPI backend for an AI chatbot that generates personalized gym workout and diet plans.

## Architecture Highlights

- FastAPI with modular structure
- JWT-based authentication
- PostgreSQL with SQLAlchemy
- OpenAI integration
- Environment config via `.env`
- Docker-ready setup

## Folder Structure

```
app/
├── api/            # Route declarations
│   └── v1/
│       └── routes/ # Modular route files (auth, chat, plans)
├── core/           # Core settings & security
├── db/             # Database config and session management
├── models/         # SQLAlchemy models
├── schemas/        # Pydantic schemas
├── services/       # Business logic
├── utils/          # Utility functions (e.g., auth)
```
