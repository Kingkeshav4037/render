import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';
import { OptimizedImage } from '../shared/OptimizedImage';

export const FeaturedDealsSection = () => {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['home', 'deals'],
    queryFn: homeContentService.getDeals,
  });

  if (error) {
    throw error;
  }

  if (!isLoading && (!deals || deals.length === 0)) {
    return null;
  }

  return (
    <section className="py-20 bg-emerald-950 text-white">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <Tag className="w-3.5 h-3.5" /> Limited Time
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Special Offers & Travel Deals
            </h2>
            <p className="text-emerald-100/70 text-base mb-8">
              Take advantage of exclusive seasonal discounts on fjord cruises, hotel stays, and guided expeditions.
            </p>
            <Link 
              to="/deals" 
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
            >
              See all offers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-3xl" />
              ))
            ) : deals?.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative h-48 rounded-3xl overflow-hidden group cursor-pointer shadow-md"
              >
                <OptimizedImage 
                  src={deal.image} 
                  alt={deal.title} 
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  containerClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/40 pointer-events-none"></div>
                
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm shadow-lg rotate-3 group-hover:rotate-6 transition-transform z-10">
                  {deal.discount}
                </div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">{deal.type}</span>
                  <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-emerald-400 transition-colors">{deal.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-1">{deal.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export const FeaturedDealsSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Deals">
    <FeaturedDealsSection />
  </SectionErrorBoundary>
);
