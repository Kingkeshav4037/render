import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type WildlifeRow = Database['public']['Tables']['wildlife_species']['Row'];

export interface WildlifeHabitat {
  id: string;
  region: string;
  best_months: string[];
  description: string | null;
}

export interface ContentMedia {
  id: string;
  media_type: string;
  media_url: string;
  alt_text: string | null;
  sort_order?: number;
}

export interface WildlifeSpecies extends WildlifeRow {
  habitats?: WildlifeHabitat[];
  media?: ContentMedia[];
  category?: string; // Parsed from facts
  primary_image?: string;
  related_locations?: any[];
}

export const wildlifeService = {
  async getAllSpecies(filters?: { category?: string; region?: string; season?: string }): Promise<WildlifeSpecies[]> {
    const { data: wildlife, error: wildlifeError } = await supabase
      .from('wildlife_species')
      .select(`
        *,
        habitats:wildlife_habitats(*)
      `);

    if (wildlifeError) return [];
    if (!wildlife || wildlife.length === 0) return [];

    const wildlifeIds = wildlife.map(w => w.id);
    const { data: media } = await supabase
      .from('content_media')
      .select('*')
      .eq('entity_type', 'wildlife_species')
      .in('entity_id', wildlifeIds)
      .in('sort_order', [0, 1]);

    return (wildlife as any[]).map(w => {
      const wMedia = media?.filter(m => m.entity_id === w.id) || [];
      return formatSpecies({ ...w, media: wMedia });
    });
  },

  async getPaginatedSpecies(
    filters?: { category?: string; region?: string; season?: string }, 
    page: number = 1, 
    limit: number = 12
  ): Promise<{ data: WildlifeSpecies[], count: number }> {
    let q = supabase
      .from('wildlife_species')
      .select(`
        *,
        habitats:wildlife_habitats(*)
      `, { count: 'exact' });
    
    // We can filter by category easily since it's now parsed from facts in some way or maybe we can't filter server side fully if it's inside `facts` array.
    // Given the complexity of filtering by joined arrays, we will do a basic fetch and paginate for now.
    // If the filters are present, we might have to fetch more or use RPC. For now, basic pagination:
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    q = q.range(from, to);

    const { data: wildlife, error: wildlifeError, count } = await q;

    if (wildlifeError || !wildlife) {
      return { data: [], count: 0 };
    }

    const wildlifeIds = wildlife.map(w => w.id);
    const { data: media } = await supabase
      .from('content_media')
      .select('*')
      .eq('entity_type', 'wildlife_species')
      .in('entity_id', wildlifeIds)
      .in('sort_order', [0, 1]);

    const mapped = (wildlife as any[]).map(w => {
      const wMedia = media?.filter(m => m.entity_id === w.id) || [];
      return formatSpecies({ ...w, media: wMedia });
    });

    return { data: mapped, count: count || 0 };
  },

  async getSpeciesBySlug(slug: string): Promise<WildlifeSpecies | null> {
    const { data: wildlife, error } = await supabase
      .from('wildlife_species')
      .select(`
        *,
        habitats:wildlife_habitats(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !wildlife) return null;

    // Fetch Media
    const { data: media } = await supabase
      .from('content_media')
      .select('*')
      .eq('entity_type', 'wildlife')
      .eq('entity_id', wildlife.id);

    // Fetch Related Locations
    const { data: relLocs } = await supabase
      .from('content_relationships')
      .select('target_id')
      .eq('source_type', 'wildlife')
      .eq('source_id', wildlife.id)
      .eq('target_type', 'location');

    let related_locations: any[] = [];
    if (relLocs && relLocs.length > 0) {
      const locIds = relLocs.map(r => r.target_id);
      const { data: locs } = await supabase
        .from('locations')
        .select('*')
        .in('id', locIds);
      related_locations = locs || [];
    }

    // Determine primary image
    let primary_image = '/images/placeholder.jpg';
    if (media && media.length > 0) {
      const primary = media.find(m => m.sort_order === 0 || m.sort_order === 1) || media[0];
      primary_image = primary.media_url;
    }

    return formatSpecies({ 
      ...wildlife, 
      media: media || [],
      primary_image,
      related_locations 
    });
  }
};

const WILDLIFE_IMAGES: Record<string, string> = {
  'moose':              'https://images.unsplash.com/photo-1547844075-8e2b2fb0c930?q=80&w=1200',
  'reindeer':           '/images/wildlife_reindeer_1787013667019.jpg',
  'arctic-fox':         'https://images.unsplash.com/photo-1516214104703-d2507f01dda4?q=80&w=1200',
  'red-fox':            'https://images.unsplash.com/photo-1474511320723-9a56873ee67b?q=80&w=1200',
  'eurasian-lynx':      'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=1200',
  'lynx':               'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=1200',
  'wolverine':          'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200',
  'brown-bear':         'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200',
  'wolf':               'https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1200',
  'grey-wolf':          'https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1200',
  'puffin':             'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1200',
  'atlantic-puffin':    'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1200',
  'white-tailed-eagle': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'sea-eagle':          'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'orca':               'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200',
  'killer-whale':       'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200',
  'humpback-whale':     'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
  'polar-bear':         'https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1200',
  'walrus':             'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1200',
  'muskox':             'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200',
  'beaver':             'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?q=80&w=1200',
  'otter':              'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200',
  'seal':               'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1200',
  'elk':                'https://images.unsplash.com/photo-1547844075-8e2b2fb0c930?q=80&w=1200',
  'bear':               'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200',
  'eagle':              'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'whale':              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
  'fox':                'https://images.unsplash.com/photo-1474511320723-9a56873ee67b?q=80&w=1200',
};

export function getWildlifeImage(slug?: string, name?: string): string {
  const cleanSlug = (slug || '').toLowerCase().trim();
  const cleanName = (name || '').toLowerCase().trim().replace(/\s+/g, '-');
  
  if (WILDLIFE_IMAGES[cleanSlug]) return WILDLIFE_IMAGES[cleanSlug];
  if (WILDLIFE_IMAGES[cleanName]) return WILDLIFE_IMAGES[cleanName];

  // Fuzzy match
  for (const [key, url] of Object.entries(WILDLIFE_IMAGES)) {
    if (cleanSlug.includes(key) || cleanName.includes(key)) {
      return url;
    }
  }

  return '/images/wildlife_reindeer_1787013667019.jpg';
}

function formatSpecies(row: any): WildlifeSpecies {
  // Parse facts for category
  let category = 'Mammals';
  if (row.facts && Array.isArray(row.facts)) {
    const catFact = row.facts.find((f: string) => f.startsWith('Category:'));
    if (catFact) {
      category = catFact.replace('Category:', '').trim();
    }
  }

  // Dictionary image ALWAYS wins — DB media is unreliable (wrong/reused images)
  const primary_image = getWildlifeImage(row.slug, row.common_name);

  return {
    ...row,
    category,
    primary_image
  };
}
