from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import auth, chat, plans, profiles, progress
from app.core.config import settings
from app.db.session import engine
from app.models.base import Base
from app.models.profile import UserProfile
from app.models.progress import Progress
from app.models.chat import ChatMessage

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered fitness assistant that generates personalized workout and diet plans",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(plans.router, prefix="/api/v1/plans", tags=["Plans"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["Profiles"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Welcome to AI Gym Coach API. Visit /api/docs for the API documentation."}
