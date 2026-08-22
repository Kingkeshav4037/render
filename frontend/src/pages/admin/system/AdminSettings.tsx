import React from 'react';
import { Settings, Shield, Globe, Database, CreditCard } from 'lucide-react';

export const AdminSettings = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Global platform configuration and environment variables.</p>
      </div>

      <div className="space-y-6">
        
        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Shield className="text-slate-500" size={18} />
            <h2 className="font-bold text-slate-900">Security & Access</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Require MFA for Admins</div>
                <div className="text-xs text-slate-500">Enforce Multi-Factor Authentication for all SUPER_ADMIN accounts.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Session Timeout</div>
                <div className="text-xs text-slate-500">Idle time before automatic logout.</div>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Globe className="text-slate-500" size={18} />
            <h2 className="font-bold text-slate-900">Global Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Platform Maintenance Mode</div>
                <div className="text-xs text-slate-500">Disables non-admin login and shows maintenance page.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
