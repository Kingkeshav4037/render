import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Landmark, ArrowRight, Compass, History, BookOpen, Sparkles, Filter, Building2, Camera, ShieldCheck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocations } from '../../hooks/useLocations';
import { Location } from '../../services/map/mapService';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { AsyncStateWrapper } from '../../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { PageHeader } from '../../components/ui/PageHeader';
import { SEO } from '../../components/shared/SEO';

const REGIONS = ['ALL', 'Fjord Norway', 'Eastern Norway', 'Northern Norway', 'Trøndelag', 'Southern Norway'];
const PLACE_TYPES = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Landmarks', value: 'LANDMARK' },
  { label: 'Viewpoints', value: 'VIEWPOINT' },
  { label: 'Museums & Heritage', value: 'MUSEUM' },
  { label: 'Stave Churches', value: 'STAVE_CHURCH' },
];

const FEATURED_PLACES = [
  {
    title: "Heddal Stave Church",
    category: "UNESCO Stave Church",
    region: "Telemark / Eastern Norway",
    description: "Norway's largest triple-nave wooden stave church, built in the early 13th century and steeped in medieval legend.",
    image: "https://images.unsplash.com/photo-1548625361-195feee1361c?q=heddal+stave+church+norway&w=1200",
    slug: "heddal-stave-church",
    tags: ["Medieval", "Architecture", "13th Century"]
  },
  {
    title: "Stegastein Viewpoint",
    category: "Scenic Viewpoint",
    region: "Aurland / Fjord Norway",
    description: "A cantilevered wooden platform jutting 30 meters out into thin air, 650 meters above the Aurlandsfjord.",
    image: "/images/fjords_1786935800026.jpg",
    slug: "flam",
    tags: ["Panoramic", "Architecture", "National Tourist Route"]
  },
  {
    title: "Arctic Cathedral",
    category: "Architectural Landmark",
    region: "Tromsø / Northern Norway",
    description: "Ishavskatedralen's striking triangular glacier-inspired modernist structure illuminated under polar nights.",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=arctic+cathedral+tromso&w=1200",
    slug: "tromso",
    tags: ["Modernist", "Arctic", "Midnight Sun"]
  }
];

const getPlaceholderImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('church') || n.includes('stave') || n.includes('kirke')) {
    return 'https://images.unsplash.com/photo-1548625361-195feee1361c?q=stave+church+norway&w=1200';
  }
  if (n.includes('cathedral') || n.includes('ishavskatedralen') || n.includes('nidaros')) {
    return 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=arctic+cathedral+tromso&w=1200';
  }
  if (n.includes('viewpoint') || n.includes('stegastein') || n.includes('flydalsjuvet') || n.includes('fjord')) {
    return '/images/fjords_1786935800026.jpg';
  }
  if (n.includes('museum') || n.includes('munch') || n.includes('opera') || n.includes('oslo')) {
    return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=oslo+opera+house+museum+architecture&w=1200';
  }
  return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=norway+landmarks+architecture&w=1200';
};

