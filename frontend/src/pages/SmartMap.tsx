import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../components/layout/Container';
import { Search, Map as MapIcon, ChevronLeft, ChevronRight, X, Navigation, CloudLightning, ShieldAlert, Zap, Ship, Tent, Coffee, Home, ChevronDown, Compass, Eye, Activity, MapPin } from 'lucide-react';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { mapService, MapEntity } from '../services/mapService';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: <MapIcon className="w-4 h-4" /> },
  { id: 'DESTINATION', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
  { id: 'HOTEL', label: 'Hotels', icon: <Home className="w-4 h-4" /> },
  { id: 'RESTAURANT', label: 'Restaurants', icon: <Coffee className="w-4 h-4" /> },
  { id: 'TRAIL', label: 'Trails', icon: <Tent className="w-4 h-4" /> },
  { id: 'ACTIVITY', label: 'Activities', icon: <Activity className="w-4 h-4" /> },
  { id: 'EV', label: 'EV Charging', icon: <Zap className="w-4 h-4" /> },
  { id: 'FERRY', label: 'Ferries', icon: <Ship className="w-4 h-4" /> },
  { id: 'WILDLIFE', label: 'Wildlife', icon: <Eye className="w-4 h-4" /> },
  { id: 'AURORA', label: 'Aurora', icon: <CloudLightning className="w-4 h-4" /> },
  { id: 'SAFETY', label: 'Safety', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'EVENT', label: 'Events', icon: <Compass className="w-4 h-4" /> },
];

const getMarkerVisuals = (category: string, isActive: boolean) => {
  const baseClasses = "flex items-center justify-center rounded-sm transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg";
  const sizeClasses = isActive ? "w-10 h-10 z-50 scale-125" : "w-8 h-8 z-10 hover:scale-110";
  
  switch (category) {
    case 'DESTINATION': return { className: `${baseClasses} ${sizeClasses} bg-purple-500/80 text-white rounded-full`, content: <MapPin className="w-4 h-4" /> };
    case 'HOTEL': return { className: `${baseClasses} ${sizeClasses} bg-blue-500/80 text-white rotate-45`, content: <div className="-rotate-45 font-bold text-xs">◇</div> };
    case 'RESTAURANT': return { className: `${baseClasses} ${sizeClasses} bg-orange-500/80 text-white rotate-45`, content: <div className="-rotate-45 font-bold text-xs">◆</div> };
    case 'TRAIL': return { className: `${baseClasses} ${sizeClasses} bg-green-500/80 text-white clip-triangle`, content: <div className="font-bold text-xs mt-1">▲</div> };
    case 'ACTIVITY': return { className: `${baseClasses} ${sizeClasses} bg-yellow-500/80 text-white rounded-full`, content: <Activity className="w-4 h-4" /> };
    case 'EV': return { className: `${baseClasses} ${sizeClasses} bg-glacier-mint/90 text-midnight rounded-full`, content: <Zap className="w-4 h-4" /> };
    case 'FERRY': return { className: `${baseClasses} ${sizeClasses} bg-ocean-steel/90 text-white rounded-full`, content: <div className="font-bold text-xs">◉</div> };
    case 'WILDLIFE': return { className: `${baseClasses} ${sizeClasses} bg-emerald-600/90 text-white rounded-full`, content: <Eye className="w-4 h-4" /> };
    case 'AURORA': return { className: `${baseClasses} ${sizeClasses} bg-aurora-violet/90 text-white rounded-full animate-pulse`, content: <div className="font-bold text-xs">✦</div> };
    case 'SAFETY': return { className: `${baseClasses} ${sizeClasses} bg-red-500/90 text-white rounded-full animate-bounce`, content: <div className="font-bold text-xs">!</div> };
    case 'EVENT': return { className: `${baseClasses} ${sizeClasses} bg-pink-500/90 text-white rounded-full`, content: <Compass className="w-4 h-4" /> };
    default: return { className: `${baseClasses} ${sizeClasses} bg-gray-500/80 text-white rounded-full`, content: <div className="font-bold text-xs">?</div> };
  }
};

