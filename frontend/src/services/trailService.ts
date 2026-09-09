import { supabase } from '../lib/supabase';

export interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  distance_km: number;
  duration_hrs: string;
  elevation_gain_m: number;
  rating: number;
  best_season: string;
  weather_status: string;
  image: string;
  description?: string;
  highlights?: string[];
}

const DEFAULT_TRAILS: Trail[] = [
  {
    id: 'tr-001', name: 'Preikestolen (Pulpit Rock)', location: 'Stavanger, Rogaland',
    difficulty: 'Moderate', distance_km: 7.6, duration_hrs: '4–5', elevation_gain_m: 334,
    rating: 4.9, best_season: 'Apr–Oct', weather_status: 'Clear',
    image: '/images/preikestolen_1786936002797.jpg',
    description: 'Norway\'s most iconic hike — a flat-topped 604m cliff rising sheer above the Lysefjord. The plateau is roughly 25×25m and offers jaw-dropping views.',
    highlights: ['UNESCO-adjacent', 'Panoramic fjord views', 'Well-marked path', 'Family friendly']
  },
  {
    id: 'tr-002', name: 'Trolltunga', location: 'Odda, Vestland',
    difficulty: 'Hard', distance_km: 22, duration_hrs: '8–12', elevation_gain_m: 800,
    rating: 4.9, best_season: 'Jun–Sep', weather_status: 'Clear',
    image: '/images/trolltunga_1786936111320.jpg',
    description: 'The "Troll\'s Tongue" — a dramatic rock ledge jutting horizontally over Lake Ringedalsvatnet 700m below. One of Norway\'s most photographed natural sites.',
    highlights: ['Extreme views', 'Iconic photo spot', 'Wild camping', 'Technical terrain']
  },
  {
    id: 'tr-003', name: 'Besseggen Ridge', location: 'Jotunheimen, Innlandet',
    difficulty: 'Hard', distance_km: 14, duration_hrs: '6–8', elevation_gain_m: 600,
    rating: 4.8, best_season: 'Jun–Sep', weather_status: 'Partly Cloudy',
    image: '/images/besseggen_1786936349992.jpg',
    description: 'Walk the famous narrow ridge separating two strikingly different lakes — green Gjende below and blue Bessvatnet above. Ibsen\'s most famous hike.',
    highlights: ['Dual-color lakes', 'Knife-edge ridge', 'Jotunheimen NP', 'Boat shuttle available']
  },
  {
    id: 'tr-004', name: 'Kjeragbolten Boulder Walk', location: 'Lysebotn, Rogaland',
    difficulty: 'Hard', distance_km: 10, duration_hrs: '5–7', elevation_gain_m: 567,
    rating: 4.8, best_season: 'May–Oct', weather_status: 'Clear',
    image: '/images/kjeragbolten_1786936275605.jpg',
    description: 'Hike to the legendary Kjerag boulder — wedged 984m above the Lysefjord. Standing on the boulder for that iconic photo is the ultimate dare.',
    highlights: ['Iconic boulder photo', 'Lysefjord views', 'Challenging chains', 'Thrilling exposure']
  },
  {
    id: 'tr-005', name: 'Galdhøpiggen Summit', location: 'Lom, Innlandet',
    difficulty: 'Extreme', distance_km: 18, duration_hrs: '7–9', elevation_gain_m: 1400,
    rating: 4.7, best_season: 'Jul–Sep', weather_status: 'Glacier conditions',
    image: '/images/galdhopiggen_1786936412055.jpg',
    description: 'Summit of Norway — and the highest peak in all of Northern Europe at 2,469m. A glacier crossing makes this a technical adventure requiring crampons.',
    highlights: ['Highest peak in Norway', 'Glacier traverse', 'Certified guides available', 'Summit panorama']
  },
  {
    id: 'tr-006', name: 'Ryten to Kvalvika Beach', location: 'Flakstad, Lofoten',
    difficulty: 'Moderate', distance_km: 8, duration_hrs: '3–4', elevation_gain_m: 543,
    rating: 4.8, best_season: 'May–Oct', weather_status: 'Clear',
    image: '/images/ryten_1786936427556.jpg',
    description: 'Hike to the Ryten summit overlooking the breathtaking Kvalvika beach — a wild, car-free sandy arc in the heart of the Lofoten wall.',
    highlights: ['Pristine wild beach', 'Lofoten wall views', 'Midnight sun', 'Secluded swimming']
  },
  {
    id: 'tr-007', name: 'Romsdalseggen Ridge', location: 'Åndalsnes, Møre og Romsdal',
    difficulty: 'Hard', distance_km: 10, duration_hrs: '5–7', elevation_gain_m: 1000,
    rating: 4.7, best_season: 'Jun–Sep', weather_status: 'Clear',
    image: '/images/svalbard_trek.jpg',
    description: 'Voted one of the world\'s most beautiful hikes — a dramatic ridge walk above Åndalsnes with the Romsdalshorn and Trollveggen as a backdrop.',
    highlights: ['World top-10 hike', '360° panoramas', 'Mountain railway return', 'Eagle views']
  },
  {
    id: 'tr-008', name: 'Glittertind via Spiterstulen', location: 'Jotunheimen, Innlandet',
    difficulty: 'Hard', distance_km: 16, duration_hrs: '6–8', elevation_gain_m: 1100,
    rating: 4.6, best_season: 'Jul–Sep', weather_status: 'Variable',
    image: '/images/svalbard_hikers.jpg',
    description: 'Norway\'s second-highest peak at 2,465m, with a glacial ice cap that occasionally makes it taller than Galdhøpiggen. A less-crowded alternative.',
    highlights: ['Second highest peak', 'Glacial cap', 'Jotunheimen NP', 'Quieter crowds']
  },
];

