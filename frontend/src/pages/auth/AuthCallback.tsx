import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        setError(error.message);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (data.session) {
        // Successful login/verification
        // Check if there's a recovery flow
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        
        if (type === 'recovery') {
          navigate('/reset-password');
        } else {
          navigate('/home');
        }
      } else {
        // No session
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white">
      {error ? (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-xl max-w-md text-center">
          <p className="font-bold mb-2">Authentication Error</p>
          <p>{error}</p>
          <p className="text-sm mt-4 opacity-70">Redirecting to login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-aurora-green animate-spin mb-4" />
          <h2 className="text-xl font-bold">Verifying authentication...</h2>
          <p className="text-white/70">Please wait while we log you in.</p>
        </div>
      )}
    </div>
  );
};
