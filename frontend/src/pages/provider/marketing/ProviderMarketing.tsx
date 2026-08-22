import React from 'react';
import { Tag, TrendingUp, Megaphone, Plus, Percent } from 'lucide-react';

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Winter Early Bird', type: 'Discount Code', status: 'ACTIVE', performance: '142 Uses', end: 'Dec 1, 2026' },
  { id: 2, name: 'Northern Lights Package', type: 'Bundle', status: 'SCHEDULED', performance: '-', end: 'Mar 31, 2027' },
  { id: 3, name: 'Summer Flash Sale', type: 'Percentage Off', status: 'ENDED', performance: '89 Uses', end: 'Aug 31, 2026' },
];

export const ProviderMarketing = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing & Promotions</h1>
          <p className="text-slate-500 text-sm mt-1">Boost your visibility and create compelling offers.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {/* Hero Recommendation */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 blur-[100px] opacity-30 rounded-full"></div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold mb-3 uppercase tracking-wider text-xs">
            <TrendingUp size={16} /> Smart Recommendation
          </div>
          <h2 className="text-2xl font-bold mb-2">Boost your low-season occupancy</h2>
          <p className="text-slate-400 text-sm">
            Historically, November sees a 30% dip in bookings for your category. Creating a targeted 15% discount for domestic travelers can help bridge the gap.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Create Offer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Campaigns List */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">Your Campaigns</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Campaign Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Performance</th>
                  <th className="px-6 py-4 font-semibold">Ends</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CAMPAIGNS.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{campaign.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Tag size={12} /> {campaign.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                        ${campaign.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : ''}
                        ${campaign.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' : ''}
                        ${campaign.status === 'ENDED' ? 'bg-slate-100 text-slate-600' : ''}
                      `}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {campaign.performance}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {campaign.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visibility Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Megaphone size={20} className="text-blue-600" /> Platform Visibility
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">Featured Placement</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Available</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Appear at the top of search results in your region for 7 days.</p>
                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Learn More
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1">
                    <Percent size={14} /> Partner Program
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Joined</span>
                </div>
                <p className="text-xs text-slate-500">You are enrolled in the Norway SmartLife Preferred Partner program.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
