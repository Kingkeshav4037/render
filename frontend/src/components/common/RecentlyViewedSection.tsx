import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Trash2, ArrowRight } from 'lucide-react';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { OptimizedImage } from '../shared/OptimizedImage';

interface RecentlyViewedSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
  showClearAll?: boolean;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  DESTINATION: { bg: 'bg-fjord-teal/20', text: 'text-fjord-teal', label: 'Destination' },
  STAY: { bg: 'bg-aurora-violet/20', text: 'text-aurora-violet', label: 'Stay' },
  RESTAURANT: { bg: 'bg-arctic-gold/20', text: 'text-arctic-gold', label: 'Dining' },
  FOOD: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Food' },
  PRODUCT: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Shop' },
  ACTIVITY: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Activity' },
  ATTRACTION: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Attraction' },
  WILDLIFE: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Wildlife' },
  FLORA: { bg: 'bg-teal-500/20', text: 'text-teal-400', label: 'Flora' },
  PLACE: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Place' },
  TRAIL: { bg: 'bg-amber-600/20', text: 'text-amber-500', label: 'Trail' },
  FJORD: { bg: 'bg-sky-500/20', text: 'text-sky-400', label: 'Fjord' },
  MOUNTAIN: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'Mountain' },
  EVENT: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Event' },
};

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  title = 'Recently Viewed',
  subtitle = 'Pick up right where you left off',
  limit = 12,
  className = '',
  showClearAll = true,
}) => {
  const { items, removeItem, clearAll } = useRecentlyViewed();

  if (!items || items.length === 0) {
    return null;
  }

  const displayedItems = items.slice(0, limit);

  return (
    <section className={`py-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-arctic-gold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-snow flex items-center gap-2">
                {title}
                <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-arctic-gold/10 text-arctic-gold border border-arctic-gold/20">
                  {items.length}
                </span>
              </h2>
              {subtitle && <p className="text-sm text-snow/60 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {showClearAll && items.length > 0 && (
            <button
              onClick={() => clearAll()}
              className="text-xs text-snow/40 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-rose-400/30"
              title="Clear all recently viewed items"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>

        {/* Carousel / Cards Grid */}
        <div className="mt-6 flex gap-5 overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth">
          <AnimatePresence>
            {displayedItems.map(item => {
              const badge = TYPE_COLORS[item.item_type] || {
                bg: 'bg-white/10',
                text: 'text-snow/70',
                label: item.item_type,
              };

              return (
                <motion.div
                  key={`${item.item_type}-${item.item_id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="min-w-[240px] max-w-[240px] bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-arctic-gold/40 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col relative shrink-0 shadow-lg"
                >
                  {/* Remove Button */}
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(item.item_type, item.item_id);
                    }}
                    aria-label={`Remove ${item.title} from recently viewed`}
                    className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-midnight/80 backdrop-blur-md border border-white/10 text-snow/60 hover:text-snow hover:bg-rose-500/80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <Link to={item.route} className="flex-1 flex flex-col">
                    {/* Image */}
                    <div className="h-32 w-full overflow-hidden relative bg-midnight">
                      <OptimizedImage
                        src={item.image_url || '/images/trolltunga_1786936111320.jpg'}
                        alt={item.title}
                        fallbackSrc="/images/trolltunga_1786936111320.jpg"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-night/80 via-transparent to-transparent pointer-events-none" />

                      {/* Type Badge */}
                      <span
                        className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} backdrop-blur-md border border-white/10`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-display font-semibold text-sm text-snow group-hover:text-arctic-gold transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.metadata?.subtitle && (
                        <p className="text-xs text-snow/50 line-clamp-1 mt-0.5">
                          {item.metadata.subtitle}
                        </p>
                      )}
                      {item.metadata?.price && (
                        <p className="text-xs font-bold text-arctic-gold mt-1.5">
                          {item.metadata.price}
                        </p>
                      )}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-snow/40 group-hover:text-arctic-gold transition-colors">
                        <span>Continue exploring</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
