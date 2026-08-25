import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, Filter, ArrowRight, Check, Star, Zap, Waves, TreePine, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStays } from '../hooks/useStays';
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [submittedQuery, setSubmittedQuery] = useState(searchParams.get('q') || '');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [page, setPage] = useState(1);
  const limit = 12;

  const [viewMode, setViewMode] = useState<'list' | 'split'>('split');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filterPayload = useMemo(() => ({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    searchQuery: submittedQuery || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
  }), [typeFilter, submittedQuery, minPrice, maxPrice, selectedAmenities]);

  const { data, isLoading, error } = useStays(filterPayload, page, limit);
  const { formatPrice } = useCurrencyStore();

  const stays = useMemo(() => {
    let list = [...(data?.data || [])];
    if (sortBy === 'price_low') {
      list.sort((a, b) => (Number(a.price_per_night) || 0) - (Number(b.price_per_night) || 0));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => (Number(b.price_per_night) || 0) - (Number(a.price_per_night) || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }
    return list;
  }, [data?.data, sortBy]);

  const nightsCount = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 4;
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  const totalPages = data ? Math.max(1, Math.ceil(data.count / limit)) : 1;

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (newType: string) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (newType === 'all') {
      newParams.delete('type');
    } else {
      newParams.set('type', newType);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 relative selection:bg-arctic-gold/30">
      <SEO 
        title="Stays & Accommodations | Norway SmartLife"
        description="Find the perfect place to stay in Norway, from cozy fjord cabins to luxury hotels."
      />

      <PageHeader
        title="Stays & Accommodations"
        description="Find the perfect place to stay in Norway, from cozy fjord cabins to luxury eco-lodges."
        breadcrumb="Hospitality"
      />
      
      {/* Search Bar */}
      <div className="z-40 bg-deep-night/95 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 lg:px-12 sticky top-0 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap md:flex-nowrap bg-white/5 border border-white/10 p-1 w-full xl:w-auto rounded-lg">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/5 min-w-[200px] flex-1 md:flex-none">
              <MapPin className="w-4 h-4 text-arctic-gold shrink-0" />
              <input 
                type="text" 
                placeholder="Where to? (e.g. Fjord, Tromsø, Bergen)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-snow/30 text-snow" 
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setSubmittedQuery(''); }} className="text-snow/40 hover:text-snow">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 border-r border-white/5">
              <Calendar className="w-4 h-4 text-arctic-gold shrink-0" />
              <input 
                type="date" 
                value={checkInDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent border-none text-xs text-snow/80 outline-none w-28 cursor-pointer" 
                title="Check-in Date"
              />
              <span className="text-snow/40 text-xs">-</span>
              <input 
                type="date" 
                value={checkOutDate} 
                min={checkInDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="bg-transparent border-none text-xs text-snow/80 outline-none w-28 cursor-pointer" 
                title="Check-out Date"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 border-r border-white/5">
              <Users className="w-4 h-4 text-arctic-gold shrink-0" />
              <select 
                value={guestsCount} 
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="bg-transparent border-none text-xs text-snow/80 outline-none"
              >
                <option value={1} className="bg-deep-night text-snow">1 Guest</option>
                <option value={2} className="bg-deep-night text-snow">2 Guests</option>
                <option value={3} className="bg-deep-night text-snow">3 Guests</option>
                <option value={4} className="bg-deep-night text-snow">4+ Guests</option>
              </select>
            </div>

            <button type="submit" className="bg-arctic-gold text-deep-night px-6 py-2 font-bold text-sm hover:bg-snow transition-colors rounded-r-md flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </button>
          </form>

          <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-4 py-3 border transition-colors rounded-md ${showFilters ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10 hover:border-white/30'}`}
            >
              <Filter className="w-4 h-4" /> Filters {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}
            </button>
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-md">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded ${viewMode === 'list' ? 'bg-arctic-gold text-deep-night' : 'text-snow/50 hover:text-snow'}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded ${viewMode === 'split' ? 'bg-arctic-gold text-deep-night' : 'text-snow/50 hover:text-snow'}`}
              >
                Map Split
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
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
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Price Range (NOK / night)</h4>
                <div className="flex gap-3 items-center">
                  <input 
                    type="number" 
                    placeholder="Min NOK" 
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-black/30 border border-white/10 px-3 py-2 w-full text-sm outline-none focus:border-arctic-gold transition-colors rounded text-snow" 
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Max NOK" 
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-black/30 border border-white/10 px-3 py-2 w-full text-sm outline-none focus:border-arctic-gold transition-colors rounded text-snow" 
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Property Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'HOTEL', 'CABIN', 'LODGE', 'RESORT', 'CAMPING'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`px-3 py-1.5 text-xs uppercase font-bold rounded tracking-wider border transition-colors ${
                        (typeFilter === t || (t === 'all' && typeFilter === 'all'))
                          ? 'bg-arctic-gold text-deep-night border-arctic-gold'
                          : 'border-white/10 text-snow/70 hover:border-white/30'
                      }`}
                    >
                      {t === 'all' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-snow/50 mb-4">Amenities & Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors rounded ${selectedAmenities.includes(amenity.id) ? 'bg-arctic-gold border-arctic-gold text-deep-night' : 'border-white/20 group-hover:border-white/50'}`}>
                        {selectedAmenities.includes(amenity.id) && <Check className="w-3 h-3" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)} 
                      /> 
                      {amenity.icon}
                      <span className="group-hover:text-arctic-gold transition-colors text-xs">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-black/20 py-4 px-6 lg:px-12 border-t border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => { setSelectedAmenities([]); setMinPrice(undefined); setMaxPrice(undefined); setShowFilters(false); }} 
                className="px-6 py-2 text-sm text-snow/50 hover:text-snow"
              >
                Reset Filters
              </button>
              <button 
                onClick={() => setShowFilters(false)} 
                className="px-6 py-2 bg-arctic-gold text-deep-night font-bold text-sm hover:bg-snow transition-colors rounded"
              >
                Apply Filters
              </button>
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
              <p className="text-snow/50 mt-1">{data?.count || stays.length} properties available</p>
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-white/10 text-xs px-3 py-2 outline-none focus:border-arctic-gold text-snow rounded"
            >
              <option value="recommended" className="bg-deep-night text-snow">Recommended</option>
              <option value="price_low" className="bg-deep-night text-snow">Price: Low to High</option>
              <option value="price_high" className="bg-deep-night text-snow">Price: High to Low</option>
              <option value="rating" className="bg-deep-night text-snow">Highest Rated</option>
            </select>
          </div>

          <AsyncStateWrapper
            isLoading={isLoading}
            error={error as Error | null}
            data={stays}
            emptyMessage="No stays found matching your criteria."
            errorMessage="Unable to load stays."
            skeleton={
              <div className={`grid ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/5 animate-pulse border border-white/5 rounded-lg"></div>)}
              </div>
            }
          >
            {(staysData) => (
              <>
                <div className={`grid ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {staysData.map((stay: any) => {
                    const priceNum = Number(stay.price_per_night) || 1800;
                    const stayUrl = checkInDate && checkOutDate 
                      ? `/stay/${stay.id}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestsCount}`
                      : `/stay/${stay.id}`;

                    return (
                      <Link
                        key={stay.id}
                        to={stayUrl}
                        className="group relative bg-white/5 border border-white/5 hover:border-arctic-gold/30 transition-all duration-500 flex flex-col overflow-hidden rounded-xl"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <OptimizedImage
                            src={stay.image_url || '/images/hotel_juvet_1787013813000.jpg'}
                            alt={stay.name}
                            fallbackSrc="/images/hotel_juvet_1787013813000.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {stay.eco_certified && (
                            <span className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white rounded">
                              Eco Certified
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] text-snow/50 uppercase tracking-widest font-bold">{stay.type?.replace(/_/g, ' ')}</div>
                            <div className="flex items-center gap-1 text-sm font-bold text-arctic-gold">
                              <Star className="w-3 h-3 fill-arctic-gold" /> {stay.rating || 4.8} <span className="text-snow/40 font-normal text-xs">(96)</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-display font-bold mb-1 group-hover:text-arctic-gold transition-colors">{stay.name}</h3>
                          <div className="text-xs text-snow/60 flex items-center gap-1 mb-4">
                            <MapPin className="w-3 h-3 text-arctic-gold" /> {(stay as any).locations?.name || 'Norway'}
                          </div>

                          <div className="flex gap-2 mb-4 flex-wrap">
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-snow/80">Breakfast Included</span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-snow/80">Free Wi-Fi</span>
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end">
                            <div>
                              <div className="text-xs text-snow/40 mb-1">
                                {nightsCount} night{nightsCount > 1 ? 's' : ''}, {guestsCount} guest{guestsCount > 1 ? 's' : ''}
                              </div>
                              <div className="text-xl font-bold text-snow">{formatPrice(priceNum * nightsCount)}</div>
                              <div className="text-[10px] text-snow/40">{formatPrice(priceNum)} / night • incl. MVA</div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-arctic-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              View Options <ArrowRight className="w-3.5 h-3.5" />
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
            
            {/* Map Markers */}
            <div className="absolute top-1/4 left-1/3 group cursor-pointer">
              <div className="bg-arctic-gold text-deep-night px-3 py-1 font-bold text-xs shadow-xl whitespace-nowrap group-hover:scale-110 transition-transform origin-bottom rounded">
                {formatPrice(2400)}
              </div>
              <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-t-arctic-gold border-l-transparent border-r-transparent mx-auto"></div>
            </div>

            <div className="absolute top-1/2 left-2/3 group cursor-pointer z-10">
              <div className="bg-white text-deep-night px-3 py-1 font-bold text-xs shadow-xl whitespace-nowrap group-hover:scale-110 group-hover:bg-arctic-gold transition-transform origin-bottom rounded">
                {formatPrice(3200)}
              </div>
              <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-t-white group-hover:border-t-arctic-gold border-l-transparent border-r-transparent mx-auto transition-colors"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stay;
