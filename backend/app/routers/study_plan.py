from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import get_db
from app.models import User, StudyPlan, StudySession
from app.schemas import StudyPlanCreate, StudyPlanResponse, StudySessionCreate, StudySessionResponse
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/generate", response_model=StudyPlanResponse)
async def generate_study_plan(
    plan_data: StudyPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered study plan"""
    try:
        # Convert subjects and time slots to JSON strings
        subjects_json = json.dumps([subject.dict() for subject in plan_data.subjects])
        time_slots_json = json.dumps([slot.dict() for slot in plan_data.time_slots])
        
        # Create study plan
        study_plan = StudyPlan(
            user_id=current_user.id,
            study_method=plan_data.study_method,
            subjects=subjects_json,
            time_slots=time_slots_json
        )
        
        db.add(study_plan)
        db.commit()
        db.refresh(study_plan)
        
        return StudyPlanResponse.from_orm(study_plan)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate study plan: {str(e)}"
        )

@router.get("/current", response_model=StudyPlanResponse)
async def get_current_study_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current study plan"""
    study_plan = db.query(StudyPlan)\
        .filter(StudyPlan.user_id == current_user.id)\
        .order_by(StudyPlan.generated_at.desc())\
        .first()
    
    if not study_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No study plan found"
        )
    
    return StudyPlanResponse.from_orm(study_plan)

@router.get("/history", response_model=List[StudyPlanResponse])
async def get_study_plan_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's study plan history"""
    study_plans = db.query(StudyPlan)\
        .filter(StudyPlan.user_id == current_user.id)\
        .order_by(StudyPlan.generated_at.desc())\
        .all()
    
    return [StudyPlanResponse.from_orm(plan) for plan in study_plans]

@router.post("/sessions", response_model=StudySessionResponse)
async def create_study_session(
    session_data: StudySessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new study session"""
    try:
        # Calculate duration in minutes
        duration = int((session_data.end_time - session_data.start_time).total_seconds() / 60)
        
        study_session = StudySession(
            user_id=current_user.id,
            subject=session_data.subject,
            start_time=session_data.start_time,
            end_time=session_data.end_time,
            duration=duration,
            session_type=session_data.session_type,
            notes=session_data.notes
        )
        
        db.add(study_session)
        db.commit()
        db.refresh(study_session)
        
        return StudySessionResponse.from_orm(study_session)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create study session: {str(e)}"
        )

@router.get("/sessions", response_model=List[StudySessionResponse])
async def get_study_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 100
):
    """Get user's study sessions"""
    sessions = db.query(StudySession)\
        .filter(StudySession.user_id == current_user.id)\
        .order_by(StudySession.start_time.desc())\
        .limit(limit)\
        .all()
    
    return [StudySessionResponse.from_orm(session) for session in sessions]

@router.put("/sessions/{session_id}/complete")
async def mark_session_complete(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a study session as completed"""
    session = db.query(StudySession)\
        .filter(StudySession.id == session_id, StudySession.user_id == current_user.id)\
        .first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found"
        )
    
    session.completed = True
    db.commit()
    
    return {"message": "Session marked as completed"} 