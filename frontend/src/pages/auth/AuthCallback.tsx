import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingState } from '../../components/ui/LoadingState';
import { profileService } from '../../services/profile/profileService';
import { isProfileComplete } from '../../types/profile';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // 1. Check for OAuth error in query or hash params
        const oauthError = 
          searchParams.get('error_description') || 
          searchParams.get('error') || 
          hashParams.get('error_description') || 
          hashParams.get('error');

        if (oauthError) {
          const formattedError = decodeURIComponent(oauthError).replace(/\+/g, ' ');
          if (isMounted) setError(formattedError);
          setTimeout(() => {
            if (isMounted) navigate('/login', { replace: true });
          }, 3500);
          return;
        }

        // 2. Handle PKCE authorization code exchange
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('PKCE exchange warning:', exchangeError.message);
          }
        }

        // 3. Handle implicit grant flow (access_token in hash)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken && refreshToken) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setSessionError) {
            console.warn('Hash session set note:', setSessionError.message);
          }
        }

        // 4. Retrieve current active session
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (data?.session?.user) {
          const type = hashParams.get('type') || searchParams.get('type');
          
          if (type === 'recovery') {
            navigate('/reset-password');
          } else {
            const rawReturnTo = sessionStorage.getItem('returnTo') || '/home';
            sessionStorage.removeItem('returnTo');
            const safeDestination = rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') && !rawReturnTo.includes('\\')
              ? rawReturnTo 
              : '/home';

            // Check if user profile has all required fields
            const profile = await profileService.getProfile(data.session.user.id);
            if (!isProfileComplete(profile)) {
              navigate(`/complete-profile?returnTo=${encodeURIComponent(safeDestination)}`);
            } else {
              navigate(safeDestination);
            }
          }
        } else {
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        if (isMounted) {
          setError(err.message || 'Authentication verification failed. Please sign in again.');
          setTimeout(() => {
            if (isMounted) navigate('/login', { replace: true });
          }, 3000);
        }
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-deep-night">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 opacity-20"
        style={{ backgroundImage: "url('/images/northern_lights.jpg')" }}
      >
        <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10">
        {error ? (
          <div 
            className="bg-red-500/10 text-red-300 p-6 rounded-2xl max-w-md text-center border border-red-500/30 backdrop-blur-xl"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-bold mb-2 text-lg">Authentication Notice</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-4 opacity-70">Redirecting to login in a moment...</p>
          </div>
        ) : (
          <LoadingState 
            message="Verifying authentication..." 
            submessage="Please wait while we log you into Norway SmartLife."
          />
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

