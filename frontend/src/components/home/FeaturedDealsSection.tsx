import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const FeaturedDealsSection = () => {
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['home', 'deals'],
    queryFn: homeContentService.getDeals,
  });

  if (error) {
    throw error;
  }

  if (!isLoading && (!deals || deals.length === 0)) {
    return null; // Don't show the section if there are no deals
  }

  return (
    <section className="py-16 bg-emerald-50 dark:bg-emerald-900/10 border-y border-emerald-100 dark:border-emerald-900/30">
      <Container>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
              <Tag className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-navy-900 dark:text-white mb-4 tracking-tight">Featured Deals</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Exclusive offers on premium Norwegian experiences, hotels, and travel packages.
            </p>
            <Link 
              to="/deals" 
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              See all offers <ArrowRight className="w-4 h-4" />
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
                <img src={deal.image} alt={deal.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-navy-900/40"></div>
                
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                  {deal.discount}
                </div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
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
