import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type Location = Database['public']['Tables']['locations']['Row'];

export interface TransportRoute {
  id: string;
  name: string;
  type: 'TRAIN' | 'FERRY' | 'CAR_RENTAL' | 'FLIGHT';
  origin_id: string;
  destination_id: string;
  duration_minutes: number;
  distance_km?: number;
  co2_saved_kg?: number;
  price_estimate?: number;
  currency?: string;
  operator?: string;
  status: 'PUBLISHED' | 'DRAFT';
  stops?: any[];
  timetable?: any[];
  alerts?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface RouteWithLocations extends TransportRoute {
  origin: Location;
  destination: Location;
}

const FALLBACK_ROUTES: RouteWithLocations[] = [
  {
    id: 'rt-flam',
    name: 'The Flåm Railway (Flåmsbana)',
    type: 'TRAIN',
    origin_id: 'loc-flam',
    destination_id: 'loc-myrdal',
    duration_minutes: 55,
    distance_km: 20.2,
    co2_saved_kg: 18.5,
    price_estimate: 490,
    currency: 'NOK',
    operator: 'Vy Tog',
    status: 'PUBLISHED',
    stops: [
      { name: 'Flåm Station (Fjord Level)', time: '09:00', altitude: '2m' },
      { name: 'Kårdal Waterfall', time: '09:22', altitude: '350m' },
      { name: 'Kjosfossen Waterfall Photo Stop', time: '09:35', altitude: '670m' },
      { name: 'Vatnahalsen', time: '09:48', altitude: '811m' },
      { name: 'Myrdal Mountain Junction', time: '09:55', altitude: '866m' }
    ],
    timetable: [
      { departure: '09:00', arrival: '09:55', frequency: 'Daily (Hourly in summer)' },
      { departure: '11:15', arrival: '12:10', frequency: 'Daily' },
      { departure: '14:30', arrival: '15:25', frequency: 'Daily' },
      { departure: '16:45', arrival: '17:40', frequency: 'Daily' }
    ],
    alerts: [
      { severity: 'INFO', message: 'Scenic waterfall photo stop at Kjosfossen included on all departures.' }
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    origin: {
      id: 'loc-flam',
      name: 'Flåm',
      slug: 'flam',
      region: 'Fjord Norway',
      type: 'VILLAGE',
      status: 'PUBLISHED',
      lat: 60.8632,
      lng: 7.1135,
      description: 'Charming village at the inner end of the Aurlandsfjord.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any,
    destination: {
      id: 'loc-myrdal',
      name: 'Myrdal',
      slug: 'myrdal',
      region: 'Fjord Norway',
      type: 'STATION',
      status: 'PUBLISHED',
      lat: 60.7350,
      lng: 7.1230,
      description: 'High-mountain railway junction connecting to the Bergen Line.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any
  },
  {
    id: 'rt-bergen',
    name: 'The Bergen Line (Bergensbanen)',
    type: 'TRAIN',
    origin_id: 'loc-oslo',
    destination_id: 'loc-bergen',
    duration_minutes: 415,
    distance_km: 496.0,
    co2_saved_kg: 84.2,
    price_estimate: 820,
    currency: 'NOK',
    operator: 'Vy Tog',
    status: 'PUBLISHED',
    stops: [
      { name: 'Oslo Central Station', time: '08:25' },
      { name: 'Drammen', time: '08:58' },
      { name: 'Hønefoss', time: '09:45' },
      { name: 'Geilo Ski Resort', time: '11:50' },
      { name: 'Finse (Highest point 1,222m)', time: '12:35' },
      { name: 'Myrdal (Flåm connection)', time: '13:05' },
      { name: 'Voss', time: '13:50' },
      { name: 'Bergen Central Station', time: '15:20' }
    ],
    timetable: [
      { departure: '08:25', arrival: '15:20', frequency: '4-5x Daily' },
      { departure: '12:03', arrival: '19:00', frequency: 'Daily' },
      { departure: '16:07', arrival: '22:58', frequency: 'Daily' },
      { departure: '23:05', arrival: '06:45 (+1)', frequency: 'Night Train with Sleepers' }
    ],
    alerts: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    origin: {
      id: 'loc-oslo',
      name: 'Oslo',
      slug: 'oslo',
      region: 'Eastern Norway',
      type: 'CITY',
      status: 'PUBLISHED',
      lat: 59.9139,
      lng: 10.7522,
      description: 'Capital of Norway surrounded by the Oslofjord and dense forests.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any,
    destination: {
      id: 'loc-bergen',
      name: 'Bergen',
      slug: 'bergen',
      region: 'Fjord Norway',
      type: 'CITY',
      status: 'PUBLISHED',
      lat: 60.3913,
      lng: 5.3221,
      description: 'UNESCO World Heritage city and gateway to the fjords.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any
  },
  {
    id: 'rt-geiranger-ferry',
    name: 'Geirangerfjord Electric Catamaran',
    type: 'FERRY',
    origin_id: 'loc-geiranger',
    destination_id: 'loc-hellesylt',
    duration_minutes: 65,
    distance_km: 20.0,
    co2_saved_kg: 42.0,
    price_estimate: 360,
    currency: 'NOK',
    operator: 'The Fjords (Future of the Fjords)',
    status: 'PUBLISHED',
    stops: [
      { name: 'Geiranger Harbour', time: '10:00' },
      { name: 'Seven Sisters Waterfall', time: '10:20' },
      { name: 'The Suitor (Friaren)', time: '10:28' },
      { name: 'Bridal Veil Waterfall', time: '10:40' },
      { name: 'Hellesylt Ferry Quay', time: '11:05' }
    ],
    timetable: [
      { departure: '10:00', arrival: '11:05', frequency: 'Daily (May - October)' },
      { departure: '13:00', arrival: '14:05', frequency: 'Daily' },
      { departure: '16:00', arrival: '17:05', frequency: 'Daily' }
    ],
    alerts: [
      { severity: 'INFO', message: '100% Zero-emission electric propulsion with silent outdoor viewing deck.' }
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    origin: {
      id: 'loc-geiranger',
      name: 'Geiranger',
      slug: 'geirangerfjord',
      region: 'Fjord Norway',
      type: 'FJORD',
      status: 'PUBLISHED',
      lat: 62.1008,
      lng: 7.2059,
      description: 'UNESCO World Heritage fjord.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any,
    destination: {
      id: 'loc-hellesylt',
      name: 'Hellesylt',
      slug: 'hellesylt',
      region: 'Fjord Norway',
      type: 'VILLAGE',
      status: 'PUBLISHED',
      lat: 62.0833,
      lng: 6.8667,
      description: 'Historic village at the head of Sunnylvsfjorden.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any
  },
  {
    id: 'rt-dovre',
    name: 'The Dovre Line (Dovrebanen)',
    type: 'TRAIN',
    origin_id: 'loc-oslo',
    destination_id: 'loc-trondheim',
    duration_minutes: 405,
    distance_km: 550.0,
    co2_saved_kg: 92.0,
    price_estimate: 790,
    currency: 'NOK',
    operator: 'SJ Norge',
    status: 'PUBLISHED',
    stops: [
      { name: 'Oslo Sentralstasjon', time: '08:02' },
      { name: 'Lillehammer', time: '10:05' },
      { name: 'Otta (Rondane Gate)', time: '11:32' },
      { name: 'Dombås (Dovrefjell)', time: '12:20' },
      { name: 'Oppdal', time: '13:15' },
      { name: 'Trondheim Sentralstasjon', time: '14:47' }
    ],
    timetable: [
      { departure: '08:02', arrival: '14:47', frequency: '4x Daily' },
      { departure: '14:02', arrival: '20:49', frequency: 'Daily' },
      { departure: '23:05', arrival: '06:50 (+1)', frequency: 'Night Train' }
    ],
    alerts: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    origin: {
      id: 'loc-oslo',
      name: 'Oslo',
      slug: 'oslo',
      region: 'Eastern Norway',
      type: 'CITY',
      status: 'PUBLISHED',
      lat: 59.9139,
      lng: 10.7522,
      description: 'Capital of Norway.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any,
    destination: {
      id: 'loc-trondheim',
      name: 'Trondheim',
      slug: 'trondheim',
      region: 'Trøndelag',
      type: 'CITY',
      status: 'PUBLISHED',
      lat: 63.4305,
      lng: 10.3951,
      description: 'Historical capital of Norway with Nidaros Cathedral.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any
  },
  {
    id: 'rt-lofoten-ferry',
    name: 'Lofoten Express Ferry (Torghatten Nord)',
    type: 'FERRY',
    origin_id: 'loc-bodo',
    destination_id: 'loc-moskenes',
    duration_minutes: 195,
    distance_km: 90.0,
    co2_saved_kg: 35.0,
    price_estimate: 240,
    currency: 'NOK',
    operator: 'Torghatten Nord',
    status: 'PUBLISHED',
    stops: [
      { name: 'Bodø Ferry Terminal', time: '11:00' },
      { name: 'Vestfjorden Crossing', time: '12:30' },
      { name: 'Moskenes Port (Lofoten)', time: '14:15' }
    ],
    timetable: [
      { departure: '07:00', arrival: '10:15', frequency: 'Daily' },
      { departure: '11:00', arrival: '14:15', frequency: 'Daily (Summer 3-5x)' },
      { departure: '16:30', arrival: '19:45', frequency: 'Daily' }
    ],
    alerts: [
      { severity: 'INFO', message: 'Free for foot passengers; vehicle reservations recommended in July/August.' }
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    origin: {
      id: 'loc-bodo',
      name: 'Bodø',
      slug: 'bodo',
      region: 'Northern Norway',
      type: 'CITY',
      status: 'PUBLISHED',
      lat: 67.2804,
      lng: 14.4049,
      description: 'European Capital of Culture 2024 and gateway to Lofoten.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any,
    destination: {
      id: 'loc-moskenes',
      name: 'Moskenes (Lofoten)',
      slug: 'moskenes',
      region: 'Northern Norway',
      type: 'VILLAGE',
      status: 'PUBLISHED',
      lat: 67.9000,
      lng: 13.0500,
      description: 'Southern tip of Lofoten near Reine and Å.',
      source_type: 'SYSTEM',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    } as any
  }
];

export const transportService = {
  async getRoutes(filters?: { mode?: string, originId?: string, destinationId?: string }): Promise<RouteWithLocations[]> {
    let routes: RouteWithLocations[] = [];

    try {
      let query = supabase
        .from('transport_routes' as any)
        .select('*, origin:origin_id(*), destination:destination_id(*)')
        .eq('status', 'PUBLISHED');

      if (filters?.mode && filters.mode !== 'all') {
        query = query.eq('type', filters.mode.toUpperCase() as any);
      }
      if (filters?.originId) {
        query = query.eq('origin_id', filters.originId);
      }
      if (filters?.destinationId) {
        query = query.eq('destination_id', filters.destinationId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        routes = data as unknown as RouteWithLocations[];
      }
    } catch (err) {
      console.warn('Database query failed for transport_routes, using authoritative fallback dataset:', err);
    }

    if (routes.length === 0) {
      routes = FALLBACK_ROUTES.filter(r => {
        if (filters?.mode && filters.mode !== 'all' && r.type !== filters.mode.toUpperCase()) {
          return false;
        }
        if (filters?.originId && r.origin_id !== filters.originId) {
          return false;
        }
        if (filters?.destinationId && r.destination_id !== filters.destinationId) {
          return false;
        }
        return true;
      });
    }

    return routes;
  },

  async getRouteDetails(id: string): Promise<RouteWithLocations | null> {
    try {
      const { data, error } = await supabase
        .from('transport_routes' as any)
        .select('*, origin:origin_id(*), destination:destination_id(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as unknown as RouteWithLocations;
      }
    } catch (err) {
      console.warn('Error fetching route details from database, checking local registry:', err);
    }

    const fallback = FALLBACK_ROUTES.find(r => r.id === id);
    return fallback || null;
  }
};
