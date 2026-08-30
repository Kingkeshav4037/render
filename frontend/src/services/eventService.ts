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
}

export const FALLBACK_EVENTS: Event[] = [
  {
    id: 'ev-001',
    location_id: 'loc-tromso',
    name: 'Midnight Sun Marathon 2026',
    category: 'Sports',
    description: 'The world\'s northernmost AIMS-certified road marathon, run under 24 hours of golden Arctic daylight through Tromsø.',
    start_date: '2026-06-20T18:00:00Z',
    end_date: '2026-06-21T02:00:00Z',
    ticket_price: 850,
    currency: 'NOK',
    image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-002',
    location_id: 'loc-bergen',
    name: 'Bergen International Festival (Festspillene)',
    category: 'Festival',
    description: 'The Nordic region’s premier music and performing arts festival featuring world-class classical, folk, and contemporary performances at Grieg Hall.',
    start_date: '2026-05-27T10:00:00Z',
    end_date: '2026-06-10T22:00:00Z',
    ticket_price: 650,
    currency: 'NOK',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200',
    featured: true,
    lat: 60.3913,
    lng: 5.3221
  },
  {
    id: 'ev-003',
    location_id: 'loc-tromso',
    name: 'Tromsø International Film Festival (TIFF)',
    category: 'Cultural',
    description: 'Screening avant-garde international films under open Arctic winter skies with giant outdoor ice screens on the main square.',
    start_date: '2027-01-18T09:00:00Z',
    end_date: '2027-01-24T23:00:00Z',
    ticket_price: 350,
    currency: 'NOK',
    image_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=tromso+winter+arctic&w=1200',
    featured: true,
    lat: 69.6492,
    lng: 18.9553
  },
  {
    id: 'ev-004',
    location_id: 'loc-oslo',
    name: 'Holmenkollen Ski Festival',
    category: 'Sports',
    description: 'The legendary "Kollen Sunday" World Cup ski jumping and cross-country festival with thousands of roaring fans in Nordmarka forest.',
    start_date: '2027-03-05T08:00:00Z',
    end_date: '2027-03-08T18:00:00Z',
    ticket_price: 490,
    currency: 'NOK',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=holmenkollen+ski+jumping+oslo&w=1200',
    featured: true,
    lat: 59.9639,
    lng: 10.6672
  },
  {
    id: 'ev-005',
    location_id: 'loc-flam',
    name: 'Fjordsteam Maritime Heritage Gathering',
    category: 'Seasonal',
    description: 'Historic vintage steamships, steam locomotives, and vintage maritime vessels gathering for live demonstrations across the fjords.',
    start_date: '2026-08-10T10:00:00Z',
    end_date: '2026-08-14T20:00:00Z',
    ticket_price: 250,
    currency: 'NOK',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=vintage+steamship+maritime+festival&w=1200',
    featured: false,
    lat: 60.8631,
    lng: 7.1132
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
      return (data || []) as unknown as Event[];
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
        .limit(10);
        
      if (error || !data || data.length === 0) {
        return FALLBACK_EVENTS;
      }
      return (data || []) as unknown as Event[];
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
      return (data || []) as unknown as Event[];
    } catch {
      return FALLBACK_EVENTS.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
  }
};
