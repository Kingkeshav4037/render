import React, { useState } from 'react';
import { Download, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePrivacy = () => {
  const [privacy, setPrivacy] = useState({
    marketing: false,
    personalization: true,
    analytics: true,
    aiPersonalization: true
  });

  const handleExport = () => {
    toast.info('Data export requested. You will receive an email shortly.');
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">Privacy Center</h2>
        <p className="text-gray-500">Control how your data is used across Norway SmartLife.</p>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Data Usage</h3>
        <div className="space-y-4">
          
          <label className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-all">
            <div className="max-w-md">
              <span className="font-bold text-navy-900 block mb-1">Marketing Communications</span>
              <span className="text-sm text-gray-500 block">Receive exclusive deals and seasonal offers via email.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${privacy.marketing ? 'bg-aurora-green' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy.marketing ? 'translate-x-6' : ''}`} />
            </div>
            <input type="checkbox" className="hidden" checked={privacy.marketing} onChange={(e) => setPrivacy(p => ({...p, marketing: e.target.checked}))} />
          </label>

          <label className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:shadow-sm transition-all">
            <div className="max-w-md">
              <span className="font-bold text-navy-900 block mb-1">AI Personalization</span>
              <span className="text-sm text-gray-500 block">Allow our AI assistant to use your trip history and preferences to curate better recommendations.</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${privacy.aiPersonalization ? 'bg-aurora-green' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy.aiPersonalization ? 'translate-x-6' : ''}`} />
            </div>
            <input type="checkbox" className="hidden" checked={privacy.aiPersonalization} onChange={(e) => setPrivacy(p => ({...p, aiPersonalization: e.target.checked}))} />
          </label>

        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Data Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-navy-900 mb-4">
              <Download size={18} />
            </div>
            <h4 className="font-bold text-navy-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Download a copy of your bookings, trips, and preferences.</p>
            <button onClick={handleExport} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-navy-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
              Request Export
            </button>
          </div>
          
          <div className="p-6 border border-red-100 rounded-2xl bg-white shadow-sm">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <Trash2 size={18} />
            </div>
            <h4 className="font-bold text-red-600 mb-2">Delete Account</h4>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Permanently remove your account and all associated data.</p>
            <button className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
