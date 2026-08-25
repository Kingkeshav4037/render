import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Eye, Map, Shield, Calendar, Leaf, ChevronLeft, ChevronRight, Search, Compass, AlertTriangle, Binoculars } from 'lucide-react';
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
  }, page, limit);

  const rawSpecies = data?.data || [];
  const species = searchTerm.trim() 
    ? rawSpecies.filter(s => 
        s.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.norwegian_name && s.norwegian_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : rawSpecies;

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  const categories = ['All', 'Mammals', 'Birds', 'Marine', 'Other'];
  const regions = ['All', 'Svalbard', 'Northern Norway', 'Fjord Norway', 'Eastern Norway', 'Trøndelag'];
  const seasons = ['All', 'Summer', 'Winter', 'Spring', 'Autumn', 'Year-round'];

  return (
    <div className="min-h-screen bg-nordic-sage/10 text-nordic-charcoal font-sans pb-24">
      <SEO 
        title="Wildlife of Norway | SmartLife Nature Guide"
        description="Discover the magnificent wildlife of Norway from Polar Bears and Arctic Foxes to Atlantic Puffins and Orcas."
      />
      {/* Documentary-style Hero */}
      <div className="relative h-[70vh] min-h-[500px]">
        <CinematicBackground 
          imageUrl="/images/wildlife_reindeer_1787013667019.jpg"
          overlayOpacity={0.6}
          theme="nordicSage"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-1 bg-nordic-sage mb-8" />
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase tracking-widest">
                Norway's Wildlife
              </h1>
              <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl font-serif italic mb-8">
                Meet the animals of Norway — from Arctic foxes and wild reindeer to whales, puffins and majestic birds of prey.
              </p>

              {/* Search Bar */}
              <div className="w-full max-w-md relative shadow-2xl">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search species (e.g. Polar Bear, Puffin, Orca)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md text-nordic-charcoal placeholder-gray-400 font-medium text-sm border-0 focus:ring-4 focus:ring-nordic-sage/50 outline-none transition-all"
                />
              </div>
            </motion.div>
          </Container>
        </div>
      </div>

      {/* Discovery Filters */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-y border-nordic-sage/20 py-4 shadow-sm">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-nordic-sage" />
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent border-none text-sm font-bold uppercase tracking-wider focus:ring-0 outline-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-nordic-sage" />
              <select 
                value={selectedRegion} 
                onChange={e => setSelectedRegion(e.target.value)}
                className="bg-transparent border-none text-sm font-bold uppercase tracking-wider focus:ring-0 outline-none cursor-pointer"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-nordic-sage" />
              <select 
                value={selectedSeason} 
                onChange={e => setSelectedSeason(e.target.value)}
                className="bg-transparent border-none text-sm font-bold uppercase tracking-wider focus:ring-0 outline-none cursor-pointer"
              >
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {(selectedCategory !== 'All' || selectedRegion !== 'All' || selectedSeason !== 'All' || searchTerm) && (
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedRegion('All'); setSelectedSeason('All'); setSearchTerm(''); }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-bold text-nordic-charcoal mb-2">Species Field Guide</h2>
            <p className="text-nordic-charcoal/60">Showing {data?.count || 0} fascinating species</p>
          </div>
        </div>

        <AsyncStateWrapper
          isLoading={isLoading}
          error={error as Error | null}
          data={species}
          emptyMessage="No species match your current filters. Try broadening your search."
          errorMessage="Failed to load wildlife data."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[3/4] bg-nordic-sage/10 animate-pulse" />
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
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <Link to={`/wildlife/${animal.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-nordic-sage/10">
                      <OptimizedImage
                        src={getWildlifeImage(animal.slug, animal.common_name)}
                        alt={animal.common_name}
                        fallbackSrc="/images/wildlife_reindeer_1787013667019.jpg"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                      
                      {/* Meta Tags */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {animal.conservation_status === 'Endangered' || animal.conservation_status === 'Vulnerable' ? (
                          <div className="bg-red-500/90 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 flex items-center gap-1 backdrop-blur-sm">
                            <Shield className="w-3 h-3" /> {animal.conservation_status}
                          </div>
                        ) : null}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <div className="text-[10px] uppercase tracking-widest text-nordic-sage mb-2 font-bold">
                          {animal.category || 'Wildlife'}
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-1">
                          {animal.common_name}
                        </h3>
                        <p className="text-sm text-white/60 font-serif italic mb-4">
                          {animal.scientific_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nordic-sage opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" /> View Guide
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
                    className="p-2 border border-nordic-sage/20 text-nordic-charcoal disabled:opacity-30 transition-opacity hover:bg-nordic-sage/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 border transition-colors ${
                        page === p 
                          ? 'border-nordic-sage bg-nordic-sage text-white' 
                          : 'border-nordic-sage/20 text-nordic-charcoal hover:bg-nordic-sage/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-nordic-sage/20 text-nordic-charcoal disabled:opacity-30 transition-opacity hover:bg-nordic-sage/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </AsyncStateWrapper>

        {/* Responsible Wildlife Observation Code */}
        <div className="mt-20 pt-16 border-t border-nordic-sage/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nordic-sage/20 text-nordic-sage font-bold text-xs uppercase tracking-widest mb-4">
              <Shield className="w-4 h-4" /> Ethical Observation Code
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-nordic-charcoal mb-4">
              Responsible Wildlife Watching
            </h2>
            <p className="text-nordic-charcoal/70 text-sm leading-relaxed">
              Norway's fauna thrives in fragile Arctic and alpine ecosystems. Adhere to these principles to preserve their natural behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-nordic-sage/20 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-nordic-sage/10 text-nordic-sage flex items-center justify-center mb-6">
                <Binoculars className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-nordic-charcoal mb-3">Maintain Safe Distances</h3>
              <p className="text-sm text-nordic-charcoal/70 leading-relaxed">
                Always use binoculars or telephoto lenses. For Muskox, maintain a strict 200m safety perimeter; never approach Polar Bears or seal haul-outs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-nordic-sage/20 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-nordic-charcoal mb-3">Never Feed or Lure</h3>
              <p className="text-sm text-nordic-charcoal/70 leading-relaxed">
                Feeding wildlife alters natural foraging behaviors and creates dangerous habituation. Keep all camp food and organic waste securely sealed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-nordic-sage/20 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-nordic-charcoal mb-3">Leash Laws & Nesting Sanctuary</h3>
              <p className="text-sm text-nordic-charcoal/70 leading-relaxed">
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
