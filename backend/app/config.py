from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./loackin.db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o-mini"
    
    # Google OAuth
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_redirect_uri: str = "http://localhost:3000/auth/google/callback"
    
    # GitHub AI (alternative to OpenAI)
    github_token: Optional[str] = None
    github_endpoint: str = "https://models.github.ai/inference"
    github_model: str = "openai/gpt-5"
    
    class Config:
        env_file = ".env"

settings = Settings() 