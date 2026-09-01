import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Ship, Clock, Users, Activity, Wind, Navigation } from 'lucide-react';
import { SEO } from '../../components/shared/SEO';

export const SmartFerry = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-28 sm:pt-32 font-sans relative overflow-hidden">
      <SEO 
        title="Electric Ferries & Zero-Emission Fjord Transit | Norway SmartLife"
        description="Real-time tracking, live departure schedules, marine weather conditions, and zero-emission fleet telemetry for electric ferries across Norway's fjords."
        canonicalUrl="/mobility/ferry"
        ogType="website"
        keywords="Norway electric ferries, fjord ferry schedule, zero emission transit Norway, Sognefjord ferry, Flåm Gudvangen ferry, Lavik Oppedal"
      />
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ocean-steel/10 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-deep-night/80 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-6xl">
        <div className="mb-12 sm:mb-16 border-b border-ocean-steel/20 pb-8 sm:pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-cyan-400 mb-4 sm:mb-6"
          >
            <Ship className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">Smart Mobility Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-3 sm:mb-4 tracking-tight"
          >
            Electric <span className="text-cyan-400 italic">Ferries.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-gray-400 font-light max-w-2xl"
          >
            Live tracking and real-time telemetry of zero-emission vessels navigating Norway's fjords.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">Active Fleet Status</h2>
                <span className="text-xs font-bold text-green-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> 86 Vessels Live</span>
              </div>
              
              <div className="divide-y divide-white/5">
                {[
                  { name: 'MF Ampere', route: 'Lavik - Oppedal', speed: '14 kts', eta: '5m', capacity: 45, status: 'On Route' },
                  { name: 'MS Richard With', route: 'Bergen - Kirkenes', speed: '16 kts', eta: 'On Time', capacity: 82, status: 'Cruising' },
                  { name: 'Legacy of The Fjords', route: 'Flåm - Gudvangen', speed: '12 kts', eta: '12m', capacity: 95, status: 'On Route' },
                ].map(ferry => (
                  <div key={ferry.name} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-ocean-steel/20 border border-ocean-steel/50 flex items-center justify-center group-hover:bg-ocean-steel/40 transition-colors">
                        <Ship className="w-6 h-6 text-ocean-steel" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{ferry.name}</h3>
                        <div className="text-sm text-gray-400">{ferry.route}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Speed</div>
                        <div className="font-bold">{ferry.speed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Capacity</div>
                        <div className="font-bold">{ferry.capacity}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">ETA</div>
                        <div className="font-bold text-green-400">{ferry.eta}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Wind className="w-4 h-4 text-ocean-steel" /> Marine Weather
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-400">Sognefjord</span>
                  <span className="font-bold text-green-400">Calm, 2m/s</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-400">Hardangerfjord</span>
                  <span className="font-bold text-amber-400">Choppy, 8m/s</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-400">Lofoten Basin</span>
                  <span className="font-bold text-red-400">Gale, 18m/s</span>
                </div>
              </div>
            </div>

            <div className="bg-ocean-steel/10 border border-ocean-steel/30 p-6 rounded-3xl relative overflow-hidden">
              <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-ocean-steel/10" />
              <h3 className="text-sm font-bold text-ocean-steel uppercase tracking-wider mb-2">Fleet Analytics</h3>
              <div className="text-4xl font-display font-bold mb-1">14.2t</div>
              <div className="text-gray-400 text-sm mb-6">CO₂ saved today by electric operations</div>
              
              <button className="w-full bg-ocean-steel text-deep-night font-bold py-3 rounded-xl hover:bg-white transition-colors">
                View Detailed Report
              </button>
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
};
