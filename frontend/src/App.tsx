import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultsPage from './pages/ResultsPage'
import StudyPlanPage from './pages/StudyPlanPage'
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const StudyModePage = lazy(() => import('./pages/StudyModePage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/questionnaire" element={<QuestionnairePage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/study-plan" element={<Layout><StudyPlanPage /></Layout>} />
      <Route
        path="/calendar"
        element={
          <Suspense fallback={<div style={{ padding: 24 }}>Loading calendar...</div>}>
            <Layout>
              <CalendarPage />
            </Layout>
          </Suspense>
        }
      />
      <Route
        path="/study-mode"
        element={
          <Suspense fallback={<div style={{ padding: 24 }}>Loading study mode...</div>}>
            <Layout>
              <StudyModePage />
            </Layout>
          </Suspense>
        }
      />
      <Route
        path="/chat"
        element={
          <Suspense fallback={<div style={{ padding: 24 }}>Loading chat...</div>}>
            <Layout>
              <ChatPage />
            </Layout>
          </Suspense>
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App 