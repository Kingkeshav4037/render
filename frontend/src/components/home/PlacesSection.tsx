import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HomePlace } from '../../types/home';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';
import { OptimizedImage } from '../shared/OptimizedImage';

interface PlacesSectionProps {
  title: string;
  subtitle: string;
  queryKey: string[];
  queryFn: () => Promise<HomePlace[]>;
  viewAllLink: string;
}

export const PlacesSection = ({ title, subtitle, queryKey, queryFn, viewAllLink }: PlacesSectionProps) => {
  const { data: places, isLoading, error } = useQuery({
    queryKey,
    queryFn,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-800/50 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-2 tracking-tight">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          <Link to={viewAllLink} className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="min-w-[300px] md:min-w-[400px] h-80 rounded-3xl flex-shrink-0" />
            ))
          ) : places?.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] md:min-w-[400px] bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex-shrink-0 group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="h-56 overflow-hidden relative">
                <OptimizedImage 
                  src={place.image} 
                  alt={place.name}
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="w-full h-full"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-navy-900 dark:text-white border border-gray-100 dark:border-white/10 z-10">
                  {place.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 text-aurora-green" />
                  <span className="text-sm font-semibold uppercase tracking-wider">{place.region}</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-aurora-green transition-colors">
                  {place.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {place.short_description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to={viewAllLink} 
          className="mt-4 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const PlacesSectionWithBoundary = (props: PlacesSectionProps) => (
  <SectionErrorBoundary sectionName={props.title}>
    <PlacesSection {...props} />
  </SectionErrorBoundary>
);
