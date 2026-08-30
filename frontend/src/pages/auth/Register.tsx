import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth/authService';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { toast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import { sanitizeRedirectUrl } from './Login';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const rawRedirect = new URLSearchParams(location.search).get('redirect') || location.state?.from?.pathname;
  const targetRedirect = sanitizeRedirectUrl(rawRedirect);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(targetRedirect, { replace: true });
    }
  }, [user, navigate, targetRedirect]);

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, message: '' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let message = '';
    if (score <= 2) message = 'Weak';
    else if (score <= 3) message = 'Medium';
    else message = 'Strong';
    
    return { score, message };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(checkPasswordStrength(val));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            role: isProvider ? 'PROVIDER' : 'USER',
          }
        }
      });

      if (signUpError) throw signUpError;

      // Handle duplicate user registration edge case
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email address already exists. Please sign in instead.');
        setLoading(false);
        return;
      }

      // Initialize user profile in profiles table
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedName,
            role: isProvider ? 'PROVIDER' : 'USER',
            country: 'Norway',
            city: 'Oslo',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id', ignoreDuplicates: true });
        } catch (profileErr) {
          console.warn('Profile initialization note:', profileErr);
        }

        // Cache initial local profile for fast hydration
        localStorage.setItem('nsl_user_profile', JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          country: 'Norway',
          city: 'Oslo',
          role: isProvider ? 'PROVIDER' : 'USER',
          updatedAt: new Date().toISOString()
        }));
      }

      // Check if email confirmation is required (Supabase returns a user but no session)
      if (data?.user && !data.session) {
        setRegisteredEmail(trimmedEmail);
        setRequiresEmailConfirmation(true);
        toast.info('Verification email sent. Please check your inbox.');
      } else {
        toast.success('Account created successfully! Welcome to Norway SmartLife.');
        navigate(targetRedirect, { replace: true });
      }
    } catch (err: any) {
      console.warn('Registration failure:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      if (targetRedirect && targetRedirect !== '/home') {
        sessionStorage.setItem('returnTo', targetRedirect);
      }
      setGoogleLoading(true);
      setLoading(true);
      setError('');
      await authService.loginWithGoogle();
    } catch (e: any) {
      console.warn('Google sign-in error:', e);
      setError(e.message || 'Unable to connect to Google sign-in. Please try again.');
      setGoogleLoading(false);
      setLoading(false);
    }
  };

  const handleDemoGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { user } = await authService.loginWithDemoGoogle();
      useAuthStore.getState().setUser(user);
      toast.success('Signed in with Google Traveler profile!');
      navigate(targetRedirect, { replace: true });
    } catch (e: any) {
      setError(e.message || 'Failed to sign in with demo Google account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an Account" 
      subtitle="Join Norway SmartLife to unlock your journey"
      bgImage="/images/fjords.jpg"
    >
      {requiresEmailConfirmation ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-4"
        >
          <div className="w-16 h-16 bg-aurora-green/10 border border-aurora-green/30 rounded-2xl flex items-center justify-center mx-auto text-aurora-green shadow-[0_0_25px_rgba(0,255,135,0.2)]">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-snow">Check your email</h3>
            <p className="text-sm text-snow/70 max-w-sm mx-auto leading-relaxed">
              We have sent a verification link to <span className="font-semibold text-snow">{registeredEmail}</span>. Please click the link to confirm your account.
            </p>
          </div>

          <div className="bg-deep-night/50 border border-white/10 rounded-xl p-4 text-xs text-snow/60 text-left space-y-2">
            <div className="flex items-center gap-2 text-snow font-semibold">
              <ShieldCheck className="w-4 h-4 text-aurora-green" />
              <span>Next Steps</span>
            </div>
            <p>1. Open your inbox and look for an email from Norway SmartLife.</p>
            <p>2. Click the confirmation link to activate your traveler credentials.</p>
            <p>3. Once verified, sign in to start planning your journeys.</p>
          </div>

          <div className="pt-2">
            <Link 
              to="/login" 
              state={{ from: location.state?.from }}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-sm font-bold text-navy-900 bg-aurora-green hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] cursor-pointer"
            >
              Return to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <form className="space-y-5" onSubmit={handleRegister}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-sm text-center mb-6 overflow-hidden"
                role="alert"
                aria-live="polite"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <div className="relative group">
              <label htmlFor="register-name" className="sr-only">Full Name</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-name"
                name="name" 
                type="text" 
                autoComplete="name"
                required 
                className="block w-full pl-11 pr-3 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="relative group">
              <label htmlFor="register-email" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-email"
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="block w-full pl-11 pr-3 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <label htmlFor="register-password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-password"
                name="password" 
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password" 
                required 
                className="block w-full pl-11 pr-11 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Password" 
                value={password} 
                onChange={handlePasswordChange} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-snow/40 hover:text-snow transition-colors cursor-pointer outline-none focus:text-aurora-green"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="pt-1">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <span className="text-xs text-snow/60 font-medium tracking-wide">Strength</span>
                  <span className={`text-[11px] uppercase tracking-wider font-bold ${
                    passwordStrength.message === 'Weak' ? 'text-red-400' : 
                    passwordStrength.message === 'Medium' ? 'text-amber-400' : 'text-aurora-green'
                  }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="w-full bg-deep-night/60 rounded-full h-1.5 flex gap-1 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${passwordStrength.score >= 1 ? (passwordStrength.message === 'Weak' ? 'bg-red-400' : passwordStrength.message === 'Medium' ? 'bg-amber-400' : 'bg-aurora-green') : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                  <div className={`h-1.5 rounded-full ${passwordStrength.score >= 3 ? (passwordStrength.message === 'Medium' ? 'bg-amber-400' : 'bg-aurora-green') : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                  <div className={`h-1.5 rounded-full ${passwordStrength.score >= 4 ? 'bg-aurora-green' : 'bg-transparent'} w-1/3 transition-all duration-300`}></div>
                </div>
              </div>
            )}

            <div className="relative group mt-4">
              <label htmlFor="register-confirm-password" className="sr-only">Confirm Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="register-confirm-password"
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                autoComplete="new-password" 
                required 
                className="block w-full pl-11 pr-11 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-snow/40 hover:text-snow transition-colors cursor-pointer outline-none focus:text-aurora-green"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-3 mb-2 px-1">
            <input
              type="checkbox"
              id="isProvider"
              checked={isProvider}
              onChange={(e) => setIsProvider(e.target.checked)}
              className="w-4 h-4 text-aurora-green bg-deep-night/40 border-white/20 rounded focus:ring-aurora-green focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 transition-colors cursor-pointer"
            />
            <label htmlFor="isProvider" className="ml-2.5 text-xs font-semibold tracking-wide text-snow/80 cursor-pointer select-none">
              Register as a Tour / Stay Provider
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] mt-4 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="px-3 bg-navy-900/80 text-snow/40 rounded-full">Or register with</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-white/10 rounded-xl text-snow bg-deep-night/40 hover:bg-deep-night/80 hover:border-white/20 transition-all group cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="h-4 w-4 border-2 border-aurora-green border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                )}
                <span className="text-xs font-semibold group-hover:text-white transition-colors">
                  {googleLoading ? 'Connecting...' : 'Google'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: location.state?.from } })}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-white/10 rounded-xl text-snow bg-deep-night/40 hover:bg-deep-night/80 hover:border-white/20 transition-all group cursor-pointer"
              >
                <svg className="h-4 w-4 text-snow/60 group-hover:text-aurora-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold group-hover:text-white transition-colors">Phone OTP</span>
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="mt-8 text-center text-sm text-snow/60 border-t border-white/10 pt-6">
        Already have an account?{' '}
        <Link to="/login" state={{ from: location.state?.from }} className="font-bold text-aurora-green hover:text-green-300 transition-colors">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
