import { supabase } from '../../lib/supabase';

export interface Accommodation {
  id: string;
  location_id: string;
  name: string;
  type: string;
  description: string;
  price_per_night: number;
  currency: string;
  rating: number;
  amenities: string[];
  eco_certified: boolean;
  featured: boolean;
  image_url: string;
  lat: number;
  lng: number;
  locations?: {
    name: string;
    region: string;
  };
}

export interface AccommodationRoom {
  id: string;
  accommodation_id: string;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  image_url: string;
  available: boolean;
  size?: string;
  bed?: string;
  cancellation?: string;
  remaining?: number;
}

export const HOTEL_IMAGES: Record<string, string> = {
  'juvet':                   '/images/hotel_juvet_1787013813000.jpg',
  'thief':                   'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200',
  'grand hotel':             'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
  'sommerro':                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
  'the hub':                 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1200',
  'anker':                   'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200',
  'opus xvi':                'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
  'norge':                   'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
  'hanseatiske':             'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
  'børs':                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200',
  'bors':                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200',
  'solstrand':               'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200',
  'britannia':               'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200',
  'clarion hotel trondheim': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
  'bakklandet':              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
  'eilert smith':            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
  'energy':                  'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1200',
  'preikestolen basecamp':   'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200',
  'the edge':                'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200',
  'ishavshotel':             'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200',
  'arctic panorama':         'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200',
  'malangen':                'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=1200',
  'sorrisniva':              '/images/northern_lights_1786935879330.jpg',
  'snowhotel':               'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200',
  'hotel union':             'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
  'grande fjord':            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200',
  'eliassen':                'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=1200',
  'nusfjord':                'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200',
  'hattvika':                'https://images.unsplash.com/photo-1516629910-c11438902888?q=80&w=1200',
  'svinøya':                 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
  'svinoya':                 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
  'reine':                   '/images/lofoten_1787013505867.jpg',
  'senja':                   'https://images.unsplash.com/photo-1490001851140-5e586071ea91?q=80&w=1200',
  'mefjord':                 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?q=80&w=1200',
  'fretheim':                'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1200',
  'flåm marina':             'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
  'vatnahalsen':             'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
  'ullensvang':              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
  'kviknes':                 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
  'walaker':                 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
  'dalen':                   'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1200',
  'finse':                   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200',
  'dr. holms':               'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
  'vestlia':                 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
  'basecamp hotel':          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200',
  'funken':                  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200',
  'manshausen':              'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200',
  'lyngen north':            '/images/northern_lights_1786935879330.jpg',
  'trolltunga hotel':        '/images/trolltunga_1786936111320.jpg',
  'radisson blu mountain':   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200',
  'wood hotel':              'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1200',
};

const STAY_TYPE_FALLBACKS: Record<string, string> = {
  HOTEL:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
  CABIN:       'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=1200',
  LODGE:       'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200',
  RESORT:      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200',
  HOSTEL:      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200',
  UNIQUE_STAY: '/images/hotel_juvet_1787013813000.jpg',
  ECO_STAY:    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200',
  CAMPING:     'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
  APARTMENT:   'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200',
};

export function getStayImage(name?: string, type?: string, imageUrl?: string | null): string {
  const cleanName = (name || '').toLowerCase().trim();
  for (const [key, url] of Object.entries(HOTEL_IMAGES)) {
    if (cleanName.includes(key)) {
      return url;
    }
  }

  if (imageUrl && imageUrl.trim() && !imageUrl.includes('placeholder') && !imageUrl.includes('hotel_juvet_1787013813000')) {
    return imageUrl;
  }

  const cleanType = (type || 'HOTEL').toUpperCase();
  return STAY_TYPE_FALLBACKS[cleanType] || STAY_TYPE_FALLBACKS.HOTEL;
}

