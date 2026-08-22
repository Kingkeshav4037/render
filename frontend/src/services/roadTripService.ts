import { supabase } from '../lib/supabase';

export interface RoadTrip {
  id: string;
  name: string;
  slug: string;
  description: string;
  distance_km: number;
  duration_days: number;
  season: string;
  difficulty: string;
  scenic_highlights: string[];
  image: string;
  start_point?: string;
  end_point?: string;
}

const DEFAULT_ROAD_TRIPS: RoadTrip[] = [
  {
    id: 'rt-001',
    name: 'The Norwegian Scenic Route — Atlantic Ocean Road',
    slug: 'atlantic-ocean-road',
    description: 'Drive across the legendary Storseisundet Bridge as waves crash around you. The Atlantic Ocean Road (Atlanterhavsveien) is consistently ranked among the world\'s most beautiful drives — a serpentine series of eight bridges threading across islets in the Norwegian Sea.',
    distance_km: 36,
    duration_days: 2,
    season: 'Year-round',
    difficulty: 'Easy',
    scenic_highlights: ['Storseisundet Bridge', 'Sea fishing', 'Birdwatching', 'Coastal villages', 'Storm watching in winter'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1400',
    start_point: 'Kristiansund',
    end_point: 'Molde'
  },
  {
    id: 'rt-002',
    name: 'Trollstigen — The Troll\'s Path',
    slug: 'trollstigen',
    description: 'Eleven hairpin bends climbing 858 metres through an impossibly steep mountain pass. Trollstigen (Troll Ladder) is Norway\'s most iconic mountain road — with sheer cliff walls, waterfalls plummeting beside the tarmac, and a viewing platform at the top with panoramic fjord views.',
    distance_km: 106,
    duration_days: 3,
    season: 'May–October',
    difficulty: 'Moderate',
    scenic_highlights: ['11 hairpin bends', 'Stigfossen Waterfall', 'Summit viewpoint', 'Geiranger UNESCO fjord', 'Eagle Road pass'],
    image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&q=80&w=1400',
    start_point: 'Åndalsnes',
    end_point: 'Geiranger'
  },
  {
    id: 'rt-003',
    name: 'Lofoten Islands Grand Loop',
    slug: 'lofoten-grand-loop',
    description: 'The Lofoten archipelago delivers the most dramatic scenery in all of Norway — jagged Dolomite-like peaks rising sheer from an impossibly blue sea, with red-painted fishing rorbuer huts reflected in glassy inlets. Drive the E10 end to end for the complete experience.',
    distance_km: 220,
    duration_days: 4,
    season: 'Jun–Sep (Midnight Sun) / Feb–Mar (Aurora)',
    difficulty: 'Easy',
    scenic_highlights: ['Reine fishing village', 'Nusfjord UNESCO site', 'Midnight sun viewpoints', 'Surfer beach Unstad', 'Eagle watching'],
    image: '/images/lofoten_1787013505867.jpg',
    start_point: 'Svolvær',
    end_point: 'Å i Lofoten'
  },
  {
    id: 'rt-004',
    name: 'Jotunheimen — Land of the Giants',
    slug: 'jotunheimen',
    description: 'Norway\'s premier mountain landscape — home to over 250 peaks above 2000m including Galdhøpiggen, the highest peak in Northern Europe. Drive the iconic Sognefjellsvegen (Norway\'s highest mountain road) for soaring glaciers and raw alpine grandeur.',
    distance_km: 190,
    duration_days: 3,
    season: 'Jun–Sep',
    difficulty: 'Moderate',
    scenic_highlights: ['Galdhøpiggen summit', 'Juvvasshytta glacier', 'Sognefjellsvegen road', 'Besseggen ridge', 'Norwegian Musk Ox'],
    image: '/images/galdhopiggen_1786936412055.jpg',
    start_point: 'Lillehammer',
    end_point: 'Årdal'
  },
  {
    id: 'rt-005',
    name: 'Hardangerfjord — The Queen of Fjords',
    slug: 'hardangerfjord',
    description: 'Norway\'s second-longest fjord sweeps through an otherworldly landscape of fruit orchards, glacier arms, and thundering waterfalls. In May the apple blossoms paint the fjord shore pink and white — a sight unlike anywhere else in Scandinavia.',
    distance_km: 250,
    duration_days: 3,
    season: 'May–Oct',
    difficulty: 'Easy',
    scenic_highlights: ['Vøringsfossen waterfall', 'Trolltunga viewpoint', 'Folgefonna glacier', 'Apple blossom route', 'Eidfjord medieval church'],
    image: '/images/trolltunga_1786936111320.jpg',
    start_point: 'Bergen',
    end_point: 'Odda'
  },
  {
    id: 'rt-006',
    name: 'Fjord Norway — Stavanger to Bergen',
    slug: 'stavanger-bergen',
    description: 'The classic Norwegian fjord road trip — from the oil capital through the UNESCO Nærøyfjord to the UNESCO Bryggen wharf in Bergen. Stop for the Preikestolen and Kjeragbolten hikes, ferry across Lysefjord, and end with Bergen\'s famous fish market.',
    distance_km: 380,
    duration_days: 5,
    season: 'Apr–Oct',
    difficulty: 'Easy',
    scenic_highlights: ['Preikestolen cliff', 'Kjeragbolten boulder', 'Nærøyfjord UNESCO', 'Bergen Bryggen', 'Flåm railway'],
    image: '/images/preikestolen_1786936002797.jpg',
    start_point: 'Stavanger',
    end_point: 'Bergen'
  },
];

export const roadTripService = {
  getRoadTrips: async (): Promise<RoadTrip[]> => {
    try {
      const { data, error } = await supabase
        .from('road_trips')
        .select(`
          id, name, slug, description,
          distance_km, duration_days, season, difficulty,
          scenic_highlights,
          content_media ( media_url, media_type )
        `)
        .order('name');

      if (error || !data || data.length === 0) {
        return DEFAULT_ROAD_TRIPS;
      }

      return (data || []).map((t: any) => {
        const heroImage = t.content_media?.find((m: any) => m.media_type === 'HERO')?.media_url;
        const firstImage = t.content_media?.[0]?.media_url;
        return {
          id: t.id,
          name: t.name,
          slug: t.slug || '',
          description: t.description || '',
          distance_km: t.distance_km || 0,
          duration_days: t.duration_days || 1,
          season: t.season || 'Summer',
          difficulty: t.difficulty || 'Easy',
          scenic_highlights: t.scenic_highlights || [],
          image: heroImage || firstImage || '/images/fjords_1786935800026.jpg'
        };
      });
    } catch {
      return DEFAULT_ROAD_TRIPS;
    }
  }
};
