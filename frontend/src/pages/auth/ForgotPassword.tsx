import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.resetPasswordForEmail(trimmedEmail);
      setSubmittedEmail(trimmedEmail);
      setSuccess(true);
    } catch (e: any) {
      console.warn('Password reset request notice:', e);
      // Generic confirmation even on unexpected errors to protect account anonymity
      setSubmittedEmail(trimmedEmail);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send you recovery instructions"
      bgImage="/images/lofoten.jpg"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-14 h-14 bg-aurora-green/10 border border-aurora-green/30 rounded-2xl flex items-center justify-center mx-auto text-aurora-green shadow-[0_0_20px_rgba(0,255,135,0.2)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-snow">Recovery Instructions Sent</h3>
              <p className="text-sm text-snow/70 max-w-sm mx-auto leading-relaxed">
                If an account exists for <span className="font-semibold text-snow">{submittedEmail}</span>, password recovery instructions have been sent.
              </p>
            </div>

            <div className="bg-deep-night/50 border border-white/10 rounded-xl p-4 text-xs text-snow/60 text-left space-y-2">
              <p>• Please check your spam folder if you do not receive the email in a few minutes.</p>
              <p>• The reset link will remain active for 1 hour.</p>
            </div>

            <div className="pt-2 space-y-3">
              <button 
                onClick={() => navigate('/login')}
                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sign in
              </button>
              
              <button
                type="button"
                onClick={() => { setSuccess(false); setEmail(''); }}
                className="w-full text-xs text-snow/50 hover:text-aurora-green transition-colors cursor-pointer py-1"
              >
                Try another email address
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6" 
            onSubmit={handleReset}
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
                <label htmlFor="forgot-email" className="sr-only">Email address</label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-snow/40 group-focus-within:text-aurora-green transition-colors" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  id="forgot-email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-3 py-3.5 border border-white/10 rounded-xl bg-deep-night/40 text-snow placeholder-snow/40 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-transparent focus:bg-deep-night/60 transition-all sm:text-sm" 
                  placeholder="Email address"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] cursor-pointer"
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-snow/70 hover:text-aurora-green transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign in
              </Link>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
