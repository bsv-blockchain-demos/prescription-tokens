import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { BroadcastProvider } from './context/broadcast';
import { LanguageProvider } from './context/language';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <BroadcastProvider>
          <CssBaseline />
          <App />
        </BroadcastProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
