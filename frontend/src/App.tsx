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
      <Route path="/study-plan" element={<Layout><StudyPlanPage /></Layout>} />
      <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
      <Route path="/study-mode" element={<Layout><StudyModePage /></Layout>} />
      <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
    </Routes>
  )
}

export default App 