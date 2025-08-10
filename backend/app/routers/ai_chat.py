from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
import openai
import httpx
from openai import OpenAI

from app.database import get_db
from app.models import User, ChatMessage
from app.schemas import AIChatRequest, AIChatResponse, ChatMessageCreate, ChatMessageResponse
from app.routers.auth import get_current_user
from app.config import settings

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

def get_ai_response(message: str, context: dict = None) -> str:
    """Get AI response using Gemini API with fallbacks"""
    # Create system prompt for study assistant
    system_prompt = """You are a helpful study assistant and learning coach. Your role is to:
    1. Provide practical study advice and learning strategies
    2. Help with time management and productivity techniques
    3. Offer motivation and encouragement for academic success
    4. Suggest effective study methods based on the user's questions
    5. Keep responses concise but informative (2-3 sentences max)
    
    Focus on actionable advice that students can implement immediately."""
    
    # Try Gemini first (primary AI service)
    if settings.gemini_api:
        try:
            return get_gemini_response(message, context, system_prompt)
        except Exception as e:
            print(f"Gemini failed: {e}, trying OpenAI...")
    
    # Fallback to OpenAI
    if settings.openai_api_key:
        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
            
            # Add context if provided
            if context:
                context_str = json.dumps(context)
                messages.insert(1, {"role": "system", "content": f"Context: {context_str}"})
            
            response = client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,
                max_tokens=150,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI failed: {e}, trying GitHub AI...")
    
    # Fallback to GitHub AI
    if settings.github_token:
        try:
            return get_github_ai_response_sync(message, context, system_prompt)
        except Exception as e:
            print(f"GitHub AI failed: {e}")
    
    # Final fallback - return a helpful response
    return get_fallback_response(message, context)

def get_gemini_response(message: str, context: dict = None, system_prompt: str = None) -> str:
    """Get AI response using Gemini API via HTTP"""
    if not settings.gemini_api:
        raise Exception("Gemini API key not configured")
    
    try:
        # Prepare the request payload for Gemini API
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{system_prompt or 'You are a helpful study assistant.'}\n\n"
                                   f"{'Context: ' + json.dumps(context) + '\n\n' if context else ''}"
                                   f"User question: {message}"
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 150
            }
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        # Use the Gemini API endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={settings.gemini_api}"
        
        import requests
        response = requests.post(url, json=payload, headers=headers, timeout=30.0)
        
        if response.status_code == 200:
            data = response.json()
            if 'candidates' in data and len(data['candidates']) > 0:
                content = data['candidates'][0].get('content', {})
                parts = content.get('parts', [])
                if parts and 'text' in parts[0]:
                    return parts[0]['text'].strip()
            
            raise Exception("Unexpected response format from Gemini")
        else:
            raise Exception(f"Gemini API error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise e

def get_github_ai_response_sync(message: str, context: dict = None, system_prompt: str = None) -> str:
    """Get AI response using GitHub AI API (synchronous version)"""
    if not settings.github_token:
        raise Exception("GitHub token not configured")
    
    # Prepare the request payload for GitHub AI
    payload = {
        "model": settings.github_model,
        "messages": [
            {"role": "system", "content": system_prompt or "You are a helpful study assistant."},
            {"role": "user", "content": message}
        ],
        "max_tokens": 150,
        "temperature": 0.7
    }
    
    headers = {
        "Authorization": f"Bearer {settings.github_token}",
        "Content-Type": "application/json"
    }
    
    import requests
    response = requests.post(
        settings.github_endpoint,
        json=payload,
        headers=headers,
        timeout=30.0
    )
    
    if response.status_code == 200:
        data = response.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    else:
        raise Exception(f"GitHub AI API error: {response.status_code} - {response.text}")

def get_fallback_response(message: str, context: dict = None) -> str:
    """Provide a helpful fallback response when AI services are unavailable"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['study', 'learn', 'focus']):
        return "Great question! For effective studying, try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. This helps maintain concentration and prevents burnout."
    
    elif any(word in message_lower for word in ['break', 'rest', 'exercise']):
        return "During breaks, try: 1) Stand up and stretch for 2 minutes, 2) Look at something 20 feet away for 20 seconds, 3) Do 10 deep breaths. These simple activities refresh your mind and body."
    
    elif any(word in message_lower for word in ['motivation', 'tired', 'bored']):
        return "When motivation is low, start with just 5 minutes of work. Often, getting started is the hardest part. Once you begin, momentum usually takes over and you'll find yourself working longer than planned."
    
    else:
        return "I'm here to help with your studies! Try asking about specific study techniques, time management, or how to stay focused during long study sessions."

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(
    request: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with AI study companion"""
    try:
        # Get AI response
        ai_response = get_ai_response(request.message, request.context)
        
        # Save user message
        user_message = ChatMessage(
            user_id=current_user.id,
            content=request.message,
            role="user"
        )
        db.add(user_message)
        
        # Save AI response
        ai_message = ChatMessage(
            user_id=current_user.id,
            content=ai_response,
            role="assistant"
        )
        db.add(ai_message)
        
        db.commit()
        
        # Generate follow-up suggestions
        suggestions = [
            "How can I apply this to my current studies?",
            "Can you give me more specific examples?",
            "What should I do next?",
            "How do I stay consistent with this approach?"
        ]
        
        return AIChatResponse(
            response=ai_response,
            suggestions=suggestions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get AI response: {str(e)}"
        )

@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """Get user's chat history"""
    messages = db.query(ChatMessage)\
        .filter(ChatMessage.user_id == current_user.id)\
        .order_by(ChatMessage.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return [ChatMessageResponse.from_orm(msg) for msg in messages]

@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear user's chat history"""
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    
    return {"message": "Chat history cleared successfully"} 