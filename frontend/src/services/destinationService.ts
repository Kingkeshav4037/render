import { supabase } from '../lib/supabase';
import { mediaService, ContentMedia } from './mediaService';

export interface LocationDestination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string | null;
  type: string;
  status: string;
  lat: number | null;
  lng: number | null;
  source_type: string;
  seo_title: string | null;
  hero_image_url: string | null;
}

export interface DestinationDetailed extends LocationDestination {
  hero_media: ContentMedia | null;
  gallery_media: ContentMedia[];
  related_activities: any[];
  related_accommodations: any[];
}

export const FALLBACK_DESTINATIONS: LocationDestination[] = [
  {
    id: 'loc-tromso',
    name: 'Tromsø',
    slug: 'tromso',
    description: 'The Gateway to the Arctic, renowned for ethereal Northern Lights, midnight sun, and vibrant cultural festivals surrounded by snow-capped peaks.',
    region: 'Northern Norway',
    type: 'CITY',
    status: 'PUBLISHED',
    lat: 69.6492,
    lng: 18.9553,
    source_type: 'SYSTEM',
    seo_title: 'Tromsø — Arctic Capital of Northern Lights | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=tromso+aurora&w=1440'
  },
  {
    id: 'loc-geiranger',
    name: 'Geirangerfjord',
    slug: 'geirangerfjord',
    description: 'UNESCO World Heritage fjord with emerald-blue waters, sheer granite walls, and famous cascading waterfalls like the Seven Sisters.',
    region: 'Fjord Norway',
    type: 'FJORD',
    status: 'PUBLISHED',
    lat: 62.1008,
    lng: 7.2059,
    source_type: 'SYSTEM',
    seo_title: 'Geirangerfjord — UNESCO World Heritage Fjord | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=geirangerfjord+norway&w=1440'
  },
  {
    id: 'loc-lofoten',
    name: 'Lofoten Islands',
    slug: 'lofoten-islands',
    description: 'Dramatic archipelago with sharp alpine peaks rising directly from Arctic waters, historic red rorbu cabins, and white sand beaches.',
    region: 'Northern Norway',
    type: 'ISLAND',
    status: 'PUBLISHED',
    lat: 68.2091,
    lng: 13.9312,
    source_type: 'SYSTEM',
    seo_title: 'Lofoten Islands — Majestic Arctic Archipelago | Norway SmartLife',
    hero_image_url: '/images/lofoten_1787013505867.jpg'
  },
  {
    id: 'loc-bergen',
    name: 'Bergen',
    slug: 'bergen',
    description: 'Historic Hanseatic port surrounded by Seven Mountains, featuring UNESCO Bryggen wharf, seafood markets, and scenic funiculars.',
    region: 'Fjord Norway',
    type: 'CITY',
    status: 'PUBLISHED',
    lat: 60.3913,
    lng: 5.3221,
    source_type: 'SYSTEM',
    seo_title: 'Bergen — Hanseatic Fjord Gateway | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=bryggen+bergen&w=1440'
  },
  {
    id: 'loc-oslo',
    name: 'Oslo',
    slug: 'oslo',
    description: 'Norway\'s dynamic green capital blending world-class architecture (Opera House, Munch Museum), urban saunas, and lush fjord islands.',
    region: 'Eastern Norway',
    type: 'CITY',
    status: 'PUBLISHED',
    lat: 59.9139,
    lng: 10.7522,
    source_type: 'SYSTEM',
    seo_title: 'Oslo — Modern Sustainable Capital | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=oslo+opera+house&w=1440'
  },
  {
    id: 'loc-jotunheimen',
    name: 'Jotunheimen National Park',
    slug: 'jotunheimen',
    description: 'The Home of the Giants, boasting Northern Europe\'s highest summits including Galdhøpiggen and the legendary Besseggen ridge.',
    region: 'Central Highlands',
    type: 'MOUNTAIN',
    status: 'PUBLISHED',
    lat: 61.6365,
    lng: 8.3124,
    source_type: 'SYSTEM',
    seo_title: 'Jotunheimen — Realm of the Giants | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=jotunheimen+mountains&w=1440'
  },
  {
    id: 'loc-flam',
    name: 'Flåm & Nærøyfjord',
    slug: 'flam',
    description: 'Nestled deep in the Aurlandsfjord, famous for the engineering marvel Flåmsbana railway and electric silent fjord cruises.',
    region: 'Fjord Norway',
    type: 'FJORD',
    status: 'PUBLISHED',
    lat: 60.8631,
    lng: 7.1132,
    source_type: 'SYSTEM',
    seo_title: 'Flåm — Scenic Railway & Deep Fjords | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=flam+railway+norway&w=1440'
  },
  {
    id: 'loc-svalbard',
    name: 'Svalbard',
    slug: 'svalbard',
    description: 'High Arctic wilderness halfway between mainland Norway and the North Pole, home to polar bears, walruses, and massive glaciers.',
    region: 'High Arctic',
    type: 'REGION',
    status: 'PUBLISHED',
    lat: 78.2232,
    lng: 15.6267,
    source_type: 'SYSTEM',
    seo_title: 'Svalbard — High Arctic Frontier | Norway SmartLife',
    hero_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=svalbard+glacier+arctic&w=1440'
  }
];

