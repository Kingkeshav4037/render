import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Map, Mountain, Clock, TrendingUp, AlertTriangle, ShieldCheck, ArrowLeft, Navigation, MapPin } from 'lucide-react';
import { trailService, Trail } from '../../services/trailService';
import { SEO } from '../../components/shared/SEO';

export const TrailDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      trailService.getTrailById(id).then(data => {
        setTrail(data);
        setIsLoading(false);
      });
    } else {
      trailService.getTrailById('tr-002').then(data => {
        setTrail(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-moss flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nordic-sage border-t-transparent" />
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen bg-moss text-white flex flex-col items-center justify-center p-8 text-center">
        <Mountain className="w-16 h-16 text-nordic-sage/60 mb-4" />
        <h1 className="text-3xl font-bold font-display mb-4">Trail Not Found</h1>
        <p className="text-gray-300 mb-8 max-w-md">The requested hiking route could not be located or may have been archived.</p>
        <Link to="/trails" className="bg-nordic-sage text-pine-forest px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-xl shadow-lg">
          Browse All Trails
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-sage text-white pb-24">
      <SEO 
        title={`${trail.name} | Hiking in Norway`}
        description={trail.description || `${trail.name} trail in ${trail.location}. Distance: ${trail.distance_km}km, Difficulty: ${trail.difficulty}.`}
        ogImage={trail.image}
      />
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
              {trail.description || 'Experience the raw grandeur of the Norwegian landscape.'}
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
                <span className="text-xl font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-gray-400"/> {trail.distance_km} km</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                <span className="text-xl font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400"/> {trail.duration_hrs} hrs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Elevation Gain</span>
                <span className="text-xl font-bold text-white flex items-center gap-2"><Mountain className="w-5 h-5 text-gray-400"/> +{trail.elevation_gain_m}m</span>
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
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Check Mountain Safety Before Departure</h3>
                  <p className="text-red-200 mb-6">Mountain weather in Norway changes rapidly. Always carry waterproof windbreakers, sturdy boots, and check live safety notices before departing.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Avalanche Risk</span>
                      <span className="font-bold text-white">Level 1 (Low)</span>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Trail Status</span>
                      <span className="font-bold text-green-400">{trail.weather_status || 'Open'}</span>
                    </div>
                  </div>
                  
                  <Link to="/safety" className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                    View Detailed Safety Report
                  </Link>
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
                    <span>{(trail.distance_km / 2).toFixed(1)} km</span>
                    <span>{trail.distance_km} km</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="flex flex-col gap-8">
            {/* Interactive Map Link */}
            <div className="glass-panel rounded-3xl overflow-hidden h-[400px] flex flex-col relative group">
               <div className="absolute inset-0 bg-[url('/images/besseggen_1786936349992.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-nordic-sage/20 mix-blend-overlay" />
               <Link to="/map" className="absolute inset-0 flex items-center justify-center z-20">
                 <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold flex items-center gap-2 group-hover:bg-nordic-sage group-hover:text-pine-forest transition-colors shadow-2xl">
                   <MapPin className="w-5 h-5" /> View on Interactive Map
                 </div>
               </Link>
               
               <div className="mt-auto p-4 relative z-10 bg-gradient-to-t from-black/90 to-transparent pt-12">
                  <h4 className="font-bold text-lg text-white mb-2">Trail Location</h4>
                  <ul className="text-sm text-gray-300 flex flex-col gap-2 mb-4">
                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-nordic-sage" /> Region: {trail.location}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Season: {trail.best_season}</li>
                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Weather Status: {trail.weather_status}</li>
                  </ul>
                  <Link 
                    to={`/weather?city=${encodeURIComponent(trail.name)}`}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
                  >
                    Check Mountain Weather
                  </Link>
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
                  <span className="text-gray-300 text-sm">Sturdy hiking boots with ankle support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Wind and waterproof shell jacket</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Thermal base layers (Merino wool)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Headlamp with backup batteries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-gray-300 text-sm">Map, compass, and first aid kit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrailDetails;
