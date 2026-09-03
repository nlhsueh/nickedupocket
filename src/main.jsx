import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeLangProvider } from './context/ThemeLangContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeLangProvider>
      <App />
    </ThemeLangProvider>
  </StrictMode>,
)
