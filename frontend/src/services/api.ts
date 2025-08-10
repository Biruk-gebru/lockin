const API_BASE_URL = 'http://localhost:8000/api'

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(email: string, username: string, password: string) {
    return this.request<{ id: number; email: string; username: string; is_active: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password })
    })
  }

  async googleOAuth(token: string) {
    return this.request<{ access_token: string; token_type: string }>('/auth/google-oauth', {
      method: 'POST',
      body: JSON.stringify({ google_token: token })
    })
  }

  async getCurrentUser() {
    return this.request<{ id: number; email: string; username: string; is_active: boolean }>('/auth/me')
  }

  // Study Plan
  async generateStudyPlan(planData: {
    study_method: string
    subjects: Array<{
      name: string
      difficulty: string
      priority: string
      hours_per_week: number
    }>
    time_slots: Array<{
      day: string
      start_time: string
      end_time: string
      is_available: boolean
    }>
  }) {
    return this.request<{
      id: number
      user_id: number
      study_method: string
      subjects: string
      time_slots: string
      generated_at: string
    }>('/study-plan/generate', {
      method: 'POST',
      body: JSON.stringify(planData)
    })
  }

  async getCurrentStudyPlan() {
    return this.request<{
      id: number
      user_id: number
      study_method: string
      subjects: string
      time_slots: string
      generated_at: string
    }>('/study-plan/current')
  }

  async getStudyPlanHistory() {
    return this.request<Array<{
      id: number
      user_id: number
      study_method: string
      subjects: string
      time_slots: string
      generated_at: string
    }>>('/study-plan/history')
  }

  // Study Sessions
  async createStudySession(sessionData: {
    subject: string
    start_time: string
    end_time: string
    session_type: string
    notes?: string
  }) {
    return this.request<{
      id: number
      user_id: number
      study_plan_id?: number
      subject: string
      start_time: string
      end_time: string
      duration: number
      session_type: string
      completed: boolean
      notes?: string
      created_at: string
    }>('/study-plan/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    })
  }

  async getStudySessions(limit?: number) {
    const params = limit ? `?limit=${limit}` : ''
    return this.request<Array<{
      id: number
      user_id: number
      study_plan_id?: number
      subject: string
      start_time: string
      end_time: string
      duration: number
      session_type: string
      completed: boolean
      notes?: string
      created_at: string
    }>>(`/study-plan/sessions${params}`)
  }

  async markSessionComplete(sessionId: number) {
    return this.request<{ message: string }>(`/study-plan/sessions/${sessionId}/complete`, {
      method: 'PUT'
    })
  }

  // Calendar
  async getWeekSchedule(startDate?: string) {
    const params = startDate ? `?start_date=${startDate}` : ''
    return this.request<Record<string, Array<{
      id: number
      user_id: number
      study_plan_id?: number
      subject: string
      start_time: string
      end_time: string
      duration: number
      session_type: string
      completed: boolean
      notes?: string
      created_at: string
    }>>>(`/calendar/week${params}`)
  }

  async getUpcomingSessions(limit?: number) {
    const params = limit ? `?limit=${limit}` : ''
    return this.request<Array<{
      id: number
      user_id: number
      study_plan_id?: number
      subject: string
      start_time: string
      end_time: string
      duration: number
      session_type: string
      completed: boolean
      notes?: string
      created_at: string
    }>>>(`/calendar/upcoming${params}`)
  }

  async getCalendarStats(days?: number) {
    const params = days ? `?days=${days}` : ''
    return this.request<{
      total_sessions: number
      completed_sessions: number
      completion_rate: number
      total_study_time_minutes: number
      total_study_time_hours: number
      sessions_by_type: Record<string, number>
      study_time_by_subject: Record<string, number>
      period_days: number
    }>(`/calendar/stats${params}`)
  }

  async deleteStudySession(sessionId: number) {
    return this.request<{ message: string }>(`/calendar/sessions/${sessionId}`, {
      method: 'DELETE'
    })
  }

  // AI Chat
  async chatWithAI(message: string, context?: Record<string, any>) {
    return this.request<{
      response: string
      suggestions: string[]
    }>('/ai-chat/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    })
  }

  async getChatHistory(limit?: number) {
    const params = limit ? `?limit=${limit}` : ''
    return this.request<Array<{
      id: number
      user_id: number
      content: string
      role: string
      timestamp: string
    }>>(`/ai-chat/history${params}`)
  }

  async clearChatHistory() {
    return this.request<{ message: string }>('/ai-chat/history', {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService()
export default apiService 