import React from 'react';
import { 
  Users, Building2, Calendar, DollarSign, Activity, ActivitySquare, 
  AlertTriangle, AlertCircle, Info, ChevronRight 
} from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time status of Norway SmartLife operations.</p>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Users', value: '125,482', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Providers', value: '2,843', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Bookings', value: '18,492', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Revenue', value: '14.8M', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Listings', value: '9,284', icon: ActivitySquare, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Wildlife Tracking', value: '35', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Platform Health', value: '99.98%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors cursor-default">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Command Center - Alerts */}
        <div className="xl:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Command Center</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                  <AlertCircle size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-0.5">Urgent</div>
                  <div className="text-sm font-bold text-slate-900">3 Payment Issues</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                  <AlertTriangle size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">High</div>
                  <div className="text-sm font-bold text-slate-900">7 Provider Verification Requests</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Info size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Medium</div>
                  <div className="text-sm font-bold text-slate-900">18 Content Moderation Items</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                  <Info size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-0.5">Info</div>
                  <div className="text-sm font-bold text-slate-900">42 New Reviews</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>
            
          </div>
        </div>

        {/* Live Operations */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Live Operations Feed</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[400px] flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-2">
              {['All', 'Bookings', 'IoT', 'System', 'Providers'].map(filter => (
                <button key={filter} className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50">
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[
                { time: 'Just now', event: 'New booking', details: 'NSL-8201 for Lofoten Cabin (4 nights)', type: 'booking' },
                { time: '2m ago', event: 'IoT Alert', details: 'EV Station #402 offline in Geiranger.', type: 'iot' },
                { time: '5m ago', event: 'Provider Approved', details: 'Nordic Adventures AS verified by Sarah J.', type: 'provider' },
                { time: '12m ago', event: 'Content Flagged', review: 'User reported review #82412 for inappropriate language.', type: 'system' },
                { time: '28m ago', event: 'Payment Refunded', details: 'NOK 1,200 refunded for NSL-8185 via Stripe.', type: 'booking' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-xs text-slate-400 font-mono w-16 pt-1 shrink-0">{log.time}</div>
                  <div className="flex-1 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full 
                        ${log.type === 'booking' ? 'bg-purple-500' : ''}
                        ${log.type === 'iot' ? 'bg-red-500' : ''}
                        ${log.type === 'provider' ? 'bg-emerald-500' : ''}
                        ${log.type === 'system' ? 'bg-amber-500' : ''}
                      `}></span>
                      <span className="font-bold text-slate-900 text-sm">{log.event}</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1 pl-4">
                      {log.details || log.review}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
