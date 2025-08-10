#!/usr/bin/env python3
"""
Setup script for Loackin backend
This script will help you initialize the database and verify your configuration.
"""

import os
import sys
from pathlib import Path

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

def check_environment():
    """Check if .env file exists and has required variables"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please copy env.template to .env and fill in your API keys:")
        print("cp env.template .env")
        print("Then edit .env with your actual values.")
        return False
    
    # Check for required environment variables
    required_vars = [
        "OPENAI_API_KEY",
        "SECRET_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var).startswith("your-"):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing or invalid environment variables: {', '.join(missing_vars)}")
        print("Please update your .env file with valid values.")
        return False
    
    print("✅ Environment variables configured!")
    return True

def create_database():
    """Create and initialize the database"""
    try:
        from app.database import engine
        from app.models import Base
        
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create database: {e}")
        return False

def test_openai_connection():
    """Test OpenAI API connection"""
    try:
        from app.config import settings
        from openai import OpenAI
        
        if not settings.openai_api_key:
            print("❌ OpenAI API key not configured")
            return False
        
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        
        print("✅ OpenAI API connection successful!")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Loackin Backend Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("app").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Step 1: Check environment
    print("\n1. Checking environment configuration...")
    if not check_environment():
        sys.exit(1)
    
    # Step 2: Create database
    print("\n2. Initializing database...")
    if not create_database():
        sys.exit(1)
    
    # Step 3: Test OpenAI connection
    print("\n3. Testing OpenAI API connection...")
    if not test_openai_connection():
        print("⚠️  OpenAI connection failed, but you can still run the app")
        print("   The AI chat will show an error until you fix the API key")
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Start the backend: uvicorn main:app --reload")
    print("2. Start the frontend: cd ../frontend && npm run dev")
    print("3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main() 