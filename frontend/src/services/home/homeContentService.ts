import { supabase } from '../../lib/supabase';
import { 
  HomePlace, 
  HomeAnimal, 
  HomeFood, 
  HomeHotel,
  HomeActivity,
  HomeEvent,
  HomeDeal
} from '../../types/home';
import { getFoodImage } from '../foodService';
import { getWildlifeImage } from '../wildlifeService';
import { getEventImage } from '../eventService';

// ─── ACTIVITY IMAGE MAP (category → local image) ────────────────────────────
// Each category gets a distinct, contextually accurate local image.
export const ACTIVITY_CATEGORY_IMAGES: Record<string, string> = {
  HIKING:    '/images/preikestolen_hikers.jpg',
  AURORA:    '/images/aurora_dogsled.jpg',
  KAYAK:     '/images/geirangerfjord_kayak.jpg',
  WILDLIFE:  '/images/sea_eagle_safari.jpg',
  CRUISE:    '/images/luxury_fjord_cruise.jpg',
  CLIMBING:  '/images/svalbard_trek.jpg',
  MOUNTAIN:  '/images/arctic_hikers.jpg',
  SKIING:    '/images/cross_country_skiing.jpg',
  DEFAULT:   '/images/fjord_rib_safari.jpg',
};

/** Returns the best local image for an activity given its category, optional DB url, or activity name. */
export function getActivityImage(category: string, dbImageUrl?: string | null, name?: string): string {
  const title = (name || '').toLowerCase();
  if (title.includes('ski') || title.includes('snow')) return '/images/cross_country_skiing.jpg';
  if (title.includes('sled') || title.includes('husky')) return '/images/dog_sledding.jpg';
  if (title.includes('kayak')) return '/images/geirangerfjord_kayak.jpg';
  if (title.includes('eagle')) return '/images/sea_eagle_safari.jpg';
  if (title.includes('whale')) return '/images/whale_safari.jpg';
  if (title.includes('walrus')) return '/images/walrus_safari.jpg';
  if (title.includes('cruise') || title.includes('boat')) return '/images/luxury_fjord_cruise.jpg';
  if (title.includes('rib')) return '/images/fjord_rib_safari.jpg';
  if (title.includes('hike') || title.includes('trek') || title.includes('pulpit') || title.includes('preikestolen')) return '/images/preikestolen_hikers.jpg';

  if (dbImageUrl && dbImageUrl.trim() && !dbImageUrl.includes('placeholder') && !dbImageUrl.includes('unsplash')) {
    return dbImageUrl;
  }
  const key = (category || '').toUpperCase();
  return ACTIVITY_CATEGORY_IMAGES[key] || ACTIVITY_CATEGORY_IMAGES.DEFAULT;
}

// ─── FALLBACK DATA ────────────────────────────────────────────────────────────

const FALLBACK_DESTINATIONS: HomePlace[] = [
  { id: 'l-01', name: 'Geirangerfjord', slug: 'geirangerfjord', category: 'Fjord', region: 'Møre og Romsdal', short_description: 'UNESCO-listed fjord flanked by cascading waterfalls and dramatic cliffs.', image: '/images/fjords_1786935800026.jpg', latitude: 62.1, longitude: 7.2, rating: 4.9, featured: true },
  { id: 'l-02', name: 'Lofoten Islands', slug: 'lofoten', category: 'Island', region: 'Nordland', short_description: 'Dramatic archipelago with red fishing cabins, midnight sun, and the Aurora.', image: '/images/lofoten_1787013505867.jpg', latitude: 68.2, longitude: 14.5, rating: 4.9, featured: true },
  { id: 'l-03', name: 'Preikestolen', slug: 'preikestolen', category: 'Mountain', region: 'Rogaland', short_description: 'Iconic 604m cliff rising sheer above the Lysefjord — a bucket-list viewpoint.', image: '/images/preikestolen_1786936002797.jpg', latitude: 58.99, longitude: 6.19, rating: 4.8, featured: true },
  { id: 'l-04', name: 'Trolltunga', slug: 'trolltunga', category: 'Mountain', region: 'Vestland', short_description: 'Norway\'s most spectacular cliff ledge hovering 700 metres above Lake Ringedalsvatnet.', image: '/images/trolltunga_1786936111320.jpg', latitude: 60.12, longitude: 6.74, rating: 4.8, featured: true },
  { id: 'l-05', name: 'Tromsø', slug: 'tromso', category: 'City', region: 'Troms', short_description: 'The gateway to the Arctic and Norway\'s prime Northern Lights destination.', image: '/images/tromso_winter.jpg', latitude: 69.65, longitude: 18.95, rating: 4.7, featured: true },
  { id: 'l-06', name: 'Bergen', slug: 'bergen', category: 'City', region: 'Vestland', short_description: 'Gateway to the fjords with a colourful Hanseatic wharf and lush surrounding mountains.', image: '/images/bryggen.jpg', latitude: 60.39, longitude: 5.32, rating: 4.8, featured: true },
];

