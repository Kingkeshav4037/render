import React, { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.updatePassword(password);
      navigate('/home');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to update password.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Enter your new secure password below"
      bgImage="/images/lofoten.jpg"
    >
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6" 
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
              aria-live="assertive"
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
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-navy-900 bg-aurora-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900 focus:ring-aurora-green transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)]"
        >
          {loading ? 'Updating...' : 'Update Password'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </motion.form>
    </AuthLayout>
  );
};

export default ResetPassword;
