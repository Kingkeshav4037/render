import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/layout/Container';
import { ArrowLeft, Zap, Battery, Clock, MapPin, Check, QrCode, AlertTriangle, Navigation, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/shared/SEO';
import { openStreetMap } from '../../lib/openStreetMap';
import { toast } from 'sonner';

const EV_STATIONS = [
  { 
    id: '1', 
    name: 'IONITY Oslo', 
    kw: 350, 
    available: 4, 
    total: 6, 
    location: 'E18, 0250 Oslo', 
    network: 'IONITY', 
    type: 'Ultra-Fast Charger',
    lat: 59.9139,
    lon: 10.7522,
    connectors: ['CCS2 (350 kW)', 'Type 2 (22 kW)'],
    operator: 'IONITY Network Norway',
    pricing: '7.80 NOK / kWh (Standard)',
    amenities: ['24/7 Restroom', 'Convenience Store', 'Coffee Bar', 'Illuminated Canopy']
  },
  { 
    id: '2', 
    name: 'Recharge Bergen', 
    kw: 150, 
    available: 1, 
    total: 8, 
    location: 'Danmarksplass, 5054 Bergen', 
    network: 'Recharge', 
    type: 'Rapid DC Hub',
    lat: 60.3780,
    lon: 5.3340,
    connectors: ['CCS2 (150 kW)', 'CHAdeMO (50 kW)'],
    operator: 'Recharge Infra AS',
    pricing: '6.90 NOK / kWh',
    amenities: ['Shopping Mall', 'Fast Food', 'Air & Water Station']
  },
  { 
    id: '3', 
    name: 'Mer Tromsø', 
    kw: 50, 
    available: 2, 
    total: 2, 
    location: 'Storgata 25, 9008 Tromsø', 
    network: 'Mer Norway', 
    type: 'Fast Charger',
    lat: 69.6492,
    lon: 18.9553,
    connectors: ['CCS2 (50 kW)', 'Type 2 (22 kW)'],
    operator: 'Mer Norway AS',
    pricing: '6.50 NOK / kWh',
    amenities: ['City Center', 'Restaurants', 'Heated Waiting Lounge']
  },
  { 
    id: '4', 
    name: 'Tesla Supercharger Dombås', 
    kw: 250, 
    available: 12, 
    total: 16, 
    location: 'E6 / Dovrefjell, 2660 Dombås', 
    network: 'Tesla / Open', 
    type: 'V3 Supercharger',
    lat: 62.0747,
    lon: 9.1258,
    connectors: ['CCS2 (250 kW)'],
    operator: 'Tesla Norway',
    pricing: '5.40 NOK / kWh (Non-Tesla: 6.80 NOK)',
    amenities: ['Troll Park', 'Diner', 'Grocery Store', 'EV Lounge']
  },
];

export const EVStationDetails = () => {
  const { id } = useParams();
  const [charging, setCharging] = useState(false);
  const [progress, setProgress] = useState(0);

  const station = EV_STATIONS.find(s => s.id === id) || (id ? null : EV_STATIONS[0]);

  if (!station) {
    return (
      <div className="min-h-screen bg-deep-night text-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <Zap className="w-16 h-16 text-glacier-mint/50 mb-4" />
        <h1 className="text-3xl font-bold font-display mb-4">Charging Station Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">The requested EV charging station could not be found in our national registry.</p>
        <Link to="/mobility/ev" className="bg-glacier-mint text-deep-night px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-xl shadow-lg">
          Browse Charging Network
        </Link>
      </div>
    );
  }

  const startCharge = () => {
    setCharging(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 1;
      setProgress(curr);
      if (curr >= 100) clearInterval(interval);
    }, 100);
  };

  const handleAddToTrip = () => {
    try {
      const savedStr = localStorage.getItem('nsl_user_saved_trips');
      const saved = savedStr ? JSON.parse(savedStr) : [];
      const newSavedItem = {
        id: `ev-${station.id}-${Date.now()}`,
        name: station.name,
        title: `${station.name} (${station.kw} kW Fast Charger)`,
        dates: 'Next Planned Drive',
        nights: 1,
        activities: 1,
        status: 'Upcoming',
        image: '/images/ev_charger.jpg',
        weather: '12°C',
        summary: `EV charging stop at ${station.location}. Operator: ${station.operator}.`,
        destinations: [station.location]
      };
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify([newSavedItem, ...saved]));
      toast.success(`${station.name} added to your travel itinerary!`);
    } catch (e) {
      toast.error('Could not save to trips.');
    }
  };

  const directionsUrl = openStreetMap.getDirectionsUrl({
    destination: { lat: station.lat, lng: station.lon }
  });

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 font-sans relative overflow-hidden">
      <SEO 
        title={`${station.name} (${station.kw} kW) | EV Fast-Charging Norway`}
        description={`Live status, connector standards, and power ratings for ${station.name} in ${station.location}.`}
      />

      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glacier-mint/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Link to="/mobility/ev" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to EV Network
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToTrip}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add to Trip
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-glacier-mint text-deep-night hover:bg-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Navigation size={14} /> Open Navigation
            </a>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="bg-glacier-mint/20 text-glacier-mint px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex mb-4">
                {station.type}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{station.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-glacier-mint"/> {station.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-glacier-mint"/> {station.kw} kW Max Output</span>
                <span>•</span>
                <span className="text-white font-medium">{station.operator}</span>
              </div>
            </div>

            {/* Dynamic Status Box */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 text-center min-w-[220px]">
              <div className="text-xs font-bold text-glacier-mint uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Telemetry
              </div>
              <div className="text-4xl font-display font-bold text-green-400 mb-1">{station.available} / {station.total}</div>
              <div className="text-xs text-gray-400">Available Fast Ports</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Static & Terminal Breakdown */}
            <div className="space-y-8">
              
              {/* Static Infrastructure Specs */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-glacier-mint" /> Infrastructure Specifications
                </h3>
                <div className="bg-black/20 rounded-2xl p-5 border border-white/5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Supported Connectors:</span>
                    <span className="font-bold text-white">{station.connectors.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max DC Output:</span>
                    <span className="font-bold text-glacier-mint">{station.kw} kW (800V Architecture)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pricing / Tariffs:</span>
                    <span className="font-bold text-white">{station.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Station Operator:</span>
                    <span className="font-bold text-white">{station.operator}</span>
                  </div>
                </div>
              </div>

              {/* Terminal Status */}
              <div>
                <h3 className="text-xl font-bold mb-4">Terminal Status</h3>
                <div className="space-y-3">
                  {Array.from({ length: station.total }).map((_, i) => {
                    const terminal = i + 1;
                    const isAvailable = terminal <= station.available;
                    return (
                      <div key={terminal} className="flex justify-between items-center p-3.5 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold font-mono text-xs text-glacier-mint">
                            0{terminal}
                          </div>
                          <div>
                            <div className="font-bold text-sm">CCS2 High-Power</div>
                            <div className="text-[11px] text-gray-400">Up to {station.kw} kW</div>
                          </div>
                        </div>
                        {isAvailable ? (
                          <span className="text-green-400 font-bold text-xs flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-md">
                            <Check className="w-3.5 h-3.5" /> Available
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md">
                            <Zap className="w-3.5 h-3.5" /> In Use
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: Remote Charging Simulation */}
            <div>
              <h3 className="text-xl font-bold mb-4">Smart App Remote Charging</h3>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!charging ? (
                    <motion.div 
                      key="auth"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <div className="w-28 h-28 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                        <QrCode className="w-14 h-14 text-glacier-mint" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Ready to Charge</h3>
                      <p className="text-gray-400 text-sm mb-6">Scan QR code at Terminal 01 or launch instant session below</p>
                      
                      <button 
                        onClick={startCharge}
                        className="w-full bg-glacier-mint text-deep-night font-bold py-3.5 rounded-xl hover:bg-white transition-all shadow-lg cursor-pointer text-sm uppercase tracking-wider"
                      >
                        Start Session (AutoCharge / App)
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="charging"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-glacier-mint uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse" /> Active High-Power Session
                        </span>
                        <span className="font-mono text-xs text-gray-400">Terminal 01</span>
                      </div>

                      <div className="text-center py-4">
                        <div className="text-5xl font-display font-bold text-white mb-1">{progress}%</div>
                        <div className="text-xs text-gray-400">Estimated 18 mins remaining</div>
                      </div>

                      <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-glacier-mint h-full transition-all duration-300 rounded-full" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
                        <div className="bg-white/5 p-3 rounded-xl">
                          <div className="text-[11px] text-gray-400 mb-1">Energy Delivered</div>
                          <div className="font-bold text-base">{((progress / 100) * 65).toFixed(1)} kWh</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                          <div className="text-[11px] text-gray-400 mb-1">Charging Power</div>
                          <div className="font-bold text-base text-glacier-mint">{station.kw} kW</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setCharging(false); setProgress(0); }}
                        className="w-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer text-xs uppercase tracking-wider"
                      >
                        Stop Charging Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default EVStationDetails;
