import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const HotelsSection = () => {
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['home', 'hotels'],
    queryFn: homeContentService.getHotels,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-800/50">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-2 tracking-tight">Incredible Stays</h2>
            <p className="text-gray-500 dark:text-gray-400">From glass igloos to historic fjord hotels</p>
          </div>
          <Link to="/stay" className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors">
            View all stays <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 sm:h-48 rounded-3xl" />
            ))
          ) : hotels?.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-xl hover:border-aurora-green/30 transition-all flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-navy-900 dark:text-white shadow-sm flex items-center gap-1 border border-white/10">
                  <Star size={12} className="text-yellow-500 fill-current" /> {hotel.rating}
                </div>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={14} className="text-aurora-green" /> {hotel.city}, {hotel.region}
                  </div>
                  <span className="text-emerald-500 dark:text-emerald-400 font-black">{hotel.price_indicator}</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-1 group-hover:text-aurora-green transition-colors">{hotel.name}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">{hotel.category} Hotel</p>
                
                <div className="mt-auto flex gap-3">
                  <Link to={`/stay/${hotel.id}`} className="flex-1 bg-gray-50 dark:bg-navy-800 hover:bg-aurora-green dark:hover:bg-aurora-green text-navy-900 dark:text-white hover:text-navy-900 text-center py-2.5 rounded-xl font-bold text-sm transition-colors border border-gray-100 dark:border-white/5">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to="/stay" 
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          View all stays <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const HotelsSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Stays">
    <HotelsSection />
  </SectionErrorBoundary>
);
