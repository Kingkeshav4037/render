import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, MapPin, Star, ArrowRight, Clock, Flame, Mountain, TrendingUp, Heart, Check, Plus, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
import { toast } from 'sonner';
import { recommendationEngine, RecommendationItem } from '../../services/recommendationEngine';
import { RecentlyViewedSection } from '../../components/common/RecentlyViewedSection';

const TABS = ['For You', 'Adventure', 'Food & Dining', 'Scenic', 'Hidden Gems'];

const RECOMMENDATIONS = [
  // Featured Hero
  {
    id: 'r1', tab: ['For You', 'Adventure', 'Scenic'], featured: true,
    reason: 'Matches your interest in Fjords & Water Adventures',
    category: 'Fjords',
    title: 'Midnight Sun Kayaking',
    subtitle: 'Lofoten Islands',
    description: 'Clear skies are forecasted for your first night. Experience the silent fjords under the golden glow of the midnight sun. Guided by certified sea kayak instructors.',
    image: 'https://images.unsplash.com/photo-1620215905096-7f4c51478c93?auto=format&fit=crop&q=80&w=1400',
    price: 1200, rating: 4.9, reviews: 128,
    distance: '15 mins from Svolvær', duration: '3 hours', tags: ['Active', 'Scenic', 'Fjords']
  },
  // Grid cards
  {
    id: 'r2', tab: ['For You', 'Adventure'], featured: false,
    reason: 'Top match for Alpine Hiking',
    category: 'Alpine Hiking',
    title: 'Reinebringen Summit Hike',
    subtitle: 'Lofoten, Nordland',
    description: 'The most iconic view in Lofoten. 1,560 Sherpa stone steps for jaw-dropping 360° panoramas. Best hiked at midnight in summer.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800',
    price: 0, rating: 4.8, reviews: 432,
    distance: 'Reine village', duration: '3–4 hrs', tags: ['Alpine Hiking', 'Iconic', 'Views']
  },
  {
    id: 'r3', tab: ['Food & Dining', 'For You'], featured: false,
    reason: 'Matches your Local Cuisine preference',
    category: 'Local Cuisine',
    title: 'Børsen Spiseri',
    subtitle: 'Svolvær, Lofoten',
    description: 'Housed in a traditional quayside warehouse dating to 1828. Famous for their stockfish and locally foraged dishes. Stunning fjord terrace.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    price: 650, rating: 4.7, reviews: 89,
    distance: 'Svolvær harbour', duration: 'Dinner ~2 hrs', tags: ['Local Cuisine', 'Seafood', 'Historic']
  },
  {
    id: 'r4', tab: ['Adventure', 'Hidden Gems'], featured: false,
    reason: 'Cold-water Arctic surf',
    category: 'Winter Sports',
    title: 'Arctic Surf @ Unstad',
    subtitle: 'Vestvågøy, Lofoten',
    description: 'Unstad beach offers world-class cold water surfing with a dramatic mountain backdrop. Equipment rental on site. Beginner lessons available.',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800',
    price: 800, rating: 4.6, reviews: 61,
    distance: '40 km from Svolvær', duration: '2–4 hrs', tags: ['Surf', 'Adventure']
  },
  {
    id: 'r5', tab: ['Scenic', 'For You'], featured: false,
    reason: 'Matches your Wildlife Safari preference',
    category: 'Wildlife Safaris',
    title: 'Trollfjord Sea Eagle Safari',
    subtitle: 'Lofoten, Nordland',
    description: 'High-speed coastal RIB boat into the dramatic Trollfjord gorge — towering 1,000m walls closing in around you. White-tailed sea eagles guaranteed.',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=800',
    price: 1050, rating: 4.9, reviews: 203,
    distance: 'Svolvær port', duration: '2 hrs', tags: ['Wildlife Safaris', 'Scenic', 'Popular']
  },
  {
    id: 'r6', tab: ['Food & Dining'], featured: false,
    reason: 'Michelin-recommended local dining',
    category: 'Local Cuisine',
    title: 'Hattvika Lodge Dinner',
    subtitle: 'Ballstad, Lofoten',
    description: 'Farm-to-table Norwegian cuisine inside a converted fisherman\'s lodge. Chef uses only ingredients sourced within 30km. Wine pairing available.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    price: 1400, rating: 4.8, reviews: 44,
    distance: 'Ballstad pier', duration: 'Dinner 3 hrs', tags: ['Fine Dining', 'Local Cuisine', 'Michelin']
  },
  {
    id: 'r7', tab: ['Scenic', 'Hidden Gems'], featured: false,
    reason: 'Preserved 19th-century fishing village',
    category: 'Historic Stave Churches',
    title: 'Nusfjord Historic Arctic Village',
    subtitle: 'Flakstad, Lofoten',
    description: 'One of the best-preserved fishing villages in Norway, unchanged since the 19th century. Hire a traditional wooden rowing boat at dawn.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    price: 200, rating: 4.7, reviews: 77,
    distance: '40 km from Reine', duration: 'Half day', tags: ['Historic', 'Scenic', 'Peaceful']
  },
  {
    id: 'r8', tab: ['Adventure', 'Scenic'], featured: false,
    reason: 'Iconic Fjord Rock Walk',
    category: 'Alpine Hiking',
    title: 'Kjeragbolten Boulder Hike',
    subtitle: 'Lysefjord, Rogaland',
    description: 'Stand on the legendary Kjerag boulder wedged 984m above the Lysefjord. Guided safety harness tours available.',
    image: '/images/kjeragbolten_1786936275605.jpg',
    price: 650, rating: 4.8, reviews: 312,
    distance: 'Lysebotn ferry', duration: '5–7 hrs', tags: ['Alpine Hiking', 'Iconic', 'Fjords']
  },
];

