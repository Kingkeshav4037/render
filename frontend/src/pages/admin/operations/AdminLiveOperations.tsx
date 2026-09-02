import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, RefreshCw, Search, Filter, AlertTriangle, 
  ShieldCheck, Server, Zap, Database, CreditCard, 
  Wifi, CloudSun, CheckCircle2, XCircle, Clock, 
  ChevronRight, ArrowUpRight, Bug, Terminal, User, Globe
} from 'lucide-react';
import { monitoringService, TelemetryLog, SystemHealthSummary } from '../../../services/monitoringService';
import { toast } from 'sonner';

export const AdminLiveOperations: React.FC = () => {
  const [healthSummary, setHealthSummary] = useState<SystemHealthSummary | null>(null);
  const [probing, setProbing] = useState(false);
  const [logs, setLogs] = useState<TelemetryLog[]>(() => monitoringService.getLogs());
  const [selectedLog, setSelectedLog] = useState<TelemetryLog | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'ERROR' | 'API' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshTelemetry = useCallback(async () => {
    setProbing(true);
    try {
      const summary = await monitoringService.checkSystemHealth();
      setHealthSummary(summary);
      setLogs(monitoringService.getLogs());
    } catch (err) {
      console.error('Failed to probe telemetry:', err);
    } finally {
      setProbing(false);
    }
  }, []);

  useEffect(() => {
    refreshTelemetry();
  }, [refreshTelemetry]);

  const handleResolveError = (id: string) => {
    monitoringService.markErrorResolved(id);
    setLogs(monitoringService.getLogs());
    if (selectedLog && selectedLog.id === id) {
      setSelectedLog(null);
    }
    toast.success('Error marked as resolved in monitoring stream.');
  };

  const handleClearAllLogs = () => {
    monitoringService.clearLogs();
    setLogs([]);
    setSelectedLog(null);
    toast.success('All telemetry logs cleared.');
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = 
      filterType === 'ALL' ? true :
      filterType === 'CRITICAL' ? log.severity === 'CRITICAL' :
      filterType === 'ERROR' ? log.type === 'ERROR' :
      filterType === 'API' ? log.type === 'API_PERFORMANCE' : true;

    const matchesSearch = 
      searchQuery === '' ||
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.pathname && log.pathname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.url && log.url.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const errorCount = logs.filter(l => l.type === 'ERROR' && !l.resolved).length;
  const criticalCount = logs.filter(l => l.severity === 'CRITICAL' && !l.resolved).length;
  const slowApiCount = logs.filter(l => l.type === 'API_PERFORMANCE' && l.data?.isSlow).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* ── 1. Header & Live Probe Trigger ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Health Active
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Uptime: {healthSummary?.uptimePercent || 99.98}%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 font-display">
            <Activity className="text-blue-600 w-7 h-7" /> Live Operations & Error Monitoring
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time anomaly detection, API performance telemetry, and instant route error inspection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshTelemetry}
            disabled={probing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={probing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
            <span>{probing ? 'Probing Services...' : 'Probe Health'}</span>
          </button>
          <button
            onClick={handleClearAllLogs}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Clear Stream
          </button>
        </div>
      </div>

      {/* ── 2. System Service Health Grid ───────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Server size={14} className="text-slate-500" /> Infrastructure & Integration Health Probes
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {healthSummary?.services.map((svc) => (
            <div 
              key={svc.key}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                  {svc.key === 'database' && <Database size={16} className="text-blue-600" />}
                  {svc.key === 'edge_functions' && <Zap size={16} className="text-amber-600" />}
                  {svc.key === 'payment_gateway' && <CreditCard size={16} className="text-purple-600" />}
                  {svc.key === 'realtime' && <Wifi size={16} className="text-emerald-600" />}
                  {svc.key === 'weather_api' && <CloudSun size={16} className="text-cyan-600" />}
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  svc.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  svc.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {svc.status}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 truncate" title={svc.name}>{svc.name}</div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-medium">
                  <span>Latency</span>
                  <span className="font-bold text-slate-700">{svc.latencyMs} ms</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{svc.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Overview Metric Badges ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Errors</span>
            <div className={`text-2xl font-black mt-0.5 ${errorCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {errorCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <Bug size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Severity</span>
            <div className={`text-2xl font-black mt-0.5 ${criticalCount > 0 ? 'text-purple-600' : 'text-slate-800'}`}>
              {criticalCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slow API Calls</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {slowApiCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg API Latency</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {healthSummary?.avgLatencyMs || 36} ms
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* ── 4. Live Error Stream & Anomaly Inspector ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/75 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bug size={18} className="text-red-500" />
              Live Telemetry Stream
            </h2>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {filteredLogs.length} events
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Pills */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
              {(['ALL', 'ERROR', 'CRITICAL', 'API'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === tab ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search route or error..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Failed Route / Source</th>
                <th className="py-3 px-4">Error Message / Event</th>
                <th className="py-3 px-4">User Role</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck size={32} className="text-emerald-500" />
                      <span className="font-bold text-slate-700">Zero Unresolved Errors in Stream</span>
                      <span className="text-[11px] text-slate-400">All routes, transactions, and APIs are operating normally.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${log.resolved ? 'opacity-50 bg-slate-50/30' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        log.severity === 'CRITICAL' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        log.severity === 'ERROR' ? 'bg-red-100 text-red-800 border border-red-200' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {log.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 max-w-[180px] truncate">
                      {log.pathname || log.url || '/unknown'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{log.name}</div>
                      {log.data?.stack && (
                        <div className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                          {log.data.stack.split('\n')[0]}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono">
                        {log.userRole || 'GUEST'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('en-GB')}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        {!log.resolved && (
                          <button
                            onClick={() => handleResolveError(log.id)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Error & Stack Trace Inspector Modal ──────────────────────────── */}
      {selectedLog && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Error details inspector"
          data-testid="error-inspector-modal"
          onClick={() => setSelectedLog(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800">
                    {selectedLog.severity}
                  </span>
                  <span className="font-mono text-xs text-blue-600 font-bold">
                    {selectedLog.pathname || selectedLog.url || 'Route unknown'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedLog.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Context Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Timestamp</span>
                  <span className="font-mono text-slate-800">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">User Role</span>
                  <span className="font-mono text-slate-800">{selectedLog.userRole || 'GUEST'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Full URL</span>
                  <span className="font-mono text-blue-600 break-all">{selectedLog.url || selectedLog.pathname}</span>
                </div>
              </div>

              {/* Call Stack */}
              {selectedLog.data?.stack && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Terminal size={14} className="text-slate-500" /> Stack Trace
                  </h4>
                  <pre className="p-4 bg-slate-950 text-rose-300 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800 max-h-48 leading-relaxed">
                    {selectedLog.data.stack}
                  </pre>
                </div>
              )}

              {/* Breadcrumbs Trail */}
              {selectedLog.breadcrumbs && selectedLog.breadcrumbs.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-500" /> Recent User Action Trail (Breadcrumbs)
                  </h4>
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {selectedLog.breadcrumbs.map((bc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
                        <span className="text-slate-400">[{new Date(bc.timestamp).toLocaleTimeString()}]</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-700">{bc.category}</span>
                        <span className="truncate">{bc.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-mono">ID: {selectedLog.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                {!selectedLog.resolved && (
                  <button
                    onClick={() => handleResolveError(selectedLog.id)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
