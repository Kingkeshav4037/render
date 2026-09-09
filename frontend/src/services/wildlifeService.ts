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

// In-memory cache for all species to ensure instant sub-millisecond filtering
let cachedAllSpecies: WildlifeSpecies[] | null = null;

export function matchesCategory(species: WildlifeSpecies, filterCat: string): boolean {
  if (!filterCat || filterCat === 'All') return true;

  const target = filterCat.toLowerCase().trim();
  const cat = (species.category || '').toLowerCase().trim();

  if (target === 'marine' || target === 'marine life') {
    return cat.includes('marine');
  }
  if (target === 'mammals' || target === 'mammal') {
    return cat.includes('mammal');
  }
  if (target === 'birds' || target === 'bird') {
    return cat.includes('bird');
  }
  if (target === 'other' || target === 'other fauna') {
    return !cat.includes('mammal') && !cat.includes('bird') && !cat.includes('marine');
  }

  return cat === target || cat.includes(target);
}

export function matchesRegion(habitats: WildlifeHabitat[] | undefined, filterRegion: string): boolean {
  if (!filterRegion || filterRegion === 'All') return true;
  if (!habitats || habitats.length === 0) return true;

  const target = filterRegion.toLowerCase().trim();

  return habitats.some(h => {
    const regionStr = (h.region || '').toLowerCase();
    const descStr = (h.description || '').toLowerCase();
    const combined = `${regionStr} ${descStr}`;

    // Universal species across Norway
    if (combined.includes('all over norway') || combined.includes('all of norway') || 
        combined.includes('entire country') || combined.includes('throughout norway') || 
        combined.includes('widespread') || combined.includes('all norway')) {
      return true;
    }

    if (target === 'svalbard') {
      return combined.includes('svalbard') || combined.includes('spitsbergen') || combined.includes('barents') || combined.includes('high arctic');
    }

    if (target === 'northern norway') {
      return combined.includes('northern norway') || combined.includes('nord-norge') || combined.includes('finnmark') || 
             combined.includes('troms') || combined.includes('tromsø') || combined.includes('vesterålen') || 
             combined.includes('nordland') || combined.includes('lofot') || combined.includes('røst') || 
             combined.includes('bleik') || combined.includes('pasvik') || combined.includes('andenes') || 
             combined.includes('senja') || combined.includes('varanger') || combined.includes('barents');
    }

    if (target === 'fjord norway') {
      return combined.includes('fjord') || combined.includes('western norway') || combined.includes('vestland') || 
             combined.includes('vestlandet') || combined.includes('møre') || combined.includes('romsdal') || 
             combined.includes('geiranger') || combined.includes('sognefjord') || combined.includes('hardanger') || 
             combined.includes('runde') || combined.includes('coast') || combined.includes('flåm') || 
             combined.includes('stavanger') || combined.includes('bergen') || combined.includes('ålesund');
    }

    if (target === 'eastern norway') {
      return combined.includes('eastern') || combined.includes('østlandet') || combined.includes('central norway') || 
             combined.includes('østerdalen') || combined.includes('hedmark') || combined.includes('dovrefjell') || 
             combined.includes('hardangervidda') || combined.includes('rondane') || combined.includes('jotunheimen') || 
             combined.includes('femundsmarka') || combined.includes('oslo') || combined.includes('boreal');
    }

    if (target === 'trøndelag') {
      return combined.includes('trøndelag') || combined.includes('central norway') || combined.includes('central') || 
             combined.includes('dovrefjell') || combined.includes('rondane') || combined.includes('børgefjell') || 
             combined.includes('trondheim');
    }

    return combined.includes(target);
  });
}

export function matchesSeason(habitats: WildlifeHabitat[] | undefined, filterSeason: string): boolean {
  if (!filterSeason || filterSeason === 'All') return true;
  if (!habitats || habitats.length === 0) return true;

  const target = filterSeason.toLowerCase().trim();

  return habitats.some(h => {
    if (!h.best_months || h.best_months.length === 0) return true;

    return h.best_months.some(m => {
      const val = m.toLowerCase().trim();

      if (val.includes('all year') || val.includes('all-year') || val.includes('year-round') || val.includes('hele året')) {
        return true;
      }

      if (target === 'year-round') {
        return val.includes('all year') || val.includes('all-year') || val.includes('year-round') || val.includes('hele året');
      }

      if (target === 'summer') {
        return val.includes('summer') || val.includes('sommer') || val.includes('june') || 
               val.includes('july') || val.includes('august') || val.includes('may-october') || 
               val.includes('summer-autumn') || val.includes('spring-summer');
      }

      if (target === 'winter') {
        return val.includes('winter') || val.includes('vinter') || val.includes('december') || 
               val.includes('january') || val.includes('february') || val.includes('november') || 
               val.includes('november-january');
      }

      if (target === 'spring') {
        return val.includes('spring') || val.includes('vår') || val.includes('march') || 
               val.includes('april') || val.includes('may') || val.includes('spring-summer');
      }

      if (target === 'autumn') {
        return val.includes('autumn') || val.includes('fall') || val.includes('høst') || 
               val.includes('september') || val.includes('october') || val.includes('november') || 
               val.includes('summer-autumn') || val.includes('may-october');
      }

      return val.includes(target);
    });
  });
}

