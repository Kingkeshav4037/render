import { supabase } from '../lib/supabase';
import { getStayImage } from './stay/staysService';
import { getFoodImage } from './foodService';

export type FavoriteCategory = 
  | 'DESTINATION'
  | 'PLACE'
  | 'STAY'
  | 'ACTIVITY'
  | 'FOOD'
  | 'PRODUCT'
  | 'GUIDE';

export interface FavoriteItem {
  id: string;
  user_id?: string | null;
  item_type: string;
  item_id: string;
  created_at?: string | null;
}

export interface HydratedFavorite {
  id: string;
  favoriteId: string;
  itemType: FavoriteCategory;
  itemId: string;
  title: string;
  subtitle?: string;
  region: string;
  image: string;
  url: string;
  description?: string;
  price?: number | string;
  rating?: number;
  categoryLabel: string;
  createdAt?: string;
}

// ─── Domain Registry for Rapid Hydration ───────────────────────────────────────
const DOMAIN_REGISTRY: Record<string, Partial<HydratedFavorite>> = {
  // Destinations
  'loc-tromso': {
    title: 'Tromsø & The Arctic Gateway',
    region: 'Northern Norway',
    image: '/images/destinations/tromso.jpg',
    url: '/explore/tromso',
    description: 'The capital of the Arctic, renowned for ethereal Northern Lights, midnight sun, and vibrant culture.',
    rating: 4.9,
    itemType: 'DESTINATION'
  },
  'tromso': {
    title: 'Tromsø',
    region: 'Northern Norway',
    image: '/images/destinations/tromso.jpg',
    url: '/explore/tromso',
    description: 'Arctic adventure hub with world-class auroral research stations and whale watching fjords.',
    rating: 4.9,
    itemType: 'DESTINATION'
  },
  'loc-geiranger': {
    title: 'Geirangerfjord',
    region: 'Western Norway',
    image: '/images/destinations/geirangerfjord.jpg',
    url: '/explore/geirangerfjord',
    description: 'UNESCO World Heritage fjord with soaring Seven Sisters waterfalls and majestic snow-capped peaks.',
    rating: 5.0,
    itemType: 'DESTINATION'
  },
  'geirangerfjord': {
    title: 'Geirangerfjord',
    region: 'Western Norway',
    image: '/images/destinations/geirangerfjord.jpg',
    url: '/explore/geirangerfjord',
    description: 'UNESCO World Heritage fjord featuring dramatic emerald waters and towering granite walls.',
    rating: 5.0,
    itemType: 'DESTINATION'
  },
  'fav-geiranger': {
    title: 'Geirangerfjord',
    region: 'Western Norway',
    image: '/images/destinations/geirangerfjord.jpg',
    url: '/explore/geirangerfjord',
    description: 'UNESCO World Heritage fjord with soaring waterfalls and majestic snow-capped peaks.',
    rating: 5.0,
    itemType: 'DESTINATION'
  },
  'loc-lofoten': {
    title: 'Lofoten Islands',
    region: 'Nordland',
    image: '/images/destinations/lofoten.jpg',
    url: '/explore/lofoten',
    description: 'Dramatic peaks rising straight from turquoise arctic waters, dotted with crimson rorbuer.',
    rating: 4.9,
    itemType: 'DESTINATION'
  },
  'lofoten': {
    title: 'Lofoten Archipelago',
    region: 'Nordland',
    image: '/images/destinations/lofoten.jpg',
    url: '/explore/lofoten',
    description: 'Unspoiled arctic islands famous for cod fishing traditions and towering sea cliffs.',
    rating: 4.9,
    itemType: 'DESTINATION'
  },
  'loc-bergen': {
    title: 'Bergen & Hanseatic Wharf',
    region: 'Western Norway',
    image: '/images/destinations/bergen.jpg',
    url: '/explore/bergen',
    description: 'Gateway to the fjords, home to the iconic UNESCO Bryggen wooden wharf and seven mountains.',
    rating: 4.8,
    itemType: 'DESTINATION'
  },
  'bergen': {
    title: 'Bergen',
    region: 'Western Norway',
    image: '/images/destinations/bergen.jpg',
    url: '/explore/bergen',
    description: 'Charming coastal city nestled between mountains, famous for fresh seafood and funiculars.',
    rating: 4.8,
    itemType: 'DESTINATION'
  },
  'loc-oslo': {
    title: 'Oslo Capital Region',
    region: 'Eastern Norway',
    image: '/images/destinations/oslo.jpg',
    url: '/explore/oslo',
    description: 'Nordic innovation hub blending cutting-edge sustainable architecture with fjord swimming.',
    rating: 4.7,
    itemType: 'DESTINATION'
  },
  'oslo': {
    title: 'Oslo',
    region: 'Eastern Norway',
    image: '/images/destinations/oslo.jpg',
    url: '/explore/oslo',
    description: 'Modern waterfront, Munch Museum, Opera House, and green forest micro-adventures.',
    rating: 4.7,
    itemType: 'DESTINATION'
  },
  'loc-stavanger': {
    title: 'Stavanger & Lysefjord',
    region: 'Rogaland',
    image: '/images/destinations/stavanger.jpg',
    url: '/explore/stavanger',
    description: 'Historic white wooden houses and the springboard to the world-famous Preikestolen rock.',
    rating: 4.8,
    itemType: 'DESTINATION'
  },
  'loc-flam': {
    title: 'Flåm & Aurlandsfjord',
    region: 'Sogn og Fjordane',
    image: '/images/destinations/flam.jpg',
    url: '/explore/flam',
    description: 'World-renowned scenic railway journey down steep mountain valleys to serene fjord shores.',
    rating: 4.9,
    itemType: 'DESTINATION'
  },
  'loc-alesund': {
    title: 'Ålesund Art Nouveau Town',
    region: 'Møre og Romsdal',
    image: '/images/destinations/alesund.jpg',
    url: '/explore/alesund',
    description: 'Fairy-tale Art Nouveau architecture spread across islands where the Atlantic meets the Sunnmøre Alps.',
    rating: 4.8,
    itemType: 'DESTINATION'
  },

  // Stays
  'stay-grand-hotel': {
    title: 'Grand Hotel Oslo',
    region: 'Oslo City Center',
    image: '/images/stays/grand_hotel_1787013661159.jpg',
    url: '/stay/stay-grand-hotel',
    description: 'Historic 1874 luxury hotel hosting Nobel Peace Prize laureates on Karl Johans gate.',
    price: 3200,
    rating: 4.9,
    itemType: 'STAY'
  },
  'stay-the-thief': {
    title: 'The Thief',
    region: 'Tjuvholmen, Oslo',
    image: '/images/stays/the_thief_1787013645398.jpg',
    url: '/stay/stay-the-thief',
    description: 'Avant-garde design waterfront hotel with bespoke contemporary art collections and luxury spa.',
    price: 3800,
    rating: 4.9,
    itemType: 'STAY'
  },
  'stay-sommerro': {
    title: 'Sommerro House',
    region: 'Frogner, Oslo',
    image: '/images/stays/sommerro_1787013653139.jpg',
    url: '/stay/stay-sommerro',
    description: 'Iconic 1930s Art Deco transformation with rooftop pool, public baths, and multiple restaurants.',
    price: 2950,
    rating: 4.8,
    itemType: 'STAY'
  },
  'stay-opus-xvi': {
    title: 'Opus XVI',
    region: 'Bergen',
    image: '/images/stays/opus_xvi_1787013667623.jpg',
    url: '/stay/stay-opus-xvi',
    description: 'Boutique heritage property owned by the descendants of legendary composer Edvard Grieg.',
    price: 2600,
    rating: 4.9,
    itemType: 'STAY'
  },
  'stay-britannia': {
    title: 'Britannia Hotel',
    region: 'Trondheim',
    image: '/images/stays/britannia_1787013681423.jpg',
    url: '/stay/stay-britannia',
    description: 'Five-star grandeur featuring Michelin-starred dining in the Palm Court and historic salons.',
    price: 3400,
    rating: 5.0,
    itemType: 'STAY'
  },
  'stay-solstrand': {
    title: 'Solstrand Hotel & Bad',
    region: 'Os, Bjørnafjorden',
    image: '/images/stays/solstrand_1787013674681.jpg',
    url: '/stay/stay-solstrand',
    description: '1896 Swiss-style fjord retreat with outdoor heated fjord pools and gardens.',
    price: 3100,
    rating: 4.9,
    itemType: 'STAY'
  },
  'fav-juvet': {
    title: 'Juvet Landscape Hotel',
    region: 'Valldal',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    url: '/stay/juvet-landscape-hotel',
    description: 'Architectural forest cabins with floor-to-ceiling glass walls immersed in Norwegian nature.',
    price: 4200,
    rating: 4.9,
    itemType: 'STAY'
  },

  // Activities & Trails
  'fav-reinebringen': {
    title: 'Reinebringen Ridge Trail',
    region: 'Lofoten Islands',
    image: 'https://images.unsplash.com/photo-1513519107127-1ea506ce3c53?auto=format&fit=crop&q=80',
    url: '/trails/reinebringen',
    description: '1,560 stone Sherpa steps leading to the iconic panoramic view of Reine and surrounding fjords.',
    rating: 4.9,
    itemType: 'ACTIVITY'
  },
  'act-aurora-chase': {
    title: 'Small-Group Aurora Science & Photography Chase',
    region: 'Tromsø',
    image: '/images/northern_lights_1786935879330.jpg',
    url: '/activities/act-aurora-chase',
    description: 'Thermal suits, campfire hot chocolate, and guided astronomical photography into the Finnish border.',
    price: 1450,
    rating: 4.9,
    itemType: 'ACTIVITY'
  },
  'act-trolltunga': {
    title: 'Guided Trolltunga Extreme Day Trek',
    region: 'Hardanger',
    image: '/images/mountains.jpg',
    url: '/activities/act-trolltunga',
    description: '28km expedition across mountain plateaus to the suspended cliff hanging 700m above Lake Ringedalsvatnet.',
    price: 1850,
    rating: 4.9,
    itemType: 'ACTIVITY'
  },
  'fav-ionity-oslo': {
    title: 'IONITY Oslo Central Hub',
    region: 'Eastern Norway',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80',
    url: '/mobility/ev/ionity-oslo',
    description: 'Ultra-fast 350kW high-power charging with 100% renewable hydroelectric power.',
    itemType: 'PLACE'
  },

  // Food
  'food-reinsdyrgryte': {
    title: 'Reinsdyrgryte (Arctic Reindeer Stew)',
    region: 'Troms & Finnmark',
    image: '/images/food_salmon_1787013684123.jpg',
    url: '/food/food-reinsdyrgryte',
    description: 'Tender arctic reindeer simmered with wild chanterelles, juniper berries, goat cheese, and mountain cranberries.',
    price: 345,
    rating: 4.9,
    itemType: 'FOOD'
  },
  'food-1': {
    title: 'Arctic Reinsdyrgryte',
    region: 'Troms & Finnmark',
    image: '/images/food_salmon_1787013684123.jpg',
    url: '/food/food-1',
    description: 'Slow-simmered reindeer stew with lingonberries and creamy mashed potatoes.',
    price: 320,
    rating: 4.9,
    itemType: 'FOOD'
  },
  'food-gravlaks': {
    title: 'Cured Gravlaks & Mustard Sauce',
    region: 'Western Fjords',
    image: '/images/food_salmon_1787013684123.jpg',
    url: '/food/food-gravlaks',
    description: 'Fresh fjord salmon cured with dill, coarse sea salt, sugar, and Aquavit, served with sweet mustard sauce.',
    price: 240,
    rating: 4.8,
    itemType: 'FOOD'
  },

  // Products
  'prod-wool-sweater-001': {
    title: 'Dale of Norway Cortina Wool Sweater',
    region: 'Artisanal Gear',
    image: '/images/shop/cortina_sweater.jpg',
    url: '/shop/prod-wool-sweater-001',
    description: '100% Norwegian virgin wool crafted in the Dale valley with traditional winter star patterns.',
    price: 2890,
    rating: 5.0,
    itemType: 'PRODUCT'
  },
  'prod-knife-002': {
    title: 'Helle Viking Hand-Forged Carbon Knife',
    region: 'Holmedal Workshop',
    image: '/images/shop/helle_knife.jpg',
    url: '/shop/prod-knife-002',
    description: 'Triple laminated carbon steel blade with curly birch handle and genuine leather sheath.',
    price: 1650,
    rating: 4.9,
    itemType: 'PRODUCT'
  },

  // Guides
  'guide-aurora': {
    title: 'Northern Lights Forecasting & Photography Masterclass',
    region: 'Travel Guides',
    image: '/images/northern_lights_1786935879330.jpg',
    url: '/guides',
    description: 'Everything you need to know about solar wind KP-indexes, camera aperture settings, and secret viewing fjords.',
    itemType: 'GUIDE'
  },
  'guide-ferry': {
    title: 'Norway Ferry & Scenic Fjord Transport Survival Guide',
    region: 'Travel Guides',
    image: '/images/fjords.jpg',
    url: '/guides',
    description: 'Navigating AutoPASS, express electric catamarans, and coastal routes effortlessly.',
    itemType: 'GUIDE'
  }
};

