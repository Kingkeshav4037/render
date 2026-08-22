import React, { useState } from 'react';
import { Shield, Key, Smartphone, LogOut, AlertTriangle, Monitor, Smartphone as PhoneIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export const SecuritySettings = () => {
  const { user, mfaLevel, hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutOtherSessions = async () => {
    // Note: To sign out other sessions effectively, you often rotate the JWT secret 
    // or rely on a custom session revocation table depending on the Supabase setup.
    // We will just do a standard sign out for now as a placeholder for session revocation.
    alert('This feature requires backend revocation logic. Logging out current session instead.');
    await useAuthStore.getState().signOut();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32 pt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Shield className="text-indigo-600" size={32} /> Security & Privacy
        </h1>
        <p className="text-slate-500 mt-2">Manage your account security, multi-factor authentication, and active sessions.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          {message}
        </div>
      )}

      {/* Password Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Password</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>
          </div>
          <button 
            onClick={handlePasswordReset}
            disabled={loading}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Multi-Factor Authentication */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <Smartphone size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Two-Factor Authentication (2FA)
              {mfaLevel === 'aal2' ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold uppercase tracking-wide">Enabled</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-bold uppercase tracking-wide">Disabled</span>
              )}
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md">
              Add an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            {hasPermission('platform.admin') && mfaLevel !== 'aal2' && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-800">
                  <strong className="font-bold">Admin Policy Warning:</strong> Platform administrators are strongly encouraged to enable MFA. Some sensitive operations may be restricted until MFA is enabled.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-6">
              <button className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors text-sm">
                {mfaLevel === 'aal2' ? 'Manage 2FA Settings' : 'Set up Authenticator App'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
            <Monitor size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">Active Sessions</h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md mb-6">
              These devices are currently logged into your account. Review any unfamiliar devices.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <Monitor className="text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Windows • Chrome</p>
                    <p className="text-xs text-emerald-600 font-medium">Active now</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <PhoneIcon className="text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">iPhone • Safari</p>
                    <p className="text-xs text-slate-500">Last active: 2 hours ago</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                  Revoke
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <button 
                onClick={handleSignOutOtherSessions}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm shadow-sm"
              >
                <LogOut size={16} /> Sign out all other sessions
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
