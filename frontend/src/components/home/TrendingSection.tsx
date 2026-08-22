import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const TrendingSection = () => {
  const { data: places, isLoading, error } = useQuery({
    queryKey: ['home', 'trending'],
    queryFn: homeContentService.getTrendingPlaces,
  });

  if (error) {
    throw error; // Let SectionErrorBoundary catch it
  }

  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-2 tracking-tight">Trending in Norway</h2>
            <p className="text-gray-500 dark:text-gray-400">The most popular destinations right now</p>
          </div>
          <Link 
            to="/explore?sort=trending" 
            className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))
          ) : places?.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
            >
              <img 
                src={place.image} 
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/20">
                <Star className="w-4 h-4 text-aurora-green fill-current" />
                <span className="text-white text-sm font-bold">{place.rating}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-aurora-green mb-2">
                  <MapPin size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">{place.region}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{place.name}</h3>
                <p className="text-white/70 text-sm line-clamp-2">{place.short_description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to="/explore?sort=trending" 
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const TrendingSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Trending Places">
    <TrendingSection />
  </SectionErrorBoundary>
);
