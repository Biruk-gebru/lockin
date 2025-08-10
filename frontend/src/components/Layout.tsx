import { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Brain, Calendar, BookOpen, MessageCircle, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('studyMethod')
    localStorage.removeItem('questionnaireAnswers')
    localStorage.removeItem('studyPlan')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/study-plan', label: 'Study Plan', icon: BookOpen },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/study-mode', label: 'Study Mode', icon: BookOpen },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/study-plan" className="flex items-center">
                <Brain className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-poppins font-bold text-text">LoackIn</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">Profile</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-100">
        <nav className="flex space-x-1 px-2 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-colors min-w-max ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default Layout 