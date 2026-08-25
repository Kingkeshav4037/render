import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Loader2, Search, Filter, Shield, Clock, FileText, X, RefreshCw, Eye } from 'lucide-react';

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  const { data: logs, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-audit-logs', searchTerm, actionFilter, resourceFilter],
    queryFn: async () => {
      let query = (supabase as any)
        .from('audit_logs')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
        
      if (actionFilter !== 'ALL') {
        query = query.eq('action', actionFilter);
      }
      if (resourceFilter !== 'ALL') {
        query = query.eq('resource_type', resourceFilter);
      }
      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%,resource_id.ilike.%${searchTerm}%`);
      }
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return (data || []) as any[];
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="text-blue-600" /> Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Immutable record of administrative actions.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
          Refresh Logs
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search action or resource ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="ALL">All Actions</option>
              <option value="UPDATE_ROLE">UPDATE_ROLE</option>
              <option value="UPDATE_USER_STATUS">UPDATE_USER_STATUS</option>
              <option value="PUBLISH_CONTENT">PUBLISH_CONTENT</option>
              <option value="DELETE_CONTENT">DELETE_CONTENT</option>
              <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
              <option value="UPDATE_ORDER">UPDATE_ORDER</option>
            </select>

            <select
              value={resourceFilter}
              onChange={e => setResourceFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="ALL">All Resources</option>
              <option value="PROFILE">PROFILE</option>
              <option value="LOCATION">LOCATION</option>
              <option value="ORDER">ORDER</option>
              <option value="PRODUCT">PRODUCT</option>
              <option value="SETTINGS">SETTINGS</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm font-semibold">Loading secure audit trail...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource Target</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>{new Date(log.created_at).toLocaleString('en-GB')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-xs">{log.profiles?.full_name || 'System Admin'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.profiles?.email || 'system@smartlife.no'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        log.action?.includes('DELETE') ? 'bg-red-50 text-red-700 border border-red-200' :
                        log.action?.includes('ROLE') ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        log.action?.includes('SETTINGS') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-900 font-mono font-bold">{log.resource_type}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">{log.resource_id}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="View audit metadata"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {logs?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <FileText size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-semibold">No audit log records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Metadata Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield size={18} className="text-blue-600" /> Audit Record Details
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Audit Record ID:</span>
                <span className="font-mono text-slate-900">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Action:</span>
                <span className="font-bold text-blue-700">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Target Resource:</span>
                <span className="font-mono text-slate-900">{selectedLog.resource_type} ({selectedLog.resource_id})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Timestamp:</span>
                <span className="text-slate-700">{new Date(selectedLog.created_at).toISOString()}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Payload Metadata:</span>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto font-mono text-[11px] max-h-48">
                  {JSON.stringify(selectedLog.details || selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


