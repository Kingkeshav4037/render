import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Utensils, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';
import { OptimizedImage } from '../shared/OptimizedImage';

export const FoodSection = () => {
  const { data: food, isLoading, error } = useQuery({
    queryKey: ['home', 'food'],
    queryFn: homeContentService.getFood,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-24 bg-white dark:bg-navy-900">
      <Container>
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center justify-center p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-4 tracking-tight">Taste of Norway</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                From fresh Arctic seafood to rich traditional dishes, explore Norway's culinary heritage.
              </p>
            </div>
            <Link to="/food" className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors">
              Discover all food <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-3xl" />
              ))
            ) : food?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-72 rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100 dark:border-white/5">
                  <OptimizedImage 
                    src={item.image} 
                    alt={item.name}
                    category="food"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                   <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{item.category}</span>
                    <span className="text-white/50">•</span>
                    <span className="text-xs font-semibold text-white/80">{item.origin_region}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 px-2">
                {item.short_description}
              </p>
              
              <div className="text-sm font-bold text-aurora-green flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-2 px-2">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/food" className="inline-flex items-center justify-center gap-2 bg-navy-900 dark:bg-white hover:bg-navy-800 dark:hover:bg-gray-100 text-white dark:text-navy-900 font-bold py-4 px-8 rounded-full transition-colors shadow-lg">
            Explore Culinary Experiences
          </Link>
        </div>
      </Container>
    </section>
  );
};

export const FoodSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Taste of Norway">
    <FoodSection />
  </SectionErrorBoundary>
);
