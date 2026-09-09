import { supabase } from '../lib/supabase';

export interface Event {
  id: string;
  location_id: string;
  name: string;
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  ticket_price: number;
  currency: string;
  image_url: string;
  featured: boolean;
  lat: number;
  lng: number;
  location_name?: string;
}

export const getEventFallbackDescription = (name: string, category?: string, location?: string): string => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('festival')) {
    return `An iconic Norwegian festival celebrating live music, regional arts, local gastronomy, and cultural heritage in ${location || 'Norway'}.`;
  }
  if (cat.includes('sports')) {
    return `An exhilarating sporting tournament showcasing high-performance competition, scenic mountain landscapes, and vibrant spectator fanfare in ${location || 'Norway'}.`;
  }
  if (cat.includes('cultural')) {
    return `A captivating cultural gathering highlighting Norwegian traditions, storytelling, indigenous heritage, and historical exhibits in ${location || 'Norway'}.`;
  }
  if (cat.includes('seasonal')) {
    return `A magical seasonal celebration marking Arctic natural phenomena, midsummer midnight sun, or winter aurora traditions in ${location || 'Norway'}.`;
  }
  if (cat.includes('concert')) {
    return `A world-class musical performance featuring outstanding acoustic resonance, renowned performers, and unforgettable stage energy in ${location || 'Norway'}.`;
  }
  return `Experience the vibrant atmosphere of ${name}, featuring live entertainment, local hospitality, and scenic Norwegian settings.`;
};

export const sanitizeEvent = (raw: any): Event => {
  const name = raw?.name || 'Norwegian Event';
  const category = raw?.category || 'Festival';
  const location_name = raw?.location_name || raw?.city || raw?.locations?.name || undefined;
  
  let description = raw?.description;
  if (!description || typeof description !== 'string' || !description.trim()) {
    description = getEventFallbackDescription(name, category, location_name);
  }

  return {
    id: raw?.id || `ev-${Math.random().toString(36).substring(2, 9)}`,
    location_id: raw?.location_id || 'loc-default',
    name,
    category,
    description,
    start_date: raw?.start_date || new Date().toISOString(),
    end_date: raw?.end_date || new Date(Date.now() + 86400000).toISOString(),
    ticket_price: typeof raw?.ticket_price === 'number' ? raw.ticket_price : (Number(raw?.price) || 0),
    currency: raw?.currency || 'NOK',
    image_url: raw?.image_url || '/images/festspillene_bergen.jpg',
    featured: Boolean(raw?.featured),
    lat: Number(raw?.lat) || 60.3929,
    lng: Number(raw?.lng) || 5.322,
    location_name
  };
};

