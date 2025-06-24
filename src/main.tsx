// ===== src/main.tsx =====
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if API keys are configured
if (!import.meta.env.VITE_TMDB_API_KEY) {
  console.warn('⚠️ TMDB API key not configured. Please check your .env file.')
}

if (!import.meta.env.VITE_OMDB_API_KEY) {
  console.warn('⚠️ OMDB API key not configured. Please check your .env file.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)