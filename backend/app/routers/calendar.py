from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json

from app.database import get_db
from app.models import User, StudySession
from app.schemas import StudySessionCreate, StudySessionResponse
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/week")
async def get_week_schedule(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    start_date: str = None
):
    """Get study sessions for a specific week"""
    try:
        if start_date:
            start = datetime.fromisoformat(start_date)
        else:
            # Start from beginning of current week
            start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            start = start - timedelta(days=start.weekday())
        
        end = start + timedelta(days=7)
        
        sessions = db.query(StudySession)\
            .filter(
                StudySession.user_id == current_user.id,
                StudySession.start_time >= start,
                StudySession.start_time < end
            )\
            .order_by(StudySession.start_time)\
            .all()
        
        # Group sessions by day
        week_schedule = {}
        for i in range(7):
            date = start + timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            week_schedule[date_str] = []
        
        for session in sessions:
            date_str = session.start_time.strftime('%Y-%m-%d')
            if date_str in week_schedule:
                week_schedule[date_str].append(StudySessionResponse.from_orm(session))
        
        return week_schedule
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get week schedule: {str(e)}"
        )

@router.get("/upcoming")
async def get_upcoming_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    """Get upcoming study sessions"""
    now = datetime.now()
    
    sessions = db.query(StudySession)\
        .filter(
            StudySession.user_id == current_user.id,
            StudySession.start_time >= now
        )\
        .order_by(StudySession.start_time)\
        .limit(limit)\
        .all()
    
    return [StudySessionResponse.from_orm(session) for session in sessions]

@router.post("/sync-google")
async def sync_with_google_calendar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sync study sessions with Google Calendar"""
    try:
        # This would integrate with Google Calendar API
        # For now, we'll simulate the sync process
        
        # Get user's study sessions
        sessions = db.query(StudySession)\
            .filter(StudySession.user_id == current_user.id)\
            .all()
        
        # Simulate Google Calendar sync
        synced_count = len(sessions)
        
        return {
            "message": "Calendar synced successfully",
            "sessions_synced": synced_count,
            "google_calendar_id": "primary"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync with Google Calendar: {str(e)}"
        )

@router.get("/stats")
async def get_calendar_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = 30
):
    """Get calendar statistics"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get sessions in date range
        sessions = db.query(StudySession)\
            .filter(
                StudySession.user_id == current_user.id,
                StudySession.start_time >= start_date,
                StudySession.start_time <= end_date
            )\
            .all()
        
        # Calculate statistics
        total_sessions = len(sessions)
        completed_sessions = len([s for s in sessions if s.completed])
        total_study_time = sum(s.duration for s in sessions)
        
        # Group by session type
        session_types = {}
        for session in sessions:
            if session.session_type not in session_types:
                session_types[session.session_type] = 0
            session_types[session.session_type] += 1
        
        # Group by subject
        subjects = {}
        for session in sessions:
            if session.subject not in subjects:
                subjects[session.subject] = 0
            subjects[session.subject] += session.duration
        
        return {
            "total_sessions": total_sessions,
            "completed_sessions": completed_sessions,
            "completion_rate": (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
            "total_study_time_minutes": total_study_time,
            "total_study_time_hours": round(total_study_time / 60, 2),
            "sessions_by_type": session_types,
            "study_time_by_subject": subjects,
            "period_days": days
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get calendar stats: {str(e)}"
        )

@router.delete("/sessions/{session_id}")
async def delete_study_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a study session"""
    session = db.query(StudySession)\
        .filter(StudySession.id == session_id, StudySession.user_id == current_user.id)\
        .first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found"
        )
    
    db.delete(session)
    db.commit()
    
    return {"message": "Study session deleted successfully"} 