import React, { useState } from 'react';
import { Mail, Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth/authService';

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
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login_background.jpg')" }}
      >
        <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-[2px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4 sm:px-0"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-aurora-green/20 text-aurora-green mb-4 border border-aurora-green/30 shadow-[0_0_15px_rgba(0,255,135,0.3)]"
            >
              <Compass className="w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Reset Password
            </h2>
            <p className="text-white/70 text-sm">Enter your email and we'll send you a link.</p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl text-sm backdrop-blur-sm">
                Check your email for the reset link! You can close this window.
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <label htmlFor="forgot-email" className="sr-only">Email address</label>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-aurora-green transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    id="forgot-email"
                    autoComplete="email"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-aurora-green/50 transition-all sm:text-sm backdrop-blur-sm" 
                    placeholder="Email address"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.4)]"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-white/70 border-t border-white/10 pt-6">
            <Link to="/login" className="flex items-center justify-center gap-2 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
