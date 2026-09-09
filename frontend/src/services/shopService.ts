import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

export type ProductRow = Database['public']['Tables']['products']['Row'];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  co2: number;
  img: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  features: string[];
  materials: string;
  origin: string;
  warranty: string;
  created_at?: string;
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-thermostat-1',
    name: 'Smart Eco Thermostat',
    category: 'Smart Home',
    price: 1890,
    rating: 4.9,
    stock: 24,
    co2: -15.4,
    img: '/images/product_thermostat.jpg',
    gallery: [
      '/images/product_thermostat.jpg',
      '/images/product_thermostat_1786938541155.jpg',
      '/images/infra_windfarm.jpg'
    ],
    description: 'Precision Nordic climate thermostat engineered for extreme sub-zero weather. Automatically synchronizes with Nord Pool hourly electricity spot prices to heat your home when renewable energy is cleanest and cheapest.',
    specs: {
      'Connectivity': 'Zigbee 3.0, Thread & Matter Over WiFi',
      'Display': 'Ambient OLED High-Contrast Nordic Glass',
      'Power': '24V C-Wire or 2-Year Lithium Backup',
      'Operating Temp': '-35°C to +45°C'
    },
    features: [
      'Nord Pool dynamic hourly price optimization',
      'Window-open rapid cooling detection',
      'Fjord-air humidity and VOC air quality sensing',
      'Zero subscription fees or telemetry lock-in'
    ],
    materials: '98% Recycled Anodized Aluminium & Bio-Circular Resin',
    origin: 'Kongsberg, Norway',
    warranty: '5-Year Scandinavian Quality Guarantee'
  },
  {
    id: 'prod-ev-cable-2',
    name: 'EV Smart Cable 22kW',
    category: 'EV Accessories',
    price: 3490,
    rating: 4.8,
    stock: 12,
    co2: -24.8,
    img: '/images/ev_charging_cable.jpg',
    gallery: [
      '/images/ev_charging_cable.jpg',
      '/images/type2_charging_cable.jpg',
      '/images/ev_charger.jpg'
    ],
    description: 'Heavy-duty 3-Phase Type 2 EV charging cable custom formulated with arctic-flex elastomer that stays completely supple down to -40°C. Includes integrated LED status illumination and smart cable lock.',
    specs: {
      'Max Power': '22 kW (3-Phase 32A / 400V)',
      'Length': '7.5 Meters High-Flexibility',
      'Ingress Protection': 'IP67 Waterproof & Submersion Resistant',
      'Connector': 'Type 2 to Type 2 Silver Plated'
    },
    features: [
      'Arctic-flex rubber stays flexible in freezing blizzards',
      'Integrated lock protection against unauthorized disconnects',
      'Ergonomic grip handles with integrated LED flashlight',
      'Includes recycled ocean-plastic carrying pouch'
    ],
    materials: 'Halogen-Free Thermoplastic Polyurethane & Recycled Copper',
    origin: 'Raufoss Industrial Park, Norway',
    warranty: '3-Year Arctic Durability Guarantee'
  },
  {
    id: 'prod-wool-thermal-3',
    name: 'Nordic Wool Thermal Layer',
    category: 'Outdoor Gear',
    price: 1290,
    rating: 5.0,
    stock: 18,
    co2: -8.2,
    img: '/images/merino_wool_top.jpg',
    gallery: [
      '/images/merino_wool_top.jpg',
      '/images/merino_base_layer.jpg',
      '/images/wool_thermal_top.jpg'
    ],
    description: '100% Norwegian free-grazing sheep wool base layer. Delivers superior thermo-regulation, natural antimicrobial odor resistance, and breathability during intense fjord treks and arctic ski touring.',
    specs: {
      'Fiber Micron': '18.5 Ultra-Fine Non-Scratch',
      'Fabric Weight': '260 g/m² Midweight Warmth',
      'Seams': 'Flatlock Non-Chafing Ergonomic Lines',
      'Care': 'Machine Washable on Wool Cycle'
    },
    features: [
      'Natural body temperature micro-climate regulation',
      'Naturally flame-retardant and moisture-wicking',
      'Extended tail drop for cycling and snow protection',
      'Thumb loops for easy cold-weather glove layering'
    ],
    materials: '100% Certified Norwegian Virgin Grazed Wool',
    origin: 'Dale & Voss, Western Norway',
    warranty: 'Lifetime Craftsmanship Guarantee'
  },
  {
    id: 'prod-solar-pack-4',
    name: 'Solar Adventure Pack 45L',
    category: 'Outdoor Gear',
    price: 2490,
    rating: 4.7,
    stock: 8,
    co2: -19.5,
    img: '/images/chrome_travel_backpack.jpg',
    gallery: [
      '/images/chrome_travel_backpack.jpg',
      '/images/travel_backpack.jpg',
      '/images/besseggen_1786936349992.jpg'
    ],
    description: 'Rugged expedition backpack featuring integrated SunPower 24W ETFE flexible solar panel cells with dual USB-C Power Delivery outputs. Keeps navigation devices and cameras charged on multi-day backcountry trails.',
    specs: {
      'Solar Panel': '24W SunPower ETFE Flexible Photovoltaic',
      'Charging Ports': 'Dual USB-C PD (30W Output) + USB-A QuickCharge',
      'Volume': '45 Liters (Expandable to 52L)',
      'Total Weight': '1.35 kg'
    },
    features: [
      'Waterproof roll-top storm compartment with YKK AquaGuard zippers',
      'Ergonomic floating mesh back suspension system',
      'Integrated survival whistle and high-visibility rain fly',
      'Dedicated hydration reservoir compartment'
    ],
    materials: '100% Ocean-Bound Recycled 420D Ripstop Nylon',
    origin: 'Stavanger, Norway',
    warranty: '5-Year Backcountry Warranty'
  },
  {
    id: 'prod-kuksa-5',
    name: 'Fjord Handcrafted Birch Kuksa',
    category: 'Lifestyle',
    price: 490,
    rating: 4.9,
    stock: 35,
    co2: -3.5,
    img: '/images/norwegian_gift.jpg',
    gallery: [
      '/images/norwegian_gift.jpg',
      '/images/product_gift_set.jpg'
    ],
    description: 'Traditional Sami-style carved wooden cup carved from sustainably harvested Arctic birch burls. Finished with organic beeswax and pure linseed oil for enjoying morning campfire coffee overlooking the fjords.',
    specs: {
      'Capacity': '220 ml (7.5 fl oz)',
      'Weight': '140 grams',
      'Cord': 'Genuine Reindeer Leather Lanyard',
      'Finish': 'Food-Grade Arctic Beeswax & Flax Oil'
    },
    features: [
      'Hand-carved from natural birch burls — each piece is unique',
      'Naturally insulating: maintains beverage temperature without burning hands',
      'Ergonomic dual-finger grip handle',
      'Ages gracefully with a rich patina over decades of use'
    ],
    materials: 'Sustainably Foraged Arctic Birch Burl & Reindeer Leather',
    origin: 'Karasjok, Northern Norway',
    warranty: 'Lifetime Authentic Craftsmanship'
  },
  {
    id: 'prod-bottle-6',
    name: 'Hardanger Vacuum Flask 1.0L',
    category: 'Lifestyle',
    price: 590,
    rating: 4.8,
    stock: 40,
    co2: -6.0,
    img: '/images/voss_water_bottles.jpg',
    gallery: [
      '/images/voss_water_bottles.jpg',
      '/images/voss_glass_bottles.jpg'
    ],
    description: 'Double-wall vacuum insulated flask made from 18/8 food-grade Swedish stainless steel with a natural FSC-certified oak cap. Keeps coffee piping hot for 24 hours or mountain spring water glacier-cold for 36 hours.',
    specs: {
      'Volume': '1000 ml (34 oz)',
      'Thermal Performance': '24 Hours Hot / 36 Hours Ice-Cold',
      'Diameter': '84 mm (Fits Standard Car & Bike Bottle Cages)',
      'Cap': 'FSC Oak & Silicone Seal (100% Leakproof)'
    },
    features: [
      'Zero condensation sweat exterior with powder-coat matte grip',
      'BPA, BPS and phthalate free',
      'Wide mouth fits full ice cubes and camp brewing filters',
      'Laser-etched topography of the Hardangerfjord'
    ],
    materials: '18/8 Pro-Grade Stainless Steel & Natural Norwegian Oak',
    origin: 'Hardanger, Norway',
    warranty: '10-Year Thermal Guarantee'
  },
  {
    id: 'prod-aurora-light-7',
    name: 'Arctic Aurora Ambient Smart Light',
    category: 'Smart Home',
    price: 1490,
    rating: 4.9,
    stock: 15,
    co2: -11.0,
    img: '/images/northern_lights_1786935879330.jpg',
    gallery: [
      '/images/northern_lights_1786935879330.jpg',
      '/images/aurora_borealis_1787013684123.jpg'
    ],
    description: 'Smart ambient mood lamp that synchronizes in real time with live Tromsø space weather sensors. Emulates the mesmerizing undulating ribbons of the Northern Lights (Aurora Borealis) in your living space.',
    specs: {
      'LED Array': 'Full Spectrum RGBW (16 Million Hues)',
      'Luminous Flux': '1200 Lumens Dimmable',
      'Integration': 'Matter, HomeKit, Google Home & Home Assistant',
      'Sensors': 'Integrated Ambient Light & Live KP-Index Telemetry'
    },
    features: [
      'Live Aurora Tracker mode pulses dynamically when solar storms hit Norway',
      'Circadian rhythm wake-up cycle simulating Nordic dawn',
      'Sleek frosted blown glass dome on blackened ash wood base',
      'Ultra-low 8W peak energy consumption'
    ],
    materials: 'Hand-blown Scandinavian Glass & Blackened Ash Wood',
    origin: 'Tromsø, Norway',
    warranty: '3-Year Smart Tech Warranty'
  },
  {
    id: 'prod-battery-warmer-8',
    name: 'Sub-Zero EV Battery Thermal Blanket',
    category: 'EV Accessories',
    price: 2190,
    rating: 4.6,
    stock: 7,
    co2: -31.2,
    img: '/images/ev_charger.jpg',
    gallery: [
      '/images/ev_charger.jpg',
      '/images/wall_ev_charger.jpg',
      '/images/smart_home_energy_system.jpg'
    ],
    description: 'Smart aerogel thermal insulation cover designed to preserve EV battery range during sub-zero overnight parking. Reduces cold-soak winter range loss by up to 28% without requiring grid pre-heating.',
    specs: {
      'Insulation': 'Space-Grade Silica Aerogel + Thermal Reflective Foil',
      'Compatibility': 'Universal EV undercarriage sizing (Tesla, VW, Audi, Polestar, Nissan)',
      'Temp Range': '-45°C to +80°C',
      'Weight': '2.1 kg'
    },
    features: [
      'Reduces cold-start battery resistance and preserves regenerative braking',
      'Quick-release magnetic mounting clips for 60-second installation',
      'Resistant to road salt, grit, ice slush and heavy moisture',
      'Folds into compact under-trunk storage pouch'
    ],
    materials: 'Silica Aerogel composite, Kevlar-reinforced ballistic nylon',
    origin: 'Trondheim, Norway',
    warranty: '5-Year Arctic Road Guarantee'
  }
];

