import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './i18n/i18n'
import './components/styles/globals.css'
import PortfolioExperience from './components/pages/PortfolioExperience.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioExperience />
    <Analytics />
  </React.StrictMode>,
)