const FALLBACK_ACTIVITIES: HomeActivity[] = [
  { id: 'a-01', name: 'Preikestolen Sunrise Trek',      category: 'HIKING',   region: 'Rogaland',        duration: '6 hrs', price: 1300, rating: 4.9, image: '/images/preikestolen_hikers.jpg' },
  { id: 'a-02', name: 'Northern Lights Dog Sledding',   category: 'AURORA',   region: 'Tromsø',          duration: '4 hrs', price: 2100, rating: 4.9, image: '/images/aurora_dogsled.jpg' },
  { id: 'a-03', name: 'Geirangerfjord Waterfall Kayak', category: 'KAYAK',    region: 'Møre og Romsdal', duration: '3 hrs', price: 1200, rating: 4.8, image: '/images/geirangerfjord_kayak.jpg' },
  { id: 'a-04', name: 'Trollfjord Sea Eagle Safari',    category: 'WILDLIFE', region: 'Lofoten',         duration: '2 hrs', price: 1050, rating: 4.8, image: '/images/sea_eagle_safari.jpg' },
];

const FALLBACK_FOODS: HomeFood[] = [
  { id: 'fo-01', name: 'Fårikål', category: 'Traditional', origin_region: 'Nationwide', short_description: "Norway's national dish: lamb slow-cooked with cabbage and black pepper.", image: '/images/dish_farikal.jpg' },
  { id: 'fo-02', name: 'Gravlaks', category: 'Seafood', origin_region: 'Coastal Norway', short_description: 'Cold-cured salmon with dill, mustard, and aquavit — an iconic Nordic starter.', image: '/images/dish_gravlaks.jpg' },
  { id: 'fo-03', name: 'Brunost', category: 'Traditional', origin_region: 'Gudbrandsdalen', short_description: 'Caramelised brown whey cheese — utterly unique and deeply Norwegian.', image: '/images/dish_brunost.jpg' },
  { id: 'fo-04', name: 'Pinnekjøtt', category: 'Land Food', origin_region: 'Western Norway', short_description: 'Salted dried lamb ribs steamed over birch twigs — the Christmas centrepiece.', image: '/images/dish_pinnekjott.jpg' },
];

const FALLBACK_WILDLIFE: HomeAnimal[] = [
  { id: 'w-01', name: 'Arctic Fox', scientific_name: 'Vulpes lagopus', category: 'Land', habitat: 'Arctic tundra', short_description: 'One of Norway\'s most endangered mammals, perfectly adapted to extreme cold.', image: '/images/arctic_fox.jpg', best_season: 'Winter' },
  { id: 'w-02', name: 'Moose', scientific_name: 'Alces alces', category: 'Land', habitat: 'Boreal forest', short_description: 'The largest of the deer family, a majestic sight in Norway\'s forests.', image: '/images/moose.jpg', best_season: 'Summer' },
  { id: 'w-03', name: 'Atlantic Puffin', scientific_name: 'Fratercula arctica', category: 'Bird', habitat: 'Sea cliffs', short_description: 'Colourful seabird nesting in millions along Norway\'s western coast.', image: '/images/atlantic_puffin.jpg', best_season: 'Summer' },
  { id: 'w-04', name: 'Orca', scientific_name: 'Orcinus orca', category: 'Marine', habitat: 'Fjords', short_description: 'Pods of orcas follow herring into Norwegian fjords each winter.', image: '/images/orca.jpg', best_season: 'Winter' },
];

const FALLBACK_HOTELS: HomeHotel[] = [
  { id: 'h-01', name: 'Juvet Landscape Hotel', category: 'Cabin', city: 'Valldal', region: 'Møre og Romsdal', rating: 4.9, price_indicator: 'NOK 4 200/night', image: '/images/hotel_juvet_1787013813000.jpg', latitude: 62.22, longitude: 7.68 },
  { id: 'h-02', name: 'The Thief Oslo', category: 'Boutique', city: 'Oslo', region: 'Eastern Norway', rating: 4.8, price_indicator: 'NOK 2 800/night', image: '/images/clarion_hotel_the_hub.jpg', latitude: 59.91, longitude: 10.72 },
  { id: 'h-03', name: 'Svinøya Rorbuer', category: 'Cabin', city: 'Svolvær', region: 'Lofoten', rating: 4.7, price_indicator: 'NOK 1 900/night', image: '/images/lofoten_cabins.jpg', latitude: 68.23, longitude: 14.57 },
];

