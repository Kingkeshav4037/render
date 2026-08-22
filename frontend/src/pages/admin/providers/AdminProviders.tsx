import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, FileCheck2, Building2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PROVIDERS = [
  { id: 'prv-101', name: 'Lofoten Eco-Adventures AS', category: 'Activities', status: 'VERIFIED', listings: 12, revenue: 'NOK 1.2M' },
  { id: 'prv-102', name: 'Aurora Cabins Tromsø', category: 'Stays', status: 'VERIFIED', listings: 4, revenue: 'NOK 450K' },
  { id: 'prv-103', name: 'Arctic Fjord Safaris', category: 'Activities', status: 'PENDING_REVIEW', listings: 1, revenue: 'NOK 0' },
  { id: 'prv-104', name: 'Nordic Transport Solutions', category: 'Transport', status: 'SUSPENDED', listings: 0, revenue: 'NOK 85K' },
];

export const AdminProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Provider Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage B2B partners, verifications, and compliance.</p>
        </div>
        <Link to="/admin/providers/verification" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <FileCheck2 size={16} /> Verification Queue <span className="bg-white/20 px-2 py-0.5 rounded text-xs">1</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search providers or Org.nr..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm">
            <Filter size={16} /> Category
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Business Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Active Listings</th>
                <th className="px-6 py-4 font-semibold text-right">YTD Revenue</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PROVIDERS.map(prv => (
                <tr key={prv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer">{prv.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{prv.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-700">{prv.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${prv.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${prv.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' : ''}
                      ${prv.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {prv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{prv.listings}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600">{prv.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
