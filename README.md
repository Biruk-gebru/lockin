# LoackIn - AI-Powered Study Companion

> "Stay focused. Study smarter. Achieve more."

## 🚀 Project Overview

LoackIn is a smart study companion that classifies students into effective study methods via a smart questionnaire, generates personalized study plans with AI, and keeps users on track with focus mode and motivational features.

## ✨ Core Features

- **Smart Study Method Classification** - Dynamic questionnaire to determine optimal study approach
- **AI-Generated Study Plans** - Personalized plans based on chosen study method
- **Google Calendar Integration** - OAuth-based calendar sync for study sessions
- **Focus Mode** - Timer-based study sessions with break exercises
- **Motivational Notifications** - Custom alerts to keep students engaged
- **Study Method Support** - Pomodoro, Active Recall, Spaced Repetition, Feynman, Interleaving

## 🎨 Design System

- **Primary**: Electric Blue (#1E90FF) - energizing, trustworthy
- **Secondary**: Lime Green (#A4DE02) - motivating, fresh  
- **Accent**: Coral Orange (#FF6F61) - alerts, CTAs
- **Background**: Off-White (#F8F9FA)
- **Text**: Charcoal Gray (#333333)
- **Typography**: Poppins Bold (titles), Inter Regular (body)

## 🛠️ Tech Stack

### Frontend
- React 18
- TailwindCSS
- React Router
- Axios for API calls

### Backend
- FastAPI (Python)
- SQLite database
- OpenAI API integration
- Google OAuth integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key
- Google OAuth credentials

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (.env)**
```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
```

## 📱 App Screens

1. **Landing Page** - Hero section with CTA buttons
2. **Authentication** - Signup/Login with Google OAuth
3. **Questionnaire** - Dynamic study method assessment
4. **Results** - Study method explanation and reasoning
5. **Study Plan Setup** - AI-generated personalized plan
6. **Calendar View** - Study session scheduling
7. **Study Mode** - Focus timer with break exercises
8. **AI Q&A Chat** - Study-related question support

## 🎯 Study Methods

- **Pomodoro Technique** - For short attention spans
- **Active Recall** - For memorization-heavy subjects
- **Spaced Repetition** - For long-term retention
- **Feynman Technique** - For deep understanding
- **Interleaving** - For multiple subjects in short periods

## 🔮 Future Features

- Real-time app blocking & distraction alerts
- Adaptive study plan updates based on progress
- Distraction detection tracking
- Streaks & gamification rewards
- Advanced AI Q&A chatbot

## 📄 License

MIT License - see LICENSE file for details 