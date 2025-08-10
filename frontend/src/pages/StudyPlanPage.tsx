import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Plus, Trash2, Clock, Calendar, BookOpen, ArrowRight, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import apiService from '../services/api'

interface Subject {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  priority: 'low' | 'medium' | 'high'
  hoursPerWeek: number
}

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const StudyPlanPage = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [studyMethod, setStudyMethod] = useState<string>('')

  useEffect(() => {
    const method = localStorage.getItem('studyMethod') || 'pomodoro'
    setStudyMethod(method)
    
    // Initialize time slots
    const initialTimeSlots = daysOfWeek.map(day => ({
      id: day.toLowerCase(),
      day,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    }))
    setTimeSlots(initialTimeSlots)
  }, [])

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      difficulty: 'medium',
      priority: 'medium',
      hoursPerWeek: 5
    }
    setSubjects([...subjects, newSubject])
  }

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id))
  }

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ))
  }

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const toggleTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
    ))
  }

  const canGenerate = () => {
    return subjects.length > 0 && 
           subjects.every(subject => subject.name.trim() !== '') &&
           timeSlots.some(slot => slot.isAvailable)
  }

  const generateStudyPlan = async () => {
    if (!canGenerate()) return

    setIsGenerating(true)
    try {
      // Prepare data for API
      const planData = {
        study_method: studyMethod,
        subjects: subjects.map(subject => ({
          name: subject.name,
          difficulty: subject.difficulty,
          priority: subject.priority,
          hours_per_week: subject.hoursPerWeek
        })),
        time_slots: timeSlots.map(slot => ({
          day: slot.day,
          start_time: slot.startTime,
          end_time: slot.endTime,
          is_available: slot.isAvailable
        }))
      }

      const result = await apiService.generateStudyPlan(planData)
      if (result.error) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        // Store study plan data locally as well
        const studyPlanData = {
          subjects,
          timeSlots,
          studyMethod,
          generatedAt: new Date().toISOString()
        }
        localStorage.setItem('studyPlan', JSON.stringify(studyPlanData))
        
        toast.success('Study plan generated successfully!')
        navigate('/calendar')
      }
    } catch (error) {
      toast.error('Failed to generate study plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            Create Your Study Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your subjects and schedule, and we'll generate a personalized study plan using your recommended method.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Subjects Section */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-poppins font-semibold text-text flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Your Subjects
                </h2>
                <button
                  onClick={addSubject}
                  className="btn-secondary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </button>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No subjects added yet.</p>
                  <p className="text-sm">Click "Add Subject" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                          placeholder="Subject name"
                          className="text-lg font-medium border-none bg-transparent focus:ring-2 focus:ring-primary rounded px-2 py-1"
                        />
                        <button
                          onClick={() => removeSubject(subject.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                          <select
                            value={subject.difficulty}
                            onChange={(e) => updateSubject(subject.id, 'difficulty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={subject.priority}
                            onChange={(e) => updateSubject(subject.id, 'priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hours/Week</label>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={subject.hoursPerWeek}
                            onChange={(e) => updateSubject(subject.id, 'hoursPerWeek', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-poppins font-semibold text-text flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Your Schedule
                </h2>
              </div>

              <div className="space-y-4">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={slot.isAvailable}
                      onChange={() => toggleTimeSlot(slot.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    
                    <span className="w-24 font-medium text-gray-700">{slot.day}</span>
                    
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                      disabled={!slot.isAvailable}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                    
                    <span className="text-gray-500">to</span>
                    
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                      disabled={!slot.isAvailable}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Study Method Info */}
            <div className="card bg-primary/5 border-primary/20">
              <h3 className="text-lg font-poppins font-semibold text-text mb-3">
                Your Study Method: {studyMethod.charAt(0).toUpperCase() + studyMethod.slice(1).replace('-', ' ')}
              </h3>
              <p className="text-gray-700 text-sm">
                We'll optimize your study plan using this method to ensure maximum effectiveness and retention.
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mt-12">
          <button
            onClick={generateStudyPlan}
            disabled={!canGenerate() || isGenerating}
            className="btn-primary text-lg px-8 py-4 flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Generating Your Study Plan...
              </>
            ) : (
              <>
                Generate Study Plan
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
          
          {!canGenerate() && (
            <p className="text-sm text-gray-500 mt-3">
              Please add at least one subject and set your available time slots to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyPlanPage 