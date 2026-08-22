import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { roadTripService, RoadTrip } from '../../services/roadTripService';
import { Map, Clock, Navigation, Calendar, Activity, ChevronRight, MapPin, Zap } from 'lucide-react';

const difficultyColor: Record<string, string> = {
  Easy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Moderate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Hard: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export const RoadTrips = () => {
  const [trips, setTrips] = useState<RoadTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    roadTripService.getRoadTrips()
      .then(data => { setTrips(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-pine-forest text-white">
      <CinematicBackground
        imageUrl="/images/kjeragbolten_1786936275605.jpg"
        overlayOpacity={0.65}
        theme="pineForest"
      />

      <div className="relative z-10 pt-32 pb-24">
        <Container>
          {/* Hero Header */}
          <div className="max-w-4xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
            >
              <Zap className="w-4 h-4 text-nordic-sage" />
              <span className="text-sm font-medium text-white/80">6 Curated Scenic Routes</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-tight"
            >
              Scenic <span className="text-nordic-sage italic">Routes.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl"
            >
              Discover Norway's most spectacular road trips — from cliff-edge mountain passes to island archipelagos floating above the Arctic Sea.
            </motion.p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { label: 'Scenic Routes', value: '18+', icon: Map },
              { label: 'Total km mapped', value: '4,200+', icon: Navigation },
              { label: 'UNESCO fjords', value: '3', icon: MapPin },
              { label: 'Best months', value: 'Jun–Oct', icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-panel p-4 rounded-2xl text-center">
                <Icon className="w-5 h-5 text-nordic-sage mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-white">{value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Road Trips List */}
          {isLoading ? (
            <div className="flex flex-col gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-panel rounded-3xl h-72 animate-pulse bg-white/5 border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {trips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  onClick={() => setSelected(selected === trip.id ? null : trip.id)}
                  className="glass-panel rounded-3xl overflow-hidden group flex flex-col md:flex-row hover:border-nordic-sage/40 transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/fjords_1786935800026.jpg';
                      }}
                    />
                    {/* Difficulty badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${difficultyColor[trip.difficulty] || 'bg-white/10 text-white border-white/20'}`}>
                        {trip.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 w-full flex flex-col justify-between">
                    <div>
                      {/* Route indicator */}
                      {trip.start_point && trip.end_point && (
                        <div className="flex items-center gap-2 text-xs text-nordic-sage font-medium mb-3">
                          <MapPin className="w-3 h-3" />
                          {trip.start_point}
                          <span className="text-gray-500">→</span>
                          {trip.end_point}
                        </div>
                      )}

                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                        {trip.name}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed line-clamp-2">
                        {trip.description}
                      </p>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-y border-white/10 py-4">
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Distance</span>
                          <span className="font-bold flex items-center gap-1 text-white">
                            <Map className="w-4 h-4 text-nordic-sage" /> {trip.distance_km} km
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Duration</span>
                          <span className="font-bold flex items-center gap-1 text-white">
                            <Clock className="w-4 h-4 text-nordic-sage" /> {trip.duration_days} {trip.duration_days === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Best Season</span>
                          <span className="font-bold flex items-center gap-1 text-white">
                            <Calendar className="w-4 h-4 text-nordic-sage" /> {trip.season}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Difficulty</span>
                          <span className="font-bold flex items-center gap-1 text-white">
                            <Activity className="w-4 h-4 text-nordic-sage" /> {trip.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Scenic highlights */}
                      {trip.scenic_highlights && trip.scenic_highlights.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Highlights</span>
                          <div className="flex flex-wrap gap-2">
                            {trip.scenic_highlights.map((h, i) => (
                              <span key={i} className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-200">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <span className="text-xs text-gray-500">Click to explore full route details</span>
                      <button className="flex items-center gap-2 text-nordic-sage hover:text-white transition-colors font-bold group-hover:translate-x-1 duration-300">
                        Explore Route <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
