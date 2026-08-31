import { lazy, ComponentType } from 'react';

/**
 * Wraps dynamic React.lazy imports with automated retry and stale chunk recovery.
 * When a new deployment is shipped to production, old chunks may no longer exist on CDN.
 * This helper catches the chunk error, attempts an immediate retry, and if needed forces
 * a clean page reload to fetch the latest assets from the server.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T } | any>
) {
  return lazy(async () => {
    const sessionKey = 'norway_chunk_reload_lock';
    
    try {
      return await factory();
    } catch (error: any) {
      const errorMsg = error?.message || String(error || '');
      const isChunkError = 
        errorMsg.includes('dynamically imported module') ||
        errorMsg.includes('Failed to load module script') ||
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('error loading dynamically imported module');

      const lastReload = sessionStorage.getItem(sessionKey);
      const now = Date.now();
      const hasRecentlyReloaded = lastReload && (now - parseInt(lastReload, 10)) < 10000;

      if (isChunkError && !hasRecentlyReloaded && typeof window !== 'undefined') {
        sessionStorage.setItem(sessionKey, String(now));
        window.location.reload();
        // Return dummy component while window reloads
        return { default: (() => null) as unknown as T };
      }

      // Propagate to RouteErrorBoundary if reload was already performed
      throw error;
    }
  });
}
