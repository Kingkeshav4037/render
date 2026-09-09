import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { HelmetProvider } from 'react-helmet-async'
import { GlobalErrorBoundary } from './components/layout/GlobalErrorBoundary'
import { AuthInitializer } from './components/layout/AuthInitializer'
import './index.css'
import App from './App.tsx'
import './i18n.ts'
import './services/languageService'

// Handle new deployment chunk hash changes gracefully
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    const key = 'norway_preload_retry';
    const lastReload = sessionStorage.getItem(key);
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem(key, String(now));
      window.location.reload();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event.reason?.message || String(event.reason || '');
    if (
      errorMsg.includes('dynamically imported module') ||
      errorMsg.includes('Failed to load module script') ||
      errorMsg.includes('Loading chunk')
    ) {
      const key = 'norway_chunk_unhandled_retry';
      const lastReload = sessionStorage.getItem(key);
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(key, String(now));
        window.location.reload();
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </HelmetProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
