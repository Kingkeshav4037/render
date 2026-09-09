import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Eye, Map, Shield, Calendar, Leaf, ChevronLeft, ChevronRight, Search, Compass, AlertTriangle, Binoculars, Sparkles, PawPrint, Feather, Fish, X } from 'lucide-react';
import { useWildlife } from '../../hooks/useWildlife';
import { AsyncStateWrapper } from '../../components/shared/AsyncStateWrapper';
import { SEO } from '../../components/shared/SEO';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { getWildlifeImage } from '../../services/wildlifeService';

export const Wildlife = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');

  const { data, isLoading, error } = useWildlife({ 
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    region: selectedRegion !== 'All' ? selectedRegion : undefined,
    season: selectedSeason !== 'All' ? selectedSeason : undefined,
    searchTerm: searchTerm.trim() || undefined,
  }, page, limit);

  const species = data?.data || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.count / limit)) : 1;

  const categories = [
    { id: 'All', label: 'All Fauna', icon: Sparkles },
    { id: 'Mammals', label: 'Mammals', icon: PawPrint },
    { id: 'Birds', label: 'Birds', icon: Feather },
    { id: 'Marine', label: 'Marine Life', icon: Fish },
    { id: 'Other', label: 'Other Fauna', icon: Leaf },
  ];
  const regions = ['All', 'Svalbard', 'Northern Norway', 'Fjord Norway', 'Eastern Norway', 'Trøndelag'];
  const seasons = ['All', 'Summer', 'Winter', 'Spring', 'Autumn', 'Year-round'];

  return (
    <div className="min-h-screen bg-[#070D18] text-white font-sans pb-24">
      <SEO 
        title="Norwegian Wildlife & Arctic Fauna Field Guide | Norway SmartLife"
        description="Comprehensive field guide to Norway's wildlife: Polar bears, Atlantic puffins, muskoxen, reindeer, and orcas with ethical sighting locations and seasons."
        canonicalUrl="/wildlife"
        ogType="website"
        keywords="Norway wildlife, Arctic fauna, polar bear Svalbard, puffins Norway, muskox Dovrefjell, whale safari Norway"
      />
      {/* Documentary-style Hero */}
      <div className="relative h-[65vh] sm:h-[70vh] min-h-[460px]">
        <CinematicBackground 
          imageUrl="/images/wildlife_reindeer_1787013667019.jpg"
          overlayOpacity={0.6}
          theme="nordicSage"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 sm:w-16 h-1 bg-nordic-sage mb-6 sm:mb-8 rounded-full" />
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider sm:tracking-widest">
                Norway's Wildlife
              </h1>
              <p className="text-sm sm:text-lg md:text-2xl text-gray-200 font-light max-w-2xl font-serif italic mb-6 sm:mb-8">
                Meet the animals of Norway — from Arctic foxes and wild reindeer to whales, puffins and majestic birds of prey.
              </p>

              {/* Search Bar */}
              <div className="w-full max-w-md relative shadow-2xl">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search species (e.g. Polar Bear, Puffin)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Search wildlife species"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl bg-white/95 backdrop-blur-md text-nordic-charcoal placeholder-gray-400 font-medium text-xs sm:text-sm border-0 focus:ring-4 focus:ring-nordic-sage/50 outline-none transition-all"
                />
              </div>
            </motion.div>
          </Container>
        </div>
      </div>

      {/* Discovery Filters Bar */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-xl border-y border-nordic-sage/25 py-3.5 shadow-sm">
        <Container>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Category Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-nordic-charcoal/50 mr-1 hidden sm:inline-block shrink-0">
                Fauna:
              </span>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20 ring-1 ring-emerald-600'
                        : 'bg-nordic-sage/10 hover:bg-nordic-sage/20 text-nordic-charcoal border border-nordic-sage/25'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-700'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}

              {/* Synchronized accessible select for screen readers and automated tests */}
              <select 
                value={selectedCategory} 
                onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
                aria-label="Filter by wildlife category"
                className="sr-only"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Region & Season Dropdown Capsules & Reset */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
              
              {/* Region Capsule */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nordic-sage/10 border border-nordic-sage/25 text-nordic-charcoal shrink-0">
                <Map className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-nordic-charcoal/50 leading-none">Region</span>
                  <select 
                    value={selectedRegion} 
                    onChange={e => { setSelectedRegion(e.target.value); setPage(1); }}
                    aria-label="Filter by region"
                    className="bg-transparent border-none text-xs font-bold uppercase tracking-wider focus:ring-0 outline-none cursor-pointer text-nordic-charcoal pr-2"
                  >
                    <option value="All">All Regions</option>
                    {regions.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Season Capsule */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nordic-sage/10 border border-nordic-sage/25 text-nordic-charcoal shrink-0">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-nordic-charcoal/50 leading-none">Season</span>
                  <select 
                    value={selectedSeason} 
                    onChange={e => { setSelectedSeason(e.target.value); setPage(1); }}
                    aria-label="Filter by season"
                    className="bg-transparent border-none text-xs font-bold uppercase tracking-wider focus:ring-0 outline-none cursor-pointer text-nordic-charcoal pr-2"
                  >
                    <option value="All">All Seasons</option>
                    {seasons.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Clear / Reset Action */}
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || selectedSeason !== 'All' || searchTerm) && (
                <button 
                  onClick={() => { 
                    setSelectedCategory('All'); 
                    setSelectedRegion('All'); 
                    setSelectedSeason('All'); 
                    setSearchTerm(''); 
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-sm"
                  title="Clear all filters"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>

          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5" /> Arctic Biodiversity & Field Guide
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight mb-2">
              Species Field Guide
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium flex items-center gap-2">
              <span>
                Showing <strong className="text-emerald-400 font-bold">{data?.count ?? species.length}</strong>{' '}
                {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'fascinating'} species
              </span>
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || selectedSeason !== 'All' || searchTerm.trim()) && (
                <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  Filtered
                </span>
              )}
            </p>
          </div>

          {(selectedCategory !== 'All' || selectedRegion !== 'All' || selectedSeason !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRegion('All');
                setSelectedSeason('All');
                setSearchTerm('');
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/15 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5 text-red-400" /> Reset Filters
            </button>
          )}
        </div>

        <AsyncStateWrapper
          isLoading={isLoading}
          error={error as Error | null}
          data={species}
          emptyMessage="No species match your current filters. Try selecting 'All Fauna' or resetting filters."
          errorMessage="Failed to load wildlife data."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          {(loadedSpecies) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {loadedSpecies.map((animal, idx) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link to={`/wildlife/${animal.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-xl group-hover:shadow-2xl transition-all">
                      <OptimizedImage
                        src={getWildlifeImage(animal.slug, animal.common_name)}
                        alt={animal.common_name}
                        fallbackSrc="/images/wildlife_reindeer_1787013667019.jpg"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                      
                      {/* Meta Tags */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {animal.conservation_status === 'Endangered' || animal.conservation_status === 'Vulnerable' || (animal.conservation_status && animal.conservation_status.includes('Endangered')) || (animal.conservation_status && animal.conservation_status.includes('Vulnerable')) ? (
                          <div className="bg-red-500/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow-md">
                            <Shield className="w-3 h-3" /> {animal.conservation_status}
                          </div>
                        ) : null}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-3 group-hover:translate-y-0 transition-transform">
                        <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-2 font-extrabold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {animal.category || 'Mammals'}
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-1 group-hover:text-emerald-300 transition-colors">
                          {animal.common_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-serif italic mb-4 line-clamp-1">
                          {animal.scientific_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" /> View Field Guide
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="p-2.5 border border-white/20 rounded-xl text-white disabled:opacity-30 transition-all hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 border rounded-xl transition-all font-bold text-sm cursor-pointer ${
                        page === p 
                          ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-105' 
                          : 'border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="p-2.5 border border-white/20 rounded-xl text-white disabled:opacity-30 transition-all hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </AsyncStateWrapper>

        {/* Responsible Wildlife Observation Code */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
              <Shield className="w-4 h-4" /> Ethical Observation Code
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Responsible Wildlife Watching
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Norway's fauna thrives in fragile Arctic and alpine ecosystems. Adhere to these principles to preserve their natural behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-lg hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Binoculars className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Maintain Safe Distances</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Always use binoculars or telephoto lenses. For Muskox, maintain a strict 200m safety perimeter; never approach Polar Bears or seal haul-outs.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-lg hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Never Feed or Lure</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Feeding wildlife alters natural foraging behaviors and creates dangerous habituation. Keep all camp food and organic waste securely sealed.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-lg hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Leash Laws & Nesting Sanctuary</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Under Norway's <em>Hundeloven</em>, dogs must be kept on a leash from April 1 to August 20 to protect ground-nesting seabirds and reindeer calves.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Wildlife;
