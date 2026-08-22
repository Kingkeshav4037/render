import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Zap, Ship, Bus, Wind, Droplets, Server, Activity, Leaf, ShieldCheck, ChevronRight } from 'lucide-react';

export const SmartCity = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-northern-cyan/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10">
        <div className="mb-16 border-b border-northern-cyan/20 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-northern-cyan mb-6"
          >
            <Activity className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">System Overview</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold mb-6"
          >
            A smarter <span className="text-northern-cyan italic">Norway.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light max-w-2xl"
          >
            Monitor the vital signs of the nation's infrastructure, mobility, and environmental impact in real-time.
          </motion.p>
        </div>

        {/* Live Metrics Hero */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          {[
            { label: 'EV Chargers', value: '1,248', icon: <Zap className="w-5 h-5 text-northern-cyan" /> },
            { label: 'Active Ferries', value: '86', icon: <Ship className="w-5 h-5 text-northern-cyan" /> },
            { label: 'Smart Devices', value: '12,450', icon: <Server className="w-5 h-5 text-northern-cyan" /> },
            { label: 'Renewable Energy', value: '78%', icon: <Wind className="w-5 h-5 text-northern-cyan" /> },
            { label: 'CO₂ Saved (Today)', value: '24.8K t', icon: <Leaf className="w-5 h-5 text-northern-cyan" /> },
          ].map((metric, idx) => (
            <motion.div 
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="bg-northern-cyan/5 border border-northern-cyan/20 p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-northern-cyan/10 transition-colors"
            >
              <div className="mb-4 bg-northern-cyan/10 p-3 rounded-full border border-northern-cyan/30">
                {metric.icon}
              </div>
              <div className="text-3xl font-display font-bold text-white mb-2">{metric.value}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mobility */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Bus className="w-6 h-6 text-northern-cyan" /> Mobility
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">EV Infrastructure</h3>
                  <p className="text-sm text-gray-400">Live charging network telemetry</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Smart Ferries</h3>
                  <p className="text-sm text-gray-400">Vessel tracking and capacity management</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Public Transport</h3>
                  <p className="text-sm text-gray-400">Bus and rail punctuality metrics</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-northern-cyan" /> Energy
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Hydropower Grid</h3>
                  <p className="text-sm text-gray-400">Reservoir levels and generation output</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Wind Farms</h3>
                  <p className="text-sm text-gray-400">Turbine efficiency and generation forecasts</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
            </div>
          </div>

          {/* Environment */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Droplets className="w-6 h-6 text-northern-cyan" /> Environment
              </h2>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-2">Updated 5m ago</span>
            </div>
            
            <div className="space-y-4">
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Air Quality</h3>
                  <p className="text-sm text-gray-400">Particulate monitoring across urban centers</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Water Systems</h3>
                  <p className="text-sm text-gray-400">Fjord salinity and temperature sensors</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-northern-cyan" /> Infrastructure
              </h2>
              <span className="text-xs font-bold text-northern-cyan flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-northern-cyan animate-pulse"/> Live Data Active</span>
            </div>
            
            <div className="space-y-4">
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">IoT Network</h3>
                  <p className="text-sm text-gray-400">Device health and signal strength</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
              <div className="group flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-northern-cyan/30 hover:bg-northern-cyan/5 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg mb-1">Smart Buildings</h3>
                  <p className="text-sm text-gray-400">Energy consumption and occupancy analytics</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-northern-cyan" />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
