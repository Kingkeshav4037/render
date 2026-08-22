import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, AlertCircle, Search, Filter } from 'lucide-react';

const MOCK_PAGES = [
  { id: 1, name: 'Wildlife', path: '/wildlife', status: 'NEEDS_ATTENTION', route: true, component: true, db: true, api: true, content: true, mobile: false, seo: false },
  { id: 2, name: 'Wildlife Details', path: '/wildlife/:id', status: 'PRODUCTION_READY', route: true, component: true, db: true, api: true, content: true, mobile: true, seo: true },
  { id: 3, name: 'Aurora Tracker', path: '/aurora', status: 'PRODUCTION_READY', route: true, component: true, db: true, api: true, content: true, mobile: true, seo: true },
  { id: 4, name: 'Smart Ferry', path: '/mobility/ferry', status: 'QA', route: true, component: true, db: true, api: true, content: true, mobile: true, seo: false },
  { id: 5, name: 'Provider Marketing', path: '/provider/marketing', status: 'PRODUCTION_READY', route: true, component: true, db: true, api: true, content: true, mobile: true, seo: true },
  { id: 6, name: 'Admin Bookings', path: '/admin/bookings', status: 'IN_DEVELOPMENT', route: true, component: false, db: false, api: false, content: false, mobile: false, seo: false },
];

export const AdminPageRegistry = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Page Registry</h1>
          <p className="text-slate-500 text-sm mt-1">Zero-Neglect tracking across all frontend routes.</p>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Pages', val: '214' },
          { label: 'Implemented', val: '201' },
          { label: 'Data Connected', val: '184' },
          { label: 'QA Passed', val: '162' },
          { label: 'Prod Ready', val: '148' },
          { label: 'Needs Attention', val: '53', highlight: true },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border shadow-sm ${stat.highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
            <div className={`text-xs font-semibold ${stat.highlight ? 'text-amber-700' : 'text-slate-500'} mb-1`}>{stat.label}</div>
            <div className={`text-xl font-bold ${stat.highlight ? 'text-amber-900' : 'text-slate-900'}`}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search pages or routes..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Page / Route</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 text-center">Route</th>
                <th className="px-4 py-4 text-center">Comp</th>
                <th className="px-4 py-4 text-center">DB/API</th>
                <th className="px-4 py-4 text-center">Content</th>
                <th className="px-4 py-4 text-center">Mobile</th>
                <th className="px-4 py-4 text-center">SEO</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PAGES.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(page => (
                <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{page.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{page.path}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${page.status === 'PRODUCTION_READY' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${page.status === 'NEEDS_ATTENTION' ? 'bg-amber-100 text-amber-800' : ''}
                      ${page.status === 'QA' ? 'bg-blue-100 text-blue-800' : ''}
                      ${page.status === 'IN_DEVELOPMENT' ? 'bg-slate-100 text-slate-600' : ''}
                    `}>
                      {page.status.replace('_', ' ')}
                    </span>
                  </td>
                  {[page.route, page.component, page.db, page.content, page.mobile, page.seo].map((check, idx) => (
                    <td key={idx} className="px-4 py-4 text-center">
                      {check ? (
                        <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-red-300 mx-auto" />
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-700">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Zero Neglect Alert Example */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-amber-900 text-sm">Zero-Neglect Warning: Wildlife Page</h3>
          <p className="text-sm text-amber-800 mt-1">
            The <strong>Wildlife</strong> page is missing Mobile QA and SEO metadata. It cannot be marked as Production Ready until these are resolved.
          </p>
        </div>
      </div>

    </div>
  );
};
