import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

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
            try {
              const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
              const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
              
              if (fullName || avatarUrl) {
                await supabase.from('profiles').upsert({
                  id: user.id,
                  email: user.email || '',
                  full_name: fullName,
                  avatar_url: avatarUrl,
                  updated_at: new Date().toISOString(),
                }, { onConflict: 'id', ignoreDuplicates: true });
              }
            } catch (syncErr) {
              console.warn('Google profile sync note:', syncErr);
            }
          }

          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get('type') || searchParams.get('type');
          
          if (type === 'recovery') {
            navigate('/reset-password');
          } else {
            navigate('/home');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white">
      {error ? (
        <div className="bg-red-500/20 text-red-200 p-6 rounded-2xl max-w-md text-center border border-red-500/30">
          <p className="font-bold mb-2 text-lg">Authentication Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4 opacity-70">Redirecting to login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-aurora-green animate-spin mb-4" />
          <h2 className="text-xl font-bold">Verifying authentication...</h2>
          <p className="text-white/70 text-sm mt-1">Please wait while we log you into Norway SmartLife.</p>
        </div>
      )}
    </div>
  );
};
