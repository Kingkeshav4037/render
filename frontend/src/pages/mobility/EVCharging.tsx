import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { Zap, Battery, Search, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/shared/SEO';

const EV_STATIONS = [
  { id: '1', name: 'IONITY Oslo', kw: 350, available: 4, total: 6, location: 'E18, 0250 Oslo', network: 'IONITY', region: 'Eastern Norway', speed: 'Ultra-Fast' },
  { id: '2', name: 'Recharge Bergen', kw: 150, available: 1, total: 8, location: 'Danmarksplass, 5054 Bergen', network: 'Recharge', region: 'Fjord Norway', speed: 'Rapid DC' },
  { id: '3', name: 'Mer Tromsø', kw: 50, available: 2, total: 2, location: 'Storgata 25, 9008 Tromsø', network: 'Mer Norway', region: 'Northern Norway', speed: 'Fast' },
  { id: '4', name: 'Tesla Supercharger Dombås', kw: 250, available: 12, total: 16, location: 'E6 / Dovrefjell, 2660 Dombås', network: 'Tesla / Open', region: 'Eastern Norway', speed: 'Ultra-Fast' },
];

export const EVCharging = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState('ALL');

  const filteredStations = EV_STATIONS.filter(s => {
    const matchesSearch = !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.network.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpeed = selectedSpeed === 'ALL' || s.speed === selectedSpeed;

    return matchesSearch && matchesSpeed;
  });

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <SEO 
        title="Norway EV Fast-Charging Network | Norway SmartLife"
        description="Find high-speed EV charging stations across Norway. Real-time telemetry, 350 kW ultra-chargers, and complete Arctic corridor coverage."
      />

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
            Real-time availability and analytics for the world's most advanced EV fast-charging network.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Search & List */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find station, city, or operator (e.g. Oslo, Dombås, IONITY)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-glacier-mint focus:ring-1 focus:ring-glacier-mint transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="flex gap-2 pb-2">
              {['ALL', 'Ultra-Fast', 'Rapid DC', 'Fast'].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSelectedSpeed(speed)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSpeed === speed
                      ? 'bg-glacier-mint text-deep-night shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {speed === 'ALL' ? 'All Speeds' : speed}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredStations.length === 0 ? (
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
                  <Zap className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">No charging hubs match your search.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedSpeed('ALL'); }}
                    className="text-xs font-bold uppercase tracking-wider text-glacier-mint hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredStations.map(station => (
                  <Link to={`/mobility/ev/${station.id}`} key={station.id}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-glacier-mint/50 transition-all group mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-glacier-mint transition-colors">{station.name}</h3>
                          <span className="text-xs text-gray-400">{station.location}</span>
                        </div>
                        <span className="bg-glacier-mint/20 text-glacier-mint text-xs font-bold px-2.5 py-1 rounded-lg">
                          {station.kw} kW
                        </span>
                      </div>
                      <div className="flex justify-between items-end text-sm text-gray-400 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{station.network}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className={`w-4 h-4 ${station.available > 0 ? 'text-green-400' : 'text-red-500'}`} />
                          <span className="font-bold text-white text-xs">{station.available}/{station.total} available</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Network Status & Telemetry */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 text-glacier-mint">
                  <Activity className="w-6 h-6 animate-pulse" />
                  <h3 className="text-xl font-bold text-white">National EV Grid Status</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                  Live Telemetry
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Public Fast-Chargers</div>
                  <div className="text-3xl font-display font-bold text-white">24,850+</div>
                  <div className="text-[11px] text-green-400 mt-1">99.4% Uptime</div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ultra-Fast (&gt;150kW)</div>
                  <div className="text-3xl font-display font-bold text-glacier-mint">6,420</div>
                  <div className="text-[11px] text-gray-400 mt-1">Every 50km on E6/E39</div>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Norway boasts the world's densest fast-charging network with interoperable payment standards (AutoCharge, RFID, and contactless terminals). All public chargers are powered by 100% renewable hydroelectricity.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/infrastructure"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-glacier-mint hover:text-white transition-colors"
                >
                  View Full Infrastructure Command <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EVCharging;
