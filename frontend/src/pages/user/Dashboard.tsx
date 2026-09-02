import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { 
  Calendar, MapPin, Compass, Leaf, Hotel, ArrowRight, 
  Bookmark, Navigation, Ticket, FileText, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, UserCheck, Wallet, 
  ChevronRight, ArrowUpRight, Activity, Plane, Train,
  Quote, RefreshCw, Mountain, CloudSun, Eye, Share2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { supabase } from '../../lib/supabase';
import { invoiceService } from '../../services/invoice/invoiceService';
import { motion, AnimatePresence } from 'framer-motion';
import { RecentlyViewedSection } from '../../components/common/RecentlyViewedSection';

// Curated Nordic Quotes
const NORDIC_QUOTES = [
  {
    quote: "Ut på tur, aldri sur.",
    translation: "Out on a trip, never grumpy.",
    context: "Timeless Norwegian Proverb celebrating Friluftsliv (Open-Air Living)",
    author: "Norwegian Traditional Wisdom",
    tag: "Friluftsliv Philosophy"
  },
  {
    quote: "The first great thing is to find yourself, and for that you need solitude and great distances — only mountains and fjords can give you that.",
    translation: "Nature provides the clarity that the modern world takes away.",
    context: "Polar Explorer, Humanitarian & Nobel Peace Laureate",
    author: "Fridtjof Nansen",
    tag: "Arctic Heritage"
  },
  {
    quote: "Det finnes ikke dårlig vær, bare dårlige klær.",
    translation: "There is no bad weather, only bad clothing.",
    context: "The golden rule of Nordic exploration across all four seasons",
    author: "Scandinavian Heritage",
    tag: "Mountain Wisdom"
  },
  {
    quote: "Adventure is just bad planning — true exploration is harmony with the wild.",
    translation: "Respect the Arctic terrain and let the fjords guide your path.",
    context: "First to reach the South Pole and traverse the Northwest Passage",
    author: "Roald Amundsen",
    tag: "Polar Spirit"
  },
  {
    quote: "In the stillness of the fjords, every echo carries the ancient whispers of the Vikings.",
    translation: "Immerse in Norway's pristine waters, cascading waterfalls, and eternal glaciers.",
    context: "Nordic Heritage Collection",
    author: "Norway SmartLife",
    tag: "Fjord Odyssey"
  }
];

export const Dashboard = () => {
  const { user, profile } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState('Welcome back');
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('God morgen (Good morning)');
    else if (hour < 18) setGreeting('God ettermiddag (Good afternoon)');
    else setGreeting('God kveld (Good evening)');
  }, []);

  // Batched, cached user telemetry using React Query (5 min fresh cache window)
  const { data: telemetry, isLoading: loading } = useQuery({
    queryKey: ['dashboard-user-telemetry', user?.id],
    queryFn: async () => {
      if (!user?.id) return { bookings: [], invoicesCount: 0 };
      const bookingsPromise = (supabase as any)
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const invoicesCountPromise = (supabase as any)
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const [{ data: bookingsData }, { count: invCount }] = await Promise.all([
        bookingsPromise,
        invoicesCountPromise
      ]);

      return {
        bookings: bookingsData || [],
        invoicesCount: typeof invCount === 'number' ? invCount : 0
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const bookings = telemetry?.bookings || [];
  const invoicesCount = telemetry?.invoicesCount || 0;

  // Cycle inspiring quotes
  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % NORDIC_QUOTES.length);
  };

  const currentQuote = NORDIC_QUOTES[quoteIndex];

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    let score = 20; // base for email signup
    if (profile?.fullName) score += 20;
    if (profile?.gender) score += 15;
    if (profile?.dateOfBirth) score += 15;
    if (profile?.address) score += 15;
    if (profile?.country) score += 15;
    return Math.min(score, 100);
  }, [profile]);

  // Upcoming Active Booking
  const upcomingBooking = useMemo(() => {
    if (!bookings || bookings.length === 0) return null;
    const now = new Date();
    return bookings.find((b: any) => {
      const start = new Date(b.start_time || b.created_at);
      const end = new Date(b.end_time || b.start_time || b.created_at);
      return b.status === 'CONFIRMED' && (end >= now || start >= now);
    }) || bookings[0] || null;
  }, [bookings]);

  const displayName = profile?.fullName?.trim() || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Traveler');

  return (
    <div className="min-h-screen relative font-sans pb-32 bg-deep-night text-snow selection:bg-aurora-green selection:text-deep-night overflow-hidden">
      <CinematicBackground gradient="aurora" />
      
      {/* ── Editorial Header Banner ─────────────────────────────────────────── */}
      <div className="pt-24 sm:pt-28 pb-8 px-6 md:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-aurora-green/15 text-aurora-green border border-aurora-green/30 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-aurora-green animate-pulse"></span>
                Active Traveler Portal
              </span>
              <span className="text-snow/40 text-xs">•</span>
              <span className="text-xs text-snow/60 font-medium">Oslo Time: {new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-snow tracking-tight">
              {greeting}, <span className="font-bold text-arctic-gold">{displayName}</span>.
            </h1>
            <p className="text-base sm:text-lg text-snow/70 font-medium mt-1">
              Your personalized gateway to Norway’s fjords, northern lights, and smart alpine living.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/planner" 
              className="px-5 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center gap-2 text-snow hover:bg-white hover:text-navy-900 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <Compass size={16} className="text-aurora-green" />
              <span>AI Trip Planner</span>
            </Link>
            <Link 
              to="/wallet" 
              className="px-5 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center gap-2 text-snow hover:bg-white hover:text-navy-900 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <Wallet size={16} className="text-amber-400" />
              <span>Travel Wallet</span>
            </Link>
            <Link 
              to="/explore" 
              className="px-6 h-11 rounded-full bg-aurora-green text-navy-900 font-bold text-xs uppercase tracking-widest hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,135,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Navigation size={16} />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Callout (if < 100%) */}
        {profileCompletion < 100 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-snow">Profile is {profileCompletion}% complete</div>
                <div className="text-[11px] text-snow/60">Complete your gender, date of birth, address & country for seamless booking access</div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }} />
              </div>
              <Link to="/profile" className="text-xs font-bold text-amber-300 hover:underline whitespace-nowrap">
                Complete Profile →
              </Link>
            </div>
          </div>
        )}

        {/* ── FEATURED HERO CARD WITH NORDIC IMAGE & INSPIRING QUOTE ──────────── */}
        <section className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-10 group">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              alt="Majestic Norwegian Fjords and Mountains" 
              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-navy-900/20 backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-navy-950/30"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[380px] sm:min-h-[420px]">
            {/* Top Badge & Quote Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 border border-white/20 text-aurora-green backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles size={13} className="text-aurora-green" />
                  <span>Nordic Daily Inspiration</span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-snow/70 border border-white/10 backdrop-blur-md uppercase tracking-wider">
                  {currentQuote.tag}
                </span>
              </div>

              <button
                onClick={nextQuote}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-snow text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer hover:border-aurora-green/50"
                title="Read another Nordic quote"
              >
                <RefreshCw size={13} className="text-aurora-green" />
                <span>Next Quote</span>
              </button>
            </div>

            {/* Inspiring Quote Hero Text */}
            <div className="my-6 max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-aurora-green shrink-0 shadow-lg hidden sm:flex">
                  <Quote size={28} />
                </div>
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                    >
                      <blockquote className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-snow leading-tight tracking-tight drop-shadow-md">
                        "{currentQuote.quote}"
                      </blockquote>
                      <p className="text-sm sm:text-base text-snow/80 mt-2 font-medium italic drop-shadow">
                        {currentQuote.translation}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-arctic-gold tracking-wide">
                        <span>— {currentQuote.author}</span>
                        <span className="text-snow/40">•</span>
                        <span className="text-snow/60 font-normal">{currentQuote.context}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Bar on Hero */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2 text-xs text-snow/70">
                <MapPin size={14} className="text-aurora-green" />
                <span className="font-semibold text-snow">Featured Region:</span>
                <span>Geirangerfjord & Lofoten Islands, Norway</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/destinations"
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-snow text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Mountain size={13} className="text-cyan-300" />
                  <span>Discover Fjords</span>
                </Link>
                <Link
                  to="/aurora"
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-snow text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Sparkles size={13} className="text-aurora-green" />
                  <span>Aurora Live</span>
                </Link>
                <Link
                  to="/stay"
                  className="px-4 py-2 rounded-xl bg-aurora-green text-navy-900 text-xs font-bold flex items-center gap-1.5 hover:bg-green-400 transition-all shadow-md cursor-pointer"
                >
                  <Hotel size={13} />
                  <span>Book Stays</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Main Dashboard Canvas ───────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        
        {/* ── LEFT COLUMN (8 cols): Upcoming Trip & Hub ────────────────────── */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Upcoming Trip / Active Reservation Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-snow/60 flex items-center gap-2">
                <Navigation size={14} className="text-aurora-green" /> 
                {upcomingBooking ? 'Active Reservation' : 'Featured Nordic Expedition'}
              </h2>
              {upcomingBooking && (
                <Link to="/user/bookings" className="text-xs font-bold text-aurora-green hover:underline">
                  All Bookings ({bookings.length}) →
                </Link>
              )}
            </div>
            
            {upcomingBooking ? (
              <div 
                className="group relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-white/5 border border-white/10 cursor-pointer"
                onClick={() => navigate(`/user/bookings/${upcomingBooking.id}`)}
              >
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                    alt="Norwegian Experience" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="relative p-8 md:p-10 min-h-[340px] flex flex-col justify-end">
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-white/80 font-bold text-xs uppercase tracking-widest mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {upcomingBooking.status || 'CONFIRMED'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-aurora-green"></span>
                        <span>{upcomingBooking.start_time ? new Date(upcomingBooking.start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Confirmed'}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display font-black text-white leading-tight mb-2">
                        {upcomingBooking.item_type || 'Norway Travel Experience'}
                      </h3>
                      <p className="text-white/80 font-medium text-sm">
                        {upcomingBooking.pax || 1} guest(s) • Total: {formatPrice(upcomingBooking.total_amount || 0)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          invoiceService.downloadInvoiceForBooking(upcomingBooking, profile);
                        }}
                        className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-navy-900 transition-colors shadow-sm cursor-pointer"
                        title="Download MVA Receipt"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/user/bookings/${upcomingBooking.id}`)}
                        className="px-6 py-3.5 bg-aurora-green text-navy-900 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-green-400 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Ticket size={16} />
                        <span>View Ticket</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Curated Default Trip Card when user has no bookings */
              <div 
                className="group relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-white/5 border border-white/10 cursor-pointer"
                onClick={() => navigate('/planner')}
              >
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/1009136/pexels-photo-1009136.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                    alt="Lofoten Islands" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="relative p-8 md:p-10 min-h-[340px] flex flex-col justify-end">
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-white/80 font-bold text-xs uppercase tracking-widest mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-aurora-green/20 text-aurora-green border border-aurora-green/30">
                          Recommended
                        </span>
                        <span className="w-1 h-1 rounded-full bg-aurora-green"></span>
                        <span>7-Day Fjord & Arctic Route</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display font-black text-white leading-tight mb-2">
                        Lofoten
                      </h3>
                      <p className="text-white/80 font-medium text-sm">
                        Your next adventure starts in 12 days. Experience traditional rorbu cabins, midnight sun, and dramatic peaks rising from the arctic sea.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => navigate('/planner')}
                        className="px-6 py-3.5 bg-aurora-green text-navy-900 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-green-400 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Compass size={16} />
                        <span>Plan This Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Quick Hub Grid: Bookings, Invoices, Wallet */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link 
              to="/user/bookings"
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-snow/50">My Bookings</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                  <Ticket size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-snow">{bookings.length}</div>
                <div className="text-xs text-snow/50 mt-1 flex items-center gap-1">
                  <span>Manage tickets</span> <ChevronRight size={12} />
                </div>
              </div>
            </Link>

            <Link 
              to="/user/invoices"
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-snow/50">Tax Invoices</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                  <FileText size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-snow">{invoicesCount || bookings.length}</div>
                <div className="text-xs text-snow/50 mt-1 flex items-center gap-1">
                  <span>MVA receipts</span> <ChevronRight size={12} />
                </div>
              </div>
            </Link>

            <Link 
              to="/wallet"
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-snow/50">Digital Wallet</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                  <Wallet size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-snow">Ready</div>
                <div className="text-xs text-snow/50 mt-1 flex items-center gap-1">
                  <span>Passes & offline QR</span> <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          </section>

          {/* Quick Hub Grid: Travel Tools */}
          <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Link 
              to="/assistant"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snow/70">AI Guide</span>
            </Link>
            
            <Link 
              to="/expenses"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                <FileText size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snow/70">Expenses</span>
            </Link>

            <Link 
              to="/user/travel-history"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                <Clock size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snow/70">History</span>
            </Link>

            <Link 
              to="/reviews"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                <UserCheck size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snow/70">Reviews</span>
            </Link>

            <Link 
              to="/notifications"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-snow/70">Alerts</span>
            </Link>
          </section>

          {/* Recent Bookings List if any */}
          {bookings.length > 0 && (
            <section className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-snow flex items-center gap-2">
                  <Calendar size={16} className="text-arctic-gold" />
                  Recent Reservations
                </h3>
                <Link to="/user/bookings" className="text-xs font-bold text-arctic-gold hover:underline">
                  View All History →
                </Link>
              </div>

              <div className="divide-y divide-white/10">
                {bookings.slice(0, 3).map((b: any) => (
                  <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/5 px-3 rounded-xl transition-colors">
                    <div>
                      <div className="font-bold text-snow text-sm">
                        {b.item_type || 'Experience Reservation'}
                      </div>
                      <div className="text-xs text-snow/50 mt-0.5">
                        Ref: {b.id.substring(0, 8).toUpperCase()} • {b.start_time ? new Date(b.start_time).toLocaleDateString('en-GB') : 'Confirmed'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <span className="font-bold text-sm text-snow">
                        {formatPrice(b.total_amount || 0)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.status || 'CONFIRMED'}
                      </span>
                      <button
                        onClick={() => invoiceService.downloadInvoiceForBooking(b, profile)}
                        className="p-1.5 rounded-lg bg-white/10 text-snow hover:bg-white hover:text-navy-900 transition-colors"
                        title="Download Receipt"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ── RIGHT COLUMN (4 cols): Curation & Travel Intelligence ─────────── */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Recommended Norway Itineraries */}
          <section className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 flex items-center gap-2">
                <Sparkles size={14} className="text-arctic-gold" /> Curated For You
              </h3>
              <Link to="/recommendations" className="text-xs font-bold text-arctic-gold hover:underline">
                Explore →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Chasing Northern Lights in Tromsø', category: 'Aurora Safari', link: '/aurora' },
                { title: 'Fjord Sightseeing & Electric Ferry', category: 'Geirangerfjord', link: '/mobility/ferry' },
                { title: 'Preikestolen Pulpit Rock Hike', category: 'Mountain Trails', link: '/trails/tr-001' },
                { title: 'Flåm Railway Scenic Journey', category: 'Alpine Transit', link: '/travel' }
              ].map((rec, i) => (
                <Link
                  key={i}
                  to={rec.link}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all flex justify-between items-center group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-snow group-hover:text-arctic-gold transition-colors">{rec.title}</div>
                    <div className="text-[10px] text-snow/50 mt-0.5">{rec.category}</div>
                  </div>
                  <ChevronRight size={16} className="text-snow/40 group-hover:text-snow group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          {/* Saved Wishlist Collections */}
          <section className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-snow/60 flex items-center gap-2">
                <Bookmark size={14} className="text-glacier-blue" /> Saved Places
              </h3>
              <Link to="/wishlist" className="text-xs font-bold text-glacier-blue hover:underline">
                View All →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-snow">My Northern Norway</div>
                <div className="text-xs text-snow/50 mt-0.5">Fjord Safaris & Ice Domes</div>
              </div>
              <Link to="/wishlist" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-snow transition-colors cursor-pointer">
                Open
              </Link>
            </div>
          </section>

          {/* Travel Impact & Sustainability */}
          <section className="bg-midnight/80 border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-aurora-green/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-aurora-green mb-2">
                <Leaf size={14} /> Your Norway Impact
              </div>
              <div className="text-4xl font-display font-black text-snow mb-1">
                {bookings.length > 0 ? `${bookings.length * 18} kg` : '0 kg'}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-snow/60 mb-6">
                Estimated CO₂ Avoided via Hydro & Electric Transit
              </div>
              
              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-snow/80">
                <div className="flex justify-between items-center">
                  <span>Renewable grid transit</span>
                  <span className="font-bold text-aurora-green">98% Clean Energy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Allemannsretten compliant</span>
                  <span className="font-bold text-snow">Active</span>
                </div>
              </div>
              
              <Link 
                to="/impact" 
                className="mt-6 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-colors cursor-pointer"
              >
                View Full Impact Score →
              </Link>
            </div>
          </section>

        </div>

      </div>

      {/* ── RECENTLY VIEWED CAROUSEL ────────────────────────────────────────── */}
      <RecentlyViewedSection
        title="Recently Explored Places"
        subtitle="Resume exploring your recently viewed destinations, hotels, and experiences"
        className="mt-12 border-t border-white/10"
      />

    </div>
  );
};

export default Dashboard;