export const FALLBACK_EVENTS: Event[] = [
  {
    id: 'ev-001',
    location_id: 'loc-tromso',
    location_name: 'Tromsø',
    name: 'Midnight Sun Marathon 2026',
    category: 'Sports',
    description: "The world's northernmost AIMS-certified road marathon, run under 24 hours of golden Arctic daylight through Tromsø with international runners from over 80 nations.",
    start_date: '2026-06-20T18:00:00Z',
    end_date: '2026-06-21T02:00:00Z',
    ticket_price: 850,
    currency: 'NOK',
    image_url: '/images/midnight_sun_marathon.jpg',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-002',
    location_id: 'loc-bergen',
    location_name: 'Bergen',
    name: 'Bergen International Festival (Festspillene)',
    category: 'Festival',
    description: 'The Nordic region’s premier music and performing arts festival featuring world-class classical, folk, and contemporary performances at Grieg Hall and historic open-air venues.',
    start_date: '2026-05-27T10:00:00Z',
    end_date: '2026-06-10T22:00:00Z',
    ticket_price: 650,
    currency: 'NOK',
    image_url: '/images/festspillene_bergen.jpg',
    featured: true,
    lat: 60.3913,
    lng: 5.3221
  },
  {
    id: 'ev-003',
    location_id: 'loc-tromso',
    location_name: 'Tromsø',
    name: 'Tromsø International Film Festival (TIFF)',
    category: 'Cultural',
    description: 'Norway’s largest film festival screening avant-garde international films under open Arctic winter skies with giant outdoor ice screens on Tromsø’s main square.',
    start_date: '2027-01-18T09:00:00Z',
    end_date: '2027-01-24T23:00:00Z',
    ticket_price: 350,
    currency: 'NOK',
    image_url: '/images/tromso_winter.jpg',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-004',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Holmenkollen Ski Festival',
    category: 'Sports',
    description: 'The legendary "Kollen Sunday" World Cup ski jumping and cross-country festival with tens of thousands of cheering fans in Oslo’s Nordmarka forest.',
    start_date: '2027-03-05T08:00:00Z',
    end_date: '2027-03-08T18:00:00Z',
    ticket_price: 490,
    currency: 'NOK',
    image_url: '/images/holmenkollen_ski_festival.jpg',
    featured: true,
    lat: 59.9639,
    lng: 10.6672
  },
  {
    id: 'ev-005',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Øyafestivalen 2026',
    category: 'Festival',
    description: 'Oslo’s premier outdoor music festival in Tøyenparken, uniting international headliners, emerging Nordic artists, organic street food, and 100% green renewable festival operations.',
    start_date: '2026-08-11T12:00:00Z',
    end_date: '2026-08-15T23:00:00Z',
    ticket_price: 3400,
    currency: 'NOK',
    image_url: '/images/oyafestivalen_toyenparken.jpg',
    featured: true,
    lat: 59.9139,
    lng: 10.7522
  },
  {
    id: 'ev-006',
    location_id: 'loc-trondheim',
    location_name: 'Trondheim',
    name: 'Trøndelag Food Festival & Bryggerifestivalen',
    category: 'Festival',
    description: 'Scandinavia’s premier culinary gathering celebrating Trondheim’s European Region of Gastronomy heritage, artisan seafood, reindeer delicacies, and craft breweries.',
    start_date: '2026-07-30T10:00:00Z',
    end_date: '2026-08-01T22:00:00Z',
    ticket_price: 150,
    currency: 'NOK',
    image_url: '/images/food_market_hall.jpg',
    featured: true,
    lat: 63.4305,
    lng: 10.3951
  },
  {
    id: 'ev-007',
    location_id: 'loc-stavanger',
    location_name: 'Stavanger',
    name: 'Gladmat Festival Stavanger',
    category: 'Festival',
    description: 'Scandinavia’s largest coastal food festival taking over the Stavanger harbor with over 250,000 visitors exploring local coastal seafood, chef masterclasses, and street dining.',
    start_date: '2026-06-24T11:00:00Z',
    end_date: '2026-06-27T23:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/gladmat_stavanger.jpg',
    featured: true,
    lat: 58.9699,
    lng: 5.7331
  },
  {
    id: 'ev-008',
    location_id: 'loc-gudbrandsdalen',
    location_name: 'Gudbrandsdalen',
    name: 'Peer Gynt Festival at Lake Gålå',
    category: 'Cultural',
    description: 'A magnificent open-air theatrical production of Henrik Ibsen’s masterpiece set against the dramatic mountain backdrop and reflective waters of Lake Gålå.',
    start_date: '2026-08-01T17:00:00Z',
    end_date: '2026-08-09T22:00:00Z',
    ticket_price: 750,
    currency: 'NOK',
    image_url: '/images/viking_reenactment.jpg',
    featured: true,
    lat: 61.5032,
    lng: 9.7951
  },
  {
    id: 'ev-009',
    location_id: 'loc-karmoy',
    location_name: 'Avaldsnes',
    name: 'Viking Festival at Avaldsnes',
    category: 'Cultural',
    description: 'The largest Viking heritage festival in Western Norway, featuring authentic Viking reenactment battles, traditional craft workshops, longboat sails, and ancient storytelling.',
    start_date: '2026-06-11T10:00:00Z',
    end_date: '2026-06-14T18:00:00Z',
    ticket_price: 220,
    currency: 'NOK',
    image_url: '/images/viking_festival_avaldsnes.jpg',
    featured: false,
    lat: 59.3564,
    lng: 5.2891
  },
  {
    id: 'ev-010',
    location_id: 'loc-voss',
    location_name: 'Voss',
    name: 'Ekstremsportveko (Extreme Sports Week)',
    category: 'Sports',
    description: 'The world’s largest extreme sports and music festival in the adrenaline capital of Voss, featuring skydiving, whitewater kayaking, paragliding, and downhill mountain biking.',
    start_date: '2026-06-21T09:00:00Z',
    end_date: '2026-06-28T23:59:00Z',
    ticket_price: 1950,
    currency: 'NOK',
    image_url: '/images/ekstremsportveko_voss.jpg',
    featured: true,
    lat: 60.6277,
    lng: 6.4258
  },
  {
    id: 'ev-011',
    location_id: 'loc-alta',
    location_name: 'Alta',
    name: 'Finnmarksløpet Sled Dog Race',
    category: 'Sports',
    description: 'Europe’s longest and toughest sled dog race spanning 1,200km through the sub-zero tundra wilderness and aurora-lit plateaus of Finnmark.',
    start_date: '2027-03-12T10:00:00Z',
    end_date: '2027-03-19T18:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/finnmarkslopet_alta.jpg',
    featured: true,
    lat: 69.9689,
    lng: 23.2716
  },
  {
    id: 'ev-012',
    location_id: 'loc-roros',
    location_name: 'Røros',
    name: 'Rørosmartnan Historic Winter Fair',
    category: 'Seasonal',
    description: 'A 170-year-old winter trading tradition in the UNESCO World Heritage mining town of Røros, featuring horse-drawn sleigh caravans, folk concerts, and artisan food stalls.',
    start_date: '2027-02-16T09:00:00Z',
    end_date: '2027-02-20T19:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/roros_winter_fair.jpg',
    featured: true,
    lat: 62.575,
    lng: 11.3833
  },
  {
    id: 'ev-013',
    location_id: 'loc-tromso',
    location_name: 'Tromsø',
    name: 'Sami Week & Reindeer Racing Championship',
    category: 'Cultural',
    description: 'A vibrant celebration of indigenous Sámi culture in Tromsø, featuring Sámi National Day festivities, traditional craft duodji markets, and the thrilling National Reindeer Racing Cup.',
    start_date: '2027-02-01T10:00:00Z',
    end_date: '2027-02-07T20:00:00Z',
    ticket_price: 180,
    currency: 'NOK',
    image_url: '/images/reindeer_racing_tromso.jpg',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-014',
    location_id: 'loc-geilo',
    location_name: 'Geilo',
    name: 'Ice Music Festival Norway',
    category: 'Seasonal',
    description: 'A magical Arctic music festival where all instruments, stage sculptures, and amphitheaters are carved completely from natural glacier ice, played beneath sub-zero moonlit skies.',
    start_date: '2027-02-04T18:00:00Z',
    end_date: '2027-02-07T23:00:00Z',
    ticket_price: 520,
    currency: 'NOK',
    image_url: '/images/ice_music_festival.jpg',
    featured: true,
    lat: 60.5332,
    lng: 8.2091
  },
  {
    id: 'ev-015',
    location_id: 'loc-flam',
    location_name: 'Flåm',
    name: 'Fjordsteam Maritime Heritage Gathering',
    category: 'Seasonal',
    description: 'Historic vintage steamships, steam locomotives, and vintage maritime vessels gathering for live demonstrations across the fjords.',
    start_date: '2026-08-10T10:00:00Z',
    end_date: '2026-08-14T20:00:00Z',
    ticket_price: 250,
    currency: 'NOK',
    image_url: '/images/viking_maritime.jpg',
    featured: false,
    lat: 60.8631,
    lng: 7.1132
  },
  {
    id: 'ev-016',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Oslo Jazz Festival',
    category: 'Concert',
    description: 'An internationally celebrated week of jazz, avant-garde, and contemporary acoustic performances staged in concert halls, jazz clubs, and open parks across Oslo.',
    start_date: '2026-08-09T14:00:00Z',
    end_date: '2026-08-15T23:30:00Z',
    ticket_price: 1200,
    currency: 'NOK',
    image_url: '/images/norwegian_jazz_festival.jpg',
    featured: false,
    lat: 59.9139,
    lng: 10.7522
  }
];

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
        
      if (error || !data || data.length === 0) {
        return FALLBACK_EVENTS;
      }
      return (data || []).map(sanitizeEvent);
    } catch {
      return FALLBACK_EVENTS;
    }
  },
  
  getUpcomingEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(20);
        
      if (error || !data || data.length === 0) {
        return FALLBACK_EVENTS;
      }
      return (data || []).map(sanitizeEvent);
    } catch {
      return FALLBACK_EVENTS;
    }
  },

  getEventsByCategory: async (category: string): Promise<Event[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .select('*')
        .eq('category', category)
        .order('start_date', { ascending: true });
        
      if (error || !data || data.length === 0) {
        return FALLBACK_EVENTS.filter(e => e.category.toLowerCase() === category.toLowerCase());
      }
      return (data || []).map(sanitizeEvent);
    } catch {
      return FALLBACK_EVENTS.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
  }
};

