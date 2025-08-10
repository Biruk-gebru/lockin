from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    email: str
    username: Optional[str] = None
    is_active: bool

# Study Plan schemas
class SubjectSchema(BaseModel):
    name: str
    difficulty: str
    priority: str
    hours_per_week: int

class TimeSlotSchema(BaseModel):
    day: str
    start_time: str
    end_time: str
    is_available: bool

class StudyPlanCreate(BaseModel):
    study_method: str
    subjects: List[SubjectSchema]
    time_slots: List[TimeSlotSchema]

class StudyPlanResponse(BaseModel):
    id: int
    user_id: int
    study_method: str
    subjects: str  # JSON string
    time_slots: str  # JSON string
    generated_at: datetime
    
    class Config:
        from_attributes = True

# Study Session schemas
class StudySessionCreate(BaseModel):
    subject: str
    start_time: datetime
    end_time: datetime
    session_type: str
    notes: Optional[str] = None

class StudySessionResponse(BaseModel):
    id: int
    user_id: int
    study_plan_id: Optional[int] = None
    subject: str
    start_time: datetime
    end_time: datetime
    duration: int
    session_type: str
    completed: bool
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageCreate(BaseModel):
    content: str
    role: str

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    content: str
    role: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

# AI Chat schemas
class AIChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    response: str
    suggestions: List[str]

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 