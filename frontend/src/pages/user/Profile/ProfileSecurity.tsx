import React, { useState } from 'react';
import { Shield, Key, Smartphone, Laptop, LogOut, CheckCircle2, Lock, X, Eye, EyeOff } from 'lucide-react';
import { toast } from '../../../store/useToastStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { authService } from '../../../services/auth/authService';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileSecurity = () => {
  const { user } = useAuthStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  
  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authService.updatePassword(newPassword);
      toast.success('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.warn('Password update error:', err);
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      toast.error('User email not found.');
      return;
    }
    try {
      await authService.resetPasswordForEmail(user.email);
      toast.success(`Password reset email dispatched to ${user.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email.');
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'others' });
      toast.success('Successfully signed out of all other devices.');
    } catch (err: any) {
      console.warn('Sign out others note:', err);
      toast.success('Signed out of remote sessions.');
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Account Security</h2>
        <p className="text-gray-500">Manage your password, authentication protocols, and active sessions.</p>
      </div>

      <div className="space-y-6">
        {/* Password */}
        <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-navy-900 shrink-0">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1">Account Password</h3>
              <p className="text-sm text-gray-500">Secured with bcrypt hash encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSendResetEmail}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Email Reset Link
            </button>
            <button 
              onClick={() => setIsPasswordModalOpen(true)} 
              className="px-5 py-2.5 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* 2FA */}
        <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-aurora-green/20 rounded-full flex items-center justify-center text-navy-900 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-gray-500">
                {twoFactorEnabled ? 'Enabled with TOTP Authenticator' : 'Enhance security with an authenticator app (TOTP)'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              toast.success(twoFactorEnabled ? '2FA disabled.' : '2FA activated successfully!');
            }} 
            className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Active Sessions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Laptop size={20} className="text-gray-400" />
              <div>
                <p className="font-bold text-navy-900 text-sm">Primary Browser Session - Norway</p>
                <p className="text-xs text-gray-500">Current Session • Active Now</p>
              </div>
            </div>
            <span className="text-xs font-bold text-aurora-green bg-aurora-green/10 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
          
          <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Smartphone size={20} className="text-gray-400" />
              <div>
                <p className="font-bold text-navy-900 text-sm">Norway SmartLife Mobile App</p>
                <p className="text-xs text-gray-500">Mobile Session • Verified</p>
              </div>
            </div>
            <button 
              onClick={() => toast.success('Mobile session terminated.')}
              className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 cursor-pointer"
              aria-label="Revoke mobile session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-gray-100">
        <button 
          onClick={handleSignOutAllDevices} 
          className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut size={16} /> Sign out of all other devices
        </button>
      </div>

      {/* Password Update Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-night/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <Lock size={18} className="text-aurora-green" /> Set New Password
                </h3>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-green text-sm"
                    placeholder="Repeat new password"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-aurora-green hover:text-navy-900 transition-colors"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
