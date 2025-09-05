import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { CustomPaletteProvider } from './contexts/CustomPaletteContext';


createRoot(document.getElementById('ysyviz')).render(
  <StrictMode>
    <LanguageProvider>
      <CustomPaletteProvider>
        <App />
      </CustomPaletteProvider>
    </LanguageProvider>
  </StrictMode>,
)
