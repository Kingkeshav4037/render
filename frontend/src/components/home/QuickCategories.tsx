import { motion } from 'framer-motion';
import { Mountain, Waves, Map, Tent, Camera, Coffee, Hotel, Train, Snowflake, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';

const CATEGORIES = [
  { id: 'fjords', label: 'Fjords', icon: Waves },
  { id: 'mountains', label: 'Mountains', icon: Mountain },
  { id: 'aurora', label: 'Aurora', icon: Snowflake },
  { id: 'wildlife', label: 'Wildlife', icon: Camera },
  { id: 'food', label: 'Food', icon: Coffee },
  { id: 'stay', label: 'Hotels', icon: Hotel },
  { id: 'activities', label: 'Activities', icon: Tent },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'travel', label: 'Transport', icon: Train },
  { id: 'map', label: 'Smart Map', icon: Map },
];

export const QuickCategories = () => {
  return (
    <section className="py-12 bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-white/5 relative z-10 -mt-8 rounded-t-3xl">
      <Container>
        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                to={`/${cat.id}`}
                className="flex flex-col items-center gap-3 min-w-[80px] group focus:outline-none"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-gray-50 dark:bg-navy-800 text-navy-900 dark:text-white border border-gray-100 dark:border-white/10 group-hover:bg-aurora-green group-hover:text-navy-900 group-hover:border-aurora-green group-hover:shadow-[0_0_20px_rgba(0,255,135,0.3)] group-hover:-translate-y-1"
                >
                  <Icon size={28} />
                </motion.div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