export const wildlifeService = {
  async getAllSpecies(filters?: { category?: string; region?: string; season?: string }): Promise<WildlifeSpecies[]> {
    let all = cachedAllSpecies;
    if (!all || all.length === 0) {
      try {
        const { data: wildlife, error: wildlifeError } = await supabase
          .from('wildlife_species')
          .select(`
            *,
            habitats:wildlife_habitats(*)
          `);

        if (!wildlifeError && wildlife && wildlife.length > 0) {
          const wildlifeIds = wildlife.map(w => w.id);
          let media: any[] = [];
          try {
            const { data: mediaData } = await supabase
              .from('content_media')
              .select('*')
              .eq('entity_type', 'wildlife_species')
              .in('entity_id', wildlifeIds)
              .in('sort_order', [0, 1]);
            media = mediaData || [];
          } catch {
            // Media query is non-critical since getWildlifeImage provides reliable visuals
          }

          all = (wildlife as any[]).map(w => {
            const wMedia = media.filter(m => m.entity_id === w.id);
            return formatSpecies({ ...w, media: wMedia });
          });
          cachedAllSpecies = all;
        }
      } catch (err) {
        console.warn('Error querying wildlife species from Supabase, using fallback data:', err);
      }

      if (!all || all.length === 0) {
        all = FALLBACK_SPECIES.map(formatSpecies);
        cachedAllSpecies = all;
      }
    }

    if (filters) {
      let filtered = all;
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(s => matchesCategory(s, filters.category!));
      }
      if (filters.region && filters.region !== 'All') {
        filtered = filtered.filter(s => matchesRegion(s.habitats, filters.region!));
      }
      if (filters.season && filters.season !== 'All') {
        filtered = filtered.filter(s => matchesSeason(s.habitats, filters.season!));
      }
      return filtered;
    }

    return all;
  },

  async getPaginatedSpecies(
    filters?: { category?: string; region?: string; season?: string; searchTerm?: string }, 
    page: number = 1, 
    limit: number = 12
  ): Promise<{ data: WildlifeSpecies[], count: number }> {
    const all = await this.getAllSpecies();
    
    let filtered = all;

    if (filters?.category && filters.category !== 'All') {
      filtered = filtered.filter(s => matchesCategory(s, filters.category!));
    }

    if (filters?.region && filters.region !== 'All') {
      filtered = filtered.filter(s => matchesRegion(s.habitats, filters.region!));
    }

    if (filters?.season && filters.season !== 'All') {
      filtered = filtered.filter(s => matchesSeason(s.habitats, filters.season!));
    }

    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const q = filters.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(s =>
        s.common_name.toLowerCase().includes(q) ||
        s.scientific_name.toLowerCase().includes(q) ||
        (s.norwegian_name && s.norwegian_name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    const totalCount = filtered.length;
    const from = (page - 1) * limit;
    const paginated = filtered.slice(from, from + limit);

    return { 
      data: paginated, 
      count: totalCount 
    };
  },

  clearCache() {
    cachedAllSpecies = null;
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
  'moose':              'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose+norway+forest&w=1200',
  'elk':                'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose+norway+forest&w=1200',
  'elg':                'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose+norway+forest&w=1200',
  'eurasian-elk':       'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose+norway+forest&w=1200',
  'reindeer':           '/images/wildlife_reindeer_1787013667019.jpg',
  'villrein':           '/images/wildlife_reindeer_1787013667019.jpg',
  'wild-reindeer':      '/images/wildlife_reindeer_1787013667019.jpg',
  'svalbard-reindeer':  'https://images.unsplash.com/photo-1543702404-03aeb69bfb01?q=reindeer+svalbard&w=1200',
  'arctic-fox':         'https://images.unsplash.com/photo-1473216892550-96f7e8a94689?q=arctic+fox+white+snow+winter&w=1200',
  'fjellrev':           'https://images.unsplash.com/photo-1473216892550-96f7e8a94689?q=arctic+fox+white+snow+winter&w=1200',
  'red-fox':            'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=red+fox+wildlife&w=1200',
  'fox':                'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=red+fox+wildlife&w=1200',
  'eurasian-lynx':      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=lynx+cat+snow&w=1200',
  'lynx':               'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=lynx+cat+snow&w=1200',
  'gaupe':              'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=lynx+cat+snow&w=1200',
  'wolverine':          'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=wolverine+gulo&w=1200',
  'jerv':               'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=wolverine+gulo&w=1200',
  'brown-bear':         'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=brown+bear+wildlife&w=1200',
  'bear':               'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=brown+bear+wildlife&w=1200',
  'brunbjørn':          'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=brown+bear+wildlife&w=1200',
  'wolf':               'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=grey+wolf+wildlife&w=1200',
  'grey-wolf':          'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=grey+wolf+wildlife&w=1200',
  'ulv':                'https://images.unsplash.com/photo-1564865878688-9a244444042a?q=grey+wolf+wildlife&w=1200',
  'polar-bear':         'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=polar+bear+svalbard&w=1200',
  'isbjørn':            'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=polar+bear+svalbard&w=1200',
  'puffin':             'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=atlantic+puffin+norway&w=1200',
  'atlantic-puffin':    'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=atlantic+puffin+norway&w=1200',
  'lunde':              'https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=atlantic+puffin+norway&w=1200',
  'white-tailed-eagle': 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=sea+eagle+flying&w=1200',
  'sea-eagle':          'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=sea+eagle+flying&w=1200',
  'havørn':             'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=sea+eagle+flying&w=1200',
  'golden-eagle':       'https://images.unsplash.com/photo-1496660144983-500b904944ec?q=golden+eagle&w=1200',
  'kongeørn':           'https://images.unsplash.com/photo-1496660144983-500b904944ec?q=golden+eagle&w=1200',
  'eagle':              'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=sea+eagle+flying&w=1200',
  'gyrfalcon':          'https://images.unsplash.com/photo-1526435071190-bdfcb7547248?q=falcon&w=1200',
  'jaktfalk':           'https://images.unsplash.com/photo-1526435071190-bdfcb7547248?q=falcon&w=1200',
  'snowy-owl':          'https://images.unsplash.com/photo-1518118014316-29a39f60e9a7?q=snowy+owl&w=1200',
  'snøugle':            'https://images.unsplash.com/photo-1518118014316-29a39f60e9a7?q=snowy+owl&w=1200',
  'arctic-tern':        'https://images.unsplash.com/photo-1621532057393-0be9df863925?q=tern&w=1200',
  'rødnebbterne':       'https://images.unsplash.com/photo-1621532057393-0be9df863925?q=tern&w=1200',
  'razorbill':          'https://images.unsplash.com/photo-1606558113264-b8d1b32d18cb?q=seabird&w=1200',
  'alke':               'https://images.unsplash.com/photo-1606558113264-b8d1b32d18cb?q=seabird&w=1200',
  'common-guillemot':   'https://images.unsplash.com/photo-1581022986873-1f1c713be246?q=guillemot&w=1200',
  'lomvi':              'https://images.unsplash.com/photo-1581022986873-1f1c713be246?q=guillemot&w=1200',
  'northern-gannet':    'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=gannet&w=1200',
  'havsule':            'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=gannet&w=1200',
  'kittiwake':          'https://images.unsplash.com/photo-1502470712753-4eb08e6f1f26?q=seagull&w=1200',
  'krykkje':            'https://images.unsplash.com/photo-1502470712753-4eb08e6f1f26?q=seagull&w=1200',
  'orca':               'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=orca+killer+whale+fjord&w=1200',
  'killer-whale':       'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=orca+killer+whale+fjord&w=1200',
  'spekkhogger':        'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=orca+killer+whale+fjord&w=1200',
  'humpback-whale':     'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=humpback+whale+tail+fluke+ocean&w=1200',
  'knølhval':           'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=humpback+whale+tail+fluke+ocean&w=1200',
  'sperm-whale':        'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=sperm+whale&w=1200',
  'spermasetthval':     'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=sperm+whale&w=1200',
  'minke-whale':        'https://images.unsplash.com/photo-1521740924089-23db975de3bd?q=whale&w=1200',
  'vågehval':           'https://images.unsplash.com/photo-1521740924089-23db975de3bd?q=whale&w=1200',
  'whale':              'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=humpback+whale+tail+fluke+ocean&w=1200',
  'harbour-porpoise':   'https://images.unsplash.com/photo-1601328005886-f81dff90d96d?q=porpoise&w=1200',
  'nise':               'https://images.unsplash.com/photo-1601328005886-f81dff90d96d?q=porpoise&w=1200',
  'walrus':             'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=walrus+svalbard+arctic&w=1200',
  'hvalross':           'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=walrus+svalbard+arctic&w=1200',
  'muskox':             'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=muskox+dovrefjell&w=1200',
  'musk-ox':            'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=muskox+dovrefjell&w=1200',
  'moskus':             'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=muskox+dovrefjell&w=1200',
  'beaver':             'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=beaver+swimming+water&w=1200',
  'bever':              'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=beaver+swimming+water&w=1200',
  'otter':              'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=otter+swimming+river&w=1200',
  'european-otter':     'https://images.unsplash.com/photo-1534005856417-64dfdf7a19bb?q=otter&w=1200',
  'oter':               'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=otter+swimming+river&w=1200',
  'seal':               'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=harbor+seal+resting+rocks&w=1200',
  'harbour-seal':       'https://images.unsplash.com/photo-1565575514660-8f3e53ba54ff?q=harbour+seal&w=1200',
  'steinkobbe':         'https://images.unsplash.com/photo-1565575514660-8f3e53ba54ff?q=harbour+seal&w=1200',
  'grey-seal':          'https://images.unsplash.com/photo-1614210667496-e2448375086d?q=grey+seal&w=1200',
  'havert':             'https://images.unsplash.com/photo-1614210667496-e2448375086d?q=grey+seal&w=1200',
  'sel':                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=harbor+seal+resting+rocks&w=1200',
  'roe-deer':           'https://images.unsplash.com/photo-1498661858852-c07a346536b5?q=roe+deer&w=1200',
  'rådyr':              'https://images.unsplash.com/photo-1498661858852-c07a346536b5?q=roe+deer&w=1200',
  'red-deer':           'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=red+deer&w=1200',
  'hjort':              'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=red+deer&w=1200',
  'mountain-hare':      'https://images.unsplash.com/photo-1518063001712-45e0a6d71b30?q=hare&w=1200',
  'hare':               'https://images.unsplash.com/photo-1518063001712-45e0a6d71b30?q=hare&w=1200',
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

function inferCategory(row: any): string {
  // 1. If explicit category property exists
  if (row.category && typeof row.category === 'string' && row.category.trim()) {
    return row.category.trim();
  }

  // 2. Parse facts array for Category: <name>
  if (row.facts && Array.isArray(row.facts)) {
    const catFact = row.facts.find((f: string) => f.startsWith('Category:'));
    if (catFact) {
      const parsed = catFact.replace('Category:', '').trim();
      if (parsed) return parsed;
    }
  }

  // 3. Smart inference based on slug and common name
  const text = `${row.slug || ''} ${row.common_name || ''} ${row.scientific_name || ''}`.toLowerCase();

  if (text.includes('puffin') || text.includes('eagle') || text.includes('owl') || 
      text.includes('falcon') || text.includes('tern') || text.includes('kittiwake') || 
      text.includes('guillemot') || text.includes('razorbill') || text.includes('gannet') || 
      text.includes('ptarmigan') || text.includes('bird') || text.includes('eider') || 
      text.includes('diver') || text.includes('murre') || text.includes('fulmar') || 
      text.includes('skua') || text.includes('bunting') || text.includes('hawk')) {
    return 'Birds';
  }

  if (text.includes('whale') || text.includes('orca') || text.includes('porpoise') || 
      text.includes('seal') || text.includes('walrus') || text.includes('dolphin') || 
      text.includes('shark') || text.includes('marine') || text.includes('fish') || 
      text.includes('hval') || text.includes('sel') || text.includes('steinkobbe')) {
    return 'Marine';
  }

  if (text.includes('bear') || text.includes('wolf') || text.includes('lynx') || 
      text.includes('fox') || text.includes('wolverine') || text.includes('moose') || 
      text.includes('elk') || text.includes('reindeer') || text.includes('musk') || 
      text.includes('deer') || text.includes('otter') || text.includes('hare') || 
      text.includes('beaver') || text.includes('lemming') || text.includes('badger') || 
      text.includes('mammal')) {
    return 'Mammals';
  }

  return 'Other';
}

function formatSpecies(row: any): WildlifeSpecies {
  const category = inferCategory(row);
  const primary_image = getWildlifeImage(row.slug, row.common_name);

  return {
    ...row,
    category,
    primary_image
  };
}
