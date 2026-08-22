import React, { useState } from 'react';
import { Settings, Users, CreditCard, Shield, UserPlus, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const MOCK_TEAM = [
  { id: 1, name: 'Sarah Jenkins', role: 'Owner', email: 'sarah@example.com' },
  { id: 2, name: 'Marcus Voller', role: 'Manager', email: 'marcus@example.com' },
  { id: 3, name: 'Emma Thompson', role: 'Support Staff', email: 'emma@example.com' },
];

export const ProviderSettings = () => {
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your business profile, team, and security.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'payouts', label: 'Payout Methods', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security & Audit', icon: Shield },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal w-full text-left
                    ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {activeTab === 'general' && (
            <div className="animate-in fade-in space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900">General Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                  <input type="text" defaultValue="Lofoten Eco-Adventures AS" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Registration Number (Org.nr)</label>
                  <input type="text" defaultValue="912 345 678" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input type="email" defaultValue={profile?.email || 'contact@lofoteneco.no'} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="animate-in fade-in space-y-6 max-w-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                  <UserPlus size={16} /> Invite Member
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {MOCK_TEAM.map(member => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">{member.role}</span>
                      <button className="text-slate-400 hover:text-slate-600 font-semibold text-sm">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900">Security & Audit Log</h2>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Enable
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Login successful', time: 'Today, 09:41 AM', ip: '192.168.1.1' },
                    { action: 'Listing "Lofoten Panoramic" updated', time: 'Yesterday, 14:22 PM', ip: '192.168.1.1' },
                    { action: 'Payout method added', time: 'Oct 15, 11:05 AM', ip: '192.168.1.1' },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{log.action}</div>
                        <div className="text-xs text-slate-500">{log.time}</div>
                      </div>
                      <div className="text-xs font-mono text-slate-400">{log.ip}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 text-red-600 font-semibold text-sm hover:text-red-700 transition-colors">
                  <LogOut size={16} /> Sign out of all other sessions
                </button>
              </div>
            </div>
          )}

          {/* Placeholders for Payouts and Notifications */}
          {['payouts', 'notifications'].includes(activeTab) && (
             <div className="animate-in fade-in flex items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
             <div className="text-center max-w-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-2 capitalize">{activeTab} Setup</h3>
               <p className="text-slate-500 text-sm">Configure your {activeTab} preferences. This module is part of the operational integration phase.</p>
             </div>
           </div>
          )}

        </div>
      </div>
    </div>
  );
};
