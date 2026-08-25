import React, { useState, useEffect } from 'react';
import { Settings, Shield, Globe, Database, CreditCard, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [requireMfa, setRequireMfa] = useState<boolean>(() => {
    const saved = localStorage.getItem('nsl_admin_require_mfa');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [sessionTimeout, setSessionTimeout] = useState<string>(() => {
    return localStorage.getItem('nsl_admin_session_timeout') || '30 Minutes';
  });

  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nsl_admin_maintenance_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [aiTelemetry, setAiTelemetry] = useState<boolean>(() => {
    const saved = localStorage.getItem('nsl_admin_ai_telemetry');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = () => {
    localStorage.setItem('nsl_admin_require_mfa', JSON.stringify(requireMfa));
    localStorage.setItem('nsl_admin_session_timeout', sessionTimeout);
    localStorage.setItem('nsl_admin_maintenance_mode', JSON.stringify(maintenanceMode));
    localStorage.setItem('nsl_admin_ai_telemetry', JSON.stringify(aiTelemetry));
    
    setSavedSuccess(true);
    toast.success('System configuration saved successfully');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="text-blue-600" /> System Settings & Operations
          </h1>
          <p className="text-slate-500 text-sm mt-1">Global platform configuration, security policies, and environment flags.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          {savedSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {savedSuccess ? 'Settings Saved' : 'Save Configurations'}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Shield className="text-slate-500" size={18} />
            <h2 className="font-bold text-slate-900">Security & Access Policies</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Require MFA for Admins</div>
                <div className="text-xs text-slate-500">Enforce Multi-Factor Authentication (TOTP) for all ADMIN and SUPER_ADMIN accounts.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={requireMfa}
                  onChange={(e) => {
                    setRequireMfa(e.target.checked);
                    toast.info(`Admin MFA policy ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Session Timeout</div>
                <div className="text-xs text-slate-500">Idle inactivity threshold before automatic administrative logout.</div>
              </div>
              <select 
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  toast.info(`Session timeout set to ${e.target.value}`);
                }}
                className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="15 Minutes">15 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="1 Hour">1 Hour</option>
                <option value="4 Hours">4 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Globe className="text-slate-500" size={18} />
            <h2 className="font-bold text-slate-900">Platform Global Configuration</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Platform Maintenance Mode</div>
                <div className="text-xs text-slate-500">Disables non-admin checkout and shows friendly maintenance notice.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={maintenanceMode}
                  onChange={(e) => {
                    setMaintenanceMode(e.target.checked);
                    if (e.target.checked) {
                      toast.warning('Platform Maintenance Mode activated');
                    } else {
                      toast.success('Platform Maintenance Mode deactivated');
                    }
                  }}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <div className="font-semibold text-slate-900 text-sm">AI Route Recommendation Telemetry</div>
                <div className="text-xs text-slate-500">Allow Gemini AI engine to optimize multi-day Nordic itineraries.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={aiTelemetry}
                  onChange={(e) => {
                    setAiTelemetry(e.target.checked);
                    toast.info(`AI engine telemetry ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
