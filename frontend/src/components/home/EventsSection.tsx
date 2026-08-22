import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeContentService } from '../../services/home/homeContentService';
import { Container } from '../layout/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionErrorBoundary } from '../shared/SectionErrorBoundary';

export const EventsSection = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['home', 'events'],
    queryFn: homeContentService.getEvents,
  });

  if (error) {
    throw error;
  }

  return (
    <section className="py-24 bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-white/5">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-2 tracking-tight">Upcoming Events</h2>
            <p className="text-gray-500 dark:text-gray-400">Festivals, concerts, and cultural experiences</p>
          </div>
          <Link 
            to="/events" 
            className="hidden md:flex items-center gap-1 text-aurora-green font-bold hover:text-emerald-500 transition-colors"
          >
            View calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-3xl" />
            ))
          ) : events?.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all group"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img src={event.image} alt={event.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-aurora-green uppercase tracking-wider mb-1">{event.category}</div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-aurora-green transition-colors">{event.name}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to="/events" 
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-aurora-green font-bold bg-aurora-green/10 py-3 rounded-xl hover:bg-aurora-green/20 transition-colors"
        >
          View calendar <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
    </section>
  );
};

export const EventsSectionWithBoundary = () => (
  <SectionErrorBoundary sectionName="Upcoming Events">
    <EventsSection />
  </SectionErrorBoundary>
);
