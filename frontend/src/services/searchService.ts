import { supabase } from '../lib/supabase';

export type SearchCategory = 
  | 'all'
  | 'destinations' 
  | 'activities' 
  | 'stays' 
  | 'food' 
  | 'wildlife' 
  | 'flora' 
  | 'smart_tech' 
  | 'pages'
  | 'shop';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  categoryLabel: string;
  path: string;
  imageUrl?: string;
  badge?: string;
  keywords: string[];
}

// Built-in comprehensive search index for 0ms instant search across Norway SmartLife
export const STATIC_SEARCH_INDEX: SearchItem[] = [
  // ── Destinations & Nature ──────────────────────────────────────────────────
  {
    id: 'dest-tromso',
    title: 'Tromsø — Arctic Capital & Northern Lights',
    description: 'Gateway to the Arctic, world-class Aurora Borealis views, fjord excursions, and cable car panoramas.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/tromso',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600',
    badge: 'Arctic Gateway',
    keywords: ['tromso', 'arctic', 'northern lights', 'aurora', 'fjords', 'cable car', 'snow', 'winter']
  },
  {
    id: 'dest-geiranger',
    title: 'Geirangerfjord — UNESCO World Heritage Fjord',
    description: 'Majestic waterfalls including the Seven Sisters, dramatic snow-capped peaks, and crystal emerald waters.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/geirangerfjord',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
    badge: 'UNESCO Heritage',
    keywords: ['geiranger', 'geirangerfjord', 'waterfalls', 'seven sisters', 'fjord', 'unesco', 'cruise']
  },
  {
    id: 'dest-lofoten',
    title: 'Lofoten Islands — Dramatic Arctic Archipelago',
    description: 'Iconic red rorbuer fisherman cabins, razor-sharp peaks rising from turquoise seas, and midnight sun.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/lofoten',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600',
    badge: 'Archipelago',
    keywords: ['lofoten', 'reine', 'sakrisoy', 'rorbuer', 'islands', 'surfing', 'hiking', 'archipelago']
  },
  {
    id: 'dest-flam',
    title: 'Flåm & Aurlandsfjord',
    description: 'Home to the world-famous Flåmsbana railway, Nærøyfjord cruises, and Stegastein panoramic viewpoint.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/flam',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600',
    badge: 'Scenic Railway',
    keywords: ['flam', 'flamsbana', 'train', 'railway', 'naeroyfjord', 'aurlandsfjord', 'stegastein']
  },
  {
    id: 'dest-bergen',
    title: 'Bergen — Hanseatic Fjord Gateway',
    description: 'Colorful wooden Hanseatic wharf at Bryggen, Mount Fløyen funicular, and gateway to western fjords.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/bergen',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600',
    badge: 'Hanseatic City',
    keywords: ['bergen', 'bryggen', 'floyen', 'funicular', 'fish market', 'west coast']
  },
  {
    id: 'dest-oslo',
    title: 'Oslo — Sustainable Smart Capital',
    description: 'Futuristic Barcode skyline, Opera House, Munch Museum, Vigeland Park, and green urban innovation.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/oslo',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600',
    badge: 'Smart Capital',
    keywords: ['oslo', 'capital', 'opera', 'munch', 'barcode', 'vigeland', 'smart city']
  },
  {
    id: 'dest-svalbard',
    title: 'Svalbard — High Arctic Wilderness',
    description: 'Glaciers, polar bears, northernmost settlements, global seed vault, and Arctic expeditions.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/svalbard',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
    badge: 'High Arctic',
    keywords: ['svalbard', 'longyearbyen', 'polar bear', 'glaciers', 'seed vault', 'arctic wilderness']
  },
  {
    id: 'dest-jotunheimen',
    title: 'Jotunheimen National Park — Realm of the Giants',
    description: 'Highest mountain range in Northern Europe, Galdhøpiggen, Besseggen ridge, and alpine tarns.',
    category: 'destinations',
    categoryLabel: 'Destination',
    path: '/explore/jotunheimen',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
    badge: 'Alpine Range',
    keywords: ['jotunheimen', 'galdhopiggen', 'mountains', 'glaciers', 'hiking', 'alpine']
  },

  // ── Hiking Trails ──────────────────────────────────────────────────────────
  {
    id: 'trail-preikestolen',
    title: 'Preikestolen (Pulpit Rock) Hike',
    description: 'Iconic flat-topped cliff rising 604 meters above Lysefjord. One of the world’s most scenic hiking vistas.',
    category: 'activities',
    categoryLabel: 'Hiking Trail',
    path: '/trails/preikestolen',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
    badge: 'Popular Trail',
    keywords: ['preikestolen', 'pulpit rock', 'lysefjord', 'stavanger', 'hike', 'cliff']
  },
  {
    id: 'trail-trolltunga',
    title: 'Trolltunga (Troll’s Tongue) Expedition',
    description: 'Spectacular rock formation hovering 700 meters above Lake Ringedalsvatnet in Odda.',
    category: 'activities',
    categoryLabel: 'Hiking Trail',
    path: '/trails/trolltunga',
    imageUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=600',
    badge: 'Challenging',
    keywords: ['trolltunga', 'trolls tongue', 'odda', 'ringedalsvatnet', 'epic hike']
  },
  {
    id: 'trail-besseggen',
    title: 'Besseggen Ridge Traverse',
    description: 'Famous mountain ridge separating deep emerald Lake Gjende from the icy blue Lake Bessvatnet.',
    category: 'activities',
    categoryLabel: 'Hiking Trail',
    path: '/trails/besseggen',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
    badge: 'Ridge Hike',
    keywords: ['besseggen', 'gjende', 'bessvatnet', 'jotunheimen', 'ridge hike']
  },

  // ── Experiences & Activities ───────────────────────────────────────────────
  {
    id: 'act-aurora',
    title: 'Aurora Borealis (Northern Lights) Tracker & Safari',
    description: 'Live geomagnetic forecasts, cloud cover tracking, and guided nighttime Arctic aurora chases.',
    category: 'activities',
    categoryLabel: 'Experience',
    path: '/aurora',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=600',
    badge: 'Live Forecast',
    keywords: ['aurora', 'northern lights', 'solar activity', 'forecast', 'tracker', 'tromso', 'night sky']
  },
  {
    id: 'act-fjord-kayak',
    title: 'Fjord Kayaking & Silent Electric Cruises',
    description: 'Paddle through serene UNESCO fjords or board emission-free catamaran cruises near towering cliffs.',
    category: 'activities',
    categoryLabel: 'Experience',
    path: '/activities',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600',
    badge: 'Eco Activity',
    keywords: ['kayak', 'kayaking', 'cruise', 'electric ferry', 'water sports', 'fjord tour']
  },
  {
    id: 'act-winter',
    title: 'Winter Sports & Alpine Ski Resorts',
    description: 'Explore world-class cross-country and downhill ski resorts at Hemsedal, Trysil, and Hafjell.',
    category: 'activities',
    categoryLabel: 'Experience',
    path: '/winter',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600',
    badge: 'Winter Sports',
    keywords: ['ski', 'skiing', 'snowboarding', 'trysil', 'hemsedal', 'winter sports', 'resort']
  },

  // ── Stays & Accommodations ────────────────────────────────────────────────
  {
    id: 'stay-fjord-cabin',
    title: 'Fjordview Eco Cabins & Glass Igloos',
    description: 'Immersive Scandinavian architecture with floor-to-ceiling glass panoramic views of fjords and auroras.',
    category: 'stays',
    categoryLabel: 'Stay',
    path: '/stay',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600',
    badge: 'Eco Luxury',
    keywords: ['stay', 'hotel', 'cabin', 'lodge', 'glass igloo', 'eco stay', 'accommodations', 'resort']
  },

  // ── Culinary & Dining ─────────────────────────────────────────────────────
  {
    id: 'food-farikal',
    title: 'Fårikål — Norway’s National Dish',
    description: 'Slow-cooked tender Norwegian lamb, layered with cabbage, whole black peppercorns, and potatoes.',
    category: 'food',
    categoryLabel: 'Norwegian Dish',
    path: '/food',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600',
    badge: 'National Dish',
    keywords: ['farikal', 'fårikål', 'lamb', 'cabbage', 'traditional food', 'norwegian dish', 'dinner']
  },
  {
    id: 'food-brunost',
    title: 'Brunost — Iconic Brown Cheese',
    description: 'Caramelized whey goat cheese with rich sweet, nutty, and savory notes. Served sliced with waffles.',
    category: 'food',
    categoryLabel: 'Norwegian Food',
    path: '/food',
    imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=600',
    badge: 'Heritage Food',
    keywords: ['brunost', 'brown cheese', 'geitost', 'waffles', 'cheese', 'breakfast']
  },
  {
    id: 'food-salmon',
    title: 'Gravlaks & Smoked Fjord Salmon',
    description: 'World-renowned cured Arctic fjord salmon dill, mustard sauce, and artisanal rye sourdough.',
    category: 'food',
    categoryLabel: 'Norwegian Food',
    path: '/food',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600',
    badge: 'Seafood',
    keywords: ['salmon', 'gravlaks', 'smoked salmon', 'fish', 'seafood', 'fjord salmon']
  },
  {
    id: 'food-restaurants',
    title: 'Michelin & Traditional Fjord Dining',
    description: 'Discover Norway’s top culinary destinations from Oslo’s Maaemo to traditional Bergen seafood taverns.',
    category: 'food',
    categoryLabel: 'Dining',
    path: '/food',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600',
    badge: 'Gastronomy',
    keywords: ['restaurant', 'dining', 'michelin', 'maaemo', 'speilsalen', 'fine dining', 'food']
  },

  // ── Wildlife & Fauna ──────────────────────────────────────────────────────
  {
    id: 'wild-moose',
    title: 'Eurasian Elk / Moose (Elg) — King of the Forest',
    description: 'Majestic boreal giant inhabiting Norway’s taiga pine forests with impressive palmate antlers.',
    category: 'wildlife',
    categoryLabel: 'Wildlife',
    path: '/wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1543946602-a0fce8117697?q=80&w=600',
    badge: 'King of Forest',
    keywords: ['moose', 'elk', 'elg', 'wildlife', 'forest', 'animals', 'taiga']
  },
  {
    id: 'wild-arctic-fox',
    title: 'Arctic Fox (Fjellrev)',
    description: 'Resilient high-altitude predator in Dovrefjell and Svalbard with thick snow-white winter coat.',
    category: 'wildlife',
    categoryLabel: 'Wildlife',
    path: '/wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80&w=600',
    badge: 'Protected',
    keywords: ['arctic fox', 'fjellrev', 'fox', 'dovrefjell', 'svalbard', 'animals']
  },
  {
    id: 'wild-reindeer',
    title: 'Wild Mountain Reindeer (Villrein)',
    description: 'Hardangervidda herds representing Europe’s largest remaining wild mountain reindeer population.',
    category: 'wildlife',
    categoryLabel: 'Wildlife',
    path: '/wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
    badge: 'Wild Herd',
    keywords: ['reindeer', 'villrein', 'hardangervidda', 'tundra', 'wildlife']
  },
  {
    id: 'wild-lynx',
    title: 'Eurasian Lynx (Gaupe)',
    description: 'Solitary, elusive apex feline inhabiting old-growth boreal forests with distinctive tufted ears.',
    category: 'wildlife',
    categoryLabel: 'Wildlife',
    path: '/wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=600',
    badge: 'Predator',
    keywords: ['lynx', 'gaupe', 'cat', 'predator', 'taiga', 'wildlife']
  },
  {
    id: 'wild-puffin',
    title: 'Atlantic Puffin (Lunde)',
    description: 'Colorful pelagic seabird nesting on coastal bird cliffs at Runde, Røst, and Bleik.',
    category: 'wildlife',
    categoryLabel: 'Wildlife',
    path: '/wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600',
    badge: 'Seabird',
    keywords: ['puffin', 'lunde', 'runde', 'rost', 'birds', 'coastal']
  },

  // ── Flora & Botany ────────────────────────────────────────────────────────
  {
    id: 'flora-spruce',
    title: 'Norway Spruce (Gran — Picea abies)',
    description: 'Cornerstone evergreen conifer of the Scandinavian boreal biome, supporting forest ecosystems.',
    category: 'flora',
    categoryLabel: 'Flora',
    path: '/flora',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
    badge: 'Native Tree',
    keywords: ['spruce', 'gran', 'trees', 'forest', 'conifer', 'plants', 'flora']
  },
  {
    id: 'flora-cloudberry',
    title: 'Cloudberry (Multe — Rubus chamaemorus)',
    description: 'Known as "Arctic Gold", this prized amber wild berry thrives in high-latitude peat bogs.',
    category: 'flora',
    categoryLabel: 'Flora',
    path: '/flora',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
    badge: 'Arctic Gold',
    keywords: ['cloudberry', 'multe', 'berries', 'bog', 'plants', 'arctic gold']
  },

  // ── Smart Tech, Infrastructure & IoT ──────────────────────────────────────
  {
    id: 'tech-ev',
    title: 'EV Fast-Charging & Supercharger Network',
    description: 'Interactive map of Norway’s nationwide ultra-fast electric vehicle charging stations and live plug status.',
    category: 'smart_tech',
    categoryLabel: 'Smart Tech',
    path: '/mobility/ev',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-5838084a9561?q=80&w=600',
    badge: 'Live Map',
    keywords: ['ev', 'electric vehicle', 'charging', 'supercharger', 'tesla', 'fast charger', 'mobility']
  },
  {
    id: 'tech-iot',
    title: 'IoT Sensor Network & Live Environmental Dashboard',
    description: 'Real-time telemetry on mountain pass temperatures, air quality, fjord currents, and road webcam conditions.',
    category: 'smart_tech',
    categoryLabel: 'Smart Tech',
    path: '/infrastructure/iot',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600',
    badge: 'Real-time IoT',
    keywords: ['iot', 'sensors', 'telemetry', 'weather station', 'temperature', 'live dashboard', 'smart city']
  },
  {
    id: 'tech-energy',
    title: 'National Green Energy & Hydro Grid Dashboard',
    description: 'Track Norway’s 98% renewable hydropower output, wind farm generation, and smart battery storage.',
    category: 'smart_tech',
    categoryLabel: 'Smart Tech',
    path: '/infrastructure/energy',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=600',
    badge: 'Renewables',
    keywords: ['energy', 'hydro', 'hydropower', 'wind', 'solar', 'green grid', 'sustainability']
  },

  // ── Smart Life Tools & Pages ──────────────────────────────────────────────
  {
    id: 'page-planner',
    title: 'AI Smart Trip Planner & Itinerary Builder',
    description: 'Generate personalized, eco-conscious day-by-day travel itineraries optimized for season and pace.',
    category: 'pages',
    categoryLabel: 'Tool',
    path: '/planner',
    badge: 'AI Powered',
    keywords: ['planner', 'itinerary', 'trip planner', 'ai', 'custom trip', 'schedule']
  },
  {
    id: 'page-map',
    title: 'Interactive National Fjord & City Map',
    description: 'Explore Norway with high-resolution satellite layers, hiking tracks, scenic routes, and ferry lines.',
    category: 'pages',
    categoryLabel: 'Tool',
    path: '/map',
    badge: 'Interactive',
    keywords: ['map', 'interactive map', 'satellite', 'routes', 'navigation', 'gis']
  },
  {
    id: 'page-weather',
    title: 'Live Weather & Yr.no Forecasts',
    description: 'Real-time meteorological updates, mountain wind warnings, precipitation radars, and sunrise/sunset times.',
    category: 'pages',
    categoryLabel: 'Tool',
    path: '/weather',
    badge: 'Live Radar',
    keywords: ['weather', 'forecast', 'radar', 'temperature', 'rain', 'snow', 'wind']
  },
  {
    id: 'page-impact',
    title: 'Eco Calculator & Personal Sustainability Score',
    description: 'Calculate your travel carbon footprint, track EV vs transit emissions, and offset impact with verified rewilding.',
    category: 'pages',
    categoryLabel: 'Tool',
    path: '/impact',
    badge: 'Sustainability',
    keywords: ['impact', 'carbon', 'calculator', 'eco', 'emissions', 'sustainability']
  },
  {
    id: 'page-deals',
    title: 'Exclusive Travel Deals & Seasonal Packages',
    description: 'Save on curated winter expeditions, fjord boat rentals, guided wildlife safaris, and luxury stays.',
    category: 'pages',
    categoryLabel: 'Deals',
    path: '/deals',
    badge: 'Discounts',
    keywords: ['deals', 'discounts', 'offers', 'packages', 'specials', 'savings']
  },
  {
    id: 'page-shop',
    title: 'Sustainable Nordic Shop & Gear',
    description: 'Shop authentic Norwegian wool sweaters, outdoor equipment, solar chargers, and local artisanal gifts.',
    category: 'shop',
    categoryLabel: 'Shop',
    path: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600',
    badge: 'Eco Gear',
    keywords: ['shop', 'products', 'gear', 'wool', 'sweater', 'equipment', 'store']
  }
];

