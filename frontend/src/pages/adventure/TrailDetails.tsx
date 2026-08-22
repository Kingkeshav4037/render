import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Map, Mountain, Clock, TrendingUp, AlertTriangle, ShieldCheck, ArrowLeft, Navigation, MapPin } from 'lucide-react';

export const TrailDetails = () => {
  const { id } = useParams();
  
  // Dummy data based on Trolltunga
  const trail = {
    name: 'Trolltunga',
    description: 'Norwegian wilderness above the fjords.',
    difficulty: 'Hard',
    distance: '27 km',
    duration: '10–12 hrs',
    elevation: '1,100 m',
    best_season: 'Jun–Sep',
    image: '/images/trolltunga_1786936111320.jpg'
  };

  return (
    <div className="min-h-screen bg-nordic-sage text-white pb-24">
      {/* Full-screen Hero */}
      <div className="relative h-screen">
        <CinematicBackground 
          imageUrl={trail.image}
          overlayOpacity={0.5}
          theme="nordicSage"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-32">
          <Container>
            <Link to="/trails" className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit">
              <ArrowLeft className="w-5 h-5" /> Back to Trails
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-display font-bold text-white mb-6 drop-shadow-2xl"
            >
              {trail.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl text-gray-200 font-light max-w-3xl drop-shadow-xl"
            >
              {trail.description}
            </motion.p>
          </Container>
        </div>
        
        {/* Information Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-xl border-t border-white/20"
        >
          <Container>
            <div className="flex flex-wrap justify-between items-center py-6 gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Difficulty</span>
                <span className="text-xl font-bold text-red-400 flex items-center gap-2"><TrendingUp className="w-5 h-5"/> {trail.difficulty}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Distance</span>
                <span className="text-xl font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-gray-400"/> {trail.distance}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                <span className="text-xl font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400"/> {trail.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Elevation</span>
                <span className="text-xl font-bold text-white flex items-center gap-2"><Mountain className="w-5 h-5 text-gray-400"/> +{trail.elevation}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Best Season</span>
                <span className="text-xl font-bold text-white">{trail.best_season}</span>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>

      <Container className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* Trail Safety */}
            <div className="bg-red-900/30 border border-red-500/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-3 rounded-xl text-red-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Check Conditions Before You Go</h3>
                  <p className="text-red-200 mb-6">Current weather warning: Heavy rainfall expected in the afternoon. Trail surfaces may be slippery. Proper hiking boots and waterproof layers are mandatory.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Avalanche Risk</span>
                      <span className="font-bold text-white">Level 1 (Low)</span>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Trail Status</span>
                      <span className="font-bold text-green-400">Open</span>
                    </div>
                  </div>
                  
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                    View Detailed Safety Report
                  </button>
                </div>
              </div>
            </div>

            {/* Elevation Profile */}
            <div>
              <h3 className="text-3xl font-display font-bold mb-6">Elevation Profile</h3>
              <div className="glass-panel rounded-3xl p-8">
                <div className="h-[300px] relative w-full flex items-end overflow-hidden pb-8">
                  {/* SVG Elevation Chart */}
                  <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="elevationGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-nordic-sage)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--color-nordic-sage)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      viewport={{ once: true }}
                      d="M0,50 L0,45 L10,35 L20,38 L30,25 L40,15 L50,10 L60,18 L70,20 L80,12 L90,25 L100,50 Z" 
                      fill="url(#elevationGrad)"
                      stroke="var(--color-nordic-sage)" 
                      strokeWidth="0.5"
                    />
                  </svg>
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
                    <div className="w-full border-t border-white/50 border-dashed" />
                    <div className="w-full border-t border-white/50 border-dashed" />
                    <div className="w-full border-t border-white/50 border-dashed" />
                    <div className="w-full border-t border-white/50 border-dashed" />
                  </div>
                  
                  {/* X Axis Labels */}
                  <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 px-2 font-mono">
                    <span>0 km</span>
                    <span>14 km</span>
                    <span>27 km</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="flex flex-col gap-8">
            {/* Interactive Map Placeholder */}
            <div className="glass-panel rounded-3xl overflow-hidden h-[400px] flex flex-col relative">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
               <div className="absolute inset-0 bg-nordic-sage/20 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-nordic-sage" /> Map Loading...
                 </div>
               </div>
               
               <div className="mt-auto p-4 relative z-10 bg-gradient-to-t from-black/80 to-transparent pt-12">
                 <h4 className="font-bold text-lg text-white mb-2">Trail Route</h4>
                 <ul className="text-sm text-gray-300 flex flex-col gap-2">
                   <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-nordic-sage" /> Starting point: Skjeggedal</li>
                   <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> 3 Viewpoints</li>
                   <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /> 2 Emergency points</li>
                 </ul>
               </div>
            </div>

            {/* Equipment Required */}
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-nordic-sage" /> Required Equipment
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Sturdy hiking boots (mandatory)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Wind and waterproof outerwear</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Warm layers (wool or fleece)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Headlamp with extra batteries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">First aid kit and map/compass</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
