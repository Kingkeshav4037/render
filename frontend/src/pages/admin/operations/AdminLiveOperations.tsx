import React from 'react';
import { Activity, RefreshCcw, Search, Filter, AlertTriangle } from 'lucide-react';

export const AdminLiveOperations = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600" /> Live Operations
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time booking modifications, refunds, and support interventions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Intervention Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Intervention Queue</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <Filter size={14} /> Critical Only
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { id: 'NSL-8201', user: 'James W.', issue: 'Requested refund for weather cancellation', provider: 'Lofoten Tours', status: 'PENDING', urgency: 'HIGH' },
              { id: 'NSL-8199', user: 'Sarah J.', issue: 'Payment sync failure', provider: 'System', status: 'IN_PROGRESS', urgency: 'MEDIUM' },
            ].map((ticket, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center">
                    <span className={`w-2 h-2 rounded-full ${ticket.urgency === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                    <span className="font-bold text-slate-900">{ticket.issue}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
                </div>
                <div className="text-sm text-slate-600 mb-4">
                  User: {ticket.user} • Provider: {ticket.provider}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded shadow-sm hover:bg-blue-700 transition-colors">
                    Take Action
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors">
                    Assign to Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Operations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-4">System Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <RefreshCcw size={18} className="text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Sync Payment Gateway</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <RefreshCcw size={18} className="text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Refresh Provider Caches</span>
                </div>
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>Warning:</strong> Manual interventions bypass automated RLS constraints. Actions are permanently logged in the audit trail.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
