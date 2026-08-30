/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ISSUE-029: Manual chunk splitting via function form — compatible with all Rollup output modes.
// Each chunk becomes a separately cacheable asset, reducing initial load time.
function manualChunks(id: string): string | undefined {
  if (id.includes('node_modules')) {
    if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
    if (id.includes('react-router-dom') || id.includes('react-router/')) return 'vendor-router';
    if (id.includes('@supabase/')) return 'vendor-supabase';
    if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-leaflet';
    if (id.includes('lucide-react') || id.includes('sonner') || id.includes('framer-motion')) return 'vendor-ui';
    if (id.includes('@tanstack/')) return 'vendor-query';
    if (id.includes('@google/generative-ai')) return 'vendor-genai';
  }
  return undefined;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: false
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks,
      }
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/src/tests/playwright/**'],
    // Prevent worker spawn timeouts when running the full test suite
    testTimeout: 30000,
    maxConcurrency: 4,
  },
})
