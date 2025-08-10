import { useState, useRef, useEffect } from 'react'
import { Brain, Send, User, Bot, Loader, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI study companion. I can help you with study strategies, explain concepts, answer questions, and provide motivation. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simulate AI response with a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = generateAIResponse(inputMessage.trim())
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Simple response logic - in real app, this would call the AI API
    if (input.includes('pomodoro') || input.includes('timer')) {
      return "The Pomodoro Technique is a time management method that uses 25-minute focused work sessions followed by 5-minute breaks. It helps maintain concentration and prevents mental fatigue. Try setting a timer for 25 minutes and focus solely on your task!"
    }
    
    if (input.includes('motivation') || input.includes('motivated')) {
      return "Remember, every expert was once a beginner. Your progress might feel slow, but consistency beats perfection. Take it one step at a time, celebrate small wins, and trust the process. You're building something amazing!"
    }
    
    if (input.includes('memory') || input.includes('remember')) {
      return "Active recall and spaced repetition are powerful memory techniques. Instead of just re-reading, try testing yourself on the material. Review concepts at increasing intervals - this strengthens neural pathways and improves long-term retention."
    }
    
    if (input.includes('focus') || input.includes('concentration')) {
      return "To improve focus: eliminate distractions, use the Pomodoro Technique, take regular breaks, stay hydrated, and create a dedicated study environment. Your brain works best when it can fully engage with one task at a time."
    }
    
    if (input.includes('stress') || input.includes('anxiety')) {
      return "It's normal to feel stressed about studies. Practice deep breathing, take regular breaks, maintain a consistent sleep schedule, and remember that your worth isn't defined by academic performance. You've got this!"
    }
    
    if (input.includes('schedule') || input.includes('planning')) {
      return "Effective study planning involves: identifying your most important tasks, scheduling them during your peak energy hours, building in buffer time for unexpected challenges, and reviewing your plan daily. Start with 2-3 main priorities per day."
    }
    
    if (input.includes('math') || input.includes('mathematics')) {
      return "Math is built on fundamentals - make sure you understand the basics before moving forward. Practice regularly, work through problems step by step, and don't be afraid to make mistakes. They're opportunities to learn!"
    }
    
    if (input.includes('science') || input.includes('physics') || input.includes('chemistry')) {
      return "Science subjects benefit from understanding the 'why' behind concepts. Connect theories to real-world examples, practice problem-solving, and use visual aids like diagrams. Break complex topics into smaller, manageable parts."
    }
    
    if (input.includes('language') || input.includes('english') || input.includes('writing')) {
      return "Language skills improve with consistent practice. Read regularly, write daily (even just a paragraph), expand your vocabulary, and practice speaking. Don't worry about perfection - focus on communication and clarity."
    }
    
    if (input.includes('break') || input.includes('rest')) {
      return "Taking breaks is crucial for learning! Your brain needs time to process and consolidate information. Try the 52/17 rule: 52 minutes of focused work, then 17 minutes of rest. Use breaks to move, hydrate, or do something completely different."
    }
    
    return "That's an interesting question! While I can provide general study advice, for specific academic questions, I'd recommend consulting your course materials or instructor. Is there something specific about study techniques or learning strategies I can help you with?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "How can I improve my focus while studying?",
    "What's the best way to remember what I learn?",
    "How do I stay motivated during long study sessions?",
    "Can you explain the Pomodoro Technique?",
    "How should I plan my study schedule?"
  ]

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary" />
              <Sparkles className="h-6 w-6 text-secondary absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl font-poppins font-bold text-text mb-4">
            AI Study Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Ask me anything about studying, learning strategies, or academic success
          </p>
        </div>

        {/* Chat Container */}
        <div className="card h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-secondary" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Try asking me:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about studying..."
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="card mt-6">
          <h3 className="text-lg font-poppins font-semibold text-text mb-4">
            💡 Chat Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>• Ask specific questions for better answers</div>
            <div>• I can help with study techniques and motivation</div>
            <div>• For academic content, consult your course materials</div>
            <div>• Use me to plan your study schedule and breaks</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage 