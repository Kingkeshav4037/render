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
