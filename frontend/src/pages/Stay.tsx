import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, Filter, Map, ArrowRight, X, Check, Star, Wind, Zap, Waves, TreePine, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStays } from '../hooks/useStays';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { SEO } from '../components/shared/SEO';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { PageHeader } from '../components/ui/PageHeader';

const AMENITIES_LIST = [
  { id: 'breakfast', label: 'Breakfast Included' },
  { id: 'parking', label: 'Parking' },
  { id: 'ev', label: 'EV Charging', icon: <Zap className="w-4 h-4 text-arctic-gold" /> },
  { id: 'spa', label: 'Spa & Wellness' },
  { id: 'pet', label: 'Pet Friendly' },
  { id: 'family', label: 'Family Friendly' },
  { id: 'sustainable', label: 'Eco Certified', icon: <TreePine className="w-4 h-4 text-green-400" /> },
  { id: 'waterfront', label: 'Waterfront', icon: <Waves className="w-4 h-4 text-blue-400" /> },
  { id: 'ski', label: 'Ski Access' },
];

export const Stay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') || 'all';
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useStays({ type: typeFilter !== 'all' ? typeFilter : undefined }, page, limit);
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyStore();

  const stays = data?.data || [];
  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  const [viewMode, setViewMode] = useState<'list' | 'split'>('split');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 relative selection:bg-arctic-gold/30">
      <SEO 
        title="Stays & Accommodations | Norway SmartLife"
        description="Find the perfect place to stay in Norway, from cozy fjord cabins to luxury hotels."
      />

      <PageHeader
        title="Stays & Accommodations"
        description="Find the perfect place to stay in Norway, from cozy fjord cabins to luxury hotels."
        breadcrumb="Hospitality"
      />
      
      {/* Search Bar (Simulating Phase 6 Advanced Search) */}
      <div className="z-40 bg-deep-night/95 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 lg:px-12 sticky top-0">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex bg-white/5 border border-white/10 p-1 w-full xl:w-auto">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/5 min-w-[200px]">
              <MapPin className="w-4 h-4 text-arctic-gold" />
              <input type="text" placeholder="Where to?" className="bg-transparent border-none text-sm outline-none w-full placeholder:text-snow/30" />
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/5">
              <Calendar className="w-4 h-4 text-arctic-gold" />
              <span className="text-sm">Aug 12 - Aug 16</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/5">
              <Users className="w-4 h-4 text-arctic-gold" />
              <span className="text-sm">2 Guests, 1 Room</span>
            </div>
            <button className="bg-arctic-gold text-deep-night px-6 py-2 font-bold text-sm hover:bg-snow transition-colors">
              Search
            </button>
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-4 py-3 border transition-colors ${showFilters ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10 hover:border-white/30'}`}
            >
              <Filter className="w-4 h-4" /> Filters {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}
            </button>
            <div className="flex bg-white/5 border border-white/10 p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${viewMode === 'list' ? 'bg-arctic-gold text-deep-night' : 'text-snow/50 hover:text-snow'}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${viewMode === 'split' ? 'bg-arctic-gold text-deep-night' : 'text-snow/50 hover:text-snow'}`}
              >
                Map Split
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Drawer/Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/5 bg-midnight overflow-hidden"
          >
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Price Range</h4>
                <div className="flex gap-4 items-center">
                  <input type="number" placeholder="Min" className="bg-black/30 border border-white/10 px-4 py-2 w-full text-sm outline-none focus:border-arctic-gold transition-colors" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="bg-black/30 border border-white/10 px-4 py-2 w-full text-sm outline-none focus:border-arctic-gold transition-colors" />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Property Type</h4>
                <div className="space-y-2">
                  {['Luxury Hotels', 'Fjord Cabins', 'Eco-Lodges', 'Resorts'].map(t => (
                    <label key={t} className="flex items-center gap-3 text-sm cursor-pointer hover:text-arctic-gold transition-colors">
                      <input type="checkbox" className="accent-arctic-gold" /> {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity.id) ? 'bg-arctic-gold border-arctic-gold text-deep-night' : 'border-white/20 group-hover:border-white/50'}`}>
                        {selectedAmenities.includes(amenity.id) && <Check className="w-3 h-3" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)} 
                      /> 
                      {amenity.icon}
                      <span className="group-hover:text-arctic-gold transition-colors">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-black/20 py-4 px-6 lg:px-12 border-t border-white/5 flex justify-end gap-4">
              <button onClick={() => {setSelectedAmenities([]); setShowFilters(false);}} className="px-6 py-2 text-sm text-snow/50 hover:text-snow">Clear All</button>
              <button onClick={() => setShowFilters(false)} className="px-6 py-2 bg-arctic-gold text-deep-night font-bold text-sm hover:bg-snow transition-colors">Apply Filters</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex ${viewMode === 'split' ? 'h-[calc(100vh-140px)]' : 'max-w-[1600px] mx-auto px-6 lg:px-12 py-8'}`}>
        
        {/* Results List */}
        <div className={`${viewMode === 'split' ? 'w-full lg:w-1/2 xl:w-2/5 overflow-y-auto p-6 lg:p-8' : 'w-full'} hide-scrollbar`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Stays in Norway</h1>
              <p className="text-snow/50 mt-1">{data?.count || 0} properties available</p>
            </div>
            {viewMode === 'list' && (
              <select className="bg-transparent border border-white/10 text-sm px-4 py-2 outline-none focus:border-arctic-gold">
                <option value="recommended" className="bg-deep-night">Recommended</option>
                <option value="price_low" className="bg-deep-night">Price: Low to High</option>
                <option value="price_high" className="bg-deep-night">Price: High to Low</option>
                <option value="rating" className="bg-deep-night">Highest Rated</option>
              </select>
            )}
          </div>

          <AsyncStateWrapper
            isLoading={isLoading}
            error={error as Error | null}
            data={stays}
            emptyMessage="No stays found matching your criteria."
            errorMessage="Unable to load stays."
            skeleton={
              <div className={`grid ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/5 animate-pulse border border-white/5"></div>)}
              </div>
            }
          >
            {(staysData) => (
              <>
                <div className={`grid ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {staysData.map((stay: any) => {
                    const priceNum = Number(stay.price_per_night) || 1800;
                    const totalDays = 4;
                    return (
                      <Link
                        key={stay.id}
                        to={`/stay/${stay.id}`}
                        className="group relative bg-white/5 border border-white/5 hover:border-arctic-gold/30 transition-all duration-500 flex flex-col overflow-hidden"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <OptimizedImage
                            src={stay.image_url || '/images/hotel_juvet_1787013813000.jpg'}
                            alt={stay.name}
                            fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {stay.eco_certified && (
                            <span className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                              Eco Certified
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] text-snow/50 uppercase tracking-widest font-bold">{stay.type?.replace(/_/g, ' ')}</div>
                            <div className="flex items-center gap-1 text-sm font-bold text-arctic-gold">
                              <Star className="w-3 h-3 fill-arctic-gold" /> {stay.rating} <span className="text-snow/40 font-normal">(124)</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-display font-bold mb-1 group-hover:text-arctic-gold transition-colors">{stay.name}</h3>
                          <div className="text-sm text-snow/60 flex items-center gap-1 mb-4">
                            <MapPin className="w-3 h-3" /> {(stay as any).locations?.name || 'Norway'}
                          </div>

                          <div className="flex gap-2 mb-4">
                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5">Free Breakfast</span>
                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5">Free Cancellation</span>
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end">
                            <div>
                              <div className="text-xs text-snow/40 mb-1">4 nights, 2 adults</div>
                              <div className="text-xl font-bold">{formatPrice(priceNum * totalDays)}</div>
                              <div className="text-[10px] text-snow/40">Includes taxes & fees</div>
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-arctic-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              View <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                    <button 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-2 border border-white/20 rounded-full hover:bg-arctic-gold hover:border-arctic-gold hover:text-deep-night transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-sans font-medium text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-2 border border-white/20 rounded-full hover:bg-arctic-gold hover:border-arctic-gold hover:text-deep-night transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </AsyncStateWrapper>
        </div>

        {/* Map View */}
        {viewMode === 'split' && (
          <div className="hidden lg:block w-1/2 xl:w-3/5 bg-black/50 border-l border-white/5 relative">
            <OptimizedImage 
              src="/images/fjords_1786935800026.jpg" 
              className="w-full h-full object-cover opacity-30 grayscale" 
              alt="Map Background" 
              category="landscape"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-deep-night/50 mix-blend-multiply pointer-events-none" />
            
            {/* Mock Map Markers */}
            <div className="absolute top-1/4 left-1/3 group cursor-pointer">
              <div className="bg-arctic-gold text-deep-night px-3 py-1 font-bold text-sm shadow-xl whitespace-nowrap group-hover:scale-110 transition-transform origin-bottom">
                {formatPrice(2400)}
              </div>
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-arctic-gold border-l-transparent border-r-transparent mx-auto"></div>
            </div>

            <div className="absolute top-1/2 left-2/3 group cursor-pointer z-10">
              <div className="bg-white text-deep-night px-3 py-1 font-bold text-sm shadow-xl whitespace-nowrap group-hover:scale-110 group-hover:bg-arctic-gold transition-transform origin-bottom">
                {formatPrice(4200)}
              </div>
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-white group-hover:border-t-arctic-gold border-l-transparent border-r-transparent mx-auto transition-colors"></div>
            </div>
            
            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-deep-night border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">+</button>
              <button className="w-10 h-10 bg-deep-night border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">-</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stay;
