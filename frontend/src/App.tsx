import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultsPage from './pages/ResultsPage'
import StudyPlanPage from './pages/StudyPlanPage'
import CalendarPage from './pages/CalendarPage'
import StudyModePage from './pages/StudyModePage'
import ChatPage from './pages/ChatPage'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/questionnaire" element={<QuestionnairePage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/study-plan" element={<StudyPlanPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/study-mode" element={<StudyModePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App 