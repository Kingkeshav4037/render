import { supabase } from '../lib/supabase';
import { getActivityImage } from './home/homeContentService';

export interface Activity {
  id: string;
  location_id: string;
  name: string;
  type: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  price: number;
  currency: string;
  image_url: string;
  tags: string[];
  difficulty_level: string;
  equipment_needed: string[];
  featured: boolean;
  lat: number;
  lng: number;
}

export interface EquipmentRental {
  id: string;
  location_id: string;
  name: string;
  description: string;
  rental_type: string;
  price_per_day: number;
  currency: string;
  available_stock: number;
  image_url: string;
}

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    location_id: 'loc-tromso',
    name: 'Fjord & Arctic Wildlife Cruise',
    type: 'WILDLIFE',
    description: 'Experience the stunning fjords and arctic wildlife from a silent hybrid-electric catamaran with expert marine biologists.',
    duration_minutes: 300,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 1400,
    currency: 'NOK',
    image_url: '/images/whale_safari.jpg',
    tags: ['Wildlife', 'Whales', 'Boat', 'Eco-certified'],
    equipment_needed: ['Warm windproof layers', 'Binoculars'],
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'act-002',
    location_id: 'loc-tromso',
    name: 'Northern Lights Dog Sledding',
    type: 'AURORA',
    description: 'Drive your own team of energetic Alaskan huskies through pristine snowscapes under the glowing Aurora Borealis.',
    duration_minutes: 240,
    difficulty: 'MODERATE',
    difficulty_level: 'MODERATE',
    price: 2100,
    currency: 'NOK',
    image_url: '/images/aurora_dogsled.jpg',
    tags: ['Aurora', 'Dogsledding', 'Winter', 'Arctic'],
    equipment_needed: ['Thermal suit provided', 'Winter boots'],
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'act-003',
    location_id: 'loc-stavanger',
    name: 'Pulpit Rock (Preikestolen) Sunrise Trek',
    type: 'HIKING',
    description: 'Beat the daytime crowds with an early morning guided hike to the legendary 604m vertical cliff overlooking Lysefjord.',
    duration_minutes: 360,
    difficulty: 'MODERATE',
    difficulty_level: 'MODERATE',
    price: 1300,
    currency: 'NOK',
    image_url: '/images/preikestolen_hikers.jpg',
    tags: ['Hiking', 'Sunrise', 'Panoramic Views', 'Iconic'],
    equipment_needed: ['Hiking boots', 'Headlamp', 'Water bottle'],
    featured: true,
    lat: 58.9864,
    lng: 6.1887
  },
  {
    id: 'act-004',
    location_id: 'loc-lofoten',
    name: 'Trollfjord Sea Eagle RIB Safari',
    type: 'WILDLIFE',
    description: 'High-speed coastal RIB tour into Trollfjord to witness giant white-tailed sea eagles diving within meters of the boat.',
    duration_minutes: 120,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 1050,
    currency: 'NOK',
    image_url: '/images/sea_eagle_safari.jpg',
    tags: ['Eagles', 'RIB Boat', 'Lofoten', 'Birdwatching'],
    equipment_needed: ['Warm layers provided'],
    featured: true,
    lat: 68.2345,
    lng: 14.5682
  },
  {
    id: 'act-005',
    location_id: 'loc-geiranger',
    name: 'Geirangerfjord Waterfall Kayaking',
    type: 'KAYAK',
    description: 'Paddle right past the roaring Seven Sisters and Bridal Veil waterfalls on a UNESCO World Heritage sea kayaking tour.',
    duration_minutes: 180,
    difficulty: 'MODERATE',
    difficulty_level: 'MODERATE',
    price: 1200,
    currency: 'NOK',
    image_url: '/images/geirangerfjord_kayak.jpg',
    tags: ['Kayaking', 'UNESCO', 'Waterfalls', 'Active'],
    equipment_needed: ['Drysuit provided', 'Change of socks'],
    featured: true,
    lat: 62.1015,
    lng: 7.2059
  },
  {
    id: 'act-006',
    location_id: 'loc-hardanger',
    name: 'Trolltunga Guided Cliff Expedition',
    type: 'HIKING',
    description: 'Conquer Norway’s most famous mountain rock ledge hovering 700m over Lake Ringedalsvatnet with certified local guides.',
    duration_minutes: 600,
    difficulty: 'HARD',
    difficulty_level: 'HARD',
    price: 1850,
    currency: 'NOK',
    image_url: '/images/arctic_hikers.jpg',
    tags: ['Trolltunga', 'Bucket List', 'Challenging', 'Mountain'],
    equipment_needed: ['Sturdy hiking boots', 'Packed lunch', 'Windproof gear'],
    featured: true,
    lat: 60.1242,
    lng: 6.7400
  },
  {
    id: 'act-007',
    location_id: 'loc-flam',
    name: 'Nærøyfjord UNESCO Heritage Cruise',
    type: 'CRUISE',
    description: 'Sail the narrowest and most dramatic branch of the Sognefjord surrounded by 1,400-meter cliffs and snowmelt cascades.',
    duration_minutes: 120,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 950,
    currency: 'NOK',
    image_url: '/images/luxury_fjord_cruise.jpg',
    tags: ['Fjord Cruise', 'UNESCO', 'Scenic', 'Relaxed'],
    equipment_needed: ['Camera', 'Warm windproof jacket'],
    featured: false,
    lat: 60.8631,
    lng: 7.1132
  },
  {
    id: 'act-008',
    location_id: 'loc-lofoten',
    name: 'Reinebringen Peak Stairs Climb',
    type: 'HIKING',
    description: 'Climb the 1,560 Sherpa stone steps for the most celebrated 360-degree panoramic vista across the Lofoten wall.',
    duration_minutes: 180,
    difficulty: 'HARD',
    difficulty_level: 'HARD',
    price: 800,
    currency: 'NOK',
    image_url: '/images/svalbard_trek.jpg',
    tags: ['Views', 'Stairs', 'Photography', 'Lofoten'],
    equipment_needed: ['Trekking poles optional', 'Water bottle'],
    featured: false,
    lat: 67.9272,
    lng: 13.0841
  },
  {
    id: 'act-009',
    location_id: 'loc-oslo',
    name: 'Holmenkollen & Nordmarka Nordic Skiing',
    type: 'SKIING',
    description: 'Glide across world-class groomed cross-country ski trails through the magical snow-covered pine forests of Oslo Nordmarka.',
    duration_minutes: 180,
    difficulty: 'MODERATE',
    difficulty_level: 'MODERATE',
    price: 850,
    currency: 'NOK',
    image_url: '/images/cross_country_skiing.jpg',
    tags: ['Skiing', 'Cross-Country', 'Oslo', 'Winter'],
    equipment_needed: ['Thermal clothing', 'Skis and poles provided'],
    featured: true,
    lat: 59.9639,
    lng: 10.6672
  },
  {
    id: 'act-010',
    location_id: 'loc-svalbard',
    name: 'Svalbard Arctic Walrus & Glacier Safari',
    type: 'WILDLIFE',
    description: 'Boat safari along the icy shores of Isfjorden to observe colonies of giant Atlantic walruses resting on coastal ice floes.',
    duration_minutes: 420,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 2400,
    currency: 'NOK',
    image_url: '/images/walrus_safari.jpg',
    tags: ['Walrus', 'Glaciers', 'Arctic', 'Boat Tour'],
    equipment_needed: ['Extreme thermal suit provided'],
    featured: true,
    lat: 78.2232,
    lng: 15.6267
  },
  {
    id: 'act-011',
    location_id: 'loc-hardanger',
    name: 'Hardangerfjord High-Speed RIB Safari',
    type: 'CRUISE',
    description: 'Skim across the deep blue waters of Hardangerfjord on an exhilarating 50-knot RIB adventure beneath sheer orchards and cascades.',
    duration_minutes: 90,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 990,
    currency: 'NOK',
    image_url: '/images/hardangerfjord_rib_safari.jpg',
    tags: ['RIB Safari', 'Fjord', 'Adrenaline', 'Scenic'],
    equipment_needed: ['Waterproof flotation suit provided'],
    featured: true,
    lat: 60.3689,
    lng: 6.2014
  },
  {
    id: 'act-012',
    location_id: 'loc-trondheim',
    name: 'Nidelva & Historic Wharves Kayak Tour',
    type: 'KAYAK',
    description: 'Paddle peacefully along the Nidelva river right between Trondheim’s iconic 18th-century wooden wharves and beneath the Old Town Bridge.',
    duration_minutes: 120,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 750,
    currency: 'NOK',
    image_url: '/images/trondheim_wharves_kayak.jpg',
    tags: ['Kayaking', 'Heritage', 'Trondheim', 'Canals'],
    equipment_needed: ['Life vest provided', 'Waterproof pouch for phone'],
    featured: false,
    lat: 63.4305,
    lng: 10.3951
  },
  {
    id: 'act-013',
    location_id: 'loc-tromso',
    name: 'Traditional Sámi Reindeer Sledding Camp',
    type: 'WILDLIFE',
    description: 'Sit bundled in reindeer pelts on a wooden sled pulled by reindeer through the Arctic night, followed by hot bidos in a traditional lavvu.',
    duration_minutes: 240,
    difficulty: 'EASY',
    difficulty_level: 'EASY',
    price: 1850,
    currency: 'NOK',
    image_url: '/images/reindeer_sledding.jpg',
    tags: ['Sámi Culture', 'Reindeer', 'Aurora', 'Campfire'],
    equipment_needed: ['Warm base layers'],
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'act-014',
    location_id: 'loc-svalbard',
    name: 'Arctic Snowmobile Wilderness Expedition',
    type: 'AURORA',
    description: 'Power across vast frozen valleys and glacier passes on modern snowmobiles into the silent polar night in search of the Aurora Borealis.',
    duration_minutes: 360,
    difficulty: 'MODERATE',
    difficulty_level: 'MODERATE',
    price: 2900,
    currency: 'NOK',
    image_url: '/images/snowmobile_safari.jpg',
    tags: ['Snowmobile', 'Glaciers', 'Aurora', 'Wilderness'],
    equipment_needed: ['Valid driving licence required', 'Balaclava provided'],
    featured: true,
    lat: 78.2232,
    lng: 15.6267
  }
];

