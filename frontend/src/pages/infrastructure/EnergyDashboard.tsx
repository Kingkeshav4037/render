import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Zap, Wind, Waves, Activity, ArrowUpRight, ArrowDownRight, Battery } from 'lucide-react';

export const EnergyDashboard = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/10 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-deep-night/80 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(251,191,36,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <Container className="relative z-10 max-w-6xl">
        <div className="mb-16 border-b border-amber-400/20 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-amber-400 mb-6"
          >
            <Zap className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">National Grid</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4"
          >
            Energy <span className="text-amber-400 italic">Flow.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light max-w-2xl"
          >
            Monitor real-time power generation, distribution, and export across Norway's renewable energy network.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Output', value: '14.2 GW', change: '+2.4%', icon: <Zap className="w-5 h-5 text-amber-400"/> },
            { label: 'Hydro Generation', value: '11.8 GW', change: '+0.8%', icon: <Waves className="w-5 h-5 text-blue-400"/> },
            { label: 'Wind Generation', value: '2.1 GW', change: '+12.4%', icon: <Wind className="w-5 h-5 text-gray-400"/> },
            { label: 'Export (EU Grid)', value: '1.2 GW', change: '-4.2%', down: true, icon: <Activity className="w-5 h-5 text-green-400"/> },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-black/30 p-2 rounded-xl">{stat.icon}</div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.down ? 'text-red-400' : 'text-green-400'}`}>
                  {stat.down ? <ArrowDownRight className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            <h3 className="text-xl font-display font-bold mb-6">Grid Capacity Map</h3>
            <div className="aspect-video bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')] bg-cover bg-center opacity-30 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-deep-night/80 to-transparent mix-blend-overlay" />
              <div className="relative z-10 text-center text-gray-400">
                [ Map Layer: Power Transmission Lines ]
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-xl font-display font-bold mb-6">Active Facilities</h3>
              <div className="space-y-4">
                {[
                  { name: 'Tonstad Power Station', type: 'Hydro', status: '98% Cap', temp: '42°C' },
                  { name: 'Kvilldal Power Station', type: 'Hydro', status: '94% Cap', temp: '38°C' },
                  { name: 'Roan Wind Farm', type: 'Wind', status: '100% Cap', temp: '-2°C' },
                ].map(fac => (
                  <div key={fac.name} className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5">
                    <div>
                      <div className="font-bold text-white">{fac.name}</div>
                      <div className="text-xs text-gray-400">{fac.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400">{fac.status}</div>
                      <div className="text-xs text-gray-500">{fac.temp} operating temp</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
