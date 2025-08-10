import { useState, useEffect } from 'react'
import { Brain, Play, Pause, RotateCcw, Eye, Coffee, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const StudyModePage = () => {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')
  const [completedSessions, setCompletedSessions] = useState(0)
  const [currentSession, setCurrentSession] = useState(1)
  const [showBreakExercise, setShowBreakExercise] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
    setSessionType('focus')
  }

  const handleSessionComplete = () => {
    if (sessionType === 'focus') {
      setCompletedSessions(prev => prev + 1)
      setSessionType('break')
      setTimeLeft(5 * 60) // 5 minute break
      toast.success('Focus session completed! Time for a break.')
      setShowBreakExercise(true)
    } else {
      setSessionType('focus')
      setTimeLeft(25 * 60)
      setCurrentSession(prev => prev + 1)
      toast.success('Break completed! Ready for next focus session.')
      setShowBreakExercise(false)
    }
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalTime = sessionType === 'focus' ? 25 * 60 : 5 * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const breakExercises = [
    {
      name: 'Eye Relaxation',
      description: 'Look away from screen for 20 seconds, focus on distant objects',
      icon: <Eye className="h-8 w-8" />
    },
    {
      name: 'Quick Stretch',
      description: 'Stand up and stretch your arms, neck, and back',
      icon: <Coffee className="h-8 w-8" />
    },
    {
      name: 'Deep Breathing',
      description: 'Take 5 deep breaths, inhaling for 4 counts, exhaling for 6',
      icon: <Brain className="h-8 w-8" />
    }
  ]

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            Study Mode
          </h1>
          <p className="text-xl text-gray-600">
            Stay focused and productive with timed study sessions
          </p>
        </div>

        {/* Timer Card */}
        <div className="card text-center mb-8">
          <div className="mb-8">
            <div className="text-6xl font-poppins font-bold text-text mb-4">
              {formatTime(timeLeft)}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  sessionType === 'focus' ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
                  isActive 
                    ? 'bg-accent hover:bg-accent-dark text-white' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-5 w-5 inline mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 inline mr-2" />
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={resetTimer}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <RotateCcw className="h-5 w-5 inline mr-2" />
                Reset
              </button>
            </div>

            <div className="text-lg text-gray-600">
              {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
            </div>
          </div>

          {/* Session Info */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-poppins font-bold text-primary mb-2">
                {currentSession}
              </div>
              <div className="text-gray-600">Current Session</div>
            </div>
            
            <div>
              <div className="text-2xl font-poppins font-bold text-secondary mb-2">
                {completedSessions}
              </div>
              <div className="text-gray-600">Completed Sessions</div>
            </div>
            
            <div>
              <div className="text-2xl font-poppins font-bold text-accent mb-2">
                {Math.floor((completedSessions * 25) / 60)}h {(completedSessions * 25) % 60}m
              </div>
              <div className="text-gray-600">Total Focus Time</div>
            </div>
          </div>
        </div>

        {/* Break Exercise */}
        {showBreakExercise && (
          <div className="card bg-secondary/5 border-secondary/20 mb-8">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4 text-center">
              Break Exercise
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {breakExercises.map((exercise, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg border border-secondary/20">
                  <div className="text-secondary mb-3 flex justify-center">
                    {exercise.icon}
                  </div>
                  <h4 className="font-semibold text-text mb-2">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Tips */}
        <div className="card">
          <h3 className="text-xl font-poppins font-semibold text-text mb-4">
            Study Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Eliminate distractions during focus sessions</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Take breaks away from your study area</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Stay hydrated and maintain good posture</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Use the break exercises to refresh your mind</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyModePage