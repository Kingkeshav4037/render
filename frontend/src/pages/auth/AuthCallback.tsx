import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingState } from '../../components/ui/LoadingState';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('PKCE exchange warning:', exchangeError.message);
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (data.session) {
          const user = data.session.user;
          if (user && user.id) {
            // User session verified. Profile creation is handled securely via backend trigger on auth.users insert.
          }

          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get('type') || searchParams.get('type');
          
          if (type === 'recovery') {
            navigate('/reset-password');
          } else {
            const returnTo = sessionStorage.getItem('returnTo') || '/home';
            sessionStorage.removeItem('returnTo');
            navigate(returnTo);
          }
        } else {
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication verification failed.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
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
            <p className="font-bold mb-2 text-lg">Authentication Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-4 opacity-70">Redirecting to login...</p>
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
