import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/layout/Container';
import { Activity, Radio, Database, Shield, Zap, Server, Bus, CloudLightning, ArrowUpRight } from 'lucide-react';
import { useRealtimeStore } from '../store/useRealtimeStore';

export const SmartNorway = () => {
  const { connectionStatus, alerts, evChargers, ferries } = useRealtimeStore();
  const [pulse, setPulse] = useState(false);

  // Simulate data heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-32 font-sans relative overflow-hidden selection:bg-northern-cyan/30">
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-northern-cyan/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-polar-indigo/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-northern-cyan mb-4">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="font-bold tracking-widest uppercase text-xs">National Telemetry</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold"
            >
              System <span className="text-northern-cyan">Status.</span>
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Database</span>
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Data Stream</span>
              <div className={`flex gap-1 ${pulse ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
                <div className="w-1 h-3 bg-northern-cyan rounded-full" />
                <div className="w-1 h-4 bg-northern-cyan rounded-full" />
                <div className="w-1 h-2 bg-northern-cyan rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Dashboard - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Realtime KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-24 h-24 text-northern-cyan" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">EV Infrastructure</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-display font-bold text-white">{Object.keys(evChargers).length || 1248}</span>
                    <span className="text-northern-cyan font-bold text-sm">Active Nodes</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                    <ArrowUpRight className="w-4 h-4" /> +12% vs last month
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Bus className="w-24 h-24 text-polar-indigo" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Transit Network</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-display font-bold text-white">{Object.keys(ferries).length || 86}</span>
                    <span className="text-polar-indigo font-bold text-sm">Vessels Live</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                    <ArrowUpRight className="w-4 h-4" /> 99.8% Punctuality
                  </div>
                </div>
              </div>
            </div>

            {/* Active Data Stream (Mock Terminal) */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 font-mono text-xs overflow-hidden h-64 relative flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 font-bold tracking-wider">POSTGRES_CHANGES_STREAM</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2 text-gray-400 flex flex-col-reverse">
                {/* Mock data lines */}
                <div className="flex gap-4 opacity-100">
                  <span className="text-northern-cyan shrink-0">[{new Date().toISOString().split('T')[1].substring(0,8)}]</span>
                  <span className="text-green-400 shrink-0">INSERT</span>
                  <span className="truncate">public.iot_telemetry (device_id: "oslo-hub-1", payload: &#123;temp: -2.4, status: "OK"&#125;)</span>
                </div>
                <div className="flex gap-4 opacity-80">
                  <span className="text-northern-cyan shrink-0">[{new Date(Date.now()-1200).toISOString().split('T')[1].substring(0,8)}]</span>
                  <span className="text-amber-400 shrink-0">UPDATE</span>
                  <span className="truncate">public.ferries (id: "f-89", lat: 60.1, lng: 5.2, speed: 18.4)</span>
                </div>
                <div className="flex gap-4 opacity-60">
                  <span className="text-northern-cyan shrink-0">[{new Date(Date.now()-2400).toISOString().split('T')[1].substring(0,8)}]</span>
                  <span className="text-green-400 shrink-0">INSERT</span>
                  <span className="truncate">public.weather_snapshots (location: "Tromsø", condition: "SNOW")</span>
                </div>
                <div className="flex gap-4 opacity-40">
                  <span className="text-northern-cyan shrink-0">[{new Date(Date.now()-3600).toISOString().split('T')[1].substring(0,8)}]</span>
                  <span className="text-green-400 shrink-0">INSERT</span>
                  <span className="truncate">public.ev_chargers (id: "ev-402", status: "CHARGING", kw: 150)</span>
                </div>
                <div className="flex gap-4 opacity-20">
                  <span className="text-northern-cyan shrink-0">[{new Date(Date.now()-4800).toISOString().split('T')[1].substring(0,8)}]</span>
                  <span className="text-red-400 shrink-0">DELETE</span>
                  <span className="truncate">public.temporary_locks (id: "lock-992")</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            
            {/* System Health */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4" /> System Health
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-white">API Gateway</span>
                    <span className="text-green-400">99.99%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-400 w-[99.99%] h-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-white">Supabase Realtime</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-400 w-full h-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-white">IoT Ingestion Hub</span>
                    <span className="text-amber-400">Degraded (14ms lag)</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 w-[85%] h-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Alerts */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Radio className="w-4 h-4" /> Active Alerts
              </h3>
              
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.slice(0,4).map((alert: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <div>
                        <div className="text-sm font-bold text-white">{alert.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{alert.message}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-amber-400" />
                      <div>
                        <div className="text-sm font-bold text-white">High Winds (E6 North)</div>
                        <div className="text-xs text-gray-400 mt-1">Crosswinds exceeding 20m/s. Cargo restrictions in place.</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-northern-cyan animate-pulse" />
                      <div>
                        <div className="text-sm font-bold text-white">Aurora Forecast Update</div>
                        <div className="text-xs text-gray-400 mt-1">KP Index risen to 5.3 in Tromsø region.</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};
