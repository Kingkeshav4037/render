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
  'moose':              '/images/moose.jpg',
  'elk':                '/images/moose.jpg',
  'elg':                '/images/moose.jpg',
  'eurasian-elk':       '/images/moose_bull.jpg',
  'reindeer':           '/images/wildlife_reindeer_1787013667019.jpg',
  'villrein':           '/images/wildlife_reindeer_1787013667019.jpg',
  'wild-reindeer':      '/images/wildlife_reindeer_1787013667019.jpg',
  'svalbard-reindeer':  '/images/svalbard_reindeer.jpg',
  'arctic-fox':         '/images/arctic_fox.jpg',
  'fjellrev':           '/images/arctic_fox.jpg',
  'red-fox':            '/images/polar_fox.jpg',
  'fox':                '/images/polar_fox.jpg',
  'eurasian-lynx':      '/images/eurasian_lynx.jpg',
  'lynx':               '/images/lynx.jpg',
  'gaupe':              '/images/eurasian_lynx.jpg',
  'wolverine':          '/images/wolverine.jpg',
  'jerv':               '/images/jerv.jpg',
  'brown-bear':         '/images/jerv.jpg',
  'bear':               '/images/jerv.jpg',
  'brunbjørn':          '/images/jerv.jpg',
  'wolf':               '/images/wolf.jpg',
  'grey-wolf':          '/images/grey_wolf.jpg',
  'ulv':                '/images/grey_wolf.jpg',
  'polar-bear':         '/images/polar_bear.jpg',
  'isbjørn':            '/images/polar_bear.jpg',
  'puffin':             '/images/puffin.jpg',
  'atlantic-puffin':    '/images/atlantic_puffin.jpg',
  'lunde':              '/images/atlantic_puffin.jpg',
  'white-tailed-eagle': '/images/sea_eagle.jpg',
  'sea-eagle':          '/images/sea_eagle.jpg',
  'havørn':             '/images/sea_eagle.jpg',
  'golden-eagle':       '/images/golden_eagle.jpg',
  'kongeørn':           '/images/golden_eagle.jpg',
  'eagle':              '/images/sea_eagle.jpg',
  'gyrfalcon':          '/images/sea_eagle.jpg',
  'jaktfalk':           '/images/sea_eagle.jpg',
  'snowy-owl':          '/images/snowy_owl.jpg',
  'snøugle':            '/images/snowy_owl.jpg',
  'arctic-tern':        '/images/arctic_tern.jpg',
  'rødnebbterne':       '/images/rodnebbterne.jpg',
  'razorbill':          '/images/atlantic_puffin.jpg',
  'alke':               '/images/atlantic_puffin.jpg',
  'common-guillemot':   '/images/puffin.jpg',
  'lomvi':              '/images/puffin.jpg',
  'northern-gannet':    '/images/sea_eagle.jpg',
  'havsule':            '/images/sea_eagle.jpg',
  'kittiwake':          '/images/arctic_tern.jpg',
  'krykkje':            '/images/arctic_tern.jpg',
  'orca':               '/images/orca.jpg',
  'killer-whale':       '/images/orca.jpg',
  'spekkhogger':        '/images/orca.jpg',
  'humpback-whale':     '/images/humpback_whale.jpg',
  'knølhval':           '/images/humpback_whale.jpg',
  'sperm-whale':        '/images/sperm_whale.jpg',
  'spermasetthval':     '/images/sperm_whale.jpg',
  'minke-whale':        '/images/minke_whale.jpg',
  'vågehval':           '/images/minke_whale.jpg',
  'whale':              '/images/whale.jpg',
  'harbour-porpoise':   '/images/harbour_porpoise.jpg',
  'nise':               '/images/porpoise.jpg',
  'walrus':             '/images/walrus.jpg',
  'hvalross':           '/images/svalbard_walrus.jpg',
  'muskox':             '/images/muskox.jpg',
  'musk-ox':            '/images/muskox.jpg',
  'moskus':             '/images/muskox.jpg',
  'beaver':             '/images/beaver.jpg',
  'bever':              '/images/beaver.jpg',
  'otter':              '/images/otter.jpg',
  'european-otter':     '/images/european_otter.jpg',
  'oter':               '/images/european_otter.jpg',
  'seal':               '/images/seals.jpg',
  'harbour-seal':       '/images/harbor_seal.jpg',
  'steinkobbe':         '/images/harbor_seal.jpg',
  'grey-seal':          '/images/grey_seal.jpg',
  'havert':             '/images/grey_seal.jpg',
  'sel':                '/images/harbor_seal.jpg',
  'roe-deer':           '/images/roe_deer.jpg',
  'rådyr':              '/images/roe_deer.jpg',
  'red-deer':           '/images/red_deer.jpg',
  'hjort':              '/images/red_deer.jpg',
  'mountain-hare':      '/images/mountain_hare.jpg',
  'hare':               '/images/fjellhare.jpg',
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
