from fastapi import FastAPI
from app.api.v1.routes import auth, chat, plans
from app.core.config import settings
from app.db.session import engine
from app.models import base

base.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version="1.0")

# Register routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(plans.router, prefix="/api/v1/plans", tags=["Plans"])
