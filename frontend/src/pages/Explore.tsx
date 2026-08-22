import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, X, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLocations } from '../hooks/useLocations';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { AsyncStateWrapper } from '../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../components/shared/OptimizedImage';
import { SEO } from '../components/shared/SEO';

const getPlaceholderImage = (name: string) => {
  const genericImages = [
    '/images/fjords_1786935800026.jpg', '/images/northern_lights_1786935879330.jpg', 
    '/images/trolltunga_1786936111320.jpg', '/images/ryten_1786936427556.jpg', '/images/besseggen_1786936349992.jpg',
    '/images/kjeragbolten_1786936275605.jpg', '/images/preikestolen_1786936002797.jpg', '/images/hotel_juvet_1787013813000.jpg', '/images/lofoten_1787013505867.jpg'
  ];
  
  const map: Record<string, string> = {
    'Geirangerfjord': '/images/fjords_1786935800026.jpg',
    'Tromsø': '/images/northern_lights_1786935879330.jpg',
    'Bergen': '/images/trolltunga_1786936111320.jpg',
    'Lofoten': '/images/lofoten_1787013505867.jpg',
    'Svalbard': '/images/besseggen_1786936349992.jpg',
    'Trøndelag': '/images/kjeragbolten_1786936275605.jpg',
    'Southern Norway': '/images/preikestolen_1786936002797.jpg',
    'Fjord Norway': '/images/fjords_1786935800026.jpg',
    'Northern Norway': '/images/northern_lights_1786935879330.jpg',
  };
  
  for (const key of Object.keys(map)) {
    if (name.includes(key)) return map[key];
  }
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % genericImages.length;
  return genericImages[index];
};

const TYPES = ['CITY', 'REGION', 'NATIONAL_PARK', 'FJORD', 'ISLAND', 'BEACH', 'VIEWPOINT', 'MUSEUM', 'LANDMARK', 'WILDLIFE', 'ATTRACTION'];

export const Explore = () => {
  const [searchParams] = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filters = {
    search: searchQuery || undefined,
    category: selectedTypes.length > 0 ? selectedTypes : undefined
  };

  const { data: fetchedDestinations, isLoading: loading, error } = useLocations(filters);
  const destinations = fetchedDestinations || [];

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      
      {/* Header */}
      <CinematicBackground 
        imageUrl="/images/ryten_1786936427556.jpg"
        gradient="aurora"
        overlayOpacity={0.7}
        className="h-[60vh] flex items-end pb-24"
        animate={false}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32">
          <div className="max-w-4xl">
            <span className="text-arctic-gold font-sans text-xs font-bold uppercase tracking-widest mb-4 block">The Atlas</span>
            <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6">Explore Norway</h1>
            
            {/* Search Input */}
            <div className="relative group max-w-2xl mt-8">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-snow/50 group-focus-within:text-arctic-gold transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text"
                placeholder="Search destinations, fjords, peaks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-snow/5 backdrop-blur-xl border border-snow/10 text-snow rounded-none py-6 pl-16 pr-6 outline-none focus:bg-snow/10 focus:border-arctic-gold/50 transition-all placeholder:text-snow/30 font-sans text-lg"
              />
            </div>
          </div>
        </div>
      </CinematicBackground>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 flex flex-col lg:flex-row gap-16 relative z-10 -mt-16">
        
        {/* Sidebar Filters */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-midnight border border-white/5 p-8 sticky top-32">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
              <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-snow">Filters</h3>
              {(selectedTypes.length > 0 || searchQuery) && (
                <button 
                  onClick={() => { setSelectedTypes([]); setSearchQuery(''); }}
                  className="text-xs text-nordic-red font-semibold uppercase hover:text-snow transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <h4 className="font-sans text-xs font-bold text-snow/50 mb-6 uppercase tracking-widest">Type</h4>
            <div className="flex flex-col gap-4">
              {TYPES.map(type => (
                <label key={type} className="flex items-center gap-4 cursor-pointer group">
                  <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                    selectedTypes.includes(type) ? 'bg-arctic-gold border-arctic-gold text-deep-night' : 'border-white/20 group-hover:border-arctic-gold'
                  }`}>
                    {selectedTypes.includes(type) && <X size={12} className="stroke-[3px]" />}
                  </div>
                  <span className={`font-sans text-sm tracking-wide ${selectedTypes.includes(type) ? 'text-snow' : 'text-snow/70 group-hover:text-snow'}`}>
                    {type.replace('_', ' ')}
                  </span>
                  <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-sm font-sans font-medium text-snow/60 uppercase tracking-widest">
              {loading ? 'Searching...' : `${destinations.length} Destinations`}
            </h2>
          </div>

          {/* Wildlife Integration Banner */}
          {!searchQuery && selectedTypes.length === 0 && (
            <div className="mb-12 relative overflow-hidden bg-midnight border border-white/5 group h-64 flex items-center">
              <div className="absolute inset-0 bg-[url('/images/wildlife_reindeer_1787013667019.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-deep-night via-deep-night/80 to-transparent opacity-90" />
              <div className="relative z-10 p-10 md:p-16 max-w-2xl">
                <span className="text-arctic-gold font-sans text-xs font-bold uppercase tracking-widest mb-3 block">First-Class Module</span>
                <h3 className="text-3xl font-display font-semibold mb-4 text-snow">Discover Norway's Wildlife</h3>
                <p className="font-sans text-snow/70 mb-6 line-clamp-2">Explore our dedicated wildlife portal. Track species, discover habitats, and find the best locations for whale watching, birding, and arctic safaris.</p>
                <Link to="/wildlife" className="inline-flex items-center gap-3 font-sans text-sm font-bold uppercase tracking-widest text-snow hover:text-arctic-gold transition-colors">
                  Enter Wildlife Explorer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          <AsyncStateWrapper
            isLoading={loading}
            error={error}
            data={destinations}
            emptyMessage="No destinations found. Try adjusting your filters or search term."
            errorMessage="Unable to load Norway destinations. Please try again."
            skeleton={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-midnight h-[500px] animate-pulse border border-white/5">
                    <div className="h-2/3 bg-white/5"></div>
                    <div className="p-8">
                      <div className="h-4 bg-white/10 w-1/4 mb-4"></div>
                      <div className="h-8 bg-white/10 w-3/4 mb-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            {(data) => (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {destinations.map((dest: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={dest.id} 
                  className="bg-midnight border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col group cursor-pointer relative h-[500px]"
                >
                  <Link to={`/explore/${dest.slug}`} className="absolute inset-0 z-10" />
                  
                  <div className="h-2/3 overflow-hidden relative bg-black">
                    <OptimizedImage
                      src={dest.hero_image_url || getPlaceholderImage(dest.name)}
                      alt={dest.name}
                      fallbackSrc="/images/fjords_1786935800026.jpg"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-6 left-6 bg-deep-night/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10">
                      {dest.type?.replace(/_/g, ' ') || 'DESTINATION'}
                    </div>
                    <FavoriteButton 
                      itemType="LOCATION" 
                      itemId={dest.id} 
                      className="absolute top-6 right-6 z-20 text-snow hover:text-nordic-red transition-colors" 
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow relative z-20">
                    <h4 className="font-display font-semibold text-2xl text-snow mb-3">{dest.name}</h4>
                    <p className="font-sans text-sm text-snow/60 line-clamp-2 leading-relaxed flex-grow">{dest.description}</p>
                    
                    <div className="flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-arctic-gold group/btn mt-auto">
                      Discover
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </AsyncStateWrapper>
        </div>
      </div>
    </div>
  );
};

export default Explore;
