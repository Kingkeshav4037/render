import React from 'react';
import { CheckCircle2, XCircle, FileText, Download, Building2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProviderVerification = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <Link to="/admin/providers" className="text-sm font-semibold text-blue-600 hover:underline">
          &larr; Back to Providers
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Queue</h1>
        <p className="text-slate-500 text-sm mt-1">Review and approve new provider applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Queue List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="font-bold text-slate-900">Pending Review (3)</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {[
              { id: 'prv-103', name: 'Arctic Fjord Safaris', category: 'Activities', date: '2 hours ago', active: true },
              { id: 'prv-105', name: 'Oslo Boutique Hotel', category: 'Stays', date: '5 hours ago', active: false },
              { id: 'prv-106', name: 'Bergen Bike Rentals', category: 'Transport', date: 'Yesterday', active: false },
            ].map(req => (
              <button key={req.id} className={`w-full text-left p-4 transition-colors ${req.active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-slate-900">{req.name}</div>
                  <span className="text-xs text-slate-500 font-mono">{req.date}</span>
                </div>
                <div className="text-xs font-semibold text-slate-600">{req.category} • {req.id}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={24} className="text-blue-600" /> Arctic Fjord Safaris
                </h2>
                <div className="text-sm text-slate-500 mt-1">Submitted 2 hours ago by Thomas Nilsen</div>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Needs Review</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Business Name</div>
                <div className="text-sm font-semibold text-slate-900">Arctic Fjord Safaris AS</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Org. Number (Brønnøysund)</div>
                <div className="text-sm font-semibold text-slate-900 font-mono">987 654 321</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</div>
                <div className="text-sm font-semibold text-slate-900">Activities & Tours</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email</div>
                <div className="text-sm font-semibold text-slate-900">thomas@arcticfjordsafaris.no</div>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-4">Submitted Documents</h3>
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Certificate of Incorporation</div>
                    <div className="text-xs text-slate-500">firmaattest.pdf (1.2 MB)</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                  <Download size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Liability Insurance Policy</div>
                    <div className="text-xs text-slate-500">insurance_2026.pdf (3.4 MB)</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                <CheckCircle2 size={18} /> Approve & Activate
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                <XCircle size={18} /> Reject Application
              </button>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertTriangle size={16} className="shrink-0" />
              <span>Approving will grant this business access to the Provider Portal and allow them to publish listings.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
