import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tent, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const ActivitiesSection = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['home', 'activities'],
    queryFn: homeContentService.getActivities,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-navy-800/50 border-t border-gray-100 dark:border-white/5">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl mb-4">
              <Tent className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-4 tracking-tight">Adventure Awaits</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Book unforgettable experiences across Norway's stunning landscapes.
            </p>
          </div>
          <Link to="/activities" className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors">
            View all activities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
            ))
          ) : activities?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-white/10 transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-900 dark:text-white shadow-sm border border-white/20">
                  {activity.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4 group-hover:text-aurora-green transition-colors line-clamp-2">
                  {activity.name}
                </h3>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activity.duration}</span>
                    <span className="flex items-center gap-1 text-navy-900 dark:text-white font-bold"><DollarSign className="w-4 h-4 text-emerald-500" /> {activity.price} NOK</span>
                  </div>
                  
                  <Link to={`/activities/${activity.id}`} className="block w-full bg-gray-50 dark:bg-navy-800 hover:bg-aurora-green dark:hover:bg-aurora-green text-navy-900 dark:text-white hover:text-navy-900 text-center py-3 rounded-xl font-bold text-sm transition-colors border border-gray-100 dark:border-white/5">
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to="/activities" 
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          View all activities <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const ActivitiesSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Adventures">
    <ActivitiesSection />
  </SectionErrorBoundary>
);
