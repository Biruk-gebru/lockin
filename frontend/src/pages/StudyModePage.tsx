import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, CheckCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface StudySession {
  id: string
  subject: string
  duration: number
  type: 'focus' | 'break' | 'long-break'
  completed: boolean
}

const StudyModePage = () => {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [sessionCount, setSessionCount] = useState(0)
  const [isBreak, setIsBreak] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [sessionSubject, setSessionSubject] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Load study method from localStorage
    const studyMethod = localStorage.getItem('studyMethod') || 'pomodoro'
    
    // Set initial time based on study method
    if (studyMethod === 'pomodoro') {
      setTimeLeft(25 * 60)
    } else if (studyMethod === 'active-recall') {
      setTimeLeft(45 * 60)
    } else if (studyMethod === 'spaced-repetition') {
      setTimeLeft(30 * 60)
    } else {
      setTimeLeft(25 * 60)
    }
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (timeLeft === 0) return
    setIsActive(true)
    toast.success('Study session started! Stay focused!')
  }

  const pauseTimer = () => {
    setIsActive(false)
    toast.info('Session paused. Take a moment if needed.')
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
    setSessionCount(0)
    setIsBreak(false)
    toast.info('Timer reset to default')
  }

  const handleSessionComplete = () => {
    setIsActive(false)
    
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    if (!isBreak) {
      // Focus session completed
      setSessionCount(prev => prev + 1)
      
      if (sessionCount + 1 >= 4) {
        // Long break after 4 sessions
        setTimeLeft(15 * 60)
        setIsBreak(true)
        toast.success('Great work! Take a 15-minute break.')
      } else {
        // Short break
        setTimeLeft(5 * 60)
        setIsBreak(true)
        toast.success('Session completed! Take a 5-minute break.')
      }
    } else {
      // Break completed, back to focus
      setTimeLeft(25 * 60)
      setIsBreak(false)
      toast.success('Break finished! Ready for next session?')
    }

    // Show session completion modal
    setShowSessionModal(true)
  }

  const completeSession = () => {
    if (sessionSubject.trim()) {
      const newSession: StudySession = {
        id: Date.now().toString(),
        subject: sessionSubject,
        duration: 25 - Math.ceil(timeLeft / 60),
        type: isBreak ? 'break' : 'focus',
        completed: true
      }
      
      setSessions(prev => [newSession, ...prev])
      setSessionSubject('')
      setSessionNotes('')
      setShowSessionModal(false)
      
      toast.success('Session logged successfully!')
    }
  }

  const skipBreak = () => {
    setTimeLeft(25 * 60)
    setIsBreak(false)
    setSessionCount(0)
    toast.info('Break skipped. Starting next focus session.')
  }

  const getProgressPercentage = () => {
    const totalTime = 25 * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            {isBreak ? 'Break Time' : 'Focus Mode'}
          </h1>
          <p className="text-xl text-gray-600">
            {isBreak 
              ? 'Take a moment to relax and recharge'
              : 'Stay focused and make progress on your studies'
            }
          </p>
        </div>

        {/* Timer Display */}
        <div className="card max-w-2xl mx-auto mb-8">
          <div className="text-center">
            {/* Progress Ring */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={isBreak ? '#10b981' : '#3b82f6'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-mono font-bold text-text mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600">
                  {isBreak ? 'Break' : `Session ${sessionCount + 1}`}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {!isActive ? (
                <button
                  onClick={startTimer}
                  disabled={timeLeft === 0}
                  className="btn-primary text-lg px-8 py-3 flex items-center disabled:opacity-50"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="btn-secondary text-lg px-8 py-3 flex items-center"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="btn-secondary text-lg px-6 py-3 flex items-center"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>

            {/* Break Skip Button */}
            {isBreak && (
              <button
                onClick={skipBreak}
                className="text-gray-600 hover:text-primary text-sm underline"
              >
                Skip break and continue
              </button>
            )}
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-2">{sessionCount}</div>
            <div className="text-gray-600">Sessions Today</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {Math.floor((25 * sessionCount) / 60)}
            </div>
            <div className="text-gray-600">Hours Studied</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {sessions.filter(s => s.completed).length}
            </div>
            <div className="text-gray-600">Sessions Logged</div>
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4">
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">{session.subject}</div>
                      <div className="text-sm text-gray-600">
                        {session.duration} minutes • {session.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Completion Modal */}
        {showSessionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {isBreak ? 'Break Completed' : 'Session Completed!'}
              </h3>
              
              {!isBreak && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What did you study?
                    </label>
                    <input
                      type="text"
                      value={sessionSubject}
                      onChange={(e) => setSessionSubject(e.target.value)}
                      placeholder="e.g., Math, Physics, History..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="How did it go? Any insights?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={completeSession}
                  className="btn-primary flex-1"
                >
                  {isBreak ? 'Continue' : 'Log Session'}
                </button>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio element for notifications */}
        <audio ref={audioRef} preload="auto">
          <source src="/notification.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}

export default StudyModePage