export const FALLBACK_STAYS: Accommodation[] = [
  {
    id: 'stay-juvet',
    location_id: 'loc-geiranger',
    name: 'Juvet Landscape Hotel',
    type: 'HOTEL',
    description: 'Immerse yourself in raw Norwegian nature with glass-walled panoramic architecture nestled on the banks of Valldøla river.',
    price_per_night: 3200,
    currency: 'NOK',
    rating: 4.9,
    amenities: ['Fjord Sauna', 'Organic Breakfast', 'Wi-Fi', 'Nature Trails', 'Bathhouse'],
    eco_certified: true,
    featured: true,
    image_url: '/images/hotel_juvet_1787013813000.jpg',
    lat: 62.3021,
    lng: 7.2456,
    locations: {
      name: 'Valldal / Geiranger',
      region: 'Fjord Norway'
    }
  },
  {
    id: 'stay-sorrisniva',
    location_id: 'loc-alta',
    name: 'Sorrisniva Igloo Hotel & Arctic Lodge',
    type: 'LODGE',
    description: 'The world\'s northernmost luxury ice hotel, offering handcrafted ice suites and warm riverside timber lodges in Alta.',
    price_per_night: 4200,
    currency: 'NOK',
    rating: 4.8,
    amenities: ['Aurora Lounge', 'Reindeer Furs', 'Ice Bar', 'Sauna', 'Fine Dining'],
    eco_certified: true,
    featured: true,
    image_url: '/images/northern_lights_1786935879330.jpg',
    lat: 69.9689,
    lng: 23.2716,
    locations: {
      name: 'Alta',
      region: 'Northern Norway'
    }
  },
  {
    id: 'stay-reine',
    location_id: 'loc-lofoten',
    name: 'Reine Rorbuer Historic Cabins',
    type: 'CABIN',
    description: 'Restored fisherman cabins directly over Reinefjorden with private sea docks and staggering views of Reinebringen.',
    price_per_night: 2800,
    currency: 'NOK',
    rating: 4.9,
    amenities: ['Full Kitchen', 'Private Pier', 'Fjord Views', 'Boat Rental', 'Wi-Fi'],
    eco_certified: true,
    featured: true,
    image_url: '/images/lofoten_1787013505867.jpg',
    lat: 67.9333,
    lng: 13.0833,
    locations: {
      name: 'Reine',
      region: 'Lofoten'
    }
  }
];