export const normalizeItemType = (rawType: string): FavoriteCategory => {
  const t = (rawType || '').toUpperCase().trim();
  if (t === 'DESTINATION' || t === 'DESTINATIONS' || t === 'LOCATION' || t === 'LOCATIONS') return 'DESTINATION';
  if (t === 'PLACE' || t === 'PLACES' || t === 'EV_STATION') return 'PLACE';
  if (t === 'STAY' || t === 'STAYS' || t === 'HOTEL' || t === 'HOTELS') return 'STAY';
  if (t === 'ACTIVITY' || t === 'ACTIVITIES' || t === 'TRAIL' || t === 'TRAILS') return 'ACTIVITY';
  if (t === 'FOOD' || t === 'RESTAURANT' || t === 'RESTAURANTS' || t === 'DISH') return 'FOOD';
  if (t === 'PRODUCT' || t === 'PRODUCTS' || t === 'SHOP' || t === 'GEAR') return 'PRODUCT';
  if (t === 'GUIDE' || t === 'GUIDES' || t === 'ARTICLE' || t === 'ARTICLES') return 'GUIDE';
  return 'DESTINATION';
};

export const getCategoryLabel = (category: FavoriteCategory): string => {
  switch (category) {
    case 'DESTINATION': return 'Destinations';
    case 'PLACE': return 'Places & Landmarks';
    case 'STAY': return 'Stays & Hotels';
    case 'ACTIVITY': return 'Activities & Trails';
    case 'FOOD': return 'Food & Dining';
    case 'PRODUCT': return 'Products & Gear';
    case 'GUIDE': return 'Travel Guides';
    default: return 'Saved Items';
  }
};

