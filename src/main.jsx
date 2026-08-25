import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './i18n/i18n'
import './components/styles/globals.css'
import Index from './components/pages/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Index />
    <Analytics />
  </React.StrictMode>,
)