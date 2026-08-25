import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { eventService, Event } from '../../services/eventService';
import { Calendar, MapPin, Tag, Search, Sparkles, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';

const CATEGORIES = ['All', 'Festival', 'Concert', 'Sports', 'Cultural', 'Seasonal'];

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events.filter(e => {
    const matchesCategory = activeCategory === 'All' || e.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchTerm.trim() || 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getEventStatus = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now >= start && now <= end) return { label: 'Happening Now', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (now < start) return { label: 'Upcoming', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    return { label: 'Past', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };
  };

  return (
    <div className="pt-24 min-h-screen bg-navy-900 text-white font-sans">
      <SEO 
        title="Local Events, Festivals & Concerts | Norway SmartLife"
        description="Discover cultural festivals, sports tournaments, and live music across Norway."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Local <span className="text-purple-500">Events</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Discover festivals, concerts, and cultural moments across Norway.
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search festivals & events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 text-sm border border-white/10 focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-6 mb-8 gap-3 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer
                ${activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'}`}
            >
              {cat}
            </button>
          ))}
          {(activeCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="px-4 py-3 rounded-full text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl h-48 animate-pulse border border-white/10"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <OptimizedImage 
                    src={event.image_url} 
                    alt={event.name}
                    category="aurora"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-center border border-white/10 z-10">
                    <div className="text-xs text-purple-400 font-bold uppercase">{new Date(event.start_date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl text-white font-bold">{new Date(event.start_date).getDate()}</div>
                  </div>
                </div>

                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                     <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                     <div className="flex items-center gap-2 shrink-0">
                       {(() => {
                         const st = getEventStatus(event.start_date, event.end_date);
                         return (
                           <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold ${st.color}`}>
                             {st.label}
                           </span>
                         );
                       })()}
                       <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider font-bold">
                         {event.category}
                       </span>
                     </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6 max-w-2xl">{event.description}</p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                     <div className="space-y-2">
                       <div className="flex items-center text-gray-300 text-sm gap-2">
                         <Calendar className="w-4 h-4 text-purple-400" />
                         <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-right">
                          <span className="text-gray-400 text-xs block">Ticket</span>
                          <span className="text-xl font-bold text-white">NOK {event.ticket_price}</span>
                        </div>
                        <button 
                           onClick={() => {
                             addItem({
                               item_type: 'EVENT',
                               item_id: event.id,
                               name: event.name,
                               unit_price: event.ticket_price,
                               quantity: 1,
                               image: event.image_url
                             });
                           }}
                           className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto cursor-pointer"
                        >
                          Buy Ticket
                        </button>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                 No events found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
