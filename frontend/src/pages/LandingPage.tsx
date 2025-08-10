import { Link } from 'react-router-dom'
import { Brain, Target, Clock, Users } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-poppins font-bold text-text">LoackIn</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Login
              </Link>
              <Link to="/login" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-text mb-6">
            Your AI-powered
            <span className="text-primary block">study partner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay focused. Study smarter. Achieve more with LoackIn's intelligent study method classification, 
            personalized AI-generated plans, and focus-enhancing features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Continue with Google
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-text mb-4">
              Why Choose LoackIn?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and helps you achieve your study goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-text mb-2">Smart Classification</h3>
              <p className="text-gray-600">AI-powered questionnaire to determine your optimal study method</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-text mb-2">Personalized Plans</h3>
              <p className="text-gray-600">Custom study plans tailored to your method and schedule</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-text mb-2">Focus Mode</h3>
              <p className="text-gray-600">Timer-based sessions with break exercises and notifications</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-text mb-2">AI Support</h3>
              <p className="text-gray-600">Get help with study questions through our AI chatbot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Study Methods Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-text mb-4">
              Proven Study Methods
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From Pomodoro to Feynman, we'll match you with the perfect study technique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Pomodoro Technique', desc: 'For short attention spans', color: 'primary' },
              { name: 'Active Recall', desc: 'For memorization-heavy subjects', color: 'secondary' },
              { name: 'Spaced Repetition', desc: 'For long-term retention', color: 'accent' },
              { name: 'Feynman Technique', desc: 'For deep understanding', color: 'primary' },
              { name: 'Interleaving', desc: 'For multiple subjects', color: 'secondary' }
            ].map((method, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-poppins font-semibold text-text mb-2">{method.name}</h3>
                <p className="text-gray-600">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-poppins font-bold text-white mb-4">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-xl text-primary-light mb-8">
            Join thousands of students who are already studying smarter with LoackIn.
          </p>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-poppins font-bold">LoackIn</span>
            </div>
            <p className="text-gray-400 mb-4">
              "Stay focused. Study smarter. Achieve more."
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 LoackIn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 