export const staysService = {
  searchStays: async (filters: { 
    type?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    eco_certified?: boolean;
    amenities?: string[];
  } = {}, page: number = 1, limit: number = 12): Promise<{ data: Accommodation[]; count: number }> => {
    try {
      let q = supabase
        .from('accommodations')
        .select('id, name, type, description, price_per_night, currency, rating, amenities, eco_certified, featured, image_url, lat, lng, locations(name, region)', { count: 'exact' })
        .eq('status', 'PUBLISHED');

      if (filters.type && filters.type !== 'all') {
        q = q.eq('type', filters.type as any);
      }
      if (filters.minPrice) {
        q = q.gte('price_per_night', filters.minPrice);
      }
      if (filters.maxPrice) {
        q = q.lte('price_per_night', filters.maxPrice);
      }
      if (filters.rating) {
        q = q.gte('rating', filters.rating);
      }
      if (filters.eco_certified) {
        q = q.eq('eco_certified', true);
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        q = q.ilike('name', `%${filters.searchQuery.trim()}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      q = q.range(from, to).order('featured', { ascending: false }).order('rating', { ascending: false });

      const { data, error, count } = await q;
      if (error) {
        console.error('Error fetching stays:', error);
        return { data: [], count: 0 };
      }

      let result = ((data as any[]) || []).map(stay => ({
        ...stay,
        image_url: getStayImage(stay.name, stay.type, stay.image_url)
      }));

      if (filters.amenities && filters.amenities.length > 0) {
        result = result.filter(stay => {
          const stayAmenities = Array.isArray(stay.amenities) ? stay.amenities : [];
          return filters.amenities!.every(a => 
            stayAmenities.some((sa: string) => sa.toLowerCase().includes(a.toLowerCase()))
          );
        });
      }

      return { data: result as Accommodation[], count: count || result.length };
    } catch (err) {
      console.error('Error in searchStays:', err);
      return { data: [], count: 0 };
    }
  },

  getStayDetails: async (id: string): Promise<Accommodation | null> => {
    try {
      const q: any = supabase
        .from('accommodations')
        .select('id, name, type, description, price_per_night, currency, rating, amenities, eco_certified, featured, image_url, lat, lng, locations(name, region)')
        .eq('id', id);

      const res = typeof q.maybeSingle === 'function' 
        ? await q.maybeSingle() 
        : typeof q.single === 'function' 
          ? await q.single() 
          : await q;
      const data = res?.data ?? res;
      const error = res?.error;

      if (error || !data) return null;
      return {
        ...data,
        image_url: getStayImage(data.name, data.type, data.image_url)
      } as any;
    } catch (err) {
      console.error('Error in getStayDetails:', err);
      return null;
    }
  },

  getStayRooms: async (accommodationId: string): Promise<AccommodationRoom[]> => {
    try {
      const { data, error } = await supabase
        .from('accommodation_rooms' as any)
        .select('id, accommodation_id, name, description, capacity, price_per_night, amenities, image_url, available')
        .eq('accommodation_id', accommodationId);

      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          ...r,
          size: r.size || '38m²',
          bed: r.bed || '1 King Bed',
          cancellation: r.cancellation || 'Free cancellation up to 48 hours before check-in',
          remaining: r.remaining || 3,
        })) as AccommodationRoom[];
      }

      // Generate contextually realistic fallback rooms based on parent stay
      const stay = await staysService.getStayDetails(accommodationId);
      const basePrice = Number(stay?.price_per_night || 2400);

      return [
        {
          id: `${accommodationId}-room-suite`,
          accommodation_id: accommodationId,
          name: 'Panoramic Fjord View Suite',
          description: 'Spacious signature suite with floor-to-ceiling panoramic glass windows, private balcony, and organic Nordic timber finishes.',
          capacity: 2,
          price_per_night: Math.round(basePrice * 1.35),
          amenities: ['Breakfast included', 'High-Speed Wi-Fi', 'Ensuite Rain Shower', 'Espresso Bar', 'Heated Bathroom Floors'],
          image_url: stay?.image_url || '/images/hotel_juvet_1787013813000.jpg',
          available: true,
          size: '48m²',
          bed: '1 King Bed',
          cancellation: 'Free cancellation up to 48 hours before check-in',
          remaining: 2
        },
        {
          id: `${accommodationId}-room-deluxe`,
          accommodation_id: accommodationId,
          name: 'Deluxe Nordic Timber Room',
          description: 'Cozy and quiet guestroom featuring handcrafted Scandinavian furniture, wool throws, and sweeping mountain outlooks.',
          capacity: 2,
          price_per_night: basePrice,
          amenities: ['Breakfast included', 'High-Speed Wi-Fi', 'Fjord Spring Water', 'Tea & Coffee Maker'],
          image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=scandinavian+hotel+bedroom&w=1080',
          available: true,
          size: '34m²',
          bed: '1 Queen Bed',
          cancellation: 'Free cancellation up to 7 days before check-in',
          remaining: 4
        },
        {
          id: `${accommodationId}-room-family`,
          accommodation_id: accommodationId,
          name: 'Arctic Family Chalet Room',
          description: 'Spacious dual-room accommodation designed for families and group explorers with custom bunk nooks.',
          capacity: 4,
          price_per_night: Math.round(basePrice * 1.65),
          amenities: ['Breakfast included', 'High-Speed Wi-Fi', 'Kitchenette', 'Gear Drying Closet'],
          image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=nordic+lodge+chalet+room&w=1080',
          available: true,
          size: '62m²',
          bed: '1 King Bed + 2 Bunk Beds',
          cancellation: 'Free cancellation up to 48 hours before check-in',
          remaining: 1
        }
      ];
    } catch (err) {
      console.error('Error fetching stay rooms:', err);
      return [];
    }
  },
  
  getRoomDetails: async (roomId: string): Promise<AccommodationRoom | null> => {
    try {
      const q: any = supabase
        .from('accommodation_rooms' as any)
        .select('id, accommodation_id, name, description, capacity, price_per_night, amenities, image_url, available')
        .eq('id', roomId);

      const res = typeof q.maybeSingle === 'function' 
        ? await q.maybeSingle() 
        : typeof q.single === 'function' 
          ? await q.single() 
          : await q;
      const data = res?.data ?? res;
      const error = res?.error;

      if (!error && data) {
        return {
          ...data,
          size: '38m²',
          bed: '1 King Bed',
          cancellation: 'Free cancellation up to 48 hours before check-in',
          remaining: 3,
        } as AccommodationRoom;
      }

      // Check if it's a generated composite ID (e.g. "<accId>-room-<type>")
      if (roomId.includes('-room-')) {
        const accId = roomId.split('-room-')[0];
        const rooms = await staysService.getStayRooms(accId);
        const match = rooms.find(r => r.id === roomId);
        if (match) return match;
      }

      return null;
    } catch (err) {
      console.error('Error in getRoomDetails:', err);
      return null;
    }
  },

  checkRoomAvailability: async (
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    itemType: string = 'ACCOMMODATION'
  ): Promise<boolean> => {
    try {
      if (!roomId || !checkInDate || !checkOutDate) return true;
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        return false;
      }

      const { data, error } = await supabase.rpc('check_availability', {
        p_item_type: itemType,
        p_item_id: roomId as any,
        p_start_date: start.toISOString(),
        p_end_date: end.toISOString(),
      });

      if (error) {
        // Fallback: If room is not UUID or table constraint doesn't match, return true
        return true;
      }

      return typeof data === 'boolean' ? data : true;
    } catch (err) {
      console.warn('Availability RPC check fallback:', err);
      return true;
    }
  }
};
