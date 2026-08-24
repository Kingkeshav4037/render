import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';
import { Container } from '../components/layout/Container';
import { Search, ArrowRight, MapPin, Clock, Star, Utensils, Mountain, Leaf, Snowflake, Calendar } from 'lucide-react';
import { homeContentService, getActivityImage } from '../services/home/homeContentService';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { SEO } from '../components/shared/SEO';
import { OptimizedImage } from '../components/shared/OptimizedImage';

const HERO_IMAGE = '/images/northern_lights_1786935879330.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { formatPrice } = useCurrencyStore();

  const [destinations, setDestinations] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [wildlife, setWildlife] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    homeContentService.getTrendingPlaces().then(setDestinations).catch(() => {});
    homeContentService.getActivities().then(setActivities).catch(() => {});
    homeContentService.getFood().then(setFoods).catch(() => {});
    homeContentService.getWildlife().then(setWildlife).catch(() => {});
    homeContentService.getHotels().then(setHotels).catch(() => {});
    homeContentService.getRestaurants().then(setRestaurants).catch(() => {});
    homeContentService.getEvents().then(setEvents).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="w-full bg-deep-night text-snow selection:bg-arctic-gold/30">
      <SEO
        title="Norway SmartLife – Discover Norway Differently"
        description="Plan your perfect Norwegian adventure. Explore fjords, northern lights, hiking, wildlife, and world-class cuisine."
        ogImage={HERO_IMAGE}
      />

      {/* ── 1. CINEMATIC HERO ───────────────────────────────────────── */}
      <CinematicBackground
        imageUrl={HERO_IMAGE}
        gradient="aurora"
        overlayOpacity={0.55}
        className="h-screen flex items-end"
      >
        <Container className="relative z-10 pb-20 pt-32">
          <motion.div className="max-w-4xl" {...fadeUp}>
            <span className="inline-flex items-center gap-2 text-arctic-gold text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-8 h-px bg-arctic-gold" /> Norway SmartLife
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
              Discover Norway<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-arctic-gold via-snow to-fjord-teal">
                differently.
              </span>
            </h1>
            <p className="text-lg md:text-xl font-sans text-snow/75 max-w-2xl mb-12 leading-relaxed">
              Fjords. Aurora. Wilderness. Sustainability. Your intelligent guide to Norway's most extraordinary experiences.
            </p>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-5 py-4 hover:bg-white/5 rounded-xl transition-colors cursor-text">
                <Search className="w-5 h-5 text-arctic-gold shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-snow/50">Explore</span>
                  <input
                    type="text"
                    placeholder="Fjords, Northern Lights, Bergen…"
                    className="bg-transparent border-none outline-none text-sm font-sans font-medium text-snow placeholder-snow/40 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="py-4 px-8 bg-arctic-gold text-deep-night font-bold rounded-xl hover:bg-snow transition-colors flex items-center gap-2 text-sm shrink-0"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { label: 'Fjord Cruises', to: '/activities?type=CRUISE' },
                { label: 'Northern Lights', to: '/activities?type=AURORA' },
                { label: 'Hiking Trails', to: '/activities?type=HIKING' },
                { label: 'Wildlife', to: '/wildlife' },
              ].map(q => (
                <Link key={q.label} to={q.to}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-bold uppercase tracking-wider transition-colors">
                  {q.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </Container>
      </CinematicBackground>

      {/* ── 2. STATS STRIP ──────────────────────────────────────────── */}
      <div className="bg-white/5 border-y border-white/10 py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: '25,000+', label: 'km of Coastline' },
              { value: '1,190+', label: 'Fjords & Inlets' },
              { value: '48', label: 'National Parks' },
              { value: '100%', label: 'Pure Nature' },
            ].map((stat, i) => (
              <div key={i} className="px-6 text-center">
                <p className="text-2xl md:text-3xl font-display font-bold text-arctic-gold">{stat.value}</p>
                <p className="text-xs text-snow/50 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-20 space-y-28">

        {/* ── 3. FEATURED DESTINATIONS ────────────────────────────── */}
        {destinations.length > 0 && (
          <motion.section {...fadeUp}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-arctic-gold text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                  <MapPin className="w-3 h-3" /> Iconic Norway
                </span>
                <h2 className="text-4xl font-display font-bold">Featured Destinations</h2>
              </div>
              <Link to="/explore" className="hidden md:flex items-center gap-2 text-sm text-snow/60 hover:text-snow transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* First card large, rest 3 smaller in a row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Hero card */}
              {destinations[0] && (
                <Link to={`/explore/${destinations[0].slug || destinations[0].id}`}
                  className="lg:col-span-2 relative overflow-hidden rounded-2xl group block" style={{ height: 440 }}>
                  <OptimizedImage 
                    src={destinations[0].image} 
                    alt={destinations[0].name}
                    category="landscape"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 p-8 z-10">
                    <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest">{destinations[0].region}</span>
                    <h3 className="text-3xl font-display font-bold mt-1 mb-2">{destinations[0].name}</h3>
                    <p className="text-snow/70 text-sm max-w-sm line-clamp-2">{destinations[0].short_description}</p>
                    <div className="flex items-center gap-1 mt-3 text-arctic-gold text-sm font-bold">
                      <Star className="w-4 h-4 fill-arctic-gold" /> {destinations[0].rating}
                    </div>
                  </div>
                </Link>
              )}

              {/* 2 stacked cards */}
              <div className="flex flex-col gap-5">
                {destinations.slice(1, 3).map(dest => (
                  <Link key={dest.id} to={`/explore/${dest.slug || dest.id}`}
                    className="relative overflow-hidden rounded-2xl group block flex-1" style={{ minHeight: 205 }}>
                    <OptimizedImage 
                      src={dest.image} 
                      alt={dest.name}
                      category="landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-5 z-10">
                      <span className="text-arctic-gold text-[10px] font-bold uppercase tracking-widest">{dest.region}</span>
                      <h3 className="text-xl font-display font-bold mt-0.5">{dest.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Remaining destinations in a row */}
            {destinations.length > 3 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
                {destinations.slice(3).map(dest => (
                  <Link key={dest.id} to={`/explore/${dest.slug || dest.id}`}
                    className="relative overflow-hidden rounded-xl group block" style={{ height: 200 }}>
                    <OptimizedImage 
                      src={dest.image} 
                      alt={dest.name}
                      category="landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-5 z-10">
                      <span className="text-arctic-gold text-[10px] font-bold uppercase tracking-widest">{dest.region}</span>
                      <h3 className="text-lg font-display font-bold mt-0.5">{dest.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ── 4. ACTIVITIES ────────────────────────────────────────── */}
        {activities.length > 0 && (
          <motion.section {...fadeUp}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[#A3B899] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                  <Mountain className="w-3 h-3" /> Experiences
                </span>
                <h2 className="text-4xl font-display font-bold">Popular Activities</h2>
              </div>
              <Link to="/activities" className="hidden md:flex items-center gap-2 text-sm text-snow/60 hover:text-snow transition-colors">
                All experiences <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {activities.map((act, idx) => (
                <motion.div key={act.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                  <Link to={`/activities/${act.id}`}
                    className="block group relative rounded-2xl overflow-hidden shadow-lg bg-white/5" style={{ height: 320 }}>
                    <OptimizedImage 
                      src={act.image || getActivityImage(act.category)} 
                      alt={act.name}
                      category="activity"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#2F5233]/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#A3B899] rounded-full">
                        {act.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <h3 className="text-lg font-display font-bold mb-1 leading-tight">{act.name}</h3>
                      <div className="flex items-center justify-between text-xs text-snow/60">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.duration}</span>
                        <span className="font-bold text-arctic-gold">{formatPrice(act.price)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 5. FOOD & WILDLIFE ───────────────────────────────────── */}
        <motion.section {...fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* FOOD */}
            {foods.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[#FF7F50] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                      <Utensils className="w-3 h-3" /> Culinary
                    </span>
                    <h2 className="text-3xl font-display font-bold">Norwegian Food</h2>
                  </div>
                  <Link to="/food" className="text-sm text-snow/60 hover:text-snow flex items-center gap-1 transition-colors">
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {foods.slice(0, 4).map((food, idx) => (
                    <Link key={food.id} to="/food"
                      className="group relative rounded-xl overflow-hidden block"
                      style={{ height: idx === 0 ? 260 : 180 }}>
                      <OptimizedImage 
                        src={food.image} 
                        alt={food.name}
                        category="food"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 p-4 z-10">
                        <span className="text-[#FF7F50] text-[9px] font-bold uppercase tracking-widest">{food.category}</span>
                        <h3 className="text-sm font-display font-bold mt-0.5">{food.name}</h3>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-[#FF7F50] text-white text-[9px] font-bold uppercase px-2 py-1 rounded-full">Featured</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* WILDLIFE */}
            {wildlife.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[#5F9EA0] text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                      <Leaf className="w-3 h-3" /> Nature
                    </span>
                    <h2 className="text-3xl font-display font-bold">Norwegian Wildlife</h2>
                  </div>
                  <Link to="/wildlife" className="text-sm text-snow/60 hover:text-snow flex items-center gap-1 transition-colors">
                    Field guide <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {wildlife.slice(0, 4).map((animal, idx) => (
                    <Link key={animal.id} to={`/wildlife/${animal.id}`}
                      className="group relative rounded-xl overflow-hidden block"
                      style={{ height: idx === 1 ? 260 : 180 }}>
                      <OptimizedImage 
                        src={animal.image} 
                        alt={animal.name}
                        category="wildlife"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 p-4 z-10">
                        <span className="text-[#5F9EA0] text-[9px] font-bold uppercase tracking-widest italic">{animal.scientific_name}</span>
                        <h3 className="text-sm font-display font-bold mt-0.5">{animal.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* ── 6. LUXURY STAYS & FINE DINING ────────────────────────── */}
        {(hotels.length > 0 || restaurants.length > 0) && (
          <motion.section {...fadeUp}>
            <div className="text-center mb-12">
              <span className="text-arctic-gold text-xs font-bold uppercase tracking-[0.2em]">Curated Luxury</span>
              <h2 className="text-4xl font-display font-bold mt-3">Sleep & Dine, Exceptionally</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Hotels */}
              {hotels.length > 0 && (
                <div>
                  <h3 className="text-xl font-display font-semibold mb-5 flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-arctic-gold" /> Exceptional Stays
                  </h3>
                  <div className="space-y-4">
                    {hotels.slice(0, 3).map(hotel => (
                      <Link key={hotel.id} to={`/stay/${hotel.id}`}
                        className="flex gap-4 group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                          <OptimizedImage 
                            src={hotel.image} 
                            alt={hotel.name}
                            category="stay"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-base truncate group-hover:text-arctic-gold transition-colors">{hotel.name}</h4>
                          <p className="text-snow/50 text-xs mt-0.5">{hotel.city || hotel.region}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-arctic-gold font-bold">
                              <Star className="w-3 h-3 fill-arctic-gold" /> {hotel.rating}
                            </span>
                            <span className="text-xs text-snow/40 border-l border-white/10 pl-3">{hotel.price_indicator}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-snow/30 group-hover:text-arctic-gold transition-colors shrink-0 self-center" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurants */}
              {restaurants.length > 0 && (
                <div>
                  <h3 className="text-xl font-display font-semibold mb-5 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#FF7F50]" /> Fine Dining
                  </h3>
                  <div className="space-y-4">
                    {restaurants.slice(0, 3).map((rest: any) => (
                      <Link key={rest.id} to="/food"
                        className="flex gap-4 group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                          <OptimizedImage 
                            src={rest.image_url} 
                            alt={rest.name}
                            category="food"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-base truncate group-hover:text-[#FF7F50] transition-colors">{rest.name}</h4>
                          <p className="text-snow/50 text-xs mt-0.5">{rest.locations?.name || 'Norway'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-[#FF7F50] font-bold">
                              <Star className="w-3 h-3 fill-[#FF7F50]" /> {Number(rest.rating || 4.8).toFixed(1)}
                            </span>
                            <span className="text-xs text-snow/40 border-l border-white/10 pl-3">{rest.price_range || '$$$'}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-snow/30 group-hover:text-[#FF7F50] transition-colors shrink-0 self-center" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ── 7. UPCOMING EVENTS ────────────────────────────────────── */}
        {events.length > 0 && (
          <motion.section {...fadeUp}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-arctic-gold text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                  <Calendar className="w-3 h-3" /> Events
                </span>
                <h2 className="text-4xl font-display font-bold">What's On in Norway</h2>
              </div>
              <Link to="/events" className="hidden md:flex items-center gap-2 text-sm text-snow/60 hover:text-snow transition-colors">
                All events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.slice(0, 3).map((event, idx) => (
                <Link key={event.id} to="/events"
                  className="group relative rounded-2xl overflow-hidden block" style={{ height: idx === 0 ? 340 : 240 }}>
                  <OptimizedImage 
                    src={event.image} 
                    alt={event.name}
                    category="aurora"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-arctic-gold text-deep-night text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <p className="text-snow/60 text-xs mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {event.date} · {event.location}
                    </p>
                    <h3 className="text-lg font-display font-bold">{event.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 8. AI PLANNER CTA ─────────────────────────────────────── */}
        <motion.section {...fadeUp}
          className="relative overflow-hidden rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #1a3a4a 50%, #0d1f2d 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('/images/northern_lights_1786935879330.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-night/90 to-deep-night/60" />
          <div className="relative z-10 py-20 px-10 md:px-16 flex flex-col md:flex-row items-center gap-10 justify-between">
            <div className="max-w-xl">
              <span className="text-arctic-gold text-xs font-bold uppercase tracking-[0.2em]">AI-Powered</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">Your Personal<br />Nordic Concierge</h2>
              <p className="text-snow/70 text-lg leading-relaxed">
                Describe your dream Norway trip and our AI planner will craft a personalised day-by-day itinerary — hidden gems included.
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => navigate('/planner')}
                className="inline-flex items-center gap-3 py-5 px-10 bg-arctic-gold text-deep-night font-bold text-base rounded-2xl hover:bg-snow transition-colors shadow-2xl"
              >
                Plan My Trip <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.section>

      </Container>

      {/* Bottom padding */}
      <div className="pb-24" />
    </div>
  );
};

export default Home;