export const Places = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const { data: fetchedPlaces, isLoading, error } = useLocations({
    category: selectedType === 'ALL' ? ['LANDMARK', 'MUSEUM', 'VIEWPOINT'] : [selectedType]
  });

  const places: Location[] = useMemo(() => {
    return (fetchedPlaces as Location[]) || [];
  }, [fetchedPlaces]);

  const filteredPlaces = useMemo(() => {
    return places.filter((p: Location) => {
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.region && p.region.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'ALL' || 
        (p.region && p.region.toLowerCase() === selectedRegion.toLowerCase()) ||
        (selectedRegion === 'Northern Norway' && (p.name.includes('Tromsø') || p.name.includes('Alta') || p.name.includes('Svalbard') || p.name.includes('Lofoten'))) ||
        (selectedRegion === 'Fjord Norway' && (p.name.includes('Bergen') || p.name.includes('Flåm') || p.name.includes('Geiranger') || p.name.includes('Stavanger') || p.name.includes('Ålesund'))) ||
        (selectedRegion === 'Eastern Norway' && (p.name.includes('Oslo') || p.name.includes('Lillehammer') || p.name.includes('Heddal')));

      const matchesType = selectedType === 'ALL' ||
        (p.type && p.type.toUpperCase() === selectedType.toUpperCase()) ||
        (selectedType === 'STAVE_CHURCH' && (p.name.toLowerCase().includes('church') || p.name.toLowerCase().includes('stave')));

      return matchesSearch && matchesRegion && matchesType;
    });
  }, [places, searchQuery, selectedRegion, selectedType]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('ALL');
    setSelectedType('ALL');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedRegion !== 'ALL' || selectedType !== 'ALL';

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      <SEO 
        title="Iconic Places & Landmarks | Norway SmartLife"
        description="Discover historical landmarks, UNESCO heritage stave churches, scenic viewpoints, and architectural marvels across Norway."
      />

      {/* 1. Places Hero */}
      <PageHeader
        title="Iconic Places & Landmarks"
        description="From 800-year-old stave churches and coastal lighthouses to cutting-edge Nordic architectural viewpoints, explore Norway's most notable places."
        breadcrumb="Places"
        backgroundImage="https://images.unsplash.com/photo-1548625361-195feee1361c?q=norway+stave+church+places+landmark&w=1600"
      >
        <div className="flex flex-wrap items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/80">
            <Landmark className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Historical Monuments & Architecture</span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <Compass className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Scenic Viewpoints & UNESCO Heritage</span>
          </div>
        </div>
      </PageHeader>

      {/* 2. Introduction to Discovering Norway */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-midnight/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="lg:col-span-2">
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-2">Heritage & Design</span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-snow mb-4">
              Where Ancient Heritage Meets Modern Nordic Design
            </h2>
            <p className="text-snow/75 text-base leading-relaxed mb-6 font-light">
              Norway’s built environment is inextricably linked with its rugged geography. Medieval timber craftsmanship in 12th-century stave churches stands alongside bold contemporary architecture along the 18 National Tourist Routes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/history"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-snow text-xs font-bold uppercase tracking-wider transition-all border border-white/15"
              >
                <History className="w-4 h-4 text-arctic-gold" /> Explore Norway History
              </Link>
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-snow text-xs font-bold uppercase tracking-wider transition-all border border-white/15"
              >
                <BookOpen className="w-4 h-4 text-arctic-gold" /> Curated Travel Guides
              </Link>
            </div>
          </div>
          <div className="bg-deep-night/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 text-arctic-gold mb-4">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Heritage Preservation</span>
            </div>
            <p className="text-xs text-snow/70 leading-relaxed mb-4">
              Norway protects 28 surviving medieval stave churches and over 1,000 listed historical monuments under the Directorate for Cultural Heritage (*Riksantikvaren*).
            </p>
            <span className="text-[11px] text-snow/50 italic">Respect heritage guidelines and historic timber preservation.</span>
          </div>
        </div>
      </section>

      {/* 3. Featured / Popular Places */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Spotlight</span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Featured Notable Places</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PLACES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-midnight border border-white/10 rounded-2xl overflow-hidden group flex flex-col hover:border-arctic-gold/50 transition-all shadow-lg"
            >
              <div className="h-60 relative overflow-hidden bg-black/40">
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10 rounded-lg">
                  {item.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-arctic-gold font-bold uppercase tracking-wider mb-2">
                  <MapPin size={13} />
                  <span>{item.region}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-snow mb-2 group-hover:text-arctic-gold transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-snow/70 leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-snow/60">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/explore/${item.slug}`}
                  className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-snow transition-colors"
                >
                  <span>Explore Location Details</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Search & Discovery Filter Bar */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-4 relative z-20">
        <div className="bg-midnight border border-white/10 p-6 rounded-3xl flex flex-col gap-6 shadow-2xl">
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-snow/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search places, stave churches, viewpoints, architectural sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-snow placeholder:text-snow/30 text-sm outline-none focus:border-arctic-gold transition-colors"
            />
          </div>

          {/* Place Type Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-snow/50 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Type:
              </span>
              {PLACE_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedType === t.value
                      ? 'bg-arctic-gold text-deep-night shadow-md'
                      : 'bg-white/5 text-snow/70 hover:bg-white/10 hover:text-snow border border-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Region Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-snow/50 mr-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Region:
              </span>
              {REGIONS.map(reg => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-white/20 text-snow border border-arctic-gold'
                      : 'bg-white/5 text-snow/60 hover:bg-white/10 hover:text-snow border border-white/10'
                  }`}
                >
                  {reg}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-nordic-red hover:text-snow transition-colors uppercase tracking-wider ml-2"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. All Filtered Places Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-xl font-display font-semibold text-snow">
            All Notable Places
          </h2>
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-snow/60">
            {isLoading ? 'Searching...' : `${filteredPlaces.length} Places Found`}
          </span>
        </div>

        <AsyncStateWrapper
          isLoading={isLoading}
          error={error}
          data={filteredPlaces}
          emptyMessage="No notable places match your search criteria."
          errorMessage="Unable to load places. Please try again."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-midnight h-[420px] animate-pulse border border-white/5 rounded-2xl" />
              ))}
            </div>
          }
        >
          {(placesList: Location[]) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placesList.map((place: Location, idx: number) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/explore/${place.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/explore/${place.slug}`); }}
                  tabIndex={0}
                  role="link"
                  aria-label={`Explore ${place.name}`}
                  className="bg-midnight border border-white/10 hover:border-arctic-gold/50 transition-all duration-500 rounded-2xl overflow-hidden group flex flex-col relative shadow-md cursor-pointer select-none"
                >
                  <Link to={`/explore/${place.slug}`} className="absolute inset-0 z-10" aria-label={place.name} />

                  <div className="h-64 relative overflow-hidden bg-black/40 pointer-events-none">
                    <OptimizedImage
                      src={place.hero_image_url || place.image_url || getPlaceholderImage(place.name)}
                      alt={place.name}
                      category="landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10 rounded-lg">
                      {place.type?.replace(/_/g, ' ') || 'LANDMARK'}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <FavoriteButton
                      itemType="LOCATION"
                      itemId={place.id}
                      className="w-9 h-9 text-snow hover:text-nordic-red transition-colors shadow-lg"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-xs text-arctic-gold font-bold uppercase tracking-wider mb-2">
                      <MapPin size={13} />
                      <span>{place.region || 'Norway'}</span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-snow mb-3 group-hover:text-arctic-gold transition-colors">
                      {place.name}
                    </h3>

                    <p className="font-sans text-sm text-snow/70 line-clamp-2 leading-relaxed mb-6 flex-1">
                      {place.description}
                    </p>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold">
                      <span>Explore Place Details</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AsyncStateWrapper>
      </section>

      {/* 6. Related Travel Inspiration */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 border-t border-white/10">
        <div className="bg-gradient-to-r from-midnight via-midnight/80 to-[#1e1c14] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-2">Planning Your Visit</span>
            <h3 className="text-3xl font-display font-bold text-snow mb-3">Combine Historic Places with Scenic Rail & Fjord Travel</h3>
            <p className="text-sm text-snow/70 max-w-2xl leading-relaxed">
              Many of Norway’s most iconic landmarks are accessible via the historic Flåm Railway, Bergen Line, or coastal Hurtigruten express ships.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/travel"
              className="px-6 py-3.5 bg-arctic-gold hover:bg-white text-deep-night font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
            >
              Public Transit & Scenic Trains
            </Link>
            <Link
              to="/activities"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-snow font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/20"
            >
              Explore Activities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Places;
