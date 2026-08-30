import { supabase } from '../lib/supabase';

export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  valid_until: string;
  image_url: string;
  featured: boolean;
  status: string;
}

export const FALLBACK_DEALS: Deal[] = [
  {
    id: 'deal-001',
    name: 'Fjord & Aurora 4-Day Winter Expedition',
    description: 'All-inclusive Arctic getaway including hybrid catamaran fjord cruise, husky sledding under the Northern Lights, and luxury glass igloo stay.',
    price: 9800,
    original_price: 13500,
    discount_percentage: 27,
    valid_until: '2026-12-31T23:59:59Z',
    image_url: '/images/northern_lights_1786935879330.jpg',
    featured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'deal-002',
    name: 'Lofoten Islands Rorbu & Sea Eagle Safari',
    description: 'Stay in authentic waterfront fishing rorbu cabins in Reine, complete with private sauna access and RIB sea eagle safari through Trollfjord.',
    price: 6400,
    original_price: 8500,
    discount_percentage: 25,
    valid_until: '2026-11-30T23:59:59Z',
    image_url: '/images/lofoten_1787013505867.jpg',
    featured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'deal-003',
    name: 'Norway in a Nutshell: Flåm Railway & Electric Fjord Cruise',
    description: 'The definitive fjord journey combining the world-famous steep Flåmsbana railway with a silent zero-emission cruise through UNESCO Nærøyfjord.',
    price: 2950,
    original_price: 3800,
    discount_percentage: 22,
    valid_until: '2026-10-31T23:59:59Z',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=flamsbana+railway+scenic+train+norway&w=1200',
    featured: true,
    status: 'PUBLISHED'
  },
  {
    id: 'deal-004',
    name: 'Preikestolen & Lysefjord Adventure Pass',
    description: 'Guided sunrise hike to the Pulpit Rock cliff top, followed by a panoramic fjord rib-boat excursion and traditional Norwegian mountain breakfast.',
    price: 1950,
    original_price: 2600,
    discount_percentage: 25,
    valid_until: '2026-09-30T23:59:59Z',
    image_url: '/images/preikestolen_1786936002797.jpg',
    featured: false,
    status: 'PUBLISHED'
  }
];

export const dealService = {
  getAllDeals: async (): Promise<Deal[]> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error || !data || data.length === 0) {
        return FALLBACK_DEALS;
      }
      return (data || []) as Deal[];
    } catch {
      return FALLBACK_DEALS;
    }
  },
  
  getFeaturedDeals: async (): Promise<Deal[]> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('featured', true)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error || !data || data.length === 0) {
        return FALLBACK_DEALS.filter(d => d.featured);
      }
      return (data || []) as Deal[];
    } catch {
      return FALLBACK_DEALS.filter(d => d.featured);
    }
  },

  getPublishedDeals: async (): Promise<Deal[]> => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });
        
      if (error || !data || data.length === 0) {
        return FALLBACK_DEALS;
      }
      return (data || []) as Deal[];
    } catch {
      return FALLBACK_DEALS;
    }
  }
};
