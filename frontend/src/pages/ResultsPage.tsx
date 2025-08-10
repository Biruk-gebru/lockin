import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Clock, Target, BookOpen, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'

interface StudyMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  benefits: string[]
  howItWorks: string
  tips: string[]
  bestFor: string[]
}

const studyMethods: Record<string, StudyMethod> = {
  'pomodoro': {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    description: 'A time management method that uses focused work sessions with short breaks to maintain concentration.',
    icon: <Clock className="h-8 w-8" />,
    color: 'primary',
    benefits: [
      'Improves focus and concentration',
      'Prevents mental fatigue',
      'Increases productivity',
      'Helps manage time effectively'
    ],
    howItWorks: 'Work for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.',
    tips: [
      'Use a timer to stay on track',
      'Eliminate distractions during work sessions',
      'Take breaks away from your study area',
      'Adjust session length based on your attention span'
    ],
    bestFor: [
      'Students with short attention spans',
      'Tasks that require intense focus',
      'Studying for exams with limited time',
      'Maintaining productivity throughout the day'
    ]
  },
  'active-recall': {
    id: 'active-recall',
    name: 'Active Recall',
    description: 'A learning technique that involves actively retrieving information from memory rather than passively reviewing.',
    icon: <Target className="h-8 w-8" />,
    color: 'secondary',
    benefits: [
      'Strengthens memory retention',
      'Identifies knowledge gaps',
      'Improves long-term learning',
      'More effective than passive review'
    ],
    howItWorks: 'Instead of rereading notes, test yourself with questions, flashcards, or explaining concepts without looking at materials.',
    tips: [
      'Create practice questions from your notes',
      'Use flashcards for key concepts',
      'Explain topics to yourself or others',
      'Quiz yourself before reviewing answers'
    ],
    bestFor: [
      'Memorization-heavy subjects',
      'Preparing for multiple-choice exams',
      'Learning new vocabulary or formulas',
      'Building strong foundational knowledge'
    ]
  },
  'spaced-repetition': {
    id: 'spaced-repetition',
    name: 'Spaced Repetition',
    description: 'A learning technique that involves reviewing information at increasing intervals to optimize memory retention.',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'accent',
    benefits: [
      'Maximizes long-term retention',
      'Reduces study time over time',
      'Prevents forgetting',
      'Efficient for large amounts of information'
    ],
    howItWorks: 'Review material at specific intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month, etc. based on how well you remember.',
    tips: [
      'Use spaced repetition apps or flashcards',
      'Review material just before you forget it',
      'Focus more on difficult concepts',
      'Be consistent with your review schedule'
    ],
    bestFor: [
      'Long-term learning goals',
      'Subjects with lots of facts to remember',
      'Preparing for future courses',
      'Building lasting knowledge'
    ]
  },
  'feynman': {
    id: 'feynman',
    name: 'Feynman Technique',
    description: 'A learning method that involves explaining complex concepts in simple terms to deepen understanding.',
    icon: <Users className="h-8 w-8" />,
    color: 'primary',
    benefits: [
      'Deepens conceptual understanding',
      'Identifies knowledge gaps',
      'Improves communication skills',
      'Makes complex topics accessible'
    ],
    howItWorks: 'Choose a concept, explain it in simple terms, identify gaps in your explanation, review and simplify further.',
    tips: [
      'Pretend you\'re teaching a beginner',
      'Use analogies and examples',
      'Avoid jargon and technical terms',
      'Practice explaining to others'
    ],
    bestFor: [
      'Complex theoretical concepts',
      'Understanding difficult subjects',
      'Preparing to teach others',
      'Building deep knowledge'
    ]
  },
  'interleaving': {
    id: 'interleaving',
    name: 'Interleaving',
    description: 'A learning technique that involves mixing different topics or types of problems during study sessions.',
    icon: <Zap className="h-8 w-8" />,
    color: 'secondary',
    benefits: [
      'Improves problem-solving skills',
      'Enhances learning transfer',
      'Prevents getting stuck in ruts',
      'More engaging than blocked practice'
    ],
    howItWorks: 'Instead of practicing one type of problem repeatedly, mix different types and subjects within the same study session.',
    tips: [
      'Switch between related topics',
      'Mix different problem types',
      'Vary your study environment',
      'Combine multiple subjects in one session'
    ],
    bestFor: [
      'Multiple subjects in short periods',
      'Problem-solving heavy subjects',
      'Preparing for comprehensive exams',
      'Building flexible thinking skills'
    ]
  }
}

const ResultsPage = () => {
  const navigate = useNavigate()
  const [studyMethod, setStudyMethod] = useState<StudyMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const methodId = localStorage.getItem('studyMethod')
    if (methodId && studyMethods[methodId]) {
      setStudyMethod(studyMethods[methodId])
    } else {
      // Fallback to pomodoro if no method found
      setStudyMethod(studyMethods['pomodoro'])
    }
    setIsLoading(false)
  }, [])

  const handleContinue = () => {
    navigate('/study-plan')
  }

  if (isLoading || !studyMethod) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            Your Perfect Study Method
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your answers, we've identified the study technique that best matches your learning style.
          </p>
        </div>

        {/* Method Card */}
        <div className="card mb-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${studyMethod.color}/10 mb-4`}>
              <div className={`text-${studyMethod.color}`}>
                {studyMethod.icon}
              </div>
            </div>
            <h2 className="text-3xl font-poppins font-bold text-text mb-4">
              {studyMethod.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {studyMethod.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4">
              Why This Method Works for You
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {studyMethod.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4">
              How It Works
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{studyMethod.howItWorks}</p>
            </div>
          </div>

          {/* Best For */}
          <div className="mb-8">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4">
              Best For
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {studyMethod.bestFor.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8">
            <h3 className="text-xl font-poppins font-semibold text-text mb-4">
              Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {studyMethod.tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={handleContinue}
            className="btn-primary text-lg px-8 py-4 flex items-center mx-auto"
          >
            Create My Study Plan
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
          
          <p className="text-sm text-gray-500">
            We'll use this method to generate a personalized study plan just for you.
          </p>
        </div>

        {/* Method Comparison */}
        <div className="mt-16">
          <h3 className="text-2xl font-poppins font-bold text-text text-center mb-8">
            Other Study Methods
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(studyMethods)
              .filter(method => method.id !== studyMethod.id)
              .map((method) => (
                <div key={method.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${method.color}/10 mb-3`}>
                    <div className={`text-${method.color}`}>
                      {method.icon}
                    </div>
                  </div>
                  <h4 className="font-poppins font-semibold text-text mb-2">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage 