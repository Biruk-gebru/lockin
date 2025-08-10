import { useState, useRef, useEffect } from 'react'
import { Brain, Send, User, Bot, Loader, Sparkles, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import apiService from '../services/api'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatHistory()
  }, [])

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await apiService.getChatHistory(50)
      
      if (response.data) {
        const historyMessages: Message[] = response.data.map(msg => ({
          id: msg.id.toString(),
          content: msg.content,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.timestamp)
        }))
        
        setMessages(historyMessages)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Add welcome message if no history
      setMessages([{
        id: '1',
        content: "Hi! I'm your AI study companion. I can help you with study strategies, explain concepts, answer questions, and provide motivation. What would you like to know?",
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoadingHistory(false)
    }
  }

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
      const response = await apiService.chatWithAI(inputMessage.trim())
      
      if (response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          role: 'assistant',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else if (response.error) {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to get response. Please try again.')
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChatHistory = async () => {
    try {
      const response = await apiService.clearChatHistory()
      if (response.data) {
        setMessages([{
          id: '1',
          content: "Chat history cleared. How can I help you today?",
          role: 'assistant',
          timestamp: new Date()
        }])
        toast.success('Chat history cleared')
      }
    } catch (error) {
      toast.error('Failed to clear chat history')
      console.error('Clear history error:', error)
    }
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

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading chat history...</p>
        </div>
      </div>
    )
  }

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
          
          {/* Clear History Button */}
          {messages.length > 1 && (
            <button
              onClick={clearChatHistory}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat History
            </button>
          )}
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