const SmartMap = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<MapEntity | null>(null);
  const [mapPoints, setMapPoints] = useState<MapEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    mapService.getUnifiedMapPoints()
      .then(data => {
        setMapPoints(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const filteredPoints = mapPoints.filter(p => {
    if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate position as percentage for the map
  const getMapPosition = (lat: number, lng: number) => {
    // Basic projection of Norway (Lat 58-71, Lng 4-32)
    const minLat = 55, maxLat = 75;
    const minLng = 4, maxLng = 35;
    
    // Y is inverted since map top is lower y (higher lat)
    const y = 100 - (((lat - minLat) / (maxLat - minLat)) * 100);
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="relative w-full h-screen bg-deep-night text-white overflow-hidden font-sans">
      {/* Fake Map Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-tr from-polar-indigo/30 via-deep-night/80 to-transparent mix-blend-overlay" />
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* SVG Markers Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <AsyncStateWrapper
          isLoading={loading}
          error={error}
          data={filteredPoints}
          emptyMessage="No locations found for this filter."
          errorMessage="Unable to load map points."
          skeleton={<div className="w-12 h-12 border-4 border-white/20 border-t-polar-indigo rounded-full animate-spin"></div>}
        >
          {(data) => (
            <>
              {data.map((point) => {
                const visuals = getMarkerVisuals(point.category, selectedPoint?.id === point.id);
                const pos = getMapPosition(point.latitude, point.longitude);
                return (
                  <div 
                    key={point.id}
                    className="absolute pointer-events-auto cursor-pointer flex flex-col items-center group"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => {
                      setSelectedPoint(point);
                      if (!isPanelOpen && window.innerWidth < 1024) {
                        // Keep panel logic minimal for now
                      }
                    }}
                  >
                    <div className={visuals.className}>
                      {visuals.content}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {point.name}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </AsyncStateWrapper>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-12 h-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-2xl"
          >
            {isPanelOpen ? <ChevronLeft className="w-6 h-6 text-polar-indigo" /> : <ChevronRight className="w-6 h-6 text-polar-indigo" />}
          </button>
        </div>
        
        <div className="pointer-events-auto bg-black/50 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse" />
            <span className="text-sm font-bold tracking-wider uppercase text-gray-300">Live Telemetry</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="w-8 h-8 rounded-full bg-polar-indigo/20 flex items-center justify-center border border-polar-indigo/50">
            <span className="text-xs font-bold text-polar-indigo">JD</span>
          </div>
        </div>
      </div>

      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-[400px] bg-black/60 backdrop-blur-2xl border-r border-white/10 z-40 flex flex-col pt-24"
          >
            <div className="px-8 pb-6 border-b border-white/10">
              <h1 className="text-3xl font-display font-bold mb-2">Norway at your fingertips.</h1>
              <p className="text-sm text-gray-400">Discover places, plan journeys, and monitor infrastructure in real time.</p>
              
              <div className="relative mt-6">
                <input 
                  type="text" 
                  placeholder="Ask SmartLife anything..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-polar-indigo focus:ring-1 focus:ring-polar-indigo transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Explore Layers</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-sm font-bold ${
                      activeCategory === cat.id 
                        ? 'bg-polar-indigo/20 border-polar-indigo text-white' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={activeCategory === cat.id ? 'text-polar-indigo' : ''}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Live Status</h3>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CloudLightning className="w-5 h-5 text-aurora-violet" />
                    <div>
                      <div className="font-bold text-sm">Aurora Activity</div>
                      <div className="text-xs text-gray-400">High probability tonight</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-aurora-violet flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-aurora-violet animate-pulse"/> Live</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-bold text-sm">Road Safety</div>
                      <div className="text-xs text-gray-400">1 active warning</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-500">Updated 2m ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Detail Drawer (Slide up from bottom) */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div 
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${!isPanelOpen && 'md:ml-0'} transition-all`}
            style={{ marginLeft: isPanelOpen && window.innerWidth >= 1024 ? '200px' : '0' }}
          >
            <div 
              className="w-full md:w-2/5 h-48 md:h-auto bg-cover bg-center relative"
              style={{ backgroundImage: `url(${selectedPoint.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=800'})` }}
            >
               <button 
                 onClick={() => setSelectedPoint(null)}
                 className="absolute top-4 left-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center md:hidden border border-white/20"
               >
                 <X className="w-4 h-4 text-white" />
               </button>
               <div className="absolute bottom-4 left-4 bg-polar-indigo text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {selectedPoint.category}
               </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col relative">
              <button 
                onClick={() => setSelectedPoint(null)}
                className="absolute top-6 right-6 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full hidden md:flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <div className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-display font-bold">{selectedPoint.name}</h2>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1"><span className="text-amber-400">★</span> {selectedPoint.rating}</span>
                <span>•</span>
                <span>{selectedPoint.price}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-glacier-mint"><span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse"/> {selectedPoint.status}</span>
                {selectedPoint.extra && (
                  <>
                    <span>•</span>
                    <span className="text-white font-bold">{selectedPoint.extra}</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Distance</div>
                  <div className="font-bold">2.4 km away</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Weather</div>
                  <div className="font-bold text-glacier-cyan">8°C, Clear</div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button className="flex-1 bg-polar-indigo hover:bg-polar-indigo/80 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" /> Navigate
                </button>
                <button className="flex-1 bg-white hover:bg-gray-200 text-deep-night font-bold py-3 rounded-xl transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default SmartMap;
