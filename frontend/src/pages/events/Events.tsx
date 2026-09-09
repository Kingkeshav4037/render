import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService, Event, getEventFallbackDescription, getEventImage } from '../../services/eventService';
import { Calendar, MapPin, Search, Sparkles, X, Info, Ticket, ChevronRight, Share2, Check } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Festival', 'Concert', 'Sports', 'Cultural', 'Seasonal'];

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { addItem } = useCartStore();
  const { requireAuth } = useRequireAuth();

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
    const desc = e.description || getEventFallbackDescription(e.name, e.category, e.location_name);
    const matchesCategory = activeCategory === 'All' || (e.category || '').toLowerCase() === activeCategory.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      (e.name || '').toLowerCase().includes(query) || 
      desc.toLowerCase().includes(query) ||
      (e.location_name || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const getEventStatus = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now >= start && now <= end) return { label: 'Happening Now', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (now < start) return { label: 'Upcoming', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    return { label: 'Past', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };
  };

  const handleBuyTicket = (event: Event) => {
    requireAuth(() => {
      addItem({
        item_type: 'EVENT',
        item_id: event.id,
        name: event.name,
        unit_price: event.ticket_price,
        quantity: 1,
        image: getEventImage(event.name, event.category, event.image_url)
      });
      toast.success(`Added ticket for ${event.name} to cart`);
    }, { message: 'Sign in to book event tickets.' });
  };

  return (
    <div className="pt-24 min-h-screen bg-navy-900 text-white font-sans pb-24">
      <SEO 
        title="Norwegian Events, Festivals & Cultural Happenings | Norway SmartLife"
        description="Explore upcoming Norwegian festivals, music concerts, world cup winter sports, and cultural gatherings across Oslo, Bergen, Tromsø, and the Fjords."
        canonicalUrl="/events"
        ogType="website"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-3 border border-purple-500/20">
              <Sparkles size={13} /> Cultural Calendar 2026-2027
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Local <span className="text-purple-500">Events</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Discover festivals, concerts, and cultural moments across Norway. Every listing features comprehensive event descriptions, dates, and ticket details.
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search festivals, concerts, sports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 text-xs sm:text-sm border border-white/10 focus:border-purple-500 outline-none transition-all focus:bg-white/15"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2.5 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer
                ${activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'}`}
            >
              {cat}
            </button>
          ))}
          {(activeCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider cursor-pointer border border-red-500/20 bg-red-500/10 shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-gray-400">
          <span>Showing <strong className="text-white">{filteredEvents.length}</strong> listings with verified descriptions</span>
          {activeCategory !== 'All' && <span>Category: <strong className="text-purple-400">{activeCategory}</strong></span>}
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-3xl h-64 animate-pulse border border-white/10"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event, idx) => {
              const description = event.description || getEventFallbackDescription(event.name, event.category, event.location_name);
              const status = getEventStatus(event.start_date, event.end_date);
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row group shadow-xl"
                >
                  {/* Thumbnail / Date Badge */}
                  <div className="md:w-5/12 lg:w-4/12 h-60 md:h-auto min-h-[220px] relative overflow-hidden shrink-0">
                    <OptimizedImage 
                      src={getEventImage(event.name, event.category, event.image_url)} 
                      alt={event.name}
                      category="aurora"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/30" />
                    
                    {/* Calendar Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-white/20 z-10 shadow-lg">
                      <div className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">
                        {startDate.toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-2xl text-white font-extrabold font-display leading-tight">
                        {startDate.getDate()}
                      </div>
                    </div>

                    {/* Location Badge */}
                    {event.location_name && (
                      <div className="absolute bottom-4 left-4 bg-navy-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-200 border border-white/15 flex items-center gap-1.5 z-10">
                        <MapPin size={13} className="text-purple-400" />
                        {event.location_name}
                      </div>
                    )}
                  </div>

                  {/* Card Content & Description */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status and Category Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] sm:text-xs px-3 py-1 rounded-full border uppercase tracking-wider font-bold ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider font-bold">
                            {event.category}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300 text-xs sm:text-sm gap-1.5 font-medium">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {event.start_date !== event.end_date && ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors font-display">
                        {event.name}
                      </h2>
                      
                      {/* Guaranteed Event Description */}
                      <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 mb-6">
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Card Footer / Action */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Admission:</span>
                        <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                          {event.ticket_price > 0 ? `NOK ${event.ticket_price.toLocaleString()}` : 'Free Entry'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-4 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial cursor-pointer"
                        >
                          <Info size={15} /> Overview
                        </button>

                        <button 
                          onClick={() => handleBuyTicket(event)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-purple-600/30 flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer"
                        >
                          <Ticket size={16} />
                          {event.ticket_price > 0 ? 'Book Ticket' : 'Reserve Spot'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-8">
                <p className="text-gray-300 text-lg mb-2">No events match your current filter.</p>
                <p className="text-gray-500 text-sm mb-6">Try clearing your search query or selecting "All" categories.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Details Inspection Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-950 border border-white/20 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
              <div className="relative h-48 sm:h-64">
                <OptimizedImage 
                  src={getEventImage(selectedEvent.name, selectedEvent.category, selectedEvent.image_url)} 
                  alt={selectedEvent.name}
                  category="aurora"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors border border-white/20"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-display">
                    {selectedEvent.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Event Description</h4>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                    {selectedEvent.description || getEventFallbackDescription(selectedEvent.name, selectedEvent.category, selectedEvent.location_name)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-purple-400 shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase">Dates</div>
                      <div className="text-white font-medium">
                        {new Date(selectedEvent.start_date).toLocaleDateString()} - {new Date(selectedEvent.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="text-purple-400 shrink-0" size={18} />
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase">Location</div>
                      <div className="text-white font-medium">{selectedEvent.location_name || 'Norway Scenic Venue'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase">Admission Price</div>
                    <div className="text-2xl font-bold text-white font-mono">
                      {selectedEvent.ticket_price > 0 ? `NOK ${selectedEvent.ticket_price.toLocaleString()}` : 'Free Admission'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => {
                        handleBuyTicket(selectedEvent);
                        setSelectedEvent(null);
                      }}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
                    >
                      <Ticket size={16} /> Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;