const resolveTrailImage = (name: string, heroImage?: string, firstImage?: string): string => {
  if (heroImage && !heroImage.includes('placeholder')) return heroImage;
  if (firstImage && !firstImage.includes('placeholder')) return firstImage;
  const match = DEFAULT_TRAILS.find(d => name.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(name.toLowerCase()));
  if (match) return match.image;
  return '/images/trolltunga_1786936111320.jpg';
};

export const trailService = {
  getTrails: async (filters?: { difficulty?: string }): Promise<Trail[]> => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select(`
          id, name, difficulty, distance_km,
          estimated_duration_minutes, elevation_gain_m,
          location:locations ( name ),
          content_media ( media_url, media_type )
        `)
        .order('name');

      if (error || !data || data.length === 0) {
        let fallback = DEFAULT_TRAILS;
        if (filters?.difficulty && filters.difficulty !== 'All') {
          fallback = DEFAULT_TRAILS.filter(t => t.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
        }
        return fallback;
      }

      return (data || []).map((t: any) => {
        const heroImage = t.content_media?.find?.((m: any) => m.media_type === 'HERO')?.media_url;
        const firstImage = t.content_media?.[0]?.media_url;
        return {
          id: t.id,
          name: t.name,
          location: t.location?.name || 'Norway',
          difficulty: t.difficulty || 'Moderate',
          distance_km: t.distance_km || 0,
          duration_hrs: t.estimated_duration_minutes ? (t.estimated_duration_minutes / 60).toFixed(1) : '4–5',
          elevation_gain_m: t.elevation_gain_m || 0,
          rating: 4.8,
          best_season: 'Jun–Sep',
          weather_status: 'Clear',
          image: resolveTrailImage(t.name, heroImage, firstImage)
        };
      });
    } catch {
      return DEFAULT_TRAILS;
    }
  },

  getTrailById: async (id: string): Promise<Trail | null> => {
    try {
      const match = DEFAULT_TRAILS.find(t => t.id === id || t.name.toLowerCase().includes(id.toLowerCase()));
      if (match) return match;

      const { data, error } = await supabase
        .from('trails')
        .select(`
          id, name, difficulty, distance_km,
          estimated_duration_minutes, elevation_gain_m,
          location:locations ( name ),
          content_media ( media_url, media_type )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      const trailData = data as any;
      const heroImage = trailData.content_media?.find?.((m: any) => m.media_type === 'HERO')?.media_url;
      const firstImage = trailData.content_media?.[0]?.media_url;
      return {
        id: trailData.id,
        name: trailData.name,
        location: trailData.location?.name || 'Norway',
        difficulty: trailData.difficulty || 'Moderate',
        distance_km: trailData.distance_km || 0,
        duration_hrs: trailData.estimated_duration_minutes ? (trailData.estimated_duration_minutes / 60).toFixed(1) : '4–5',
        elevation_gain_m: trailData.elevation_gain_m || 0,
        rating: 4.8,
        best_season: 'Jun–Sep',
        weather_status: 'Clear',
        image: resolveTrailImage(trailData.name, heroImage, firstImage)
      };
    } catch {
      return DEFAULT_TRAILS.find(t => t.id === id) || null;
    }
  }
};
