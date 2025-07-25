from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, profiles, s3  # 👉 Import all your routers
from app.database import engine
from app import models
import os

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = os.getenv("CORS_ORIGINS", "").split(",")
# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # adjust when deploying
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(user.router, tags=["Auth"])
app.include_router(profiles.router, prefix="/profile", tags=["Profile"])
app.include_router(s3.router, prefix="/s3", tags=["S3 Uploads"])
