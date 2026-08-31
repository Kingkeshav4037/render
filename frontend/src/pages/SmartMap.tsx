import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  Map as MapIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Navigation, 
  CloudLightning, 
  ShieldAlert, 
  Zap, 
  Ship, 
  Tent, 
  Coffee, 
  Home, 
  Compass, 
  Eye, 
  Activity, 
  MapPin,
  BookmarkPlus,
  RotateCcw
} from 'lucide-react';
import { mapService, MapEntity } from '../services/mapService';
import { openStreetMap } from '../lib/openStreetMap';
import { toast } from 'sonner';
import { SEO } from '../components/shared/SEO';

const CATEGORIES = [
  { id: 'ALL', label: 'All Layers', icon: <MapIcon className="w-4 h-4" /> },
  { id: 'DESTINATION', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
  { id: 'TRAIL', label: 'Hiking Trails', icon: <Tent className="w-4 h-4" /> },
  { id: 'EV', label: 'EV Fast Charging', icon: <Zap className="w-4 h-4" /> },
  { id: 'HOTEL', label: 'Stays & Cabins', icon: <Home className="w-4 h-4" /> },
  { id: 'RESTAURANT', label: 'Dining', icon: <Coffee className="w-4 h-4" /> },
  { id: 'ACTIVITY', label: 'Activities', icon: <Activity className="w-4 h-4" /> },
  { id: 'FERRY', label: 'Electric Ferries', icon: <Ship className="w-4 h-4" /> },
  { id: 'WILDLIFE', label: 'Wildlife Sightings', icon: <Eye className="w-4 h-4" /> },
  { id: 'AURORA', label: 'Aurora Viewing', icon: <CloudLightning className="w-4 h-4" /> },
  { id: 'SAFETY', label: 'Safety Shelters', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'EVENT', label: 'Events & Festivals', icon: <Compass className="w-4 h-4" /> },
];

const getCategoryMarkerConfig = (category: string) => {
  switch (category) {
    case 'DESTINATION': return { bg: '#9333ea', symbol: '📍' };
    case 'HOTEL': return { bg: '#2563eb', symbol: '🏨' };
    case 'RESTAURANT': return { bg: '#ea580c', symbol: '🍽️' };
    case 'TRAIL': return { bg: '#16a34a', symbol: '▲' };
    case 'ACTIVITY': return { bg: '#ca8a04', symbol: '⚡' };
    case 'EV': return { bg: '#0891b2', symbol: '🔌' };
    case 'FERRY': return { bg: '#0284c7', symbol: '🚢' };
    case 'WILDLIFE': return { bg: '#059669', symbol: '🦌' };
    case 'AURORA': return { bg: '#7c3aed', symbol: '✦' };
    case 'SAFETY': return { bg: '#dc2626', symbol: '!' };
    case 'EVENT': return { bg: '#db2777', symbol: '🎪' };
    default: return { bg: '#4b5563', symbol: '📍' };
  }
};

const createLeafletDivIcon = (category: string, isActive: boolean) => {
  const { bg, symbol } = getCategoryMarkerConfig(category);
  const size = isActive ? 36 : 28;
  return L.divIcon({
    className: 'custom-smart-marker',
    html: `<div style="
      background-color: ${bg}; 
      width: ${size}px; 
      height: ${size}px; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 4px 14px rgba(0,0,0,0.6); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: ${isActive ? '15px' : '12px'}; 
      color: white; 
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    ">${symbol}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Map Recenter Helper Component
const MapRecenter = ({ center }: { center?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, Math.max(map.getZoom(), 8), { animate: true });
    }
  }, [center, map]);
  return null;
};

export const SmartMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'ALL';
  const queryParam = searchParams.get('search') || '';

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedPoint, setSelectedPoint] = useState<MapEntity | null>(null);
  const [mapPoints, setMapPoints] = useState<MapEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    mapService.getUnifiedMapPoints()
      .then(data => {
        // Filter out any duplicate coordinates or records with missing coordinates
        const unique = data.filter((item, index, self) => 
          item.latitude && 
          item.longitude && 
          index === self.findIndex((t) => t.id === item.id)
        );
        setMapPoints(unique);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'ALL') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (!query) {
      newParams.delete('search');
    } else {
      newParams.set('search', query);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSearchParams({});
  };

  const handleAddToTrip = (point: MapEntity) => {
    try {
      const existingStr = localStorage.getItem('nsl_user_saved_trips');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      const newEntry = {
        id: `trip-point-${point.id}`,
        name: point.name,
        title: `${point.name} Exploration`,
        dates: 'Self-guided',
        nights: 1,
        activities: 1,
        status: 'Upcoming',
        image: point.image || '/images/besseggen_1786936349992.jpg',
        weather: '14°C',
        days: [
          {
            day: 1,
            date: new Date().toISOString().split('T')[0],
            title: point.name,
            activities: [
              {
                id: `act-${point.id}`,
                time: '10:00',
                durationHours: 3,
                title: point.name,
                description: point.description || `Explore ${point.name} in ${point.region || 'Norway'}.`,
                location: point.region || point.name,
                type: 'activity',
                cost: 0,
                currency: 'NOK'
              }
            ]
          }
        ]
      };

      const updated = [newEntry, ...existing.filter((t: any) => t.id !== newEntry.id)];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updated));
      toast.success(`"${point.name}" added to your Digital Travel Journal!`);
    } catch (err) {
      toast.error('Unable to save point to travel journal.');
    }
  };

  const filteredPoints = useMemo(() => {
    return mapPoints.filter(p => {
      if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.region?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [mapPoints, activeCategory, searchQuery]);

  const hasActiveFilters = activeCategory !== 'ALL' || searchQuery !== '';

  return (
    <div className="relative w-full h-screen bg-deep-night text-white overflow-hidden font-sans">
      <SEO 
        title="Smart Map of Norway | Interactive Geospatial Discovery"
        description="Explore Norway's destinations, hiking trails, EV fast charging corridors, and scenic fjords on OpenStreetMap."
      />

      {/* Interactive Leaflet + OpenStreetMap Container */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[62.0, 10.0]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#0B1120' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {selectedPoint && (
            <MapRecenter center={[selectedPoint.latitude, selectedPoint.longitude]} />
          )}

          {filteredPoints.map((point) => {
            if (!point.latitude || !point.longitude) return null;
            const isSelected = selectedPoint?.id === point.id;
            return (
              <Marker
                key={point.id}
                position={[point.latitude, point.longitude]}
                icon={createLeafletDivIcon(point.category, isSelected)}
                eventHandlers={{
                  click: () => setSelectedPoint(point),
                }}
              >
                <Popup className="smart-map-popup">
                  <div className="p-2 text-navy-900 min-w-[160px]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-polar-indigo mb-0.5">
                      {point.category}
                    </div>
                    <h4 className="font-bold text-sm leading-snug mb-1">{point.name}</h4>
                    {point.region && <p className="text-[11px] text-gray-500 mb-1">{point.region}</p>}
                    <p className="text-xs text-gray-600 mb-2">{point.status}</p>
                    <button
                      onClick={() => setSelectedPoint(point)}
                      className="w-full py-1 px-2 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-12 h-12 bg-black/60 backdrop-blur-xl border border-white/15 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors shadow-2xl cursor-pointer"
            aria-label="Toggle explorer sidebar"
          >
            {isPanelOpen ? <ChevronLeft className="w-6 h-6 text-polar-indigo" /> : <ChevronRight className="w-6 h-6 text-polar-indigo" />}
          </button>
        </div>
        
        <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/15 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse" />
            <span className="text-sm font-bold tracking-wider uppercase text-gray-300">Live Telemetry</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="text-xs font-semibold text-white/70">
            {filteredPoints.length} Active Markers
          </div>
        </div>
      </div>

      {/* Collapsible Sidebar Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-[400px] max-w-[90vw] bg-black/75 backdrop-blur-2xl border-r border-white/10 z-30 flex flex-col pt-24"
          >
            <div className="px-8 pb-6 border-b border-white/10">
              <h1 className="text-3xl font-display font-bold mb-2">Norway at your fingertips.</h1>
              <p className="text-sm text-gray-400">Discover places, plan journeys, and monitor infrastructure in real time with OpenStreetMap.</p>
              
              <div className="relative mt-6">
                <input 
                  type="text" 
                  placeholder="Filter destinations, trails, stays..." 
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-polar-indigo focus:ring-1 focus:ring-polar-indigo transition-all text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-polar-indigo hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} /> Clear all filters ({filteredPoints.length} matching)
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Explore Layers</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors text-xs font-bold cursor-pointer truncate ${
                      activeCategory === cat.id 
                        ? 'bg-polar-indigo/20 border-polar-indigo text-white shadow-sm' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={activeCategory === cat.id ? 'text-polar-indigo' : ''}>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
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
                      <div className="text-xs text-gray-400">Mountain passes monitored</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400">Passes Clear</span>
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-black/85 backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all"
          >
            <div 
              className="w-full md:w-2/5 h-48 md:h-auto bg-cover bg-center relative"
              style={{ backgroundImage: `url(${selectedPoint.image || '/images/besseggen_1786936349992.jpg'})` }}
            >
               <button 
                 onClick={() => setSelectedPoint(null)}
                 className="absolute top-4 left-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center md:hidden border border-white/20 cursor-pointer"
                 aria-label="Close detail drawer"
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
                className="absolute top-6 right-6 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full hidden md:flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close detail drawer"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <div className="flex justify-between items-start mb-1">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">{selectedPoint.name}</h2>
              </div>
              {selectedPoint.region && (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin size={12} className="text-polar-indigo" /> {selectedPoint.region}
                </p>
              )}

              {selectedPoint.description && (
                <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-2">
                  {selectedPoint.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
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

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <div className="text-gray-500 text-[10px] mb-0.5 uppercase tracking-wider">Coordinates</div>
                  <div className="font-bold">{selectedPoint.latitude?.toFixed(2)}°N, {selectedPoint.longitude?.toFixed(2)}°E</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                  <div className="text-gray-500 text-[10px] mb-0.5 uppercase tracking-wider">Navigation</div>
                  <div className="font-bold text-glacier-cyan">OpenStreetMap Engine</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-auto">
                {selectedPoint.detail_url && (
                  <a
                    href={selectedPoint.detail_url}
                    className="flex-1 min-w-[105px] bg-white text-deep-night hover:bg-snow font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-center"
                  >
                    View Details
                  </a>
                )}
                <button
                  onClick={() => handleAddToTrip(selectedPoint)}
                  className="flex-1 min-w-[105px] bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-glacier-mint" /> Add to Trip
                </button>
                <a
                  href={`/weather?city=${encodeURIComponent(selectedPoint.name)}&lat=${selectedPoint.latitude}&lon=${selectedPoint.longitude}`}
                  className="flex-1 min-w-[105px] bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                >
                  <CloudLightning className="w-3.5 h-3.5 text-amber-400" /> Weather
                </a>
                <a
                  href={openStreetMap.getDirectionsUrl({
                    destination: { lat: selectedPoint.latitude, lng: selectedPoint.longitude }
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[105px] bg-polar-indigo hover:bg-polar-indigo/80 text-white font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartMap;
