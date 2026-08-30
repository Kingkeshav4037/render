import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

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

export interface WildlifeSpecies {
  id: string;
  slug: string;
  common_name: string;
  scientific_name: string;
  norwegian_name?: string | null;
  conservation_status: string;
  description: string;
  behavior?: string | null;
  diet?: string | null;
  facts?: string[];
  source_type?: 'demo' | 'editorial' | 'external' | 'imported' | 'verified' | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
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
    try {
      const { data: wildlife, error } = await supabase
        .from('wildlife_species')
        .select(`
          *,
          habitats:wildlife_habitats(*)
        `)
        .eq('slug', slug)
        .single();

      if (!error && wildlife) {
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

        let primary_image = getWildlifeImage(wildlife.slug, wildlife.common_name);
        if (media && media.length > 0) {
          const primary = media.find(m => m.sort_order === 0 || m.sort_order === 1) || media[0];
          if (primary.media_url && !primary.media_url.includes('placeholder')) {
            primary_image = primary.media_url;
          }
        }

        return formatSpecies({ 
          ...wildlife, 
          media: media || [],
          primary_image,
          related_locations 
        });
      }
    } catch {
      // Fallback
    }

    const fallback = FALLBACK_SPECIES.find(s => s.slug === slug || s.slug.includes(slug) || slug.includes(s.slug));
    return fallback ? formatSpecies(fallback) : null;
  }
};

export const FALLBACK_SPECIES: WildlifeSpecies[] = [
  {
    id: 'ws-polar-bear',
    slug: 'polar-bear',
    common_name: 'Polar Bear',
    scientific_name: 'Ursus maritimus',
    norwegian_name: 'Isbjørn',
    conservation_status: 'Vulnerable (VU)',
    description: 'The monarch of the High Arctic, perfectly adapted to polar ice sheets with insulating blubber, dense fur, and powerful swimming capabilities.',
    behavior: 'Solitary predators that travel hundreds of kilometers across pack ice hunting seals. Highly curious and dangerous at close quarters.',
    diet: 'Ringed and bearded seals, whale carcasses, and coastal seabird eggs.',
    facts: ['Category: Mammals', 'Estimated population: 3,000 in the Barents Sea region', 'Largest land carnivore on Earth'],
    source_type: 'editorial',
    status: 'PUBLISHED',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    habitats: [
      { id: 'h1', region: 'Svalbard', best_months: ['May', 'June', 'July', 'August'], description: 'Pack ice edges, remote fjords of Spitsbergen' }
    ]
  },
  {
    id: 'ws-reindeer',
    slug: 'reindeer',
    common_name: 'Wild Reindeer',
    scientific_name: 'Rangifer tarandus',
    norwegian_name: 'Villrein',
    conservation_status: 'Near Threatened (NT)',
    description: 'Norway hosts Europe’s last remaining populations of wild tundra reindeer roaming the vast high plateaus of Hardangervidda and Dovrefjell.',
    behavior: 'Nomadic herd animals moving across mountain plateaus according to wind direction and lichen growth.',
    diet: 'Reindeer lichen (Cladonia rangiferina), alpine shrubs, sedges, and dwarf birch.',
    facts: ['Category: Mammals', 'Norway holds 80% of Europe wild reindeer', 'Both males and females grow antlers'],
    source_type: 'editorial',
    status: 'PUBLISHED',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    habitats: [
      { id: 'h2', region: 'Central Highlands', best_months: ['June', 'July', 'August', 'September'], description: 'Hardangervidda, Dovrefjell-Sunndalsfjella' }
    ]
  },
  {
    id: 'ws-arctic-fox',
    slug: 'arctic-fox',
    common_name: 'Arctic Fox',
    scientific_name: 'Vulpes lagopus',
    norwegian_name: 'Fjellrev',
    conservation_status: 'Critically Endangered (CR - Mainland Norway)',
    description: 'One of the world’s most cold-hardy mammals, sporting a pristine snow-white winter coat that changes to grayish-brown in summer.',
    behavior: 'Monogamous pairs maintaining complex underground dens. Follows polar bears on sea ice to scavenge leftover prey.',
    diet: 'Lemmings, voles, ptarmigan, seabirds, and carrion.',
    facts: ['Category: Mammals', 'Withstands temperatures down to -50°C', 'Remarkable breeding conservation program in Norway'],
    source_type: 'editorial',
    status: 'PUBLISHED',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    habitats: [
      { id: 'h3', region: 'Central Highlands', best_months: ['June', 'July', 'August'], description: 'Finse, Børgefjell, Svalbard tundra' }
    ]
  },
  {
    id: 'ws-atlantic-puffin',
    slug: 'atlantic-puffin',
    common_name: 'Atlantic Puffin',
    scientific_name: 'Fratercula arctica',
    norwegian_name: 'Lunde',
    conservation_status: 'Vulnerable (VU)',
    description: 'The beloved "Clown of the Sea," nesting in vast bird cliffs along Norway’s windswept Atlantic coast with vibrant rainbow beaks in spring.',
    behavior: 'Spends winters out on the open North Atlantic, returning in May to burrow nesting chambers on steep grassy island cliffs.',
    diet: 'Small fish like sandeels, herring, and capelin carried in cross-bill stacks.',
    facts: ['Category: Birds', 'Can flap wings up to 400 beats per minute', 'Famous colonies at Røst and Runde islands'],
    source_type: 'editorial',
    status: 'PUBLISHED',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    habitats: [
      { id: 'h4', region: 'Northern Norway', best_months: ['May', 'June', 'July', 'August'], description: 'Runde, Bleik, Røst archipelago' }
    ]
  }
];

const WILDLIFE_IMAGES: Record<string, string> = {
  'moose':              'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=1200',
  'elk':                'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=1200',
  'elg':                'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=1200',
  'reindeer':           '/images/wildlife_reindeer_1787013667019.jpg',
  'villrein':           '/images/wildlife_reindeer_1787013667019.jpg',
  'arctic-fox':         'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80&w=1200',
  'fjellrev':           'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80&w=1200',
  'red-fox':            'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1200',
  'fox':                'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1200',
  'eurasian-lynx':      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200',
  'lynx':               'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200',
  'gaupe':              'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200',
  'wolverine':          'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1200',
  'jerv':               'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1200',
  'brown-bear':         'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200',
  'bear':               'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200',
  'brunbjørn':          'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200',
  'wolf':               'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=80&w=1200',
  'grey-wolf':          'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=80&w=1200',
  'ulv':                'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=80&w=1200',
  'polar-bear':         'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200',
  'isbjørn':            'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200',
  'puffin':             'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1200',
  'atlantic-puffin':    'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1200',
  'lunde':              'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=1200',
  'white-tailed-eagle': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'sea-eagle':          'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'havørn':             'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'eagle':              'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200',
  'orca':               'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200',
  'killer-whale':       'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200',
  'spekkhogger':        'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200',
  'humpback-whale':     'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
  'knølhval':           'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
  'whale':              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
  'walrus':             'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1200',
  'hvalross':           'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1200',
  'muskox':             'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200',
  'moskus':             'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200',
  'beaver':             'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=1200',
  'otter':              'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=1200',
  'seal':               'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1200',
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
