import { supabase } from '../lib/supabase';
import { wildlifeService } from './wildlifeService';
import { FALLBACK_DESTINATIONS } from './destinationService';

export interface MapEntity {
  id: string;
  entity_type: string;
  entity_id: string;
  name: string;
  slug?: string;
  detail_url?: string;
  latitude: number;
  longitude: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  price?: string;
  status?: string;
  extra?: string;
  region?: string;
}

const FALLBACK_TRAIL_POINTS: MapEntity[] = [
  {
    id: 'map-tr-001',
    entity_type: 'TRAIL',
    entity_id: 'tr-001',
    name: 'Preikestolen (Pulpit Rock)',
    slug: 'preikestolen',
    detail_url: '/trails/tr-001',
    latitude: 58.9864,
    longitude: 6.1904,
    category: 'TRAIL',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    description: 'Iconic clifftop plateau rising 604m directly above Lysefjord.',
    rating: 4.9,
    price: 'Free',
    status: 'Popular',
    extra: '8.0 km • 4-5 hrs',
    region: 'Fjord Norway'
  },
  {
    id: 'map-tr-002',
    entity_type: 'TRAIL',
    entity_id: 'tr-002',
    name: 'Trolltunga (Troll Tongue)',
    slug: 'trolltunga',
    detail_url: '/trails/tr-002',
    latitude: 60.1333,
    longitude: 6.7500,
    category: 'TRAIL',
    image: '/images/trolltunga_1786936111320.jpg',
    description: 'Hovering rock shelf 700m over Lake Ringedalsvatnet.',
    rating: 4.9,
    price: 'Free',
    status: 'Iconic',
    extra: '27.0 km • 10-12 hrs',
    region: 'Fjord Norway'
  },
  {
    id: 'map-tr-003',
    entity_type: 'TRAIL',
    entity_id: 'tr-003',
    name: 'Besseggen Ridge',
    slug: 'besseggen-ridge',
    detail_url: '/trails/tr-003',
    latitude: 61.5039,
    longitude: 8.7186,
    category: 'TRAIL',
    image: '/images/besseggen_1786936349992.jpg',
    description: 'Legendary knife-edge alpine ridge between emerald Gjende and cobalt Bessvatnet.',
    rating: 4.8,
    price: 'Free',
    status: 'Challenging',
    extra: '14.0 km • 7-8 hrs',
    region: 'Eastern Norway'
  },
  {
    id: 'map-tr-004',
    entity_type: 'TRAIL',
    entity_id: 'tr-004',
    name: 'Reinebringen',
    slug: 'reinebringen',
    detail_url: '/trails/tr-006',
    latitude: 67.9284,
    longitude: 13.0763,
    category: 'TRAIL',
    image: '/images/lofoten_1787013505867.jpg',
    description: '1,560 Sherpa stone steps leading to panoramic 360° views of Reinefjorden.',
    rating: 4.8,
    price: 'Free',
    status: 'Popular',
    extra: '3.0 km • 2-3 hrs',
    region: 'Northern Norway'
  }
];

const FALLBACK_EV_POINTS: MapEntity[] = [
  {
    id: 'map-ev-1',
    entity_type: 'EV',
    entity_id: '1',
    name: 'IONITY Oslo Hub',
    detail_url: '/mobility/ev/1',
    latitude: 59.9139,
    longitude: 10.7522,
    category: 'EV',
    image: '/images/infra_windfarm_1786938637138.jpg',
    description: 'Ultra-fast 350 kW CCS2 charging hub on the E18 corridor.',
    rating: 4.9,
    price: 'NOK 5.80/kWh',
    status: '4/6 Available',
    extra: '350 kW Ultra-Fast',
    region: 'Eastern Norway'
  },
  {
    id: 'map-ev-2',
    entity_type: 'EV',
    entity_id: '2',
    name: 'Recharge Bergen Hub',
    detail_url: '/mobility/ev/2',
    latitude: 60.3913,
    longitude: 5.3221,
    category: 'EV',
    image: '/images/infra_windfarm_1786938637138.jpg',
    description: 'Rapid 150 kW DC charging hub at Danmarksplass.',
    rating: 4.7,
    price: 'NOK 5.20/kWh',
    status: '1/8 Available',
    extra: '150 kW Rapid DC',
    region: 'Fjord Norway'
  },
  {
    id: 'map-ev-3',
    entity_type: 'EV',
    entity_id: '3',
    name: 'Mer Tromsø Arctic Fast Charger',
    detail_url: '/mobility/ev/3',
    latitude: 69.6492,
    longitude: 18.9553,
    category: 'EV',
    image: '/images/infra_windfarm_1786938637138.jpg',
    description: '50 kW Fast Charger located in Tromsø city centre.',
    rating: 4.6,
    price: 'NOK 4.90/kWh',
    status: '2/2 Available',
    extra: '50 kW Fast',
    region: 'Northern Norway'
  },
  {
    id: 'map-ev-4',
    entity_type: 'EV',
    entity_id: '4',
    name: 'Tesla Supercharger Dombås',
    detail_url: '/mobility/ev/4',
    latitude: 62.0744,
    longitude: 9.1264,
    category: 'EV',
    image: '/images/infra_windfarm_1786938637138.jpg',
    description: 'V3 250 kW High-altitude mountain crossroad charging hub.',
    rating: 4.9,
    price: 'NOK 4.50/kWh',
    status: '12/16 Available',
    extra: '250 kW V3 Open',
    region: 'Eastern Norway'
  }
];

