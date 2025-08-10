from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, study_plan, ai_chat, calendar
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LoackIn API",
    description="AI-Powered Study Companion Backend API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(study_plan.router, prefix="/api/study-plan", tags=["Study Plan"])
app.include_router(ai_chat.router, prefix="/api/ai-chat", tags=["AI Chat"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])

@app.get("/")
async def root():
    return {"message": "Welcome to LoackIn API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LoackIn API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 