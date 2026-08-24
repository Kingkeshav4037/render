import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tent, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';
import { OptimizedImage } from '../shared/OptimizedImage';

export const ActivitiesSection = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['home', 'activities'],
    queryFn: homeContentService.getActivities,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-20 bg-gray-50/50 dark:bg-black/20">
      <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                <Tent className="w-3.5 h-3.5" /> Experiences
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 dark:text-white">
                Unforgettable Norwegian Adventures
              </h2>
            </div>
            <Link 
              to="/activities"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-aurora-green hover:underline group"
            >
              Explore all activities
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  <OptimizedImage 
                    src={activity.image} 
                    alt={activity.name}
                    category="activity"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-900 dark:text-white shadow-sm border border-white/20 z-10">
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
