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

// ─── EVENT IMAGES DICTIONARY (User-uploaded authentic photos) ─────────────
export const EVENT_IMAGES: Record<string, string> = {
  'midnight sun':         '/images/event_midnight_sun_marathon.jpg',
  'festspillene':         '/images/event_festspillene.jpg',
  'bergen international': '/images/event_festspillene.jpg',
  'holmenkollen':         '/images/event_holmenkollen.jpg',
  'ski festival':         '/images/event_holmenkollen.jpg',
  'øyafestivalen':        '/images/event_oyafestivalen.jpg',
  'oyafestivalen':        '/images/event_oyafestivalen.jpg',
  'gladmat':              '/images/event_gladmat.jpg',
  'viking':               '/images/event_viking_festival.jpg',
  'ekstremsportveko':     '/images/event_ekstremsportveko.jpg',
  'extreme sports':       '/images/event_ekstremsportveko.jpg',
  'finnmarksløpet':       '/images/event_finnmarkslopet.jpg',
  'finnmarkslopet':       '/images/event_finnmarkslopet.jpg',
  'rørosmartnan':         '/images/event_rorosmartnan.jpg',
  'rorosmartnan':         '/images/event_rorosmartnan.jpg',
  'reindeer racing':      '/images/event_reindeer_racing.jpg',
  'reindeer':             '/images/event_reindeer_racing.jpg',
  'ice music':            '/images/event_ice_music.jpg',
  'jazz':                 '/images/event_jazz_festival.jpg',
  'tons of rock':         '/images/event_tons_of_rock.jpg',
  'palmesus':             '/images/event_palmesus.jpg',
  'oslo pride':           '/images/event_oslo_pride.jpg',
  'bergen pride':         '/images/event_bergen_pride.jpg',
  'pride':                '/images/event_oslo_pride.jpg',
  'birkebeinerrennet':    '/images/event_birkebeinerrennet.jpg',
  'insomnia':             '/images/event_insomnia.jpg',
  'riddu':                '/images/event_riddu_riddu.jpg',
  'piknik':               '/images/event_piknik_i_parken.jpg',
  'flea':                 '/images/event_flea_market.jpg',
  'birkelunden':          '/images/event_flea_market.jpg',
  'sami music':           '/images/event_sami_music.jpg',
  'sami':                 '/images/event_sami_music.jpg',
  'bergen marathon':      '/images/event_bergen_marathon.jpg',
  'marathon':             '/images/event_midnight_sun_marathon.jpg',
};

export function getEventImage(name?: string, category?: string, currentUrl?: string | null): string {
  const n = (name || '').toLowerCase().trim();
  for (const [key, url] of Object.entries(EVENT_IMAGES)) {
    if (n.includes(key) || key.includes(n)) {
      return url;
    }
  }
  if (currentUrl && currentUrl.startsWith('/images/event_')) {
    return currentUrl;
  }
  if (currentUrl && !currentUrl.includes('placeholder') && !currentUrl.includes('unsplash') && !currentUrl.includes('food_market')) {
    return currentUrl;
  }
  const cat = (category || '').toLowerCase();
  if (cat.includes('sport')) return '/images/event_ekstremsportveko.jpg';
  if (cat.includes('concert') || cat.includes('music')) return '/images/event_jazz_festival.jpg';
  if (cat.includes('cultur')) return '/images/event_viking_festival.jpg';
  if (cat.includes('season')) return '/images/event_ice_music.jpg';
  return '/images/event_festspillene.jpg';
}

