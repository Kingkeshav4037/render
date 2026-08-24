import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.resetPasswordForEmail(email);
      setSuccess(true);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send you a link"
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
            <div className="bg-aurora-green/10 border border-aurora-green/30 text-aurora-green p-4 rounded-xl text-sm font-medium tracking-wide">
              Check your email for the reset link! You can close this window.
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Sign in
            </button>
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
                  aria-live="assertive"
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
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)]"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center text-sm text-snow/60 border-t border-white/10 pt-6">
        <Link to="/login" className="flex items-center justify-center gap-2 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
