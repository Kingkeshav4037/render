import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Security Interceptor
 * Protects critical backend operations by ensuring authentication tokens
 * are valid before the request is made.
 */
export const securityInterceptor = {
  
  /**
   * Wrapper for Supabase API calls or generic Fetch calls to ensure
   * 401 Unauthorized responses correctly trigger a session clear and redirect.
   */
  async withAuth<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('AUTH_MISSING');
      }

      return await operation();
    } catch (error: any) {
      if (error.message === 'AUTH_MISSING' || error.status === 401 || error.status === 403) {
        console.warn('Security Interceptor caught unauthorized access. Forcing session termination.');
        await useAuthStore.getState().signOut();
        window.location.href = '/login?error=session_expired';
      }
      throw error;
    }
  },

  /**
   * Strict verification of an MFA requirement before performing an action.
   */
  async enforceMfa<T>(operation: () => Promise<T>): Promise<T> {
    const { mfaLevel } = useAuthStore.getState();
    
    if (mfaLevel !== 'aal2') {
      console.warn('MFA AAL2 required for this action. Access Denied.');
      // Optionally trigger an MFA prompt here
      throw new Error('MFA_REQUIRED');
    }
    
    return await operation();
  }
};