export const shopService = {
  /**
   * Fetch all products with optional category, search, and sorting
   */
  async getProducts(params?: {
    category?: string;
    search?: string;
    sortBy?: string;
  }): Promise<{ data: Product[]; error: string | null }> {
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('products')
        .select('*');

      let list: Product[] = [];

      if (!dbError && dbData && dbData.length > 0) {
        // Map database products and merge rich metadata
        list = dbData.map((row) => {
          const matchedFallback = FALLBACK_PRODUCTS.find(
            (fb) => fb.id === row.id || fb.name.toLowerCase() === row.name.toLowerCase()
          );

          return {
            id: row.id,
            name: row.name,
            category: row.category,
            price: Number(row.price),
            rating: Number(row.rating || 4.8),
            stock: Number(row.stock ?? 15),
            co2: Number(row.co2 || -10),
            img: row.img || matchedFallback?.img || '/images/smart_energy_monitor.jpg',
            gallery: matchedFallback?.gallery || [row.img || '/images/smart_energy_monitor.jpg'],
            description: matchedFallback?.description || `High-quality sustainable ${row.category} engineered in Norway.`,
            specs: matchedFallback?.specs || { 'Standard': 'Nordic Swan Certified', 'Origin': 'Norway' },
            features: matchedFallback?.features || ['Engineered for extreme Nordic climate', 'Sustainable materials'],
            materials: matchedFallback?.materials || 'Eco-certified recyclable composite',
            origin: matchedFallback?.origin || 'Norway',
            warranty: matchedFallback?.warranty || '2-Year Nordic Warranty',
            created_at: row.created_at
          };
        });
      } else {
        // Use rich curated fallback catalog
        list = [...FALLBACK_PRODUCTS];
      }

      // Apply category filter
      if (params?.category && params.category !== 'All') {
        list = list.filter(
          (p) => p.category.toLowerCase() === params.category?.toLowerCase()
        );
      }

      // Apply search query
      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      // Apply sorting
      if (params?.sortBy === 'Price: Low to High') {
        list.sort((a, b) => a.price - b.price);
      } else if (params?.sortBy === 'Price: High to Low') {
        list.sort((a, b) => b.price - a.price);
      } else if (params?.sortBy === 'Top Rated') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (params?.sortBy === 'Eco Impact') {
        list.sort((a, b) => Math.abs(b.co2) - Math.abs(a.co2));
      }

      return { data: list, error: null };
    } catch (err: any) {
      console.error('shopService.getProducts error:', err);
      // Even on exception, guarantee rich fallback data
      let list = [...FALLBACK_PRODUCTS];
      if (params?.category && params.category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }
      return { data: list, error: null };
    }
  },

  /**
   * Fetch a single product by ID or slug
   */
  async getProductById(id: string): Promise<Product | null> {
    if (!id) return null;

    try {
      // 1. Check database first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data && !error) {
        const matchedFallback = FALLBACK_PRODUCTS.find(
          (fb) => fb.id === data.id || fb.name.toLowerCase() === data.name.toLowerCase()
        );
        return {
          id: data.id,
          name: data.name,
          category: data.category,
          price: Number(data.price),
          rating: Number(data.rating || 4.8),
          stock: Number(data.stock ?? 15),
          co2: Number(data.co2 || -10),
          img: data.img || matchedFallback?.img || '/images/smart_energy_monitor.jpg',
          gallery: matchedFallback?.gallery || [data.img || '/images/smart_energy_monitor.jpg'],
          description: matchedFallback?.description || `High-quality sustainable ${data.category} engineered in Norway.`,
          specs: matchedFallback?.specs || { 'Standard': 'Nordic Swan Certified', 'Origin': 'Norway' },
          features: matchedFallback?.features || ['Engineered for extreme Nordic climate', 'Sustainable materials'],
          materials: matchedFallback?.materials || 'Eco-certified recyclable composite',
          origin: matchedFallback?.origin || 'Norway',
          warranty: matchedFallback?.warranty || '2-Year Nordic Warranty',
          created_at: data.created_at
        };
      }
    } catch (e) {
      console.warn('shopService.getProductById db fetch error:', e);
    }

    // 2. Fallback search
    const fallback = FALLBACK_PRODUCTS.find(
      (p) =>
        p.id === id ||
        p.name.toLowerCase().replace(/\s+/g, '-').includes(id.toLowerCase()) ||
        id.toLowerCase().includes(p.name.toLowerCase().replace(/\s+/g, '-'))
    );

    return fallback || null;
  },

  /**
   * Retrieve related products in the same category
   */
  async getRelatedProducts(productId: string, category: string, limit = 4): Promise<Product[]> {
    const { data } = await this.getProducts({ category });
    return data.filter((p) => p.id !== productId).slice(0, limit);
  }
};
