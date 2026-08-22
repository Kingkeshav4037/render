import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { Eye, Map, Shield, Calendar, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWildlife } from '../../hooks/useWildlife';
import { AsyncStateWrapper } from '../../components/shared/AsyncStateWrapper';
import { SEO } from '../../components/shared/SEO';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { getWildlifeImage } from '../../services/wildlifeService';

export const Wildlife = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');

  const { data, isLoading, error } = useWildlife({ 
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    region: selectedRegion !== 'All' ? selectedRegion : undefined,
    season: selectedSeason !== 'All' ? selectedSeason : undefined,
  }, page, limit);

  const species = data?.data || [];
  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  // Compute available filter options based on actual data
  // Note: in a fully server-side filtered app, these might come from an aggregations endpoint.
  // For now we'll hardcode some logical options for Norway wildlife.
  const categories = ['All', 'Mammals', 'Birds', 'Marine', 'Other'];
  const regions = ['All', 'Svalbard', 'Northern Norway', 'Fjord Norway', 'Eastern Norway', 'Trøndelag'];
  const seasons = ['All', 'Summer', 'Winter', 'Spring', 'Autumn', 'Year-round'];

  return (
    <div className="min-h-screen bg-nordic-sage/10 text-nordic-charcoal font-sans pb-24">
      <SEO 
        title="Wildlife of Norway | SmartLife"
        description="Discover the magnificent wildlife of Norway from Polar Bears to Atlantic Puffins."
      />
      {/* Documentary-style Hero */}
      <div className="relative h-[70vh]">
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
              <div className="w-16 h-1 bg-nordic-sage mt-4" />
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
      </Container>
    </div>
  );
};

export default Wildlife;
