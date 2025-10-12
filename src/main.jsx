import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import global styles
import './index.css'
// Import Bootstrap CSS (import before your app so it can be overridden by app styles if needed)
import 'bootstrap/dist/css/bootstrap.min.css'
// Optional: Import Bootstrap JS bundle (includes Popper) for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
