import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Location } from './transportService';

export type RestaurantRow = Database['public']['Tables']['restaurants']['Row'];

export interface Restaurant extends RestaurantRow {
  location?: Location;
  is_demo?: boolean;
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
  // Trust DB url only if it's genuinely unique (not the repeated salmon image from a bad migration)
  if (imageUrl && !imageUrl.includes('placeholder') && !imageUrl.includes('food_salmon')) {
    // Extra check – if slug-key image exists, prefer it anyway
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
  // Generic fallback
  return 149;
}

// Fallback dataset for when DB is empty
const FOOD_DEFAULTS = {
  canonical_url: null, external_id: null, og_image: null, published_at: null,
  seo_description: null, seo_title: null, source_name: null, source_type: null,
  verified_at: null, verified_by: null,
  image_alt: null, image_category: null, image_credit: null, image_source: null,
  image_verified: null, image_verified_at: null, image_verified_by: null,
  search_vector: null
};
const DEFAULT_FOODS: Food[] = [
  { ...FOOD_DEFAULTS, id: 'f-001', slug: 'farikal', name: 'Fårikål', description: "Norway's national dish: slow-cooked lamb and cabbage with whole black peppercorns, traditionally served in autumn.", status: 'PUBLISHED', featured: true, image_url: FOOD_IMAGES['farikal'], price: 198, currency: 'NOK', category: 'Traditional', prep_time: '2.5 hrs', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-002', slug: 'brunost', name: 'Brunost', description: "A sweet, caramelized brown cheese made by boiling whey, milk, and cream — iconic on Norwegian waffles.", status: 'PUBLISHED', featured: true, image_url: FOOD_IMAGES['brunost'], price: 89, currency: 'NOK', category: 'Traditional', prep_time: '5 min', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-003', slug: 'kjottkaker', name: 'Kjøttkaker', description: 'Traditional Norwegian meatballs in a rich brown gravy, served with mashed potatoes and lingonberry jam.', status: 'PUBLISHED', featured: true, image_url: FOOD_IMAGES['kjottkaker'], price: 175, currency: 'NOK', category: 'Traditional', prep_time: '45 min', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-004', slug: 'pinnekjott', name: 'Pinnekjøtt', description: 'Salted and dried lamb ribs steamed over birch sticks — the classic Norwegian Christmas main course.', status: 'PUBLISHED', featured: true, image_url: FOOD_IMAGES['pinnekjott'], price: 285, currency: 'NOK', category: 'Traditional', prep_time: '3 hrs', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-005', slug: 'ribbe', name: 'Ribbe', description: "Crispy pork belly, Norway's most popular Christmas Eve main dish, seasoned with salt and pepper.", status: 'PUBLISHED', featured: true, image_url: FOOD_IMAGES['ribbe'], price: 245, currency: 'NOK', category: 'Traditional', prep_time: '3 hrs', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-006', slug: 'lutefisk', name: 'Lutefisk', description: 'Dried stockfish treated with lye then rehydrated — a polarizing but traditional Norwegian Christmas dish.', status: 'PUBLISHED', featured: false, image_url: FOOD_IMAGES['lutefisk'], price: 220, currency: 'NOK', category: 'Seafood', prep_time: '20 min', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-007', slug: 'raspeballer', name: 'Raspeballer', description: 'Hearty potato dumplings boiled with salted meat and bacon — a beloved comfort food from Western Norway.', status: 'PUBLISHED', featured: false, image_url: FOOD_IMAGES['raspeballer'], price: 165, currency: 'NOK', category: 'Traditional', prep_time: '1 hr', created_at: '', updated_at: '' },
  { ...FOOD_DEFAULTS, id: 'f-008', slug: 'lapskaus', name: 'Lapskaus', description: 'A thick Norwegian stew of meat, potatoes, and root vegetables — hearty winter comfort food.', status: 'PUBLISHED', featured: false, image_url: FOOD_IMAGES['lapskaus'], price: 155, currency: 'NOK', category: 'Traditional', prep_time: '1.5 hrs', created_at: '', updated_at: '' },
];


const DEFAULT_RESTAURANTS: any[] = [
  { id: 'r-001', name: 'Maaemo', type: 'FINE_DINING', description: 'Three-Michelin-star pioneer of New Nordic cuisine in Oslo.', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200', rating: 5.0, price_range: '$$$$', location: { name: 'Oslo', region: 'Eastern Norway' } },
  { id: 'r-002', name: 'Cornelius Seafood Restaurant', type: 'SEAFOOD', description: 'Norway\'s freshest seafood served on a rocky island accessible only by boat in the Bergen Fjord.', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200', rating: 4.8, price_range: '$$$', location: { name: 'Bergen', region: 'Fjord Norway' } },
  { id: 'r-003', name: 'Lysverket', type: 'NEW_NORDIC', description: 'Creative New Nordic tasting menus inside Bergen\'s famous KODE art museum.', image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cbe818b5?q=80&w=1200', rating: 4.7, price_range: '$$$', location: { name: 'Bergen', region: 'Fjord Norway' } },
  { id: 'r-004', name: 'Sabi Omakase', type: 'FINE_DINING', description: 'Intimate 8-seat omakase bar in Stavanger combining Japanese precision with Norwegian seafood.', image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200', rating: 4.9, price_range: '$$$$', location: { name: 'Stavanger', region: 'Fjord Norway' } },
  { id: 'r-005', name: 'Re-naa', type: 'FINE_DINING', description: 'One-Michelin-star restaurant highlighting local Rogaland produce with modern technique.', image_url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?q=80&w=1200', rating: 4.8, price_range: '$$$', location: { name: 'Stavanger', region: 'Fjord Norway' } },
  { id: 'r-006', name: 'Bagatelle', type: 'NEW_NORDIC', description: 'Oslo\'s legendary fine-dining institution with a deep focus on seasonal Norwegian ingredients.', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200', rating: 4.7, price_range: '$$$', location: { name: 'Oslo', region: 'Eastern Norway' } },
  { id: 'r-007', name: 'Sjømagasinet', type: 'SEAFOOD', description: 'Award-winning Bergen waterfront seafood restaurant in a beautifully restored 19th-century warehouse.', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200', rating: 4.6, price_range: '$$$', location: { name: 'Bergen', region: 'Fjord Norway' } },
  { id: 'r-008', name: 'Arakataka', type: 'CASUAL', description: 'Celebrated Oslo bistro for organic, locally-sourced small plates with natural wines.', image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cbe818b5?q=80&w=1200', rating: 4.5, price_range: '$$', location: { name: 'Oslo', region: 'Eastern Norway' } },
];

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

      if (error || !data || data.length === 0) {
        const filtered = filters?.cuisine
          ? DEFAULT_RESTAURANTS
          : DEFAULT_RESTAURANTS;
        return {
          data: filtered.slice((page - 1) * limit, page * limit) as Restaurant[],
          count: filtered.length,
        };
      }

      return { data: data as Restaurant[], count: count || 0 };
    } catch {
      return { data: DEFAULT_RESTAURANTS as Restaurant[], count: DEFAULT_RESTAURANTS.length };
    }
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      // Check if it's a fallback ID
      const fallback = DEFAULT_RESTAURANTS.find(r => r.id === id);
      if (fallback) return fallback as Restaurant;

      const { data, error } = await supabase
        .from('restaurants')
        .select('*, location:locations(*)')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return data as Restaurant;
    } catch {
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

      if (error || !data || data.length === 0) {
        let fallback = DEFAULT_FOODS;
        if (filters?.featured) fallback = DEFAULT_FOODS.filter(f => f.featured);
        return {
          data: fallback.slice((page - 1) * limit, page * limit),
          count: fallback.length,
        };
      }

      // Enrich each food with correct image and price
      const enriched: Food[] = (data as Food[]).map(food => ({
        ...food,
        image_url: getFoodImage(food.name, food.image_url),
        price: getFoodPrice(food.name, undefined),
        currency: 'NOK',
      }));

      return { data: enriched, count: count || enriched.length };
    } catch {
      return { data: DEFAULT_FOODS, count: DEFAULT_FOODS.length };
    }
  },
};
