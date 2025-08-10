import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: number
  text: string
  options: {
    value: string
    label: string
    method: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "When you start studying, how long before you feel distracted?",
    options: [
      { value: "A", label: "Less than 15 minutes", method: "pomodoro" },
      { value: "B", label: "15-30 minutes", method: "active-recall" },
      { value: "C", label: "30-60 minutes", method: "spaced-repetition" },
      { value: "D", label: "More than 1 hour", method: "feynman" }
    ]
  },
  {
    id: 2,
    text: "Do you prefer to study one subject fully before switching?",
    options: [
      { value: "Yes", label: "Yes, I like to focus on one topic", method: "spaced-repetition" },
      { value: "No", label: "No, I prefer mixing subjects", method: "interleaving" }
    ]
  },
  {
    id: 3,
    text: "What's your biggest challenge in studying?",
    options: [
      { value: "Focus", label: "Staying focused and avoiding distractions", method: "pomodoro" },
      { value: "Memory", label: "Remembering and retaining information", method: "spaced-repetition" },
      { value: "Understanding", label: "Deeply understanding complex concepts", method: "feynman" },
      { value: "Motivation", label: "Staying motivated throughout long sessions", method: "active-recall" }
    ]
  },
  {
    id: 4,
    text: "How soon is your next big exam or deadline?",
    options: [
      { value: "<1 week", label: "Less than 1 week", method: "pomodoro" },
      { value: "1-4 weeks", label: "1-4 weeks", method: "active-recall" },
      { value: "1 month", label: "1 month or more", method: "spaced-repetition" }
    ]
  },
  {
    id: 5,
    text: "Do you enjoy explaining topics to others as a learning method?",
    options: [
      { value: "Yes", label: "Yes, I love teaching others", method: "feynman" },
      { value: "No", label: "No, I prefer other methods", method: "active-recall" }
    ]
  },
  {
    id: 6,
    text: "How do you typically review your notes?",
    options: [
      { value: "Reread", label: "I reread my notes multiple times", method: "spaced-repetition" },
      { value: "Quiz", label: "I quiz myself on the material", method: "active-recall" },
      { value: "Explain", label: "I try to explain concepts in my own words", method: "feynman" },
      { value: "Mix", label: "I mix different subjects and topics", method: "interleaving" }
    ]
  }
]

const QuestionnairePage = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const canProceed = () => {
    return answers[questions[currentQuestion].id] !== undefined
  }

  const canSubmit = () => {
    return Object.keys(answers).length === questions.length
  }

  const getStudyMethod = () => {
    const methodCounts: Record<string, number> = {}
    
    Object.values(answers).forEach(answer => {
      const question = questions.find(q => 
        q.options.some(opt => opt.value === answer)
      )
      if (question) {
        const method = question.options.find(opt => opt.value === answer)?.method
        if (method) {
          methodCounts[method] = (methodCounts[method] || 0) + 1
        }
      }
    })
    
    return Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'pomodoro'
  }

  const handleSubmit = async () => {
    if (!canSubmit()) return
    
    setIsSubmitting(true)
    try {
      const studyMethod = getStudyMethod()
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store result and navigate to results page
      localStorage.setItem('studyMethod', studyMethod)
      localStorage.setItem('questionnaireAnswers', JSON.stringify(answers))
      
      toast.success('Questionnaire completed!')
      navigate('/results')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            Let's Find Your Perfect Study Method
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few questions to help us understand your learning style and recommend the best study technique for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-poppins font-semibold text-text mb-6">
              {currentQ.text}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQ.id] === option.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {answers[currentQ.id] === option.value && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                disabled={!canProceed()}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get My Results
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your answers help us create a personalized study plan that matches your learning style.
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuestionnairePage 