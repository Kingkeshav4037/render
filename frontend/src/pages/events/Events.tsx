import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { eventService, Event } from '../../services/eventService';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { useCart } from '../../store/useCartStore';

const CATEGORIES = ['All', 'Festival', 'Concert', 'Sports', 'Cultural', 'Seasonal'];

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="pt-24 min-h-screen bg-navy-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Local <span className="text-purple-500">Events</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Discover festivals, concerts, and cultural moments across Norway.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-6 mb-8 gap-3 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
                ${activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'}`}
            >
              {cat}
            </button>
          ))}
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
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800'} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-center border border-white/10">
                    <div className="text-xs text-purple-400 font-bold uppercase">{new Date(event.start_date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl text-white font-bold">{new Date(event.start_date).getDate()}</div>
                  </div>
                </div>

                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                     <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider font-bold">
                       {event.category}
                     </span>
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
                               quantity: 1
                             });
                             alert('Event ticket added to cart!');
                           }}
                           className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
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