export const sanitizeEvent = (raw: any): Event => {
  const name = raw?.name || 'Norwegian Event';
  const category = raw?.category || 'Festival';
  const location_name = raw?.location_name || raw?.city || raw?.locations?.name || undefined;
  
  let description = raw?.description;
  if (!description || typeof description !== 'string' || !description.trim()) {
    description = getEventFallbackDescription(name, category, location_name);
  }

  const imageUrl = getEventImage(name, category, raw?.image_url);

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
    image_url: imageUrl,
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
    image_url: '/images/event_midnight_sun_marathon.jpg',
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
    image_url: '/images/event_festspillene.jpg',
    featured: true,
    lat: 60.3913,
    lng: 5.3221
  },
  {
    id: 'ev-003',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Holmenkollen Ski Festival',
    category: 'Sports',
    description: 'The legendary "Kollen Sunday" World Cup ski jumping and cross-country festival with tens of thousands of cheering fans in Oslo’s Nordmarka forest.',
    start_date: '2027-03-05T08:00:00Z',
    end_date: '2027-03-08T18:00:00Z',
    ticket_price: 490,
    currency: 'NOK',
    image_url: '/images/event_holmenkollen.jpg',
    featured: true,
    lat: 59.9639,
    lng: 10.6672
  },
  {
    id: 'ev-004',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Øyafestivalen 2026',
    category: 'Festival',
    description: 'Oslo’s premier outdoor music festival in Tøyenparken, uniting international headliners, emerging Nordic artists, organic street food, and 100% green renewable festival operations.',
    start_date: '2026-08-11T12:00:00Z',
    end_date: '2026-08-15T23:00:00Z',
    ticket_price: 3400,
    currency: 'NOK',
    image_url: '/images/event_oyafestivalen.jpg',
    featured: true,
    lat: 59.9139,
    lng: 10.7522
  },
  {
    id: 'ev-005',
    location_id: 'loc-stavanger',
    location_name: 'Stavanger',
    name: 'Gladmat Festival Stavanger',
    category: 'Festival',
    description: 'Scandinavia’s largest coastal food festival taking over the Stavanger harbor with over 250,000 visitors exploring local coastal seafood, chef masterclasses, and street dining.',
    start_date: '2026-06-24T11:00:00Z',
    end_date: '2026-06-27T23:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_gladmat.jpg',
    featured: true,
    lat: 58.9699,
    lng: 5.7331
  },
  {
    id: 'ev-006',
    location_id: 'loc-voss',
    location_name: 'Voss',
    name: 'Ekstremsportveko (Extreme Sports Week)',
    category: 'Sports',
    description: 'The world’s largest extreme sports and music festival in the adrenaline capital of Voss, featuring skydiving, whitewater kayaking, paragliding, and downhill mountain biking.',
    start_date: '2026-06-21T09:00:00Z',
    end_date: '2026-06-28T23:59:00Z',
    ticket_price: 1950,
    currency: 'NOK',
    image_url: '/images/event_ekstremsportveko.jpg',
    featured: true,
    lat: 60.6277,
    lng: 6.4258
  },
  {
    id: 'ev-007',
    location_id: 'loc-alta',
    location_name: 'Alta',
    name: 'Finnmarksløpet Sled Dog Race',
    category: 'Sports',
    description: 'Europe’s longest and toughest sled dog race spanning 1,200km through the sub-zero tundra wilderness and aurora-lit plateaus of Finnmark.',
    start_date: '2027-03-12T10:00:00Z',
    end_date: '2027-03-19T18:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_finnmarkslopet.jpg',
    featured: true,
    lat: 69.9689,
    lng: 23.2716
  },
  {
    id: 'ev-008',
    location_id: 'loc-karmoy',
    location_name: 'Avaldsnes',
    name: 'Viking Festival at Avaldsnes',
    category: 'Cultural',
    description: 'The largest Viking heritage festival in Western Norway, featuring authentic Viking reenactment battles, traditional craft workshops, longboat sails, and ancient storytelling.',
    start_date: '2026-06-11T10:00:00Z',
    end_date: '2026-06-14T18:00:00Z',
    ticket_price: 220,
    currency: 'NOK',
    image_url: '/images/event_viking_festival.jpg',
    featured: false,
    lat: 59.3564,
    lng: 5.2891
  },
  {
    id: 'ev-009',
    location_id: 'loc-roros',
    location_name: 'Røros',
    name: 'Rørosmartnan Historic Winter Fair',
    category: 'Seasonal',
    description: 'A 170-year-old winter trading tradition in the UNESCO World Heritage mining town of Røros, featuring horse-drawn sleigh caravans, folk concerts, and artisan food stalls.',
    start_date: '2027-02-16T09:00:00Z',
    end_date: '2027-02-20T19:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_rorosmartnan.jpg',
    featured: true,
    lat: 62.575,
    lng: 11.3833
  },
  {
    id: 'ev-010',
    location_id: 'loc-tromso',
    location_name: 'Tromsø',
    name: 'Sami Week & Reindeer Racing Championship',
    category: 'Cultural',
    description: 'A vibrant celebration of indigenous Sámi culture in Tromsø, featuring Sámi National Day festivities, traditional craft duodji markets, and the thrilling National Reindeer Racing Cup.',
    start_date: '2027-02-01T10:00:00Z',
    end_date: '2027-02-07T20:00:00Z',
    ticket_price: 180,
    currency: 'NOK',
    image_url: '/images/event_reindeer_racing.jpg',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-011',
    location_id: 'loc-geilo',
    location_name: 'Geilo',
    name: 'Ice Music Festival Norway',
    category: 'Seasonal',
    description: 'A magical Arctic music festival where all instruments, stage sculptures, and amphitheaters are carved completely from natural glacier ice, played beneath sub-zero moonlit skies.',
    start_date: '2027-02-04T18:00:00Z',
    end_date: '2027-02-07T23:00:00Z',
    ticket_price: 520,
    currency: 'NOK',
    image_url: '/images/event_ice_music.jpg',
    featured: true,
    lat: 60.5332,
    lng: 8.2091
  },
  {
    id: 'ev-012',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Oslo Jazz Festival',
    category: 'Concert',
    description: 'An internationally celebrated week of jazz, avant-garde, and contemporary acoustic performances staged in concert halls, jazz clubs, and open parks across Oslo.',
    start_date: '2026-08-09T14:00:00Z',
    end_date: '2026-08-15T23:30:00Z',
    ticket_price: 1200,
    currency: 'NOK',
    image_url: '/images/event_jazz_festival.jpg',
    featured: false,
    lat: 59.9139,
    lng: 10.7522
  },
  {
    id: 'ev-013',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Tons of Rock Festival Oslo',
    category: 'Festival',
    description: 'Norway’s biggest rock and metal festival held at scenic Ekebergsletta in Oslo, drawing 100,000+ passionate rock fans for four days of electrifying stage performances.',
    start_date: '2026-06-25T13:00:00Z',
    end_date: '2026-06-28T23:59:00Z',
    ticket_price: 3650,
    currency: 'NOK',
    image_url: '/images/event_tons_of_rock.jpg',
    featured: true,
    lat: 59.8972,
    lng: 10.7781
  },
  {
    id: 'ev-014',
    location_id: 'loc-kristiansand',
    location_name: 'Kristiansand',
    name: 'Palmesus Beach Festival',
    category: 'Festival',
    description: 'Scandinavia’s largest beach party on Bystranda in Kristiansand, featuring international EDM, pop titans, and sunset beach revelry along the southern coast.',
    start_date: '2026-07-03T12:00:00Z',
    end_date: '2026-07-04T23:59:00Z',
    ticket_price: 2800,
    currency: 'NOK',
    image_url: '/images/event_palmesus.jpg',
    featured: true,
    lat: 58.1467,
    lng: 7.9956
  },
  {
    id: 'ev-015',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Oslo Pride Festival & Parade',
    category: 'Cultural',
    description: 'Norway’s largest celebration of diversity and equality, uniting over 400,000 spectators and participants in Pride Park and the massive downtown street parade.',
    start_date: '2026-06-19T10:00:00Z',
    end_date: '2026-06-27T23:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_oslo_pride.jpg',
    featured: true,
    lat: 59.9139,
    lng: 10.7522
  },
  {
    id: 'ev-016',
    location_id: 'loc-bergen',
    location_name: 'Bergen',
    name: 'Bergen Pride Regnbuedagene',
    category: 'Cultural',
    description: 'Western Norway’s vibrant rainbow festival celebrating diversity, human rights debates, youth workshops, and the colourful parade winding through Festplassen.',
    start_date: '2026-05-29T10:00:00Z',
    end_date: '2026-06-06T22:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_bergen_pride.jpg',
    featured: false,
    lat: 60.3913,
    lng: 5.3221
  },
  {
    id: 'ev-017',
    location_id: 'loc-rena',
    location_name: 'Rena & Lillehammer',
    name: 'Birkebeinerrennet Historic Ski Marathon',
    category: 'Sports',
    description: 'The world-famous 54km cross-country ski race over two mountain passes, where all participants carry a 3.5kg backpack honoring the 1206 rescue of prince Haakon.',
    start_date: '2027-03-20T07:30:00Z',
    end_date: '2027-03-20T18:00:00Z',
    ticket_price: 1350,
    currency: 'NOK',
    image_url: '/images/event_birkebeinerrennet.jpg',
    featured: true,
    lat: 61.1304,
    lng: 11.3644
  },
  {
    id: 'ev-018',
    location_id: 'loc-tromso',
    location_name: 'Tromsø',
    name: 'Insomnia Electronic Music Festival',
    category: 'Festival',
    description: 'An innovative Arctic music festival exploring cutting-edge electronic sounds, spatial audio design, audiovisual installations, and late-night polar raves.',
    start_date: '2026-10-22T18:00:00Z',
    end_date: '2026-10-25T03:00:00Z',
    ticket_price: 950,
    currency: 'NOK',
    image_url: '/images/event_insomnia.jpg',
    featured: false,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-019',
    location_id: 'loc-manndalen',
    location_name: 'Kåfjord',
    name: 'Riddu Riđđu Indigenous Cultural Festival',
    category: 'Cultural',
    description: 'An international indigenous cultural gathering celebrating Sámi music, joik, yurt storytelling, world indigenous artists, and youth activism in northern fjords.',
    start_date: '2026-07-08T10:00:00Z',
    end_date: '2026-07-12T22:00:00Z',
    ticket_price: 1800,
    currency: 'NOK',
    image_url: '/images/event_riddu_riddu.jpg',
    featured: true,
    lat: 69.5186,
    lng: 20.5283
  },
  {
    id: 'ev-020',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Piknik i Parken (PiPfest)',
    category: 'Festival',
    description: 'A relaxed, bohemian summer music and picnic gathering at Sofienbergparken in Oslo featuring indie folk, acoustic headliners, and organic culinary booths.',
    start_date: '2026-06-12T13:00:00Z',
    end_date: '2026-06-14T23:00:00Z',
    ticket_price: 2450,
    currency: 'NOK',
    image_url: '/images/event_piknik_i_parken.jpg',
    featured: false,
    lat: 59.9217,
    lng: 10.7617
  },
  {
    id: 'ev-021',
    location_id: 'loc-oslo',
    location_name: 'Oslo',
    name: 'Birkelunden Historic Flea & Antique Market',
    category: 'Cultural',
    description: 'Oslo’s Sunday open-air treasure hunt in Grünerløkka, featuring vintage Scandinavian mid-century design, retro knitwear, old vinyl, and artisan goods.',
    start_date: '2026-05-17T10:00:00Z',
    end_date: '2026-05-17T18:00:00Z',
    ticket_price: 0,
    currency: 'NOK',
    image_url: '/images/event_flea_market.jpg',
    featured: false,
    lat: 59.9258,
    lng: 10.7578
  },
  {
    id: 'ev-022',
    location_id: 'loc-kautokeino',
    location_name: 'Kautokeino',
    name: 'Sámi Easter Festival & Music Week',
    category: 'Cultural',
    description: 'The premier winter gathering of the Sámi people in Finnmark, starring the Sámi Grand Prix music competition, traditional snowmobile races, and joik concerts.',
    start_date: '2027-03-25T11:00:00Z',
    end_date: '2027-03-29T23:00:00Z',
    ticket_price: 450,
    currency: 'NOK',
    image_url: '/images/event_sami_music.jpg',
    featured: true,
    lat: 69.0117,
    lng: 23.0417
  },
  {
    id: 'ev-023',
    location_id: 'loc-bergen',
    location_name: 'Bergen',
    name: 'Bergen City Marathon 2026',
    category: 'Sports',
    description: 'Western Norway’s most scenic running event, taking 13,000 runners past the UNESCO Bryggen waterfront, over Gamle Bergen, and along the dramatic mountain foothills.',
    start_date: '2026-04-25T08:30:00Z',
    end_date: '2026-04-25T16:00:00Z',
    ticket_price: 790,
    currency: 'NOK',
    image_url: '/images/event_bergen_marathon.jpg',
    featured: true,
    lat: 60.3913,
    lng: 5.3221
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

