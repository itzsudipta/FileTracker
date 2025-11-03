import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FileManagementSystem from './components/App.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FileManagementSystem />
  </StrictMode>,
)