export const favoriteService = {
  /**
   * Fetch all raw favorite records for a user from Supabase.
   */
  async getFavorites(userId: string): Promise<FavoriteItem[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Error fetching user favorites:', err);
      return [];
    }
  },

  /**
   * Fetch and hydrate all favorite items with rich metadata (title, images, URL, pricing, etc.)
   */
  async getHydratedFavorites(userId: string): Promise<HydratedFavorite[]> {
    const rawFavorites = await this.getFavorites(userId);
    if (!rawFavorites || rawFavorites.length === 0) return [];

    return rawFavorites.map((fav) => {
      const normType = normalizeItemType(fav.item_type);
      const reg = DOMAIN_REGISTRY[fav.item_id] || DOMAIN_REGISTRY[fav.item_id.toLowerCase()];

      if (reg) {
        return {
          id: fav.id || `${fav.item_type}-${fav.item_id}`,
          favoriteId: fav.id,
          itemType: normType,
          itemId: fav.item_id,
          title: reg.title || formatFallbackTitle(fav.item_id),
          subtitle: reg.subtitle,
          region: reg.region || 'Norway',
          image: reg.image || getFallbackImage(normType),
          url: reg.url || getFallbackUrl(normType, fav.item_id),
          description: reg.description || 'Saved Norwegian experience in your personal collection.',
          price: reg.price,
          rating: reg.rating || 4.8,
          categoryLabel: getCategoryLabel(normType),
          createdAt: fav.created_at || new Date().toISOString()
        };
      }

      // Dynamic fallback for any entity ID
      return {
        id: fav.id || `${fav.item_type}-${fav.item_id}`,
        favoriteId: fav.id,
        itemType: normType,
        itemId: fav.item_id,
        title: formatFallbackTitle(fav.item_id),
        region: 'Norway',
        image: getFallbackImage(normType),
        url: getFallbackUrl(normType, fav.item_id),
        description: 'Saved to your personal Norwegian favorites collection.',
        rating: 4.8,
        categoryLabel: getCategoryLabel(normType),
        createdAt: fav.created_at || new Date().toISOString()
      };
    });
  },

  /**
   * Check whether a specific item is in the user's favorites.
   */
  async checkIsFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) return false;
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;
      return (count || 0) > 0;
    } catch {
      return false;
    }
  },

  /**
   * Add an item to user favorites.
   */
  async addFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) throw new Error('User and Item ID are required.');
    
    const { error } = await supabase
      .from('favorites')
      .upsert(
        {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
          created_at: new Date().toISOString()
        },
        { onConflict: 'user_id,item_type,item_id' }
      );

    if (error) throw error;
    return true;
  },

  /**
   * Remove an item from user favorites.
   */
  async removeFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) throw new Error('User and Item ID are required.');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId);

    if (error) throw error;
    return true;
  },

  /**
   * Toggle favorite state for a given item. Returns true if saved, false if removed.
   */
  async toggleFavorite(userId: string, itemType: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) throw new Error('Authentication required.');

    // Check if it already exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      return false;
    } else {
      await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          item_type: itemType,
          item_id: itemId
        });
      return true;
    }
  },

  /**
   * Clear all saved favorites for the user.
   */
  async clearAllFavorites(userId: string): Promise<boolean> {
    if (!userId) return false;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatFallbackTitle(rawId: string): string {
  const cleaned = rawId.replace(/^(loc-|fav-|stay-|act-|food-|prod-|guide-)/i, '').replace(/[-_]/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function getFallbackImage(type: FavoriteCategory): string {
  switch (type) {
    case 'DESTINATION': return '/images/destinations/tromso.jpg';
    case 'PLACE': return '/images/fjords.jpg';
    case 'STAY': return '/images/stays/the_thief_1787013645398.jpg';
    case 'ACTIVITY': return '/images/mountains.jpg';
    case 'FOOD': return '/images/food_salmon_1787013684123.jpg';
    case 'PRODUCT': return '/images/shop/cortina_sweater.jpg';
    case 'GUIDE': return '/images/northern_lights_1786935879330.jpg';
    default: return '/images/destinations/geirangerfjord.jpg';
  }
}

function getFallbackUrl(type: FavoriteCategory, itemId: string): string {
  const cleanId = itemId.replace(/^(loc-|fav-|stay-|act-|food-|prod-|guide-)/i, '');
  switch (type) {
    case 'DESTINATION': return `/explore/${cleanId}`;
    case 'PLACE': return `/places`;
    case 'STAY': return `/stay/${cleanId}`;
    case 'ACTIVITY': return `/activities/${cleanId}`;
    case 'FOOD': return `/food/${cleanId}`;
    case 'PRODUCT': return `/shop/${cleanId}`;
    case 'GUIDE': return `/guides`;
    default: return `/explore/${cleanId}`;
  }
}