export const activityService = {
  getActivities: async (
    filters?: { category?: string },
    page = 1,
    limit = 12
  ): Promise<{ data: Activity[]; count: number }> => {
    try {
      let query = (supabase as any)
        .from('activities')
        .select('id, location_id, name, type, description, duration_minutes, difficulty, price, currency, image_url, tags, difficulty_level, equipment_needed, featured', { count: 'exact' });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('type', filters.category);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error || !data || data.length === 0) {
        // Return rich curated fallback filtered by category
        let filtered = DEFAULT_ACTIVITIES;
        if (filters?.category && filters.category !== 'all') {
          filtered = DEFAULT_ACTIVITIES.filter(a => a.type.toUpperCase() === filters.category?.toUpperCase());
        }
        return { 
          data: filtered.slice((page - 1) * limit, page * limit), 
          count: filtered.length 
        };
      }
      
      return { data: data.map((a: any) => ({
        ...a,
        // Apply category and name-aware image fallback for any DB records with missing/generic images
        image_url: getActivityImage(a.type, a.image_url, a.name),
      })) as unknown as Activity[], count: count || data.length };
    } catch (e) {
      console.error('Error fetching activities:', e);
      let filtered = DEFAULT_ACTIVITIES;
      if (filters?.category && filters.category !== 'all') {
        filtered = DEFAULT_ACTIVITIES.filter(a => a.type.toUpperCase() === filters.category?.toUpperCase());
      }
      return { data: filtered, count: filtered.length };
    }
  },

  getFeaturedActivities: async (): Promise<Activity[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('activities')
        .select('id, location_id, name, type, description, duration_minutes, difficulty, price, currency, image_url, tags, difficulty_level, equipment_needed, featured')
        .eq('featured', true)
        .limit(6);
      if (error || !data || data.length === 0) {
        return DEFAULT_ACTIVITIES.filter(a => a.featured);
      }
      return data.map((a: any) => ({
        ...a,
        image_url: getActivityImage(a.type, a.image_url, a.name),
      })) as unknown as Activity[];
    } catch {
      return DEFAULT_ACTIVITIES.filter(a => a.featured);
    }
  },

  getActivityById: async (id: string): Promise<Activity | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('activities')
        .select('id, location_id, name, type, description, duration_minutes, difficulty, price, currency, image_url, tags, difficulty_level, equipment_needed, featured')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        const found = DEFAULT_ACTIVITIES.find(a => a.id === id) ||
          DEFAULT_ACTIVITIES.find(a => a.id.toLowerCase().includes(id.toLowerCase()));
        if (!found) return null;
        return {
          ...found,
          image_url: getActivityImage(found.type, found.image_url, found.name)
        };
      }

      return {
        ...(data as Activity),
        image_url: getActivityImage(data.type, data.image_url, data.name)
      };
    } catch {
      const found = DEFAULT_ACTIVITIES.find(a => a.id === id);
      if (!found) return null;
      return {
        ...found,
        image_url: getActivityImage(found.type, found.image_url)
      };
    }
  },

  getEquipmentRentals: async (locationId?: string): Promise<EquipmentRental[]> => {
    try {
      let query = (supabase as any).from('equipment_rentals').select('id, name, description, rental_type, price_per_day, currency, available_stock, image_url');
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      const { data, error } = await query;
      if (error || !data) return [];
      return data as unknown as EquipmentRental[];
    } catch {
      return [];
    }
  }
};
