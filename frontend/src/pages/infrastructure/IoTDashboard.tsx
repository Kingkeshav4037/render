import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Server, Activity, Radio, Cpu, Smartphone, Wifi, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IoTDashboard = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-polar-indigo/20 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <Container className="relative z-10 max-w-6xl">
        <div className="mb-16 border-b border-polar-indigo/30 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-polar-indigo mb-6"
          >
            <Server className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">Telemetry Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4"
          >
            Device <span className="text-polar-indigo italic">Fleet.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light max-w-2xl"
          >
            Manage and monitor millions of connected sensors across the Smart Norway ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Total Devices</div>
            <div className="text-5xl font-display font-bold mb-2">2.4M</div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-4">
              <div className="bg-polar-indigo w-[98%] h-full" />
            </div>
            <div className="text-sm text-gray-400 flex items-center justify-between">
              <span>Online: 2.35M</span>
              <span className="text-amber-400">Offline: 50k</span>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
            <Radio className="absolute -bottom-4 -right-4 w-32 h-32 text-polar-indigo/10" />
            <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Throughput</div>
            <div className="text-5xl font-display font-bold mb-2">12.4k</div>
            <div className="text-sm text-gray-400">Events per second</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl bg-gradient-to-br from-polar-indigo/20 to-transparent">
            <div className="text-polar-indigo font-bold uppercase tracking-wider text-xs mb-2">Critical Alerts</div>
            <div className="text-5xl font-display font-bold mb-2">14</div>
            <div className="text-sm text-gray-300">Requires immediate attention</div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-display font-bold flex items-center gap-3">
              <Activity className="w-6 h-6 text-polar-indigo" /> Active Clusters
            </h3>
            <div className="relative">
              <input type="text" placeholder="Search device ID..." className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-polar-indigo transition-colors" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-white/5">
                <tr>
                  <th className="pb-4">Device ID / Type</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Last Ping</th>
                  <th className="pb-4">Firmware</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'SENS-OSL-001', type: 'Air Quality', loc: 'Oslo Sentrum', status: 'Online', ping: '2s ago', fw: 'v2.4.1' },
                  { id: 'CAM-BRG-142', type: 'Traffic Vision', loc: 'Bergen E39', status: 'Online', ping: '5s ago', fw: 'v1.9.0' },
                  { id: 'WTR-TRM-089', type: 'Fjord Salinity', loc: 'Tromsøysundet', status: 'Offline', ping: '4h ago', fw: 'v2.1.0' },
                  { id: 'GRID-SVA-012', type: 'Power Relay', loc: 'Longyearbyen', status: 'Warning', ping: '12s ago', fw: 'v3.0.0-beta' },
                ].map(dev => (
                  <tr key={dev.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4">
                      <div className="font-bold text-white">{dev.id}</div>
                      <div className="text-xs text-gray-500">{dev.type}</div>
                    </td>
                    <td className="py-4 text-gray-400">{dev.loc}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        dev.status === 'Online' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 
                        dev.status === 'Offline' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      }`}>
                        {dev.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{dev.ping}</td>
                    <td className="py-4 text-gray-500 font-mono text-xs">{dev.fw}</td>
                    <td className="py-4 text-right">
                      <Link to={`/infrastructure/iot/${dev.id}`} className="text-polar-indigo font-bold text-xs hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
};