export const Recommendations = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyStore();
  const { profile, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('For You');
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  const firstName = profile?.fullName?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

  useEffect(() => {
    try {
      const prefStr = localStorage.getItem('nsl_user_preferences');
      if (prefStr) {
        setUserPreferences(JSON.parse(prefStr));
      }
      const favsStr = localStorage.getItem('nsl_user_favorites');
      if (favsStr) {
        const favs = JSON.parse(favsStr);
        if (Array.isArray(favs)) setSavedFavorites(favs.map((f: any) => f.id));
      }
    } catch (e) {
      console.warn('Error reading preferences:', e);
    }
  }, []);

  const sortedRecommendations = useMemo(() => {
    if (!userPreferences?.interests || userPreferences.interests.length === 0) {
      return RECOMMENDATIONS;
    }
    const userInterests = userPreferences.interests as string[];
    return [...RECOMMENDATIONS].sort((a, b) => {
      const aMatch = userInterests.some(i => a.tags.includes(i) || a.category === i);
      const bMatch = userInterests.some(i => b.tags.includes(i) || b.category === i);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [userPreferences]);

  const featured = sortedRecommendations.find(r => r.featured && r.tab.includes(activeTab)) || sortedRecommendations.find(r => r.tab.includes(activeTab));
  const grid = sortedRecommendations.filter(r => r.id !== featured?.id && r.tab.includes(activeTab));

  const toggleSaveFavorite = (rec: any) => {
    try {
      const favsStr = localStorage.getItem('nsl_user_favorites');
      const existingFavs = favsStr ? JSON.parse(favsStr) : [];
      let updatedFavs;
      if (savedFavorites.includes(rec.id)) {
        updatedFavs = existingFavs.filter((f: any) => f.id !== rec.id);
        setSavedFavorites(prev => prev.filter(id => id !== rec.id));
        toast.info(`Removed "${rec.title}" from favorites.`);
      } else {
        const newFav = {
          id: rec.id,
          type: 'ACTIVITY',
          title: rec.title,
          region: rec.subtitle,
          image: rec.image,
          url: '/activities'
        };
        updatedFavs = [newFav, ...existingFavs];
        setSavedFavorites(prev => [...prev, rec.id]);
        toast.success(`Saved "${rec.title}" to favorites!`);
      }
      localStorage.setItem('nsl_user_favorites', JSON.stringify(updatedFavs));
    } catch (e) {
      toast.error('Could not update favorites.');
    }
  };

  const handleAddToTrip = (rec: any) => {
    try {
      const tripsStr = localStorage.getItem('nsl_user_saved_trips');
      const existingTrips = tripsStr ? JSON.parse(tripsStr) : [];
      
      const newSavedTrip = {
        id: `trip-rec-${Date.now()}`,
        name: rec.title,
        title: `${rec.title} Experience`,
        dates: 'Next Planned Trip',
        nights: 1,
        activities: 1,
        status: 'Upcoming',
        image: rec.image,
        weather: '14°C',
        summary: rec.description,
        destinations: [rec.subtitle],
        activitiesList: [
          { id: `act-${rec.id}`, title: rec.title, location: rec.subtitle, cost: rec.price, time: '10:00', desc: rec.description }
        ]
      };

      const updated = [newSavedTrip, ...existingTrips];
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(updated));
      toast.success(`"${rec.title}" added to your Travel Journal!`);
    } catch (e) {
      toast.error('Could not add to trips.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans pb-24">
      <SEO 
        title="Personalized Travel Recommendations | Norway SmartLife"
        description="Tailored recommendations for hikes, fjord adventures, and authentic cuisine based on your saved travel preferences."
      />

      {/* Dark gradient hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/80 via-[#0D1117]/60 to-[#0D1117]" />

        <div className="relative z-10 pt-36 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                {userPreferences?.interests?.length > 0 
                  ? `Tailored to your preferences: ${userPreferences.interests.slice(0, 3).join(', ')}`
                  : 'Curated Norwegian Experiences'
                }
              </span>
            </motion.div>

            <Link
              to="/profile/preferences"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors"
            >
              <Settings size={14} /> Edit Preferences
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight"
          >
            Made for <span className="text-emerald-400">{firstName}</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mb-10"
          >
            {userPreferences?.interests?.length > 0
              ? 'Ranked and sorted based on your saved travel style, preferred activities, and current regional conditions.'
              : 'Discover top-rated Norwegian expeditions. Set your travel preferences in your profile to customize your feed.'
            }
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: TrendingUp, label: '12 curated matches today', color: 'text-emerald-400' },
              { icon: Flame, label: '3 trending in Vestland', color: 'text-orange-400' },
              { icon: Clock, label: 'Live Weather: Clear Windows', color: 'text-sky-400' },
              { icon: Mountain, label: 'Alpine Season Active', color: 'text-purple-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                <Icon size={14} className={color} />
                <span className="text-gray-300">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-[#0D1117]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 space-y-16">

        {/* Featured Hero Card */}
        {featured && (
          <motion.section
            key={featured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{featured.reason}</h2>
            </div>

            <div className="group relative rounded-[28px] overflow-hidden min-h-[480px] md:min-h-[560px] border border-white/10">
              <OptimizedImage 
                src={featured.image} 
                alt={featured.title} 
                category="activity"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                containerClassName="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/95 via-[#0D1117]/60 to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-14 h-full flex flex-col justify-end max-w-xl z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featured.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300">{tag}</span>
                  ))}
                </div>
                <h3 className="text-4xl md:text-6xl font-display font-black text-white leading-none mb-2">{featured.title}</h3>
                <p className="text-emerald-400 font-medium mb-4">{featured.subtitle}</p>
                <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">{featured.description}</p>

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <span className="text-white text-sm font-bold flex items-center gap-2"><MapPin size={14} className="text-emerald-400" /> {featured.distance}</span>
                  <span className="text-white text-sm font-bold flex items-center gap-2"><Star size={14} className="text-amber-400 fill-amber-400" /> {featured.rating} ({featured.reviews} reviews)</span>
                  <span className="text-white text-sm font-bold flex items-center gap-2"><Clock size={14} className="text-sky-400" /> {featured.duration}</span>
                  <span className="text-emerald-300 text-lg font-black">
                    {featured.price === 0 ? 'Free' : formatPrice(featured.price)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleAddToTrip(featured)}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> Add to Trip
                  </button>
                  <button
                    onClick={() => toggleSaveFavorite(featured)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${savedFavorites.includes(featured.id) ? 'bg-red-500/20 border-red-500/40' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                  >
                    <Heart size={18} className={savedFavorites.includes(featured.id) ? 'text-red-400 fill-red-400' : 'text-white'} />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Recommendations Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">More Picks for You</h2>
            <span className="text-sm text-gray-400">{grid.length} recommendations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {grid.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * idx }}
                className="group bg-[#161B22] border border-white/5 rounded-[24px] overflow-hidden hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage 
                    src={rec.image} 
                    alt={rec.title} 
                    category="landscape"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent pointer-events-none" />
                  <button
                    onClick={() => toggleSaveFavorite(rec)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 cursor-pointer ${savedFavorites.includes(rec.id) ? 'bg-red-500/40 text-red-400' : 'bg-black/40 text-white hover:bg-black/60'}`}
                  >
                    <Heart size={14} className={savedFavorites.includes(rec.id) ? 'fill-red-400' : ''} />
                  </button>
                  {/* Tags */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {rec.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/80">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">{rec.reason}</p>
                  <h4 className="text-xl font-display font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-sm text-emerald-400/70 font-medium mb-3 flex items-center gap-1">
                    <MapPin size={11} /> {rec.subtitle}
                  </p>
                  <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">{rec.description}</p>

                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mb-5 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {rec.rating}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {rec.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">
                      {rec.price === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : formatPrice(rec.price)}
                    </span>
                    <button 
                      onClick={() => handleAddToTrip(rec)}
                      className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add to Trip
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-[28px] overflow-hidden relative border border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1400')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 to-teal-950/80" />
          <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Itinerary Engine</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-2">Build your custom Norwegian journey</h3>
              <p className="text-white/70 max-w-md text-sm">Tell our planning engine what you love and it will generate a structured day-by-day plan with weather context.</p>
            </div>
            <button
              onClick={() => navigate('/planner')}
              className="flex-shrink-0 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              Start Planning <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Recently Viewed Tracking Section */}
        <RecentlyViewedSection
          title="Recently Explored"
          subtitle="Continue planning from places and experiences you previously discovered"
          className="mt-8"
        />

      </div>
    </div>
  );
};

export default Recommendations;
