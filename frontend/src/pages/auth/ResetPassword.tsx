import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, AlertTriangle, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { supabase } from '../../lib/supabase';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Verify that the user has a valid active session or recovery token
  useEffect(() => {
    let mounted = true;
    const verifyRecoverySession = async () => {
      try {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        if (session || user) {
          if (mounted) setHasValidSession(true);
        } else {
          if (mounted) setHasValidSession(false);
        }
      } catch (err) {
        console.warn('Session verification notice:', err);
        if (mounted) setHasValidSession(false);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    };

    verifyRecoverySession();
    return () => { mounted = false; };
  }, [user]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setError(null);
      await authService.updatePassword(password);
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/home'), 2000);
    } catch (e: any) {
      console.warn('Password update error:', e);
      setError(e.message || 'Failed to update password. Your recovery link may have expired.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <AuthLayout 
        title="Verifying Security State" 
        subtitle="Please wait while we confirm your recovery session..."
        bgImage="/images/lofoten.jpg"
      >
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-aurora-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Enter your new secure password below"
      bgImage="/images/lofoten.jpg"
    >
      {!hasValidSession ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-2"
        >
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-snow">Invalid or Expired Link</h3>
            <p className="text-sm text-snow/70 max-w-sm mx-auto leading-relaxed">
              This password reset link is invalid, expired, or has already been used. Please request a new recovery link to reset your credentials.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link 
              to="/forgot-password"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-sm font-bold text-navy-900 bg-aurora-green hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] cursor-pointer"
            >
              Request a New Link
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-semibold text-snow/60 hover:text-snow transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login
            </Link>
          </div>
        </motion.div>
      ) : success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-2"
        >
          <div className="w-14 h-14 bg-aurora-green/10 border border-aurora-green/30 rounded-2xl flex items-center justify-center mx-auto text-aurora-green shadow-[0_0_20px_rgba(0,255,135,0.2)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-snow">Password Updated!</h3>
            <p className="text-sm text-snow/70 max-w-sm mx-auto leading-relaxed">
              Your password has been successfully reset. Redirecting you to your account...
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/home')}
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] cursor-pointer"
            >
              Continue to Norway SmartLife
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-5" 
          onSubmit={handleUpdate}
        >
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
              <label htmlFor="new-password" className="sr-only">New Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password"
                required 
                value={password}
                onChange={handlePasswordChange}
                className="block w-full pl-11 pr-11 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="New Password"
                minLength={6}
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
              <label htmlFor="confirm-new-password" className="sr-only">Confirm New Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
              </div>
              <input 
                id="confirm-new-password"
                name="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"} 
                autoComplete="new-password"
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-11 pr-11 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                placeholder="Confirm New Password"
                minLength={6}
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

          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] cursor-pointer"
          >
            {loading ? 'Updating Password...' : 'Set New Password'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </motion.form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
