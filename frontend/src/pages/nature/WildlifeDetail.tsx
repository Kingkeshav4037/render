import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { Container } from '../../components/layout/Container';
import { ArrowLeft, Camera, ShieldAlert, MapPin, Calendar, Heart, Loader2, Map } from 'lucide-react';
import { wildlifeService, WildlifeSpecies, getWildlifeImage } from '../../services/wildlifeService';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';

export const WildlifeDetail = () => {
  const { id } = useParams(); // Using id as slug
  const [species, setSpecies] = useState<WildlifeSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (!id) return;
      setLoading(true);
      const data = await wildlifeService.getSpeciesBySlug(id);
      setSpecies(data);
      setLoading(false);
    };
    fetchSpecies();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-nordic-sage animate-spin" />
      </div>
    );
  }

  if (!species) {
    return (
      <div className="min-h-screen bg-snow flex flex-col items-center justify-center text-center p-8">
        <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-3xl font-display font-bold text-nordic-charcoal mb-4">Species Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">We couldn't find the wildlife species you're looking for. It may have been relocated.</p>
        <Link to="/wildlife" className="bg-nordic-charcoal text-white px-6 py-3 rounded-xl font-bold hover:bg-nordic-sage transition-colors">
          Return to Wildlife Explorer
        </Link>
      </div>
    );
  }

  const primaryHabitat = species.habitats?.[0];
  const galleryMedia = species.media?.filter(m => m.sort_order !== 0 && m.sort_order !== 1) || [];

  return (
    <div className="min-h-screen bg-snow text-nordic-charcoal pb-24">
      <SEO 
        title={`${species.common_name} (${species.scientific_name}) | Norway Wildlife Guide`}
        description={species.description}
      />
      {/* Hero */}
      <div className="relative h-[80vh]">
        <CinematicBackground 
          imageUrl={species.primary_image || getWildlifeImage(species.slug, species.common_name)}
          overlayOpacity={0.4}
          theme="nordicSage"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-snow via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12">
          <Container>
            <Link to="/wildlife" className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit drop-shadow-md font-medium">
              <ArrowLeft className="w-5 h-5" /> Back to Wildlife
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-white mb-2 drop-shadow-lg"
            >
              {species.common_name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-3xl text-nordic-sage font-serif italic mb-8 drop-shadow-md font-bold"
            >
              {species.scientific_name}
            </motion.p>
          </Container>
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 -mt-8 relative z-10">
          
          <div className="lg:col-span-2 flex flex-col gap-12">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-display font-bold mb-6">Overview</h2>
              <p className="text-lg text-slate leading-relaxed">{species.description}</p>
            </section>

            {species.behavior && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-display font-bold mb-6">Behaviour & Diet</h2>
                <p className="text-lg text-slate leading-relaxed">{species.behavior}</p>
                {species.facts && species.facts.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {species.facts.map((fact, idx) => (
                      <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium">
                        {fact}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {galleryMedia.length > 0 && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                  <Camera className="w-6 h-6 text-nordic-sage" /> Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {galleryMedia.map(m => (
                    <div key={m.id} className="w-full h-48 rounded-xl overflow-hidden">
                      <OptimizedImage 
                        src={m.media_url} 
                        alt={m.alt_text || species.common_name} 
                        category="wildlife"
                        className="w-full h-full object-cover" 
                        containerClassName="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Locations: Where to see it */}
            {species.related_locations && species.related_locations.length > 0 && (
              <section className="bg-arctic-mist p-8 rounded-3xl border border-gray-200">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                  <Map className="w-6 h-6 text-nordic-sage" /> Where to see it
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {species.related_locations.map(loc => (
                    <Link key={loc.id} to={`/explore/${loc.slug}`} className="bg-white p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-nordic-sage/10 flex items-center justify-center text-nordic-sage shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-nordic-charcoal">{loc.name}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{loc.type || 'Region'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-display font-bold mb-6">Species Fact File</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-nordic-sage shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-1">Region</h4>
                    <p className="text-nordic-charcoal font-medium">{primaryHabitat?.region || 'Various Regions'}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{primaryHabitat?.description}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-nordic-sage shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-1">Best Season</h4>
                    <p className="text-nordic-charcoal font-medium">
                      {primaryHabitat?.best_months ? primaryHabitat.best_months.join(', ') : 'Year Round'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {species.conservation_status && species.conservation_status !== 'Not Evaluated' && (
              <div className="bg-nordic-sage/10 p-8 rounded-3xl border border-nordic-sage/30">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-nordic-sage" /> Conservation
                </h3>
                <div className="bg-white px-4 py-2 rounded-xl text-nordic-charcoal font-bold inline-block mb-4 border border-gray-200 shadow-sm uppercase text-xs tracking-wider">
                  Status: {species.conservation_status}
                </div>
                <p className="text-sm text-slate mb-6">
                  Protecting Norway's wildlife is a shared responsibility. Respect habitats and follow local guidelines when observing animals in the wild.
                </p>
                <button className="w-full bg-nordic-charcoal text-white font-bold py-3 rounded-xl hover:bg-nordic-sage transition-colors flex justify-center items-center gap-2 text-sm">
                  <Heart className="w-4 h-4" /> Support Conservation
                </button>
              </div>
            )}
          </div>
          
        </div>
      </Container>
    </div>
  );
};
