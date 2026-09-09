import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bookmark, Heart, MapPin, ArrowRight, Trash2, Plus, Search, 
  Zap, Compass, Bed, Mountain, Utensils, ShoppingBag, BookOpen 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { favoriteService, HydratedFavorite, normalizeItemType } from '../../services/favoriteService';
import { motion } from 'framer-motion';
import { SEO } from '../../components/shared/SEO';

export interface SavedFavorite {
  id: string;
  type: 'DESTINATION' | 'TRAIL' | 'STAY' | 'EV_STATION' | 'ACTIVITY' | 'FOOD' | 'PRODUCT' | 'GUIDE' | 'PLACE' | string;
  title: string;
  region: string;
  image: string;
  url: string;
  description?: string;
  price?: number | string;
  rating?: number;
  savedAt?: string;
}

const DEFAULT_FAVORITES: SavedFavorite[] = [
  {
    id: 'fav-geiranger',
    type: 'DESTINATION',
    title: 'Geirangerfjord',
    region: 'Western Norway',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
    url: '/explore/geirangerfjord',
    description: 'UNESCO World Heritage fjord with soaring waterfalls and majestic snow-capped peaks.'
  },
  {
    id: 'fav-reinebringen',
    type: 'TRAIL',
    title: 'Reinebringen Ridge Trail',
    region: 'Lofoten Islands',
    image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80',
    url: '/trails/reinebringen',
    description: '1,560 stone Sherpa steps leading to the iconic panoramic view of Reine and surrounding fjords.'
  },
  {
    id: 'fav-juvet',
    type: 'STAY',
    title: 'Juvet Landscape Hotel',
    region: 'Valldal',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    url: '/stay/juvet-landscape-hotel',
    description: 'Architectural forest cabins with floor-to-ceiling glass walls immersed in Norwegian nature.'
  },
  {
    id: 'fav-ionity-oslo',
    type: 'EV_STATION',
    title: 'IONITY Oslo Central Hub',
    region: 'Eastern Norway',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80',
    url: '/mobility/ev/ionity-oslo',
    description: 'Ultra-fast 350kW high-power charging with 100% renewable hydroelectric power.'
  }
];

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [localFavorites, setLocalFavorites] = useState<SavedFavorite[]>(() => {
    try {
      const stored = localStorage.getItem('nsl_user_favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_FAVORITES;
  });
  const [supabaseFavorites, setSupabaseFavorites] = useState<HydratedFavorite[] | null>(null);
  const [isRemoteLoading, setIsRemoteLoading] = useState<boolean>(false);

  // 1. Fetch remote Supabase hydrated favorites when user is authenticated
  useEffect(() => {
    let ignore = false;
    const userId = user?.id;
    if (!userId) {
      return;
    }

    favoriteService.getHydratedFavorites(userId)
      .then(data => {
        if (!ignore) setSupabaseFavorites(data || []);
      })
      .catch(err => {
        console.warn('Failed to load Supabase favorites:', err);
      })
      .finally(() => {
        if (!ignore) setIsRemoteLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // Combine and deduplicate items
  const allFavorites: SavedFavorite[] = useMemo(() => {
    if (user && supabaseFavorites !== null) {
      return supabaseFavorites.map(f => ({
        id: f.itemId || f.id,
        type: f.itemType,
        title: f.title,
        region: f.region,
        image: f.image,
        url: f.url,
        description: f.description,
        price: f.price,
        rating: f.rating,
        savedAt: f.createdAt
      }));
    }

    if (localFavorites.length > 0) {
      return localFavorites;
    }

    return DEFAULT_FAVORITES;
  }, [user, supabaseFavorites, localFavorites]);

  const handleRemoveFavorite = async (id: string, title: string) => {
    // 1. Remove from local list
    const updated = allFavorites.filter(f => f.id !== id && f.title !== title);
    setLocalFavorites(updated);
    if (supabaseFavorites) {
      setSupabaseFavorites(supabaseFavorites.filter(f => f.itemId !== id && f.id !== id && f.title !== title));
    }
    localStorage.setItem('nsl_user_favorites', JSON.stringify(updated));

    // 2. Remove from Supabase if logged in
    if (user?.id) {
      try {
        const itemToRemove = allFavorites.find(f => f.id === id || f.title === title);
        const itemType = itemToRemove?.type || 'DESTINATION';
        await favoriteService.removeFavorite(user.id, itemType, id);
      } catch (err) {
        console.warn('Failed to remove remote favorite:', err);
      }
    }

    toast.info(`Removed ${title} from saved items.`);
  };

  const handleAddToTrip = (item: SavedFavorite) => {
    try {
      const tripsStr = localStorage.getItem('nsl_user_saved_trips');
      let trips = tripsStr ? JSON.parse(tripsStr) : [];
      if (trips.length === 0) {
        trips = [{
          id: 'trip-norway-expedition',
          name: 'My Norway Grand Expedition',
          title: 'My Norway Grand Expedition',
          dates: 'Aug 15 - Aug 24, 2026',
          startDate: '2026-08-15',
          endDate: '2026-08-24',
          nights: 9,
          destinations: [item.title],
          activitiesList: [],
          staysList: [],
          status: 'Planning'
        }];
      } else {
        if (!trips[0].destinations) trips[0].destinations = [];
        if (!trips[0].destinations.includes(item.title)) {
          trips[0].destinations.push(item.title);
        }
      }
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify(trips));
      toast.success(`Added ${item.title} to your planned trip!`);
    } catch (err) {
      console.error(err);
      toast.success(`Added ${item.title} to your trip.`);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all saved favorites?')) {
      setLocalFavorites([]);
      setSupabaseFavorites([]);
      localStorage.setItem('nsl_user_favorites', JSON.stringify([]));

      if (user?.id) {
        await favoriteService.clearAllFavorites(user.id);
      }

      toast.info('All saved favorites cleared.');
    }
  };

  const filteredFavorites = useMemo(() => {
    return allFavorites.filter(item => {
      const normItemType = normalizeItemType(item.type);
      const matchesCategory = 
        activeCategory === 'ALL' || 
        item.type === activeCategory ||
        normItemType === activeCategory ||
        (activeCategory === 'TRAIL' && (normItemType === 'ACTIVITY' || item.type === 'TRAIL')) ||
        (activeCategory === 'ACTIVITY' && (normItemType === 'ACTIVITY' || item.type === 'TRAIL')) ||
        (activeCategory === 'EV_STATION' && (normItemType === 'PLACE' || item.type === 'EV_STATION'));

      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [allFavorites, activeCategory, searchQuery]);

  const CATEGORIES = [
    { id: 'ALL', label: 'All Saved', icon: <Bookmark size={14} /> },
    { id: 'DESTINATION', label: 'Destinations', icon: <Compass size={14} /> },
    { id: 'TRAIL', label: 'Trails & Peaks', icon: <Mountain size={14} /> },
    { id: 'STAY', label: 'Stays & Cabins', icon: <Bed size={14} /> },
    { id: 'ACTIVITY', label: 'Activities', icon: <Mountain size={14} /> },
    { id: 'FOOD', label: 'Food & Dining', icon: <Utensils size={14} /> },
    { id: 'PRODUCT', label: 'Products & Gear', icon: <ShoppingBag size={14} /> },
    { id: 'GUIDE', label: 'Travel Guides', icon: <BookOpen size={14} /> },
    { id: 'EV_STATION', label: 'EV Charging', icon: <Zap size={14} /> }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32 selection:bg-red-500/20 selection:text-red-900">
      <SEO 
        title="My Favorites & Saved Places | Norway SmartLife"
        description="Your personal collection of saved Norwegian fjords, hotels, alpine trails, restaurants, and gear."
      />

      {/* Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-red-50 text-red-500 rounded-xl">
              <Heart size={24} fill="currentColor" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Personal Travel Wishlist</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 tracking-tight">
            Saved Places & Favorites
          </h1>
          <p className="mt-2 text-base text-gray-500 max-w-2xl leading-relaxed">
            Bookmark destinations, alpine trails, boutique stays, culinary dishes, and gear for seamless itinerary planning.
          </p>
        </div>

        {allFavorites.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
              {allFavorites.length} {allFavorites.length === 1 ? 'Item' : 'Items'} Saved
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} /> Clear All
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-8">
        
        {/* Controls: Search & Categories */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved items..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-navy-900 shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {user && isRemoteLoading && supabaseFavorites === null && localFavorites.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded-2xl w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredFavorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-2xl mx-auto shadow-sm my-8">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">
              {searchQuery ? 'No Matching Favorites' : 'Your Personal Collection is Empty'}
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              {searchQuery 
                ? `No saved items matched "${searchQuery}". Try selecting another category tab or clearing your search.`
                : 'Click the heart icon (❤️) on any destination, fjord hotel, alpine trail, gourmet dish, or shop item to bookmark it here for your journey.'
              }
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors cursor-pointer"
              >
                Explore Destinations
              </button>
              <button
                onClick={() => navigate('/stay')}
                className="px-5 py-2.5 bg-gray-100 text-navy-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Browse Stays
              </button>
              <button
                onClick={() => navigate('/food')}
                className="px-5 py-2.5 bg-gray-100 text-navy-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Discover Food
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="px-5 py-2.5 bg-gray-100 text-navy-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Marketplace Gear
              </button>
            </div>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFavorites.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Card Header Image */}
                <div className="h-56 relative overflow-hidden bg-slate-100">
                  <OptimizedImage 
                    src={item.image} 
                    alt={item.title} 
                    category="landscape"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-navy-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {item.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(item.id, item.title);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer z-10"
                    aria-label={`Remove ${item.title} from favorites`}
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-aurora-green text-xs font-bold mb-1">
                      <MapPin size={12} /> {item.region}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleAddToTrip(item)}
                      className="flex-1 py-2.5 px-3 bg-gray-50 hover:bg-navy-900 hover:text-white text-navy-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> Add to Trip
                    </button>
                    <Link
                      to={item.url}
                      className="py-2.5 px-4 bg-aurora-green/20 hover:bg-aurora-green text-navy-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      View <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Favorites = Wishlist;
export default Wishlist;
