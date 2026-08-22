// @ts-nocheck
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Loader2, Search, Filter } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';

export const AuditLogs = () => {
  const { hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  
  // RLS will block this query if the user lacks 'audit.read' permission in the DB
  // We use useQuery to fetch it safely.
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
        
      if (searchTerm) {
        query = query.ilike('action', `%${searchTerm}%`);
      }
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as any[];
    }
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Audit Logs</h1>
          <p className="text-gray-500">Immutable record of administrative actions.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search actions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs?.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.profiles?.full_name || 'System'}</div>
                  <div className="text-sm text-gray-500">{log.profiles?.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wider">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">{log.resource_type}</div>
                  <div className="text-xs text-gray-500 font-mono">{log.resource_id}</div>
                </td>
              </tr>
            ))}
            {logs?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

