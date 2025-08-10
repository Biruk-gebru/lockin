import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Calendar, Plus, Clock, BookOpen, ExternalLink, Settings, Sync } from 'lucide-react'
import toast from 'react-hot-toast'

interface StudySession {
  id: string
  subject: string
  startTime: string
  endTime: string
  date: string
  duration: number
  type: 'focus' | 'review' | 'break'
  completed: boolean
}

const CalendarPage = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddSession, setShowAddSession] = useState(false)
  const [newSession, setNewSession] = useState({
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'focus' as const
  })

  useEffect(() => {
    loadStudyPlan()
    generateSampleSessions()
  }, [])

  const loadStudyPlan = () => {
    const studyPlan = localStorage.getItem('studyPlan')
    if (studyPlan) {
      // Parse and use study plan data
      console.log('Study plan loaded:', JSON.parse(studyPlan))
    }
  }

  const generateSampleSessions = () => {
    const today = new Date()
    const sampleSessions: StudySession[] = []
    
    // Generate sessions for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      if (date.getDay() !== 0) { // Skip Sundays
        // Morning session
        sampleSessions.push({
          id: `session-${i}-1`,
          subject: 'Mathematics',
          startTime: '09:00',
          endTime: '10:30',
          date: date.toISOString().split('T')[0],
          duration: 90,
          type: 'focus',
          completed: false
        })
        
        // Afternoon session
        sampleSessions.push({
          id: `session-${i}-2`,
          subject: 'Physics',
          startTime: '14:00',
          endTime: '15:30',
          date: date.toISOString().split('T')[0],
          duration: 90,
          type: 'focus',
          completed: false
        })
        
        // Evening review
        if (i % 2 === 0) {
          sampleSessions.push({
            id: `session-${i}-3`,
            subject: 'Chemistry',
            startTime: '19:00',
            endTime: '20:00',
            date: date.toISOString().split('T')[0],
            duration: 60,
            type: 'review',
            completed: false
          })
        }
      }
    }
    
    setStudySessions(sampleSessions)
  }

  const connectGoogleCalendar = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsGoogleConnected(true)
      toast.success('Google Calendar connected successfully!')
    } catch (error) {
      toast.error('Failed to connect Google Calendar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const syncWithGoogle = async () => {
    if (!isGoogleConnected) {
      toast.error('Please connect Google Calendar first')
      return
    }
    
    setIsLoading(true)
    try {
      // Simulate syncing
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Calendar synced with Google Calendar!')
    } catch (error) {
      toast.error('Failed to sync calendar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addStudySession = () => {
    if (!newSession.subject || !newSession.date || !newSession.startTime || !newSession.endTime) {
      toast.error('Please fill in all fields')
      return
    }

    const start = new Date(`${newSession.date}T${newSession.startTime}`)
    const end = new Date(`${newSession.date}T${newSession.endTime}`)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60)

    if (duration <= 0) {
      toast.error('End time must be after start time')
      return
    }

    const session: StudySession = {
      id: Date.now().toString(),
      subject: newSession.subject,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      date: newSession.date,
      duration: Math.round(duration),
      type: newSession.type,
      completed: false
    }

    setStudySessions([...studySessions, session])
    setNewSession({
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'focus'
    })
    setShowAddSession(false)
    toast.success('Study session added!')
  }

  const toggleSessionComplete = (id: string) => {
    setStudySessions(sessions =>
      sessions.map(session =>
        session.id === id ? { ...session, completed: !session.completed } : session
      )
    )
  }

  const getSessionsForDate = (date: string) => {
    return studySessions.filter(session => session.date === date)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    
    return dates
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'focus': return 'bg-primary text-white'
      case 'review': return 'bg-secondary text-white'
      case 'break': return 'bg-accent text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Brain className="h-10 w-10 text-primary mr-3" />
              <h1 className="text-3xl font-poppins font-bold text-text">Study Calendar</h1>
            </div>
            <p className="text-gray-600">
              Manage your study sessions and sync with Google Calendar
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowAddSession(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </button>
            
            {!isGoogleConnected ? (
              <button
                onClick={connectGoogleCalendar}
                disabled={isLoading}
                className="btn-secondary flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
            ) : (
              <button
                onClick={syncWithGoogle}
                disabled={isLoading}
                className="btn-secondary flex items-center"
              >
                <Sync className="h-4 w-4 mr-2" />
                {isLoading ? 'Syncing...' : 'Sync Calendar'}
              </button>
            )}
          </div>
        </div>

        {/* Week View */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-semibold text-text">This Week</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(currentDate.getDate() - 7)
                  setCurrentDate(newDate)
                }}
                className="px-3 py-1 text-gray-600 hover:text-primary"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(currentDate.getDate() + 7)
                  setCurrentDate(newDate)
                }}
                className="px-3 py-1 text-gray-600 hover:text-primary"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {getWeekDates().map((date) => {
              const sessions = getSessionsForDate(date.toISOString().split('T')[0])
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div key={date.toISOString()} className="min-h-[200px]">
                  <div className={`text-center p-2 rounded-lg mb-2 ${
                    isToday ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}>
                    <div className="text-sm font-medium">
                      {formatDate(date)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-2 rounded text-xs cursor-pointer transition-all ${
                          session.completed 
                            ? 'opacity-60 line-through' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => toggleSessionComplete(session.id)}
                      >
                        <div className={`inline-block px-2 py-1 rounded text-xs mb-1 ${getTypeColor(session.type)}`}>
                          {session.type}
                        </div>
                        <div className="font-medium text-gray-800">{session.subject}</div>
                        <div className="text-gray-600">
                          {session.startTime} - {session.endTime}
                        </div>
                        <div className="text-gray-500">{session.duration} min</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <h2 className="text-2xl font-poppins font-semibold text-text mb-6">Upcoming Sessions</h2>
          
          {studySessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No study sessions scheduled yet.</p>
              <p className="text-sm">Add your first session to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studySessions
                .filter(session => new Date(session.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 10)
                .map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      session.completed 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                    onClick={() => toggleSessionComplete(session.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(session.type)}`}></div>
                      <div>
                        <div className="font-medium text-gray-800">{session.subject}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{session.duration} min</span>
                      <input
                        type="checkbox"
                        checked={session.completed}
                        onChange={() => toggleSessionComplete(session.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add Session Modal */}
        {showAddSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-poppins font-semibold text-text mb-4">Add Study Session</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSession.subject}
                    onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                    className="input-field"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newSession.startTime}
                      onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newSession.endTime}
                      onChange={(e) => setNewSession({...newSession, endTime: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                  <select
                    value={newSession.type}
                    onChange={(e) => setNewSession({...newSession, type: e.target.value as any})}
                    className="input-field"
                  >
                    <option value="focus">Focus Session</option>
                    <option value="review">Review Session</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSession(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudySession}
                  className="flex-1 btn-primary"
                >
                  Add Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarPage 