import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { trailService, Trail } from '../../services/trailService';
import { Map, Mountain, Clock, TrendingUp, Sun, CloudRain, AlertTriangle, Snowflake } from 'lucide-react';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

const FILTER_DIFFICULTY = ['All', 'Easy', 'Moderate', 'Hard', 'Extreme'];
const FILTER_DURATION = ['All', '< 2 hours', '2–4 hours', '4–8 hours', 'Full day', 'Multi-day'];

export const HikingTrails = () => {
  const [activeDiff, setActiveDiff] = useState('All');
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await trailService.getTrails();
      setTrails(data || []);
    } catch (err: any) {
      console.error('Failed to load hiking trails:', err);
      setError(err?.message || 'Unable to load trails at this moment.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTrails();
  }, []);

  const filteredTrails = trails.filter(t => activeDiff === 'All' || t.difficulty === activeDiff);
  return (
    <div className="min-h-screen bg-moss text-white relative">
      <CinematicBackground 
        imageUrl="/images/besseggen_1786936349992.jpg"
        overlayOpacity={0.7}
        theme="moss"
      />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-[1]" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 Q 25 25, 50 50 T 100 50\' stroke=\'white\' fill=\'none\' stroke-width=\'0.5\'/%3E%3Cpath d=\'M0 60 Q 25 35, 50 60 T 100 60\' stroke=\'white\' fill=\'none\' stroke-width=\'0.5\'/%3E%3Cpath d=\'M0 70 Q 25 45, 50 70 T 100 70\' stroke=\'white\' fill=\'none\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px'
        }}
      />

      <div className="relative z-10 pt-32 pb-24">
        <Container>
          {/* Hero Statistics */}
          <div className="max-w-4xl mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-10"
            >
              Find your <span className="italic text-nordic-sage">trail.</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-display font-bold text-white">412</span>
                <span className="text-xs text-gray-300 uppercase tracking-wider">Trails</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-display font-bold text-nordic-sage">128</span>
                <span className="text-xs text-gray-300 uppercase tracking-wider">Easy</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-display font-bold text-amber-500">145</span>
                <span className="text-xs text-gray-300 uppercase tracking-wider">Moderate</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-display font-bold text-red-400">96</span>
                <span className="text-xs text-gray-300 uppercase tracking-wider">Hard</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-display font-bold text-white">43</span>
                <span className="text-xs text-gray-300 uppercase tracking-wider">Multi-Day</span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="sticky top-24 glass-panel p-6 rounded-3xl">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Map className="w-5 h-5 text-nordic-sage" /> Filters
                </h3>

                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Difficulty</h4>
                  <div className="flex flex-col gap-2">
                    {FILTER_DIFFICULTY.map(diff => (
                      <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border ${activeDiff === diff ? 'bg-nordic-sage border-nordic-sage' : 'border-gray-500 group-hover:border-nordic-sage'} flex items-center justify-center transition-colors`}>
                          {activeDiff === diff && <div className="w-2.5 h-2.5 bg-pine-forest rounded-sm" />}
                        </div>
                        <span className={`text-sm ${activeDiff === diff ? 'text-white font-bold' : 'text-gray-300 group-hover:text-white'}`}>{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Duration</h4>
                  <div className="flex flex-col gap-2">
                    {FILTER_DURATION.map(dur => (
                      <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border border-gray-500 group-hover:border-nordic-sage transition-colors" />
                        <span className="text-sm text-gray-300 group-hover:text-white">{dur}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Experience</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Family', 'Beginner', 'Photography', 'Scenic', 'Expert'].map(tag => (
                      <button key={tag} className="px-3 py-1.5 rounded-full border border-white/20 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trail Cards Grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col gap-8">
                {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row h-72 animate-pulse">
                        <div className="w-full md:w-2/5 bg-white/5 h-full" />
                        <div className="p-8 w-full md:w-3/5 space-y-4">
                          <div className="h-6 bg-white/10 w-1/2 rounded" />
                          <div className="h-4 bg-white/5 w-1/3 rounded" />
                          <div className="h-12 bg-white/5 w-full rounded" />
                          <div className="grid grid-cols-4 gap-4 pt-4">
                            {[1, 2, 3, 4].map(c => <div key={c} className="h-8 bg-white/10 rounded" />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto border border-red-500/20 bg-red-500/10">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-display font-bold mb-2">Unable to Load Trails</h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">{error}</p>
                    <button
                      onClick={fetchTrails}
                      className="px-6 py-2.5 bg-nordic-sage text-midnight font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredTrails.length === 0 ? (
                  <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto">
                    <Mountain className="w-12 h-12 text-nordic-sage mx-auto mb-4 opacity-70" />
                    <h3 className="text-white text-xl font-display font-bold mb-2">No trails match "{activeDiff}"</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      We couldn't find any hiking routes with {activeDiff} difficulty level in our active catalog.
                    </p>
                    <button
                      onClick={() => setActiveDiff('All')}
                      className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
                    >
                      Show All Difficulties
                    </button>
                  </div>
                ) : (
                  filteredTrails.map((trail, idx) => (
                  <motion.div 
                    key={trail.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="glass-panel rounded-3xl overflow-hidden group flex flex-col md:flex-row hover:border-nordic-sage/50 transition-all cursor-pointer"
                  >
                    <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                      <OptimizedImage 
                        src={trail.image} 
                        alt={trail.name}
                        category="trail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        {trail.weather_status === 'Clear' && (
                          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
                            <Sun className="w-3 h-3 text-amber-400" /> Clear conditions
                          </div>
                        )}
                        {trail.weather_status === 'Warning' && (
                          <div className="bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
                            <AlertTriangle className="w-3 h-3 text-white" /> Weather Warning
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-8 w-full md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-3xl font-display font-bold text-white">{trail.name}</h3>
                          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                            <span className="text-amber-400">★</span>
                            <span className="text-sm font-bold">{trail.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-400 mb-3 flex items-center gap-2">
                          <Map className="w-4 h-4 text-nordic-sage" /> {trail.location}
                        </p>
                        {(trail as any).description && (
                          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                            {(trail as any).description}
                          </p>
                        )}
                        {(trail as any).highlights && (trail as any).highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(trail as any).highlights.map((h: string) => (
                              <span key={h} className="px-2 py-1 bg-white/10 border border-white/10 rounded-full text-[11px] text-gray-300">{h}</span>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Difficulty</span>
                            <span className={`font-bold ${trail.difficulty === 'Hard' ? 'text-red-400' : trail.difficulty === 'Moderate' ? 'text-amber-400' : 'text-nordic-sage'}`}>
                              {trail.difficulty}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Distance</span>
                            <span className="font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3 text-gray-400"/> {trail.distance_km} km</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Duration</span>
                            <span className="font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400"/> {trail.duration_hrs}h</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Elevation</span>
                            <span className="font-bold flex items-center gap-1"><Mountain className="w-3 h-3 text-gray-400"/> +{trail.elevation_gain_m}m</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="text-sm text-gray-400">
                          Best season: <span className="text-white">{trail.best_season}</span>
                        </div>
                        <Link to={`/trails/${trail.id}`} className="bg-nordic-sage text-pine-forest px-6 py-2 rounded-xl font-bold hover:bg-moss hover:text-white transition-colors">
                          Explore Trail
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
