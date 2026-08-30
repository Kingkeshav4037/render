import { supabase } from '../lib/supabase';

export interface FloraSpecies {
  id: string;
  slug: string;
  common_name: string;
  norwegian_name: string;
  scientific_name: string;
  latin_name?: string;
  category: 'Trees' | 'Alpine' | 'Berries' | 'Wildflowers' | 'Orchids' | string;
  habitat: string;
  distribution_region: string;
  flowering_season: string;
  blooming_season?: string;
  foraging_status: 'Edible & Forageable' | 'Protected - Do Not Pick' | 'Medicinal' | 'Non-Edible' | string;
  conservation_status: string;
  is_protected?: boolean;
  description: string;
  ecological_role: string;
  traditional_uses?: string;
  foraging_tips?: string;
  image_url: string;
}

export const FALLBACK_FLORA: FloraSpecies[] = [
  {
    id: 'f1',
    slug: 'scots-pine',
    common_name: 'Scots Pine',
    norwegian_name: 'Furu',
    scientific_name: 'Pinus sylvestris',
    category: 'Trees',
    habitat: 'Boreal coniferous forests and rocky terrain',
    distribution_region: 'Nationwide, up to 1000m altitude',
    flowering_season: 'May - June (Pollen)',
    foraging_status: 'Edible & Forageable',
    conservation_status: 'Least Concern',
    description: 'The Scots Pine is the dominant evergreen conifer of the Norwegian taiga, renowned for its reddish-orange upper bark, twisted crown, and resilient timber that has built Stave churches for a millennium.',
    ecological_role: 'Provides critical habitat for Western Capercaillie, Pine Martens, and Red Squirrels.',
    traditional_uses: 'Needles used for vitamin C-rich tea by Sami and Norse settlers.',
    foraging_tips: 'Harvest tender young green needles in spring for herbal tea.',
    image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=scots+pine+norway&w=1080'
  },
  {
    id: 'f2',
    slug: 'norway-spruce',
    common_name: 'Norway Spruce',
    norwegian_name: 'Gran',
    scientific_name: 'Picea abies',
    category: 'Trees',
    habitat: 'Deep taiga valleys and moist mountain slopes',
    distribution_region: 'Eastern Norway, Trøndelag, Central Highlands',
    flowering_season: 'May - June',
    foraging_status: 'Edible & Forageable',
    conservation_status: 'Least Concern',
    description: 'The quintessential Scandinavian forest giant, growing tall with drooping branchlets and resinous needle scent.',
    ecological_role: 'Forms dense canopy cover sheltering forest fauna during severe Nordic blizzards.',
    traditional_uses: 'Spruce shoot syrup (granskuddsirup) is a beloved Norwegian culinary delicacy.',
    foraging_tips: 'Pick tender neon-green spring shoots in May/June for syrups and infusions.',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=norway+spruce+forest&w=1080'
  },
  {
    id: 'f3',
    slug: 'cloudberry',
    common_name: 'Cloudberry',
    norwegian_name: 'Molte',
    scientific_name: 'Rubus chamaemorus',
    category: 'Berries',
    habitat: 'Arctic peat bogs, sphagnum moss mires, alpine tundra',
    distribution_region: 'Northern Norway, Finnmark, Dovrefjell, Hardangervidda',
    flowering_season: 'June (Berries: July - August)',
    foraging_status: 'Edible & Forageable',
    conservation_status: 'Least Concern',
    description: 'Revered across Scandinavia as "Arctic Gold", the cloudberry is an amber-orange jewel that grows singularly on delicate low creeping plants in remote peat bogs.',
    ecological_role: 'Provides high-energy nutrition to Arctic migratory birds and voles.',
    traditional_uses: 'Served as the centerpiece Norwegian Christmas dessert "Multekrem" (whipped cream with fresh cloudberries).',
    foraging_tips: 'Look for translucent golden-apricot berries that slip easily off their calyx.',
    image_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=cloudberries+norway&w=1080'
  },
  {
    id: 'f4',
    slug: 'lingonberry',
    common_name: 'Lingonberry',
    norwegian_name: 'Tyttebær',
    scientific_name: 'Vaccinium vitis-idaea',
    category: 'Berries',
    habitat: 'Dry pine forests, heathlands, and mossy mountain crags',
    distribution_region: 'Nationwide, abundant in coniferous forests',
    flowering_season: 'June - July (Berries: Aug - Oct)',
    foraging_status: 'Edible & Forageable',
    conservation_status: 'Least Concern',
    description: 'A low evergreen dwarf shrub with glossy leathery leaves and tart, ruby-red berries.',
    ecological_role: 'Primary late-autumn foraging food for Brown Bears, Moose, and forest birds.',
    traditional_uses: 'Stirred raw with sugar into "Rørte tyttebær", the companion to Norwegian meatballs.',
    foraging_tips: 'Easy to pick in late August with a traditional berry-picker comb under Allemannsretten.',
    image_url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=lingonberries+forest&w=1080'
  },
  {
    id: 'f5',
    slug: 'bilberry',
    common_name: 'Wild Bilberry',
    norwegian_name: 'Blåbær',
    scientific_name: 'Vaccinium myrtillus',
    category: 'Berries',
    habitat: 'Moist acidic forest floors and mountain slopes',
    distribution_region: 'Nationwide, from south coast to 1200m altitude',
    flowering_season: 'May - June (Berries: July - Sept)',
    foraging_status: 'Edible & Forageable',
    conservation_status: 'Least Concern',
    description: 'Wild Norwegian bilberries have intense blue-black skins and deeply pigmented violet-red flesh brimming with antioxidants.',
    ecological_role: 'Keystone understory plant supporting bumblebees in spring.',
    traditional_uses: 'Eaten fresh with cold whole milk, baked into summer tarts, or preserved as blueberry jam.',
    foraging_tips: 'Pick throughout late July and August in acidic forest clearings.',
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=wild+blueberries+norway&w=1080'
  },
  {
    id: 'f6',
    slug: 'glacier-buttercup',
    common_name: 'Glacier Buttercup',
    norwegian_name: 'Issoleie',
    scientific_name: 'Ranunculus glacialis',
    category: 'Alpine',
    habitat: 'Glacial moraines, alpine snowbeds, high summits',
    distribution_region: 'Jotunheimen, Dovrefjell, High Arctic Svalbard',
    flowering_season: 'July - August',
    foraging_status: 'Protected - Do Not Pick',
    conservation_status: 'Least Concern',
    description: 'The highest-altitude flowering plant in northern Europe, blooming directly against permanent ice fields at over 2,300 meters on Galdhøpiggen.',
    ecological_role: 'Produces antifreeze proteins allowing its cells to survive freezing nightly summer blizzards.',
    traditional_uses: 'Symbol of alpine resilience and high-mountain Norwegian mountaineering heritage.',
    foraging_tips: 'Strictly observe Leave No Trace principles; alpine tundra plants take decades to recover.',
    image_url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=ranunculus+glacialis+alpine+buttercup+flower&w=1080'
  },
  {
    id: 'f7',
    slug: 'mountain-avens',
    common_name: 'Mountain Avens',
    norwegian_name: 'Reinrose',
    scientific_name: 'Dryas octopetala',
    category: 'Alpine',
    habitat: 'Dry limestone mountain heaths and Arctic tundra ridges',
    distribution_region: 'Dovrefjell, Jotunheimen, Troms, Svalbard',
    flowering_season: 'June - July',
    foraging_status: 'Protected - Do Not Pick',
    conservation_status: 'Least Concern',
    description: 'An Arctic-alpine evergreen dwarf shrub with eight-petaled pure white blossoms that track the midnight sun across the sky.',
    ecological_role: 'Fixes atmospheric nitrogen in barren limestone soils, creating fertile footholds.',
    traditional_uses: 'Official county flower of historic Oppland; famous paleoclimatological marker.',
    foraging_tips: 'Look for circular blooming mats on sun-exposed rocky limestone outcrops.',
    image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?q=mountain+avens+flower&w=1080'
  },
  {
    id: 'f8',
    slug: 'ladys-slipper',
    common_name: 'Lady\'s Slipper Orchid',
    norwegian_name: 'Marisko',
    scientific_name: 'Cypripedium calceolus',
    category: 'Orchids',
    habitat: 'Calcareous beech and pine forests, marshy woodland clearings',
    distribution_region: 'Eastern Norway (Ringerike, Snåsa), Trøndelag, Nordland',
    flowering_season: 'Late May - June',
    foraging_status: 'Protected - Do Not Pick',
    conservation_status: 'Vulnerable (Strictly Protected)',
    description: 'Norway\'s largest and most flamboyant wild orchid, featuring an inflated golden-yellow slipper pouch framed by four twisted maroon-purple sepals.',
    ecological_role: 'Highly specialized mycorrhizal symbiosis with soil fungi required for germination.',
    traditional_uses: 'Crown jewel of Norwegian botanical photography. Completely protected by law.',
    foraging_tips: 'Strictly protected under Norwegian law. Photograph from designated boardwalks only.',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=yellow+wild+orchid&w=1080'
  }
];

export const floraService = {
  async getAllFlora(): Promise<FloraSpecies[]> {
    try {
      const { data, error } = await (supabase.from as any)('flora_species')
        .select('*')
        .order('common_name', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_FLORA;
      }
      return data as FloraSpecies[];
    } catch {
      return FALLBACK_FLORA;
    }
  },

  async getFloraBySlug(slug: string): Promise<FloraSpecies | null> {
    try {
      const { data, error } = await (supabase.from as any)('flora_species')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return FALLBACK_FLORA.find(f => f.slug === slug) || null;
      }
      return data as FloraSpecies;
    } catch {
      return FALLBACK_FLORA.find(f => f.slug === slug) || null;
    }
  }
};
