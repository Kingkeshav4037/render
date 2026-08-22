import React from 'react';
import { BarChart3, TrendingUp, Search as SearchIcon, ArrowUpRight } from 'lucide-react';

export const AdminAnalytics = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">High-level view of platform performance.</p>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm">
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'New Users', value: '4,201', trend: '+12%' },
          { label: 'Active Users', value: '82,492', trend: '+5%' },
          { label: 'Conversion Rate', value: '3.2%', trend: '+0.4%' },
          { label: 'Gross Booking Value', value: 'NOK 4.2M', trend: '+18%' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500">{stat.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-sm font-bold text-emerald-600 flex items-center">
                <ArrowUpRight size={14} /> {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Analytics */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <SearchIcon size={18} className="text-blue-600" /> Search Analytics
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Queries (Converting)</h3>
              <div className="space-y-3">
                {[
                  { query: 'Norway northern lights', searches: '8,420' },
                  { query: 'Oslo hotel', searches: '6,820' },
                  { query: 'Whale safari', searches: '4,201' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-900">"{item.query}"</span>
                    <span className="font-mono text-slate-500">{item.searches}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Zero-Result Searches</h3>
              <p className="text-xs text-slate-500 mb-3">These searches returned no results, indicating gaps in our inventory.</p>
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                {[
                  { query: 'Arctic helicopter dinner', searches: '1,284' },
                  { query: 'Tromso submarine tour', searches: '890' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-900">"{item.query}"</span>
                    <span className="font-mono text-red-600 font-bold">{item.searches}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destination Analytics Mock */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600" /> Destination Analytics
            </h2>
          </div>
          
          <div className="space-y-4">
             {[
               { dest: 'Lofoten Islands', views: '240k', conversion: '4.2%' },
               { dest: 'Bergen', views: '180k', conversion: '1.8%' },
               { dest: 'Tromsø', views: '150k', conversion: '5.4%' },
               { dest: 'Geirangerfjord', views: '120k', conversion: '3.1%' },
             ].map((item, idx) => (
               <div key={idx} className="p-4 border border-slate-100 rounded-lg">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-slate-900">{item.dest}</span>
                   <span className="text-xs font-mono text-slate-500">{item.views} views</span>
                 </div>
                 <div className="flex items-center gap-4 text-sm">
                   <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full" style={{ width: `${parseFloat(item.conversion) * 10}%` }}></div>
                   </div>
                   <span className="font-bold text-slate-700 w-12 text-right">{item.conversion}</span>
                 </div>
                 {item.dest === 'Bergen' && (
                   <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded inline-block">High traffic, low conversion. Needs optimization.</p>
                 )}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
