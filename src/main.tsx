import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Disable React's automatic lazy loading
const disableLazyLoading = () => {
  // This is a workaround to ensure all images load eagerly
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'eager');
    }
  });
};

// Run once on initial load
window.addEventListener('DOMContentLoaded', disableLazyLoading);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
