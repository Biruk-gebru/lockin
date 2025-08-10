from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import get_db
from app.models import User, ChatMessage
from app.schemas import AIChatRequest, AIChatResponse, ChatMessageCreate, ChatMessageResponse
from app.routers.auth import get_current_user

router = APIRouter()

def get_ai_response(message: str, context: dict = None) -> str:
    """Get AI response - placeholder for AI integration"""
    message_lower = message.lower()
    
    # Simple response logic - in real app, this would call AI API
    if any(word in message_lower for word in ['pomodoro', 'timer']):
        return "The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks. This helps maintain concentration and prevents mental fatigue. Try setting a timer for 25 minutes and focus solely on your task!"
    
    if any(word in message_lower for word in ['motivation', 'motivated']):
        return "Remember, every expert was once a beginner. Your progress might feel slow, but consistency beats perfection. Take it one step at a time, celebrate small wins, and trust the process. You're building something amazing!"
    
    if any(word in message_lower for word in ['memory', 'remember']):
        return "Active recall and spaced repetition are powerful memory techniques. Instead of just re-reading, try testing yourself on the material. Review concepts at increasing intervals - this strengthens neural pathways and improves long-term retention."
    
    if any(word in message_lower for word in ['focus', 'concentration']):
        return "To improve focus: eliminate distractions, use the Pomodoro Technique, take regular breaks, stay hydrated, and create a dedicated study environment. Your brain works best when it can fully engage with one task at a time."
    
    if any(word in message_lower for word in ['stress', 'anxiety']):
        return "It's normal to feel stressed about studies. Practice deep breathing, take regular breaks, maintain a consistent sleep schedule, and remember that your worth isn't defined by academic performance. You've got this!"
    
    if any(word in message_lower for word in ['schedule', 'planning']):
        return "Effective study planning involves: identifying your most important tasks, scheduling them during your peak energy hours, building in buffer time for unexpected challenges, and reviewing your plan daily. Start with 2-3 main priorities per day."
    
    return "That's an interesting question! While I can provide general study advice, for specific academic questions, I'd recommend consulting your course materials or instructor. Is there something specific about study techniques or learning strategies I can help you with?"

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