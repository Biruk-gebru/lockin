import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './ErrorBoundary'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </ErrorBoundary>
)