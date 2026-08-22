import React, { useState } from 'react';
import { Mail, Lock, Compass, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth/authService';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.loginWithGoogle();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.sendPhoneOtp(phone);
      setOtpSent(true);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.verifyPhoneOtp(phone, otp);
      setTimeout(() => navigate('/home'), 500);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.loginWithEmail(email, password);
      setTimeout(() => navigate('/home'), 500);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image - Matches Register */}
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
              Welcome back
            </h2>
            <p className="text-white/70 text-sm">Sign in to your Norway SmartLife account</p>
          </div>

          {loginMethod === 'email' ? (
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50 group-focus-within:text-aurora-green transition-colors" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  id="email"
                  autoComplete="email"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-3 py-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-aurora-green/50 transition-all sm:text-sm backdrop-blur-sm" 
                  placeholder="Email address"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-aurora-green transition-colors" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-3 py-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-aurora-green/50 transition-all sm:text-sm backdrop-blur-sm" 
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div />
                <Link to="/forgot-password" className="text-sm font-medium text-aurora-green hover:text-green-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:shadow-[0_0_30px_rgba(0,255,135,0.6)]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/50">Or sign in with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('phone'); setError(null); }}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all"
                >
                  <svg className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Phone OTP
                </button>
              </div>
            </div>
          </form>
          ) : (
            <form className="space-y-6" onSubmit={otpSent ? handleOtpSubmit : handlePhoneSubmit}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-aurora-green transition-colors" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    autoComplete="tel"
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className="block w-full pl-11 pr-3 py-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-aurora-green/50 transition-all sm:text-sm backdrop-blur-sm disabled:opacity-50" 
                    placeholder="Phone number (e.g. +47...)"
                  />
                </div>
                {otpSent && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/50 group-focus-within:text-aurora-green transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      name="otp"
                      autoComplete="one-time-code"
                      required 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-11 pr-3 py-3.5 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-green/50 focus:border-aurora-green/50 transition-all sm:text-sm backdrop-blur-sm" 
                      placeholder="Enter OTP"
                    />
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:shadow-[0_0_30px_rgba(0,255,135,0.6)]"
              >
                {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setError(null); }}
                  className="text-sm font-bold text-aurora-green hover:text-green-300 transition-colors"
                >
                  Back to Email Login
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center text-sm text-white/70 border-t border-white/10 pt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-aurora-green hover:text-green-300 transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
