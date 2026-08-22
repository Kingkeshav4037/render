import React from 'react';
import { Shield, Key, Smartphone, Laptop, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSecurity = () => {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Account Security</h2>
        <p className="text-gray-500">Manage your password, 2FA, and active sessions.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-navy-900 shrink-0">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1">Password</h3>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
          </div>
          <button onClick={() => toast.info('Password reset link sent to email')} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shrink-0">
            Change Password
          </button>
        </div>

        <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-aurora-green/20 rounded-full flex items-center justify-center text-navy-900 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Protected by authenticator app</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shrink-0">
            Manage 2FA
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
                <p className="font-bold text-navy-900 text-sm">MacBook Pro - Oslo, NO</p>
                <p className="text-xs text-gray-500">Current Session • Chrome</p>
              </div>
            </div>
            <span className="text-xs font-bold text-aurora-green bg-aurora-green/10 px-3 py-1 rounded-full">Active</span>
          </div>
          
          <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Smartphone size={20} className="text-gray-400" />
              <div>
                <p className="font-bold text-navy-900 text-sm">iPhone 14 Pro - Bergen, NO</p>
                <p className="text-xs text-gray-500">Last active 2 days ago • Safari</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-gray-100">
        <button onClick={() => toast.success('Signed out of all other devices')} className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 transition-colors">
          <LogOut size={16} /> Sign out of all devices
        </button>
      </div>
    </div>
  );
};
