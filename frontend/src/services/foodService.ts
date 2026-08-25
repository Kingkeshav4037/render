import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Location } from './transportService';

export type RestaurantRow = Database['public']['Tables']['restaurants']['Row'];

export interface Restaurant extends RestaurantRow {
  location?: Location;
}

export type FoodRow = Database['public']['Tables']['foods']['Row'];

export interface Food extends FoodRow {
  price?: number;
  currency?: string;
  category?: string;
  prep_time?: string;
  media?: any[];
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

// Unique, contextually-correct Unsplash images for each Norwegian dish
const FOOD_IMAGES: Record<string, string> = {
  'fårikål':         'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200',
  'farikal':         'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200',
  'brunost':         'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1200',
  'kjøttkaker':      'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1200',
  'kjottkaker':      'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1200',
  'pinnekjøtt':      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
  'pinnekjott':      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
  'ribbe':           'https://images.unsplash.com/photo-1604908177522-8b8d8b0a0c6c?q=80&w=1200',
  'lutefisk':        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200',
  'raspeballer':     'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200',
  'lapskaus':        'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200',
  'rakfisk':         'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200',
  'gravlaks':        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200',
  'gravlax':         'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200',
  'salmon':          '/images/food_salmon_1787013684123.jpg',
  'laks':            '/images/food_salmon_1787013684123.jpg',
  'klippfisk':       'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200',
  'stockfish':       'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200',
  'rømmegrøt':       'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=80&w=1200',
  'rommegrot':       'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=80&w=1200',
  'lefse':           'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200',
  'krumkake':        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200',
  'cloudberry':      'https://images.unsplash.com/photo-1528821154031-2b0b45f9e47e?q=80&w=1200',
  'multekrem':       'https://images.unsplash.com/photo-1528821154031-2b0b45f9e47e?q=80&w=1200',
  'smalahove':       'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
  'whale':           'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200',
  'hvalbiff':        'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1200',
  'svele':           'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200',
  'waffle':          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200',
  'vaffel':          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200',
};

// Category → representative image
const CATEGORY_IMAGES: Record<string, string> = {
  'seafood':      '/images/food_salmon_1787013684123.jpg',
  'meat':         'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
  'dairy':        'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1200',
  'dessert':      'https://images.unsplash.com/photo-1528821154031-2b0b45f9e47e?q=80&w=1200',
  'bread':        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200',
  'soup':         'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200',
  'christmas':    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
};

// Estimated price range for traditional dishes (in NOK, for display purposes)
const FOOD_PRICES: Record<string, number> = {
  'fårikål':         198,
  'farikal':         198,
  'brunost':          89,
  'kjøttkaker':      175,
  'kjottkaker':      175,
  'pinnekjøtt':      285,
  'pinnekjott':      285,
  'ribbe':           245,
  'lutefisk':        220,
  'raspeballer':     165,
  'lapskaus':        155,
  'rakfisk':         310,
  'gravlaks':        265,
  'gravlax':         265,
  'rømmegrøt':       125,
  'rommegrot':       125,
  'lefse':            65,
  'krumkake':         55,
  'cloudberry':       98,
  'multekrem':        98,
  'svele':            55,
  'vaffel':           55,
};

export function getFoodImage(name: string, imageUrl?: string | null): string {
  if (imageUrl && !imageUrl.includes('placeholder') && !imageUrl.includes('food_salmon')) {
    return imageUrl;
  }

  const key = name.toLowerCase().trim();
  // Exact match
  for (const [slug, url] of Object.entries(FOOD_IMAGES)) {
    if (key === slug || key.startsWith(slug) || key.includes(slug)) {
      return url;
    }
  }
  // Fallback – try category
  for (const [cat, url] of Object.entries(CATEGORY_IMAGES)) {
    if (key.includes(cat)) return url;
  }
  return '/images/food_salmon_1787013684123.jpg';
}

export function getFoodPrice(name: string, dbPrice?: number | null): number {
  if (dbPrice && dbPrice > 0) return dbPrice;
  const key = name.toLowerCase().trim();
  for (const [slug, price] of Object.entries(FOOD_PRICES)) {
    if (key === slug || key.includes(slug)) return price;
  }
  return 149;
}

export const foodService = {
  async getRestaurants(
    filters?: { cuisine?: string; type?: string; location_id?: string },
    page = 1,
    limit = 24
  ): Promise<PaginatedResult<Restaurant>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('restaurants')
        .select('*, location:locations(*)', { count: 'exact' });

      if (filters?.cuisine) {
        query = query.contains('cuisine', [filters.cuisine.toUpperCase()]);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type as any);
      }
      if (filters?.location_id) {
        query = query.eq('location_id', filters.location_id);
      }

      const { data, count, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching restaurants:', error);
        return { data: [], count: 0 };
      }

      return { data: (data as Restaurant[]) || [], count: count || 0 };
    } catch (err) {
      console.error('Error in getRestaurants:', err);
      return { data: [], count: 0 };
    }
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, location:locations(*)')
        .eq('id', id)
        .single();

      if (error || !data) {
        if (error) console.error('Error fetching restaurant by id:', error);
        return null;
      }
      return data as Restaurant;
    } catch (err) {
      console.error('Error in getRestaurantById:', err);
      return null;
    }
  },

  async getFoods(
    filters?: { featured?: boolean },
    page = 1,
    limit = 24
  ): Promise<PaginatedResult<Food>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('foods')
        .select('*', { count: 'exact' });

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      const { data, count, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching foods:', error);
        return { data: [], count: 0 };
      }

      // Enrich each food with correct image and price
      const enriched: Food[] = ((data as Food[]) || []).map(food => ({
        ...food,
        image_url: getFoodImage(food.name, food.image_url),
        price: getFoodPrice(food.name, undefined),
        currency: 'NOK',
      }));

      return { data: enriched, count: count || enriched.length };
    } catch (err) {
      console.error('Error in getFoods:', err);
      return { data: [], count: 0 };
    }
  },

  async getFoodById(id: string): Promise<Food | null> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // Fallback: try searching across foods list
        const { data: allFoods } = await this.getFoods({}, 1, 50);
        const match = allFoods.find(f => f.id === id || f.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase());
        return match || null;
      }

      const food = data as Food;
      return {
        ...food,
        image_url: getFoodImage(food.name, food.image_url),
        price: getFoodPrice(food.name, undefined),
        currency: 'NOK',
      };
    } catch (err) {
      console.error('Error in getFoodById:', err);
      return null;
    }
  },
};

