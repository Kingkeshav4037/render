import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../store/useToastStore';

export interface RequireAuthOptions {
  message?: string;
  returnTo?: string;
}

/**
 * Centralized hook for action-level authentication gating.
 * 
 * If the user is authenticated, executes the callback immediately.
 * If the user is a guest, displays a contextual notice and redirects
 * to `/login?returnTo=...&message=...` while preserving state.
 */
export function useRequireAuth() {
  const { user, initialized, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (
    actionCallback?: () => void,
    options?: RequireAuthOptions
  ): boolean => {
    if (user) {
      if (actionCallback) {
        actionCallback();
      }
      return true;
    }

    const currentPath = options?.returnTo || (location.pathname + location.search);
    const msg = options?.message || 'Please sign in to continue.';

    toast.info(msg);

    const searchParams = new URLSearchParams();
    searchParams.set('returnTo', currentPath);
    if (msg) searchParams.set('message', msg);

    navigate(`/login?${searchParams.toString()}`, {
      state: { from: location, returnTo: currentPath, message: msg }
    });

    return false;
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading || !initialized,
    requireAuth,
  };
}
