import React, { useEffect, useState } from 'react';
import { Shield, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PermissionGuard } from '../../../components/auth/PermissionGuard';

export const AdminSecurityEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('security_events')
      .select('*, user:profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (error) {
      console.error('Failed to fetch security events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const getEventIcon = (type: string) => {
    if (type.includes('fail') || type.includes('denied') || type.includes('lockout')) {
      return <AlertTriangle className="text-red-500" size={16} />;
    }
    if (type.includes('success') || type.includes('granted')) {
      return <CheckCircle className="text-emerald-500" size={16} />;
    }
    return <Clock className="text-slate-400" size={16} />;
  };

  return (
    <PermissionGuard require="security.read">
      <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Shield className="text-indigo-600" size={32} /> Security Audit Log
            </h1>
            <p className="text-slate-500 mt-2">Monitor access events, permission changes, and potential security threats.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm">
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search events, users, or IP addresses..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full max-w-[200px]"></div></td>
                    </tr>
                  ))
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No security events logged yet.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                        {new Date(event.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.event_type)}
                          <span className="font-semibold text-slate-900 text-sm">{event.event_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {event.user ? (
                          <div>
                            <p className="text-sm font-bold text-slate-900">{event.user.full_name}</p>
                            <p className="text-xs text-slate-500">{event.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Anonymous / System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                        {event.ip_address || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {event.description}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <div className="mt-1 text-xs font-mono text-slate-400 bg-slate-100 p-2 rounded truncate max-w-xs">
                            {JSON.stringify(event.metadata)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};
