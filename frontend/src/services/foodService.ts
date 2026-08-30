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

// Unique, contextually-correct images for each Norwegian dish
const FOOD_IMAGES: Record<string, string> = {
  'fårikål':         'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=lamb+cabbage+stew+pot&w=1200',
  'farikal':         'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=lamb+cabbage+stew+pot&w=1200',
  'brunost':         'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=brown+cheese+norway&w=1200',
  'kjøttkaker':      'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=meatballs+gravy+lingonberry&w=1200',
  'kjottkaker':      'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=meatballs+gravy+lingonberry&w=1200',
  'pinnekjøtt':      'https://images.unsplash.com/photo-1544025162-d76694265947?q=lamb+ribs+steamed&w=1200',
  'pinnekjott':      'https://images.unsplash.com/photo-1544025162-d76694265947?q=lamb+ribs+steamed&w=1200',
  'ribbe':           'https://images.unsplash.com/photo-1514944298352-f4728562d294?q=roast+pork+belly+crackling&w=1200',
  'sodd':            'https://images.unsplash.com/photo-1547592180-85f173990554?q=clear+broth+soup+meatballs&w=1200',
  'lutefisk':        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=whitefish+cod+peas+bacon&w=1200',
  'raspeballer':     'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=potato+dumplings+knodel&w=1200',
  'komle':           'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=potato+dumplings+knodel&w=1200',
  'lapskaus':        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=beef+stew+potatoes+carrots&w=1200',
  'rakfisk':         'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=cured+trout+platter+flatbread&w=1200',
  'gravlaks':        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=gravlax+salmon+dill&w=1200',
  'gravlax':         'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=gravlax+salmon+dill&w=1200',
  'salmon':          '/images/food_salmon_1787013684123.jpg',
  'laks':            '/images/food_salmon_1787013684123.jpg',
  'klippfisk':       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=bacalao+cod+tomato+stew&w=1200',
  'bacalao':         'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=bacalao+cod+tomato+stew&w=1200',
  'stockfish':       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=bacalao+cod+tomato+stew&w=1200',
  'rømmegrøt':       'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=sour+cream+porridge+cinnamon&w=1200',
  'rommegrot':       'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=sour+cream+porridge+cinnamon&w=1200',
  'lefse':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=flatbread+pastry+norwegian&w=1200',
  'krumkake':        'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=cone+cookie+waffle&w=1200',
  'cloudberry':      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=cloudberries+whipped+cream&w=1200',
  'multekrem':       'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=cloudberries+whipped+cream&w=1200',
  'smalahove':       'https://images.unsplash.com/photo-1558030006-450675393462?q=seared+steak+meat+platter&w=1200',
  'whale':           'https://images.unsplash.com/photo-1558030006-450675393462?q=seared+steak+meat+platter&w=1200',
  'hvalbiff':        'https://images.unsplash.com/photo-1558030006-450675393462?q=seared+steak+meat+platter&w=1200',
  'svele':           'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=pancake+fluffy+butter&w=1200',
  'waffle':          'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=waffle+berries+norway&w=1200',
  'vaffel':          'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=waffle+berries+norway&w=1200',
};

// Unique images for Norwegian restaurants and cafes
const RESTAURANT_IMAGES: Record<string, string> = {
  'einer':                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
  'kontrast':             'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200',
  'smalhans':             'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200',
  'bryggeloftet & stuene': 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=1200',
  'bryggeloftet':         'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=1200',
  'kaffemisjonen':        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200',
  'vippa':                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
  'speilsalen':           'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200',
  'enhjørningen':         'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200',
  'enhjorningen':         'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200',
};

// Category → representative image
const CATEGORY_IMAGES: Record<string, string> = {
  'seafood':      '/images/food_salmon_1787013684123.jpg',
  'meat':         'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
  'dairy':        'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1200',
  'dessert':      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=1200',
  'bread':        'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=1200',
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
  const key = name.toLowerCase().trim();
  
  // Specific dish dictionary lookup takes precedence
  for (const [slug, url] of Object.entries(FOOD_IMAGES)) {
    if (key === slug || key.startsWith(slug) || key.includes(slug)) {
      return url;
    }
  }

  if (imageUrl && !imageUrl.includes('placeholder') && !imageUrl.includes('food_salmon')) {
    return imageUrl;
  }

  // Fallback – try category
  for (const [cat, url] of Object.entries(CATEGORY_IMAGES)) {
    if (key.includes(cat)) return url;
  }
  return '/images/food_salmon_1787013684123.jpg';
}

export function getRestaurantImage(name: string, imageUrl?: string | null): string {
  const key = name.toLowerCase().trim();
  for (const [slug, url] of Object.entries(RESTAURANT_IMAGES)) {
    if (key === slug || key.includes(slug) || slug.includes(key)) {
      return url;
    }
  }
  if (imageUrl && !imageUrl.includes('placeholder')) {
    return imageUrl;
  }
  return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200';
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

      const enriched: Restaurant[] = ((data as Restaurant[]) || []).map(r => ({
        ...r,
        image_url: getRestaurantImage(r.name, r.image_url)
      }));

      return { data: enriched, count: count || enriched.length };
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

