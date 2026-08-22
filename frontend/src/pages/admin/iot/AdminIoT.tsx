import React from 'react';
import { Zap, Battery, Wifi, Power, Settings2, Activity } from 'lucide-react';

const MOCK_DEVICES = [
  { id: 'EV-4021', type: 'Charger', location: 'Geiranger', status: 'ONLINE', usage: '82%', lastPing: '2s ago' },
  { id: 'EV-4022', type: 'Charger', location: 'Geiranger', status: 'OFFLINE', usage: '0%', lastPing: '4h 12m ago' },
  { id: 'LTH-101', type: 'Ferry Hub', location: 'Lofoten', status: 'ONLINE', usage: '45%', lastPing: '1s ago' },
  { id: 'SMR-892', type: 'Smart Road', location: 'Tromsø', status: 'MAINTENANCE', usage: 'N/A', lastPing: '12s ago' },
];

export const AdminIoT = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Zap className="text-emerald-500" /> IoT Control Center
        </h1>
        <p className="text-slate-500 text-sm mt-1">Monitor and control smart infrastructure across Norway.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Devices', val: '12,482', icon: Activity, color: 'text-emerald-600' },
          { label: 'Offline', val: '14', icon: Power, color: 'text-red-600' },
          { label: 'Network Health', val: '99.9%', icon: Wifi, color: 'text-blue-600' },
          { label: 'Avg Power Draw', val: '1.2 GW', icon: Battery, color: 'text-amber-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{stat.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
           <h2 className="font-bold text-slate-900">Device Fleet</h2>
           <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded shadow-sm">
             <Settings2 size={14} /> Manage Fleet
           </button>
        </div>
        
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Device ID</th>
              <th className="px-6 py-4 font-semibold">Type & Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Usage</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_DEVICES.map(dev => (
              <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{dev.id}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-700">{dev.type}</div>
                  <div className="text-xs text-slate-500">{dev.location}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${dev.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${dev.status === 'OFFLINE' ? 'bg-red-100 text-red-800' : ''}
                    ${dev.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' : ''}
                  `}>
                    {dev.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Ping: {dev.lastPing}</div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-600">{dev.usage}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-semibold text-sm hover:text-blue-800">Reboot</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
