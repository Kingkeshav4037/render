import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Filter, Clock, Users, ArrowRight, Activity, Camera, Fish, Compass, Mountain, TreePine, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { activityService } from '../services/activityService';
import { getActivityImage } from '../services/home/homeContentService';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '../components/shared/SEO';
import { OptimizedImage } from '../components/shared/OptimizedImage';

const CATEGORIES = [
  { id: 'all', label: 'All Experiences', icon: <Compass className="w-4 h-4"/> },
  { id: 'HIKING', label: 'Hiking & Treks', icon: <Mountain className="w-4 h-4"/> },
  { id: 'CRUISE', label: 'Fjord Cruises', icon: <Navigation className="w-4 h-4"/> },
  { id: 'KAYAK', label: 'Kayaking', icon: <Fish className="w-4 h-4"/> },
  { id: 'AURORA', label: 'Northern Lights', icon: <Activity className="w-4 h-4"/> },
  { id: 'WILDLIFE', label: 'Wildlife Tours', icon: <Camera className="w-4 h-4"/> },
];

export const Activities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') || 'all';
  const { formatPrice } = useCurrencyStore();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['activities', typeFilter, page, limit],
    queryFn: () => activityService.getActivities({ category: typeFilter }, page, limit),
    staleTime: 5 * 60 * 1000,
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-[#2F5233]/40">
      <SEO 
        title="Experiences & Activities | Norway SmartLife"
        description="Book expert-led treks, sustainable fjord cruises, and authentic local experiences."
      />
      {/* Pine Theme Hero */}
      <CinematicBackground 
        imageUrl="/images/lofoten_1787013505867.jpg"
        gradient="dark"
        overlayOpacity={0.6}
        className="h-[60vh] flex items-center"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32">
          <div className="max-w-4xl">
            <span className="text-[#A3B899] font-sans text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <TreePine className="w-4 h-4" /> Experiences & Activities
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6">Discover Norway's Wild</h1>
            <p className="text-lg md:text-xl font-sans text-snow/80 max-w-2xl mb-12 leading-relaxed">
              Book expert-led treks, sustainable fjord cruises, and authentic local experiences.
            </p>

            {/* Smart Booking Bar (Pine Tinted) */}
            <div className="bg-[#1A2E1F]/90 backdrop-blur-2xl border border-[#2F5233]/40 p-2 flex flex-col md:flex-row gap-2 max-w-4xl shadow-2xl">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                <MapPin className="w-5 h-5 text-[#A3B899] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-snow/60 font-bold">Location</span>
                  <input type="text" placeholder="Where to?" className="bg-transparent text-sm outline-none placeholder:text-snow/30 w-full" />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                <Calendar className="w-5 h-5 text-[#A3B899] group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-snow/60 font-bold">When</span>
                  <span className="text-sm font-medium">Select Dates</span>
                </div>
              </div>
              <button className="h-auto py-4 px-10 bg-[#2F5233] text-snow font-bold hover:bg-[#A3B899] hover:text-deep-night transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0">
                <Search className="w-4 h-4" /> Find
              </button>
            </div>
          </div>
        </div>
      </CinematicBackground>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* Navigation Categories */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 mb-12 pb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchParams({ type: cat.id });
                setPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded-full border ${
                typeFilter === cat.id 
                  ? 'bg-[#2F5233] border-[#2F5233] text-snow' 
                  : 'bg-midnight border-white/10 text-snow/70 hover:bg-white/5 hover:text-snow'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
          <div className="ml-auto">
            <button className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-snow/70 hover:text-snow transition-colors px-6 py-3 border border-white/10 rounded-full">
              <Filter size={14} /> More Filters
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <AsyncStateWrapper
          isLoading={isLoading}
          error={error as Error}
          data={data?.data}
          emptyMessage="No activities found matching your criteria."
          errorMessage="Unable to load activities."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-[400px] bg-white/5 animate-pulse border border-white/5"></div>)}
            </div>
          }
        >
          {(activities) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {activities.map((activity, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={activity.id}
                    className="group relative flex flex-col bg-[#1A2E1F]/20 border border-white/5 hover:border-[#2F5233] transition-all duration-500 overflow-hidden cursor-pointer"
                  >
                    <Link to={`/activities/${activity.id}`} className="absolute inset-0 z-10" />
                    
                    <div className="h-64 relative overflow-hidden">
                      <OptimizedImage 
                        src={getActivityImage(activity.type, activity.image_url)} 
                        alt={activity.name}
                        fallbackSrc={getActivityImage(activity.type)}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-20 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-snow border border-white/10">
                        {activity.type}
                      </div>
                      {(activity as any).availability === 'Limited Spots' && (
                        <div className="absolute top-4 right-4 z-20 bg-orange-500/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-orange-400">
                          Selling Fast
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow relative z-20">
                      <h3 className="text-2xl font-display font-semibold mb-2 group-hover:text-[#A3B899] transition-colors">{activity.name}</h3>
                      <div className="flex items-center gap-4 text-sm font-sans mb-4 text-snow/60">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Fjord Region</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {activity.duration_minutes ? `${activity.duration_minutes} min` : 'Varies'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-auto">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm border border-white/5">
                          {activity.difficulty_level || activity.difficulty || 'Moderate'}
                        </span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-end">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-snow/50 tracking-widest mb-1">From</div>
                          <div className="text-xl font-bold">{formatPrice(activity.price)}</div>
                        </div>
                        <button className="text-sm font-bold uppercase tracking-wider text-[#A3B899] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Details <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pb-16">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-white/10 bg-white/5 text-white disabled:opacity-30 transition-opacity hover:bg-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 border transition-colors ${
                        page === p 
                          ? 'border-[#A3B899] bg-[#A3B899]/20 text-[#A3B899]' 
                          : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-white/10 bg-white/5 text-white disabled:opacity-30 transition-opacity hover:bg-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </AsyncStateWrapper>
      </div>
    </div>
  );
};

export default Activities;
