import React from 'react';
import { AlertCircle, Link, Image as ImageIcon, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminDataQuality = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Quality Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Automatically detect missing content, broken links, and SEO gaps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Content Health Score', val: '92%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Missing Images', val: '14', icon: ImageIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Broken Links', val: '3', icon: Link, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Missing Meta Tags', val: '28', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{stat.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Missing Content Issues */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Missing Required Content
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { type: 'Destination', name: 'Svalbard', issue: 'Missing Hero Image' },
              { type: 'Activity', name: 'Fjord Kayaking', issue: 'Missing Coordinates' },
              { type: 'Provider', name: 'Arctic Tours AS', issue: 'Missing Description' },
              { type: 'Wildlife', name: 'Polar Bear', issue: 'Missing Conservation Status' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 flex justify-between items-center transition-colors">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.type}</div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                </div>
                <div className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  {item.issue}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical SEO & Links */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" /> Technical Issues
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { route: '/explore/tromso/activities/unknown', issue: '404 Broken Link from /explore/tromso', severity: 'HIGH' },
              { route: '/nature/wildlife/puffin', issue: 'Missing Canonical URL', severity: 'MEDIUM' },
              { route: '/planner/itinerary/1294', issue: 'Broken Image Link', severity: 'LOW' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-mono text-sm text-slate-900">{item.route}</div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded
                    ${item.severity === 'HIGH' ? 'bg-red-100 text-red-700' : ''}
                    ${item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : ''}
                    ${item.severity === 'LOW' ? 'bg-slate-100 text-slate-600' : ''}
                  `}>
                    {item.severity}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {item.issue}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