export const mapService = {
  getUnifiedMapPoints: async (): Promise<MapEntity[]> => {
    // Arbitrary bounding box covering Norway
    const minLat = 55;
    const maxLat = 75;
    const minLng = 4;
    const maxLng = 35;

    let mapEntities: MapEntity[] = [];

    try {
      if (typeof supabase.rpc === 'function') {
        const { data: markers, error } = await supabase
          .rpc('get_smart_map_markers', {
            min_lat: minLat,
            max_lat: maxLat,
            min_lng: minLng,
            max_lng: maxLng
          });

        if (error) {
          console.error('Error fetching smart map markers:', error);
        } else if (markers && markers.length > 0) {
          mapEntities = markers.map((m: any) => ({
            id: m.id,
            entity_type: m.type || 'LOCATION',
            entity_id: m.location_id || m.id,
            name: m.name,
            slug: m.slug,
            detail_url: m.type === 'LOCATION' ? `/explore/${m.slug || m.id}` : `/explore/${m.slug || m.id}`,
            latitude: m.lat || m.latitude,
            longitude: m.lng || m.longitude,
            category: m.type || m.category || 'DESTINATION',
            image: m.image_url || '/images/trolltunga_1786936111320.jpg',
            description: m.description || '',
            rating: m.average_rating || 4.8,
            price: m.base_price_nok ? `NOK ${m.base_price_nok}` : 'Free',
            status: m.featured ? 'Featured' : 'Active',
            extra: m.subcategory || undefined,
            region: m.region
          }));
        }
      }
    } catch (rpcErr) {
      console.warn('RPC get_smart_map_markers error, falling back to local dataset:', rpcErr);
    }

    // If RPC returned empty, seed authoritative fallback destinations
    if (mapEntities.length === 0) {
      const destinationEntities: MapEntity[] = FALLBACK_DESTINATIONS.map(d => ({
        id: `dest-${d.id}`,
        entity_type: 'LOCATION',
        entity_id: d.id,
        name: d.name,
        slug: d.slug,
        detail_url: `/explore/${d.slug}`,
        latitude: d.lat || 60.0,
        longitude: d.lng || 10.0,
        category: 'DESTINATION',
        image: d.hero_image_url || '/images/trolltunga_1786936111320.jpg',
        description: d.description || '',
        rating: 4.9,
        price: 'Free',
        status: 'Featured',
        extra: d.type,
        region: d.region || undefined
      }));

      mapEntities = [...destinationEntities, ...FALLBACK_TRAIL_POINTS, ...FALLBACK_EV_POINTS];
    }

    // Fetch wildlife sightings and attach locations
    try {
      const wildlife = await wildlifeService.getAllSpecies();
      const dynamicWildlife: MapEntity[] = wildlife.slice(0, 10).map((s, idx) => ({
        id: `wildlife-${s.id}`,
        entity_type: 'WILDLIFE',
        entity_id: s.id,
        name: s.common_name,
        slug: s.id,
        detail_url: `/wildlife/${s.id}`,
        latitude: 61 + ((idx * 1.7) % 8),
        longitude: 7 + ((idx * 2.3) % 15),
        category: 'WILDLIFE',
        image: s.primary_image || '/images/wildlife_reindeer_1787013667019.jpg',
        description: s.scientific_name,
        rating: 4.8,
        price: 'Free',
        status: 'Active Sightings',
        extra: s.scientific_name,
        region: 'Protected Habitat'
      }));

      mapEntities = [...mapEntities, ...dynamicWildlife];
    } catch (err) {
      console.error('Error fetching wildlife for map:', err);
    }

    return mapEntities;
  }
};
