import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Leaf, Wind, Sun, Battery, Activity } from 'lucide-react';

export const Sustainability = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-900/40 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-6xl">
        <div className="mb-16 border-b border-green-500/20 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-green-400 mb-6"
          >
            <Leaf className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">Environmental Impact</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4"
          >
            Sustainable <span className="text-green-400 italic">Future.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light max-w-2xl"
          >
            Tracking Norway's progress towards a net-zero society.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
            <h3 className="text-2xl font-display font-bold mb-8">Carbon Emissions Reduction</h3>
            <div className="h-64 flex items-end gap-2">
              {/* Fake Bar Chart */}
              {[60, 55, 45, 40, 30, 25, 15, 10, 5, 2].map((val, i) => (
                <div key={i} className="flex-1 bg-green-400/20 hover:bg-green-400/40 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${val}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}M tons
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-bold uppercase mt-4 border-t border-white/10 pt-4">
              <span>2015</span>
              <span>2020</span>
              <span>2025 (Projected)</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Renewable Energy</div>
              <div className="text-5xl font-display font-bold mb-2 text-green-400">98%</div>
              <div className="text-sm text-gray-300">Of national grid powered by hydro and wind.</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">EV Market Share</div>
              <div className="text-5xl font-display font-bold mb-2 text-blue-400">82%</div>
              <div className="text-sm text-gray-300">Of all new cars sold in 2024.</div>
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
};