export const destinationService = {
  async getDestinationBySlug(slug: string): Promise<DestinationDetailed | null> {
    try {
      // 1. Fetch Location from Supabase
      const { data: location, error: locError } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .single();

      if (locError || !location) {
        const cleanSlug = slug.toLowerCase().trim();
        const fallback = FALLBACK_DESTINATIONS.find(d => 
          d.slug?.toLowerCase() === cleanSlug || 
          d.id?.toLowerCase() === cleanSlug ||
          d.name.toLowerCase() === cleanSlug ||
          (cleanSlug === 'lofoten' && d.slug === 'lofoten-islands') ||
          d.name.toLowerCase().replace(/\s+/g, '-') === cleanSlug
        );
        if (fallback) {
          return {
            ...fallback,
            hero_media: fallback.hero_image_url ? { id: 'm1', entity_type: 'location', entity_id: fallback.id, media_url: fallback.hero_image_url, media_type: 'HERO', caption: fallback.name } : null,
            gallery_media: [],
            related_activities: [],
            related_accommodations: []
          } as DestinationDetailed;
        }
        return null;
      }

      // 2. Fetch Media
      const media = await mediaService.getMediaForEntity('location', location.id);
      const hero_media = media.find(m => m.media_type === 'HERO') || null;
      const gallery_media = media.filter(m => m.media_type === 'GALLERY');

      // 3. Fetch Related Accommodations via content_relationships
      const { data: relAccomm } = await supabase
        .from('content_relationships')
        .select('target_id')
        .eq('source_type', 'location')
        .eq('source_id', location.id)
        .eq('target_type', 'accommodation');
        
      const accommodationIds = relAccomm?.map(r => r.target_id) || [];
      let related_accommodations: any[] = [];
      if (accommodationIds.length > 0) {
        const { data: accomms } = await supabase
          .from('accommodations')
          .select('*')
          .in('id', accommodationIds)
          .limit(3);
        related_accommodations = accomms || [];
      }

      // 4. Fetch Related Activities via content_relationships
      const { data: relActivities } = await supabase
        .from('content_relationships')
        .select('target_id')
        .eq('source_type', 'location')
        .eq('source_id', location.id)
        .eq('target_type', 'activity');

      const activityIds = relActivities?.map(r => r.target_id) || [];
      let related_activities: any[] = [];
      if (activityIds.length > 0) {
        const { data: acts } = await supabase
          .from('activities')
          .select('*')
          .in('id', activityIds)
          .limit(3);
        related_activities = acts || [];
      }

      return {
        ...location,
        hero_media,
        gallery_media,
        related_accommodations,
        related_activities
      } as DestinationDetailed;

    } catch (error) {
      console.error(`Error fetching destination ${slug}:`, error);
      const cleanSlug = slug.toLowerCase().trim();
      const fallback = FALLBACK_DESTINATIONS.find(d => 
        d.slug?.toLowerCase() === cleanSlug || 
        d.id?.toLowerCase() === cleanSlug ||
        d.name.toLowerCase() === cleanSlug ||
        (cleanSlug === 'lofoten' && d.slug === 'lofoten-islands') ||
        d.name.toLowerCase().replace(/\s+/g, '-') === cleanSlug
      );
      if (fallback) {
        return {
          ...fallback,
          hero_media: fallback.hero_image_url ? { id: 'm1', entity_type: 'location', entity_id: fallback.id, media_url: fallback.hero_image_url, media_type: 'HERO', caption: fallback.name } : null,
          gallery_media: [],
          related_activities: [],
          related_accommodations: []
        } as DestinationDetailed;
      }
      return null;
    }
  },
  
  async getAllDestinations(): Promise<LocationDestination[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .in('type', ['CITY', 'REGION', 'FJORD', 'ISLAND', 'MOUNTAIN'])
        .eq('status', 'PUBLISHED')
        .order('name');
        
      if (error || !data || data.length === 0) {
        return FALLBACK_DESTINATIONS;
      }
      return data as LocationDestination[];
    } catch {
      return FALLBACK_DESTINATIONS;
    }
  }
};