export const searchService = {
  /**
   * Search through local index and remote Supabase global search with instant fuzzy matching.
   */
  async search(query: string, category: SearchCategory = 'all'): Promise<SearchItem[]> {
    if (!query || query.trim().length === 0) return [];
    
    const cleanQuery = query.toLowerCase().trim();
    const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);

    // 1. Filter local static index
    let localMatches = STATIC_SEARCH_INDEX.filter(item => {
      // Check category match
      if (category !== 'all' && item.category !== category) return false;

      const titleMatch = queryTerms.some(term => item.title.toLowerCase().includes(term));
      const descMatch = queryTerms.some(term => item.description.toLowerCase().includes(term));
      const keywordMatch = queryTerms.some(term => 
        item.keywords.some(k => k.toLowerCase().includes(term))
      );

      return titleMatch || descMatch || keywordMatch;
    });

    // Score and rank matches (exact title matches first)
    localMatches = localMatches.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(cleanQuery) ? 2 : 1;
      const bExact = b.title.toLowerCase().includes(cleanQuery) ? 2 : 1;
      return bExact - aExact;
    });

    // 2. Attempt remote Supabase RPC search in parallel (graceful fallback if offline)
    try {
      const { data, error } = await supabase.rpc('global_search' as any, {
        search_query: cleanQuery,
        filter_category: category === 'all' ? undefined : category,
        limit_count: 10
      });

      if (!error && Array.isArray(data)) {
        const remoteItems: SearchItem[] = data.map((d: any) => ({
          id: d.entity_id || `rem-${d.slug}`,
          title: d.title,
          description: d.description || '',
          category: (d.entity_type || 'pages') as SearchCategory,
          categoryLabel: d.entity_type || 'Result',
          path: d.slug?.startsWith('/') ? d.slug : `/${d.slug}`,
          imageUrl: d.hero_image_url,
          keywords: [d.title.toLowerCase()]
        }));

        // Merge remote items avoiding duplicate paths
        const existingPaths = new Set(localMatches.map(m => m.path));
        remoteItems.forEach(item => {
          if (!existingPaths.has(item.path)) {
            localMatches.push(item);
          }
        });
      }
    } catch {
      // Fallback seamlessly on local matches
    }

    return localMatches;
  },

  /**
   * Save search query to recent search history in localStorage
   */
  saveRecentSearch(query: string) {
    if (typeof window === 'undefined' || !query.trim()) return;
    try {
      const existing: string[] = JSON.parse(localStorage.getItem('norway_recent_searches') || '[]');
      const filtered = existing.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query.trim(), ...filtered].slice(0, 6);
      localStorage.setItem('norway_recent_searches', JSON.stringify(updated));
    } catch {}
  },

  /**
   * Retrieve recent search queries from localStorage
   */
  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('norway_recent_searches') || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Clear recent search history
   */
  clearRecentSearches() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('norway_recent_searches');
    } catch {}
  }
};