const FALLBACK_RESTAURANTS = [
  { id: 'r-01', name: 'Maaemo', type: 'FINE_DINING', image_url: '/images/restaurant_maaemo.jpg', rating: 5.0, price_range: '$$$$', locations: { name: 'Oslo' } },
  { id: 'r-02', name: 'Cornelius Seafood', type: 'SEAFOOD', image_url: '/images/food_salmon_1787013684123.jpg', rating: 4.8, price_range: '$$$', locations: { name: 'Bergen' } },
  { id: 'r-03', name: 'Sabi Omakase', type: 'FINE_DINING', image_url: '/images/fine_dining_interior.jpg', rating: 4.9, price_range: '$$$$', locations: { name: 'Stavanger' } },
];

const FALLBACK_EVENTS: HomeEvent[] = [
  { id: 'ev-01', name: 'Bergen International Festival', date: 'May 21 – Jun 1', location: 'Bergen', category: 'Festival', image: '/images/event_festspillene.jpg' },
  { id: 'ev-02', name: 'Midnight Sun Marathon', date: 'Jun 21', location: 'Tromsø', category: 'Sports', image: '/images/event_midnight_sun_marathon.jpg' },
  { id: 'ev-03', name: 'Holmenkollen Ski Festival', date: 'Mar 7–9', location: 'Oslo', category: 'Sports', image: '/images/event_holmenkollen.jpg' },
];

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export const homeContentService = {

  async getTrendingPlaces(): Promise<HomePlace[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, slug, type, region, description, lat, lng, hero_image_url, featured, status')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .limit(6);
      if (error || !data || data.length === 0) return FALLBACK_DESTINATIONS;
      return data.map(mapLocationToHomePlace);
    } catch { return FALLBACK_DESTINATIONS; }
  },

  async getActivities(): Promise<HomeActivity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('id, name, type, duration_minutes, price, image_url, status, featured')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .limit(4);
      if (error || !data || data.length === 0) return FALLBACK_ACTIVITIES;
      return data.map(d => ({
        id: d.id,
        name: d.name,
        category: d.type || 'Adventure',
        region: 'Norway',
        duration: d.duration_minutes ? `${Math.floor(d.duration_minutes / 60)}h ${d.duration_minutes % 60 ? (d.duration_minutes % 60) + 'm' : ''}`.trim() : '2h',
        price: d.price || 0,
        rating: 4.8,
        // Use category & title specific local image when DB image is missing/broken
        image: getActivityImage(d.type, d.image_url, d.name),
      }));
    } catch { return FALLBACK_ACTIVITIES; }
  },

  async getFood(): Promise<HomeFood[]> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('id, name, description, image_url, status, featured')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .limit(4);
      if (error || !data || data.length === 0) return FALLBACK_FOODS;
      return data.map(d => ({
        id: d.id,
        name: d.name,
        category: 'Traditional' as any,
        origin_region: 'Norway',
        short_description: d.description || '',
        image: getFoodImage(d.name, d.image_url),
      }));
    } catch { return FALLBACK_FOODS; }
  },

  async getWildlife(): Promise<HomeAnimal[]> {
    try {
      const { data, error } = await supabase
        .from('wildlife_species')
        .select('id, common_name, scientific_name, slug, description, facts')
        .limit(4);
      if (error || !data || data.length === 0) return FALLBACK_WILDLIFE;
      return data.map(d => ({
        id: d.id,
        name: d.common_name,
        scientific_name: d.scientific_name || '',
        category: 'Land' as any,
        habitat: '',
        short_description: d.description || '',
        image: getWildlifeImage(d.slug, d.common_name),
        best_season: 'Year-round',
      }));
    } catch { return FALLBACK_WILDLIFE; }
  },

  async getHotels(): Promise<HomeHotel[]> {
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('id, name, type, rating, price_per_night, image_url, lat, lng, locations(name, region)')
        .limit(4);
      if (error || !data || data.length === 0) return FALLBACK_HOTELS;
      return data.map(mapAccommodationToHomeHotel);
    } catch { return FALLBACK_HOTELS; }
  },

  async getRestaurants() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, locations(name, region)')
        .limit(3);
      if (error || !data || data.length === 0) return FALLBACK_RESTAURANTS;
      return data.map((r: any) => ({
        ...r,
        image_url: r.image_url && !r.image_url.includes('placeholder')
          ? r.image_url
          : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800'
      }));
    } catch { return FALLBACK_RESTAURANTS; }
  },

  async getRoadTrips() {
    try {
      const { data, error } = await supabase
        .from('road_trips')
        .select('*, content_media(media_url, media_type)')
        .limit(3);
      if (error || !data || data.length === 0) return [
        { id: 'rt-01', name: 'Atlantic Ocean Road', duration_days: 3, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=atlantic+ocean+road+norway+bridge&w=1400', region: 'Møre og Romsdal' },
        { id: 'rt-02', name: 'Trollstigen Mountain Route', duration_days: 2, image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=trollstigen+mountain+pass+hairpin&w=1400', region: 'Vestland' },
      ];
      return data.map((t: any) => ({
        ...t,
        image: t.content_media?.find((m: any) => m.media_type === 'HERO')?.media_url || t.content_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=scenic+road+norway&w=1400'
      }));
    } catch { return []; }
  },

  async getSkiResorts() {
    try {
      const { data, error } = await supabase
        .from('ski_resorts')
        .select('*, locations(name, region), content_media(media_url, media_type)')
        .limit(3);
      if (error || !data || data.length === 0) return [
        { id: 'sk-01', name: 'Hemsedal', region: 'Viken', image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800' },
        { id: 'sk-02', name: 'Geilo', region: 'Viken', image: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?q=80&w=800' },
      ];
      return data.map((t: any) => ({
        ...t,
        name: t.locations?.name || t.name,
        region: t.locations?.region,
        image: t.content_media?.find((m: any) => m.media_type === 'HERO')?.media_url || t.content_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800'
      }));
    } catch { return []; }
  },

  async getNorthernLights() {
    try {
      const { data, error } = await supabase
        .from('aurora_forecasts')
        .select('*, locations(name, region)')
        .order('probability_pct', { ascending: false })
        .limit(4);
      if (error || !data || data.length === 0) return [];
      return data;
    } catch { return []; }
  },

  async getEvents(): Promise<HomeEvent[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(3);
      if (error || !data || data.length === 0) return FALLBACK_EVENTS;
      return data.map(d => ({
        id: d.id,
        name: d.name,
        date: d.start_date ? new Date(d.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD',
        location: 'Norway',
        category: d.category || 'Event',
        image: getEventImage(d.name, d.category, d.image_url),
      }));
    } catch { return FALLBACK_EVENTS; }
  },

  async getDeals(): Promise<HomeDeal[]> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'PUBLISHED')
        .eq('featured', true)
        .limit(3);
      if (error || !data || data.length === 0) return [];
      return data.map((d: any) => ({
        id: d.id,
        title: d.name,
        type: 'Package',
        description: d.description,
        price: d.price,
        original_price: d.original_price,
        discount: `${d.discount_percentage}% OFF`,
        image: d.image_url || '/images/fjords_1786935800026.jpg',
        valid_until: d.valid_until ? new Date(d.valid_until).toLocaleDateString() : 'Limited Time',
      }));
    } catch { return []; }
  },

  // Legacy helpers
  async getFjords(): Promise<HomePlace[]> { return this.getTrendingPlaces(); },
  async getMountains(): Promise<HomePlace[]> { return this.getTrendingPlaces(); },
};

// ─── MAPPERS ──────────────────────────────────────────────────────────────────

function mapLocationToHomePlace(d: any): HomePlace {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.type ? (d.type.charAt(0) + d.type.slice(1).toLowerCase()) as any : 'Landmark',
    region: d.region || 'Norway',
    short_description: d.description || '',
    image: d.hero_image_url || '/images/fjords_1786935800026.jpg',
    latitude: d.lat || 0,
    longitude: d.lng || 0,
    rating: d.rating || 4.8,
    featured: d.featured,
  };
}

function mapAccommodationToHomeHotel(d: any): HomeHotel {
  return {
    id: d.id,
    name: d.name,
    category: d.type ? (d.type.charAt(0) + d.type.slice(1).toLowerCase()) as any : 'Hotel',
    city: (d.locations as any)?.name || '',
    region: (d.locations as any)?.region || '',
    rating: d.rating || 4.5,
    price_indicator: d.price_per_night ? `NOK ${d.price_per_night}` : '€€',
    image: d.image_url || '/images/hotel_juvet_1787013813000.jpg',
    latitude: d.lat || 0,
    longitude: d.lng || 0,
  };
}
