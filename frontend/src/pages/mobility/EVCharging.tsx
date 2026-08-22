import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Zap, MapPin, Battery, Activity, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';

export const EVCharging = () => {
  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glacier-mint/10 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-deep-night/80 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-6xl">
        <div className="mb-16 border-b border-glacier-mint/20 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-glacier-mint mb-6"
          >
            <Zap className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">Smart Mobility</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4"
          >
            Power your <span className="text-glacier-mint italic">journey.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light max-w-2xl"
          >
            Real-time availability and analytics for the world's most advanced EV charging network.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Search & List */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find a charging station..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-glacier-mint focus:ring-1 focus:ring-glacier-mint transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {[
                { id: '1', name: 'IONITY Oslo', kw: 350, available: 4, total: 6, distance: '1.2 km' },
                { id: '2', name: 'Recharge Bergen', kw: 150, available: 1, total: 8, distance: '450 km' },
                { id: '3', name: 'Mer Tromsø', kw: 50, available: 2, total: 2, distance: '1200 km' },
              ].map(station => (
                <Link to={`/mobility/ev/${station.id}`} key={station.id}>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-glacier-mint/50 transition-all group mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{station.name}</h3>
                      <span className="bg-glacier-mint/20 text-glacier-mint text-xs font-bold px-2 py-1 rounded">
                        {station.kw} kW
                      </span>
                    </div>
                    <div className="flex justify-between items-end text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {station.distance}
                      </div>
                      <div className="flex items-center gap-2">
                        <Battery className={`w-4 h-4 ${station.available > 0 ? 'text-green-400' : 'text-red-500'}`} />
                        <span className="font-bold text-white">{station.available}/{station.total} available</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Map & Stats */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="h-[400px] bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden flex items-center justify-center">
              {/* Fake Map visualization */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600')] bg-cover bg-center opacity-30 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-tr from-glacier-mint/20 via-deep-night/80 to-transparent" />
              
              <div className="relative z-10 text-center">
                <Zap className="w-12 h-12 text-glacier-mint mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Interactive Map Layer (Placeholder)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Network Load</div>
                <div className="text-3xl font-display font-bold mb-2">42%</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-glacier-mint w-[42%] h-full" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Active Sessions</div>
                <div className="text-3xl font-display font-bold mb-2">1,204</div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" /> Peak hours
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Green Energy</div>
                <div className="text-3xl font-display font-bold mb-2 text-green-400">100%</div>
                <div className="text-xs text-gray-500">Hydro & Wind supplied</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
