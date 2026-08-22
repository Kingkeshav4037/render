import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download } from 'lucide-react';

export const ProviderAnalytics = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Deep dive into your performance metrics and booking trends.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none shadow-sm">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Views', value: '45.2k', trend: '+12%', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Conversion Rate', value: '3.8%', trend: '+0.4%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unique Guests', value: '1,204', trend: '+15%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Lead Time', value: '42 days', trend: '-2 days', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mock Chart: Revenue Over Time */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 pb-2 relative">
            {/* Background grid lines mock */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-slate-100 w-full h-0"></div>
              <div className="border-t border-slate-100 w-full h-0"></div>
              <div className="border-t border-slate-100 w-full h-0"></div>
              <div className="border-t border-slate-100 w-full h-0"></div>
            </div>
            
            {[30, 45, 25, 60, 80, 55, 90, 75, 40, 65, 85, 100].map((h, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t relative group z-10" style={{ height: `${h}%` }}>
                <div className="absolute inset-0 bg-blue-600 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Mock Chart: Demographics or Listing Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-6">Top Performing Listings</h2>
          <div className="space-y-6">
            {[
              { name: 'Lofoten Panoramic Cabin', rev: 'NOK 245,000', pct: 85 },
              { name: 'Midnight Sun Kayaking', rev: 'NOK 120,000', pct: 45 },
              { name: 'Fjord Sightseeing Ferry', rev: 'NOK 87,000', pct: 30 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-slate-500 font-medium">{item.rev}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
