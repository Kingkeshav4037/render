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

// Map product keywords/names to authentic Norwegian local photos uploaded in public/images
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Smart Home
  'nordic eco-stat thermostat':     '/images/product_thermostat.jpg',
  'smart eco thermostat':          '/images/product_thermostat.jpg',
  'thermostat':                    '/images/product_thermostat.jpg',
  'mill wi-fi panel heater':       '/images/mill_smart_heater.jpg',
  'panel heater':                  '/images/mill_smart_heater.jpg',
  'heater':                        '/images/mill_smart_heater.jpg',
  'airify smart air purifier':     '/images/smart_air_purifier.jpg',
  'smart air purifier':            '/images/smart_air_purifier.jpg',
  'air purifier':                  '/images/smart_air_purifier.jpg',
  'purifier':                      '/images/smart_air_purifier.jpg',
  'smart blinds controller':       '/images/smart_blinds_motor.jpg',
  'blinds controller':             '/images/smart_blinds_motor.jpg',
  'curtain':                       '/images/smart_curtain_motor.jpg',
  'blind':                         '/images/smart_blinds_motor.jpg',
  'smart grid energy monitor':     '/images/smart_electricity_meter.jpg',
  'energy monitor':                '/images/smart_electricity_meter.jpg',
  'smart meter':                   '/images/smart_electricity_meter.jpg',
  'meter':                         '/images/smart_electricity_meter.jpg',
  'smart plant moisture sensor':   '/images/soil_moisture_sensor.jpg',
  'plant sensor':                  '/images/soil_moisture_sensor.jpg',
  'soil moisture':                 '/images/soil_moisture_sensor.jpg',
  'sensor':                        '/images/soil_moisture_sensor.jpg',
  'aura solar pathway lights':     '/images/smart_garden_sensor.jpg',
  'pathway lights':                '/images/smart_garden_sensor.jpg',
  'arctic aurora ambient smart light': '/images/northern_lights_1786935879330.jpg',
  'aurora':                        '/images/northern_lights_1786935879330.jpg',
  'shower':                        '/images/hansgrohe_shower_mixer.jpg',

  // EV Accessories
  'zaptec go ev charger':          '/images/product_charger.jpg',
  'zaptec':                        '/images/product_charger.jpg',
  'easee home ev charger':         '/images/wall_ev_charger.jpg',
  'easee':                         '/images/wall_ev_charger.jpg',
  'ev charger':                    '/images/product_charger.jpg',
  'charger':                       '/images/product_charger.jpg',
  'ev charging cable type 2':      '/images/type2_charging_cable.jpg',
  'ev smart cable 22kw':           '/images/ev_charging_cable.jpg',
  'charging cable':                '/images/type2_charging_cable.jpg',
  'cable':                         '/images/type2_charging_cable.jpg',
  'ev home battery storage':       '/images/energy_storage_system.jpg',
  'battery storage':               '/images/energy_storage_system.jpg',
  'sub-zero ev battery thermal blanket': '/images/smart_home_energy_system.jpg',
  'battery blanket':               '/images/smart_home_energy_system.jpg',
  'battery warmer':                '/images/smart_home_energy_system.jpg',
  'battery':                       '/images/energy_storage_system.jpg',

  // Outdoor Gear
  'fjord 40l recycled backpack':   '/images/hiking_backpack.jpg',
  'solar adventure pack 45l':      '/images/chrome_travel_backpack.jpg',
  'backpack':                      '/images/hiking_backpack.jpg',
  'pack':                          '/images/hiking_backpack.jpg',
  'tromsø hiking boots':           '/images/mountain_boots.jpg',
  'tromsa, hiking boots':          '/images/mountain_boots.jpg',
  'hiking boots':                  '/images/mountain_boots.jpg',
  'mountain boots':                '/images/mountain_boots.jpg',
  'boots':                         '/images/mountain_boots.jpg',
  'lofoten tent (eco-nylon)':      '/images/nordic_tent.jpg',
  'nordic tent':                   '/images/nordic_tent.jpg',
  'tent':                          '/images/nordic_tent.jpg',
  'polar sleeping bag':            '/images/arctic_sleeping_bag.jpg',
  'arctic sleeping bag':           '/images/arctic_sleeping_bag.jpg',
  'sleeping bag':                  '/images/arctic_sleeping_bag.jpg',
  'svalbard extreme expedition parka': '/images/yellow_parka.jpg',
  'expedition parka':              '/images/yellow_parka.jpg',
  'parka':                         '/images/yellow_parka.jpg',
  'oslo winter shell jacket':      '/images/waterproof_jacket.jpg',
  'winter shell jacket':           '/images/waterproof_jacket.jpg',
  'shell jacket':                  '/images/waterproof_jacket.jpg',
  'jacket':                        '/images/waterproof_jacket.jpg',
  'bergen eco-raincoat':           '/images/rain_coat.jpg',
  'eco-raincoat':                  '/images/rain_coat.jpg',
  'raincoat':                      '/images/rain_coat.jpg',
  'rain':                          '/images/rain_coat.jpg',
  'coat':                          '/images/rain_coat.jpg',
  'eco-wool base layer':           '/images/merino_wool_top.jpg',
  'nordic wool thermal layer':     '/images/merino_wool_top.jpg',
  'norwegian pure wool sweater':   '/images/merino_wool_top.jpg',
  'wool base layer':               '/images/merino_wool_top.jpg',
  'wool sweater':                  '/images/merino_wool_top.jpg',
  'wool':                          '/images/merino_wool_top.jpg',
  'merino':                        '/images/merino_wool_top.jpg',
  'thermal':                       '/images/merino_wool_top.jpg',
  'barents sea kayak (recycled)':  '/images/bottle_kayak.jpg',
  'sea kayak':                     '/images/bottle_kayak.jpg',
  'kayak':                         '/images/bottle_kayak.jpg',
  'boat':                          '/images/bottle_kayak.jpg',

  // Lifestyle
  'voss reusable water bottle':    '/images/voss_water_bottles.jpg',
  'hardanger vacuum flask 1.0l':   '/images/voss_water_bottles.jpg',
  'voss water bottle':             '/images/voss_water_bottles.jpg',
  'water bottle':                  '/images/voss_water_bottles.jpg',
  'flask':                         '/images/voss_water_bottles.jpg',
  'bottle':                        '/images/voss_water_bottles.jpg',
  'bamboo utensil travel set':     '/images/bamboo_cutlery_set.jpg',
  'bamboo cutlery':                '/images/bamboo_cutlery_set.jpg',
  'bamboo':                        '/images/bamboo_cutlery_set.jpg',
  'cutlery':                       '/images/bamboo_cutlery_set.jpg',
  'utensil':                       '/images/bamboo_cutlery_set.jpg',
  'lofoten seaweed skincare set':  '/images/skincare_gift_set.jpg',
  'seaweed skincare set':          '/images/skincare_gift_set.jpg',
  'skincare':                      '/images/skincare_gift_set.jpg',
  'fjord handcrafted birch kuksa': '/images/norwegian_gift.jpg',
  'birch kuksa':                   '/images/norwegian_gift.jpg',
  'kuksa':                         '/images/norwegian_gift.jpg',
  'helle viking hand-forged carbon knife': '/images/norwegian_gift.jpg',
  'knife':                         '/images/norwegian_gift.jpg',
  'gift':                          '/images/product_gift_set.jpg'
};

// Rich, multi-perspective galleries for all product categories
export const PRODUCT_GALLERIES: Record<string, string[]> = {
  // Smart Home
  'thermostat': [
    '/images/product_thermostat.jpg',
    '/images/product_thermostat_1786938541155.jpg',
    '/images/smart_electricity_meter.jpg'
  ],
  'heater': [
    '/images/mill_smart_heater.jpg',
    '/images/mill_invisible_heater.jpg',
    '/images/smart_panel_heater.jpg'
  ],
  'purifier': [
    '/images/smart_air_purifier.jpg',
    '/images/home_air_purifier.jpg',
    '/images/room_purifier.jpg'
  ],
  'blind': [
    '/images/smart_blinds_motor.jpg',
    '/images/smart_curtain_motor.jpg',
    '/images/automatic_curtain.jpg'
  ],
  'meter': [
    '/images/smart_electricity_meter.jpg',
    '/images/smart_meter.jpg',
    '/images/energy_meter.jpg'
  ],
  'sensor': [
    '/images/soil_moisture_sensor.jpg',
    '/images/smart_garden_sensor.jpg',
    '/images/plant_sensor.jpg'
  ],
  'light': [
    '/images/smart_garden_sensor.jpg',
    '/images/solar_battery_ev.jpg',
    '/images/northern_lights_1786935879330.jpg'
  ],
  'aurora': [
    '/images/northern_lights_1786935879330.jpg',
    '/images/aurora_borealis_1787013684123.jpg',
    '/images/smart_air_purifier.jpg'
  ],

  // EV Accessories
  'zaptec': [
    '/images/product_charger.jpg',
    '/images/product_charger_1786938528191.jpg',
    '/images/home_ev_charger.jpg'
  ],
  'easee': [
    '/images/wall_ev_charger.jpg',
    '/images/electric_car_charger.jpg',
    '/images/electric_vehicle_charger.jpg'
  ],
  'charger': [
    '/images/product_charger.jpg',
    '/images/wall_ev_charger.jpg',
    '/images/home_ev_charger.jpg'
  ],
  'cable': [
    '/images/type2_charging_cable.jpg',
    '/images/ev_charging_cable.jpg',
    '/images/ev_cable.jpg'
  ],
  'battery storage': [
    '/images/energy_storage_system.jpg',
    '/images/home_solar_ev.jpg',
    '/images/solar_battery_ev.jpg'
  ],
  'blanket': [
    '/images/smart_home_energy_system.jpg',
    '/images/energy_storage_system.jpg',
    '/images/ev_charger.jpg'
  ],

  // Outdoor Gear
  'backpack': [
    '/images/hiking_backpack.jpg',
    '/images/adventure_backpack.jpg',
    '/images/outdoor_backpack.jpg'
  ],
  'solar adventure pack': [
    '/images/chrome_travel_backpack.jpg',
    '/images/travel_backpack.jpg',
    '/images/outdoor_backpack.jpg'
  ],
  'boots': [
    '/images/mountain_boots.jpg',
    '/images/brown_hiking_boots.jpg',
    '/images/premium_hiking_boots.jpg'
  ],
  'tent': [
    '/images/nordic_tent.jpg',
    '/images/backpacking_tent.jpg',
    '/images/camping_tent.jpg'
  ],
  'sleeping bag': [
    '/images/arctic_sleeping_bag.jpg',
    '/images/winter_sleeping_bag.jpg',
    '/images/sleeping_bag_snow.jpg'
  ],
  'parka': [
    '/images/yellow_parka.jpg',
    '/images/expedition_jackets.jpg',
    '/images/yellow_rain_jacket.jpg'
  ],
  'jacket': [
    '/images/waterproof_jacket.jpg',
    '/images/outdoor_jacket.jpg',
    '/images/fjord_jacket.jpg'
  ],
  'raincoat': [
    '/images/rain_coat.jpg',
    '/images/yellow_rain_jacket.jpg',
    '/images/waterproof_jacket.jpg'
  ],
  'wool': [
    '/images/merino_wool_top.jpg',
    '/images/merino_base_layer.jpg',
    '/images/wool_thermal_top.jpg'
  ],
  'kayak': [
    '/images/bottle_kayak.jpg',
    '/images/plastic_bottle_boat.jpg',
    '/images/recycled_boat.jpg'
  ],

  // Lifestyle
  'bottle': [
    '/images/voss_water_bottles.jpg',
    '/images/voss_glass_bottles.jpg',
    '/images/voss_still_water.jpg'
  ],
  'bamboo': [
    '/images/bamboo_cutlery_set.jpg',
    '/images/bamboo_utensils.jpg',
    '/images/sustainable_cutlery.jpg'
  ],
  'skincare': [
    '/images/skincare_gift_set.jpg',
    '/images/gift_set_bottles.jpg',
    '/images/oil_gift_box.jpg'
  ],
  'kuksa': [
    '/images/norwegian_gift.jpg',
    '/images/product_gift_set.jpg',
    '/images/oil_gift_box.jpg'
  ]
};

/**
 * Returns an authentic, local uploaded product image URL.
 * Automatically discards picsum placeholders, unsplash links, or invalid external paths.
 */
export function getProductImage(name: string, category?: string, currentUrl?: string | null): string {
  // If current URL is already a valid local image (and not a placeholder)
  if (
    currentUrl &&
    currentUrl.startsWith('/images/') &&
    !currentUrl.includes('placeholder') &&
    !currentUrl.includes('picsum')
  ) {
    // If it points to smart_energy_monitor or generic, see if a more specific match exists
    if (!currentUrl.includes('smart_energy_monitor.jpg')) {
      return currentUrl;
    }
  }

  const key = (name || '').toLowerCase().trim();

  // 1. Direct key match
  for (const [pattern, imgPath] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (key === pattern || key.includes(pattern)) {
      return imgPath;
    }
  }

  // 2. Category-based authentic Norwegian image fallback
  const cat = (category || '').toLowerCase().trim();
  if (cat.includes('smart') || cat.includes('home')) {
    return '/images/product_thermostat.jpg';
  }
  if (cat.includes('ev') || cat.includes('charging') || cat.includes('access')) {
    return '/images/product_charger.jpg';
  }
  if (cat.includes('outdoor') || cat.includes('gear')) {
    return '/images/hiking_backpack.jpg';
  }
  if (cat.includes('life') || cat.includes('gift')) {
    return '/images/voss_water_bottles.jpg';
  }

  return '/images/product_thermostat.jpg';
}

/**
 * Returns a 3-image authentic Norwegian gallery for any product.
 */
export function getProductGallery(name: string, category?: string, currentGallery?: string[]): string[] {
  // Check if existing gallery already has multiple valid local images
  if (currentGallery && currentGallery.length >= 2) {
    const validLocal = currentGallery.filter(
      (img) =>
        img &&
        img.startsWith('/images/') &&
        !img.includes('placeholder') &&
        !img.includes('picsum')
    );
    if (validLocal.length >= 2) {
      return validLocal;
    }
  }

  const key = (name || '').toLowerCase().trim();

  for (const [pattern, gallery] of Object.entries(PRODUCT_GALLERIES)) {
    if (key === pattern || key.includes(pattern)) {
      return gallery;
    }
  }

  // Fallback gallery based on main product image
  const mainImg = getProductImage(name, category);
  return [
    mainImg,
    '/images/norwegian_shop_exterior.jpg',
    '/images/smart_electricity_meter.jpg'
  ];
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
      '/images/smart_electricity_meter.jpg'
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
    id: 'prod-zaptec-1',
    name: 'Zaptec Go EV Charger',
    category: 'EV Accessories',
    price: 6990,
    rating: 4.9,
    stock: 16,
    co2: -120.0,
    img: '/images/product_charger.jpg',
    gallery: [
      '/images/product_charger.jpg',
      '/images/product_charger_1786938528191.jpg',
      '/images/home_ev_charger.jpg'
    ],
    description: 'Award-winning Norwegian ultra-compact 22kW EV charger. Engineered on the stormy West Coast of Norway with intelligent dynamic phase balancing, integrated RFID reader, and automated solar charging.',
    specs: {
      'Max Power': '22 kW (3-Phase 32A)',
      'Dimensions': '242 x 180 x 75 mm (Ultra-compact)',
      'Connectivity': '4G LTE-M & Wi-Fi Always Connected',
      'Protection': 'Type B RCD & IP54 Weatherproof'
    },
    features: [
      'Eco-Smart charging synchronizes with cheapest Nord Pool spot rates',
      'Integrated solar energy self-consumption mode',
      'Engineered and manufactured in Stavanger, Norway',
      'Winner of the Red Dot Best of the Best Design Award'
    ],
    materials: 'Flame-Retardant Recycled Polycarbonate & Aluminium',
    origin: 'Stavanger, Norway',
    warranty: '5-Year Manufacturer Warranty'
  },
  {
    id: 'prod-backpack-1',
    name: 'Fjord 40L Recycled Backpack',
    category: 'Outdoor Gear',
    price: 1290,
    rating: 4.5,
    stock: 22,
    co2: -12.5,
    img: '/images/hiking_backpack.jpg',
    gallery: [
      '/images/hiking_backpack.jpg',
      '/images/adventure_backpack.jpg',
      '/images/outdoor_backpack.jpg'
    ],
    description: 'Engineered for multi-day mountain trekking and fjord traverses. Built from 100% recycled high-density ripstop nylon salvaged from discarded fishing gear, featuring an ergonomic ventilated suspension back system.',
    specs: {
      'Volume': '40 Liters (Expandable)',
      'Weight': '1.15 kg',
      'Waterproof': '10,000mm Hydrostatic Head Ripstop',
      'Zippers': 'YKK AquaGuard Waterproof Zippers'
    },
    features: [
      'Anatomical hip belt with quick-access compass and snack pouches',
      'Roll-top storm collar with dual compression straps',
      'Dedicated hydration reservoir sleeve with hose port',
      'Integrated high-visibility rescue rain cover'
    ],
    materials: '100% Recycled Ocean-Bound Polyamide & Bio-Foam',
    origin: 'Åndalsnes, Norway',
    warranty: 'Lifetime Repair Guarantee'
  },
  {
    id: 'prod-pathway-lights-1',
    name: 'Aura Solar Pathway Lights',
    category: 'Smart Home',
    price: 890,
    rating: 4.2,
    stock: 30,
    co2: -8.0,
    img: '/images/smart_garden_sensor.jpg',
    gallery: [
      '/images/smart_garden_sensor.jpg',
      '/images/solar_battery_ev.jpg',
      '/images/northern_lights_1786935879330.jpg'
    ],
    description: 'High-efficiency monocrystalline solar pathway markers with dusk-to-dawn ambient sensors. Charges even under diffuse Nordic overcast skies to illuminate gravel walkways and garden trails with soft 2700K warm glow.',
    specs: {
      'Solar Cell': 'Monocrystalline ETFE Solar Shingle',
      'Battery': 'LiFePO4 3.2V 1500mAh Extreme Cold Resistant',
      'Color Temp': '2700K Nordic Warm Ambient',
      'Weatherproofing': 'IP68 Submersible & Salt-Mist Resistant'
    },
    features: [
      'Dual optical lenses diffuse light without blinding glare',
      'Integrated ground spikes made of anodized aluminium',
      'Sub-zero smart battery charge controller down to -30°C',
      'Automatic twilight activation with 14-hour runtime'
    ],
    materials: 'Sandblasted Aluminium & Toughened Borosilicate Glass',
    origin: 'Grimstad, Norway',
    warranty: '3-Year Nordic Climate Guarantee'
  },
  {
    id: 'prod-voss-bottle-1',
    name: 'Voss Reusable Water Bottle',
    category: 'Lifestyle',
    price: 349,
    rating: 4.7,
    stock: 50,
    co2: -2.1,
    img: '/images/voss_water_bottles.jpg',
    gallery: [
      '/images/voss_water_bottles.jpg',
      '/images/voss_glass_bottles.jpg',
      '/images/voss_still_water.jpg'
    ],
    description: 'Minimalist Scandinavian cylindrical hydration flask. Crafted from thermal shock-resistant borosilicate glass with a brushed stainless steel cap and organic leakproof silicone seal.',
    specs: {
      'Capacity': '800 ml (27 fl oz)',
      'Weight': '360 grams',
      'Thermal Range': '-10°C to +100°C',
      'Cap': 'FSC Brushed Steel & Food-Grade Silicone'
    },
    features: [
      '100% BPA, BPS, and toxin free',
      'Dishwasher safe and odor-resistant',
      'Fits standard vehicle cupholders and bike cages',
      'Includes protective felt sleeve from recycled wool'
    ],
    materials: 'High-Grade Borosilicate Glass & Food-Grade Steel',
    origin: 'Vatnestrøm, Iveland, Norway',
    warranty: '2-Year Leakproof Warranty'
  },
  {
    id: 'prod-grid-monitor-1',
    name: 'Smart Grid Energy Monitor',
    category: 'Smart Home',
    price: 1190,
    rating: 4.4,
    stock: 19,
    co2: -35.0,
    img: '/images/smart_electricity_meter.jpg',
    gallery: [
      '/images/smart_electricity_meter.jpg',
      '/images/smart_meter.jpg',
      '/images/energy_meter.jpg'
    ],
    description: 'Plug-and-play HAN-port electricity meter interface. Reads real-time power draw every 2.5 seconds, instantly identifying energy vampires, solar export peaks, and high-tariff consumption surges.',
    specs: {
      'Protocol': 'RJ45 HAN Port (Kamstrup, Aidon, Kaifa kompatibel)',
      'Connectivity': 'Wi-Fi 802.11 b/g/n & MQTT API',
      'Power': 'Parasitic bus powered via HAN port',
      'Sampling Rate': '2.5 Seconds Real-Time'
    },
    features: [
      'Integrates directly with Home Assistant and openHAB',
      'Spot-price threshold alerts for automated load shedding',
      'Historical kWh graphing and predictive monthly billing',
      'No external AC adapter or batteries required'
    ],
    materials: 'Recycled Ocean Polymer & Gold-Plated RJ45 Pins',
    origin: 'Oslo, Norway',
    warranty: '5-Year Electronics Warranty'
  },
  {
    id: 'prod-shell-jacket-1',
    name: 'Oslo Winter Shell Jacket',
    category: 'Outdoor Gear',
    price: 4500,
    rating: 4.9,
    stock: 14,
    co2: -15.0,
    img: '/images/waterproof_jacket.jpg',
    gallery: [
      '/images/waterproof_jacket.jpg',
      '/images/outdoor_jacket.jpg',
      '/images/fjord_jacket.jpg'
    ],
    description: 'Professional 3-layer technical hardshell engineered to withstand maritime winter tempests and horizontal sleet. Features a bio-based breathable membrane with 28,000mm hydrostatic head waterproofing.',
    specs: {
      'Membrane': '3-Layer Bio-Circular Sympatex 28k/28k',
      'Weight': '520 grams (Men Large)',
      'Hood': 'Helmet-Compatible Storm Hood with Recco Reflector',
      'Zips': 'YKK Vislon Matte Waterproof 2-Way Pit Zips'
    },
    features: [
      'Integrated RECCO search and rescue avalanche avalanche reflector',
      'Dual underarm ventilation zippers for steep alpine climbs',
      'Internal waterproof pocket for phone battery warmth protection',
      'Fluorocarbon-free DWR water repellent coating'
    ],
    materials: '100% Recycled Polyester & Bio-Polyurethane Membrane',
    origin: 'Bergen, Norway',
    warranty: 'Lifetime Hardshell Guarantee'
  },
  {
    id: 'prod-easee-charger-1',
    name: 'Easee Home EV Charger',
    category: 'EV Accessories',
    price: 7200,
    rating: 4.8,
    stock: 11,
    co2: -115.0,
    img: '/images/wall_ev_charger.jpg',
    gallery: [
      '/images/wall_ev_charger.jpg',
      '/images/electric_car_charger.jpg',
      '/images/electric_vehicle_charger.jpg'
    ],
    description: 'Ultra-smart Norwegian EV charging robot. Dynamically scales charging power from 1.4 kW single-phase to 22 kW 3-phase, allowing up to 3 chargers on a single electrical circuit.',
    specs: {
      'Power Range': '1.4 kW to 22 kW (Adaptive Single & 3-Phase)',
      'Weight': '1.5 kg (69% lighter than competitors)',
      'Connectivity': 'Integrated 4G eSIM (Free Lifetime) & Wi-Fi',
      'Socket': 'Universal Type 2 with automated locking'
    },
    features: [
      'Built-in electronic earthing with Type B RCD protection',
      'Automatic cable locking to prevent theft while charging',
      'RFID reader for multi-user access authentication',
      'Developed and manufactured in Rogaland, Norway'
    ],
    materials: 'Impact-Resistant Recycled Polycarbonate',
    origin: 'Sandnes, Norway',
    warranty: '5-Year Arctic Warranty'
  },
  {
    id: 'prod-wool-base-1',
    name: 'Eco-Wool Base Layer',
    category: 'Outdoor Gear',
    price: 890,
    rating: 4.6,
    stock: 28,
    co2: -5.5,
    img: '/images/merino_wool_top.jpg',
    gallery: [
      '/images/merino_wool_top.jpg',
      '/images/merino_base_layer.jpg',
      '/images/wool_thermal_top.jpg'
    ],
    description: '100% Norwegian free-grazing sheep wool base layer. Delivers natural thermal regulation, moisture transport, and antibacterial odor suppression across demanding arctic winter adventures.',
    specs: {
      'Fiber Micron': '19.5 Ultra-Fine Itch-Free Merino Blend',
      'Fabric Weight': '220 g/m² Warm Midweight',
      'Seams': 'Flatlock Non-Chafing Ergonomic Seams',
      'Fit': 'Athletic Next-to-Skin Contoured Cut'
    },
    features: [
      'Naturally flame-retardant and highly breathable',
      'Maintains warming capacity even when completely wet',
      'Extended back panel keeps lower spine protected from drafts',
      'Oeko-Tex Standard 100 Class 1 Certified'
    ],
    materials: '100% Certified Norwegian Virgin Wool',
    origin: 'Dale, Vaksdal, Norway',
    warranty: '2-Year Craftsmanship Guarantee'
  },
  {
    id: 'prod-mill-heater-1',
    name: 'Mill Wi-Fi Panel Heater',
    category: 'Smart Home',
    price: 1890,
    rating: 4.5,
    stock: 20,
    co2: -22.0,
    img: '/images/mill_smart_heater.jpg',
    gallery: [
      '/images/mill_smart_heater.jpg',
      '/images/mill_invisible_heater.jpg',
      '/images/smart_panel_heater.jpg'
    ],
    description: 'Iconic Norwegian minimalist glass panel heater with integrated PID thermostat and Wi-Fi scheduling. Delivers whisper-quiet convective heat that will not scorch dust or dry ambient air.',
    specs: {
      'Heating Output': '1200 Watts (Heats rooms up to 18 m²)',
      'Connectivity': 'Generation 3 Wi-Fi & Bluetooth Easy Setup',
      'Thermostat': 'PID Predictive Temperature Control (±0.2°C)',
      'Safety': 'Overheat Protection & Child Safety Lock'
    },
    features: [
      'Modern curved Scandinavian aluminium front panel',
      'Open window automatic shutoff detection',
      'Syncs with Tibber and Nord Pool hourly power rates',
      'Whisper-quiet electronic solid-state relay switching'
    ],
    materials: 'Powder-Coated Recycled Steel & Toughened Front Glass',
    origin: 'Oslo, Norway',
    warranty: '5-Year Nordic Home Warranty'
  },
  {
    id: 'prod-kayak-1',
    name: 'Barents Sea Kayak (Recycled)',
    category: 'Outdoor Gear',
    price: 12500,
    rating: 4.9,
    stock: 4,
    co2: -80.0,
    img: '/images/bottle_kayak.jpg',
    gallery: [
      '/images/bottle_kayak.jpg',
      '/images/plastic_bottle_boat.jpg',
      '/images/recycled_boat.jpg'
    ],
    description: 'Heavy-duty 16-foot expedition sea touring kayak rotationally molded from 100% upcycled ocean plastic ghost nets and buoys retrieved along Northern Norwegian fjords. Virtually indestructible hull.',
    specs: {
      'Length': '5.05 Meters (16 ft 7 in)',
      'Beam': '56 cm',
      'Max Payload': '160 kg (Kayaker + Gear)',
      'Rudder': 'Retractable SmartTrack Skeg & Foot Rudder'
    },
    features: [
      'Dual watertight bulkheads with Kajak-Sport rubber hatch covers',
      'Ergonomic padded thermo-formed touring cockpit seat',
      'Deck bungee rigging for map cases and spare paddles',
      'Each hull removes 32 kg of plastic waste from the Arctic Ocean'
    ],
    materials: '100% Upcycled High-Density Polyethylene (HDPE)',
    origin: 'Tromsø Coastal Workshop, Norway',
    warranty: '10-Year Hull Integrity Guarantee'
  },
  {
    id: 'prod-blinds-1',
    name: 'Smart Blinds Controller',
    category: 'Smart Home',
    price: 1450,
    rating: 4.3,
    stock: 17,
    co2: -18.5,
    img: '/images/smart_blinds_motor.jpg',
    gallery: [
      '/images/smart_blinds_motor.jpg',
      '/images/smart_curtain_motor.jpg',
      '/images/automatic_curtain.jpg'
    ],
    description: 'Retrofit motorized drive unit for roller shades and curtains. Features an integrated solar energy collector and ambient light sensor that adjusts shade height according to solar elevation angle.',
    specs: {
      'Motor Torque': '1.8 Nm High-Torque Silent Planetary Gear',
      'Power': 'Solar Harvesting Panel + 4000mAh Battery',
      'Connectivity': 'Matter over Thread & Zigbee 3.0',
      'Noise Level': '< 32 dB Whisper-Quiet Operation'
    },
    features: [
      'Zero wiring required — charges indefinitely from solar panel',
      'Adapts automatically to sunrise and sunset calculations',
      'Reduces winter window radiant heat loss by up to 22%',
      'Compatible with bead chain and cord loop roller shades'
    ],
    materials: 'Machined Aluminium Alloy & Recycled Polycarbonate',
    origin: 'Drammen, Norway',
    warranty: '3-Year Quality Guarantee'
  },
  {
    id: 'prod-cable-type2-1',
    name: 'EV Charging Cable Type 2',
    category: 'EV Accessories',
    price: 1990,
    rating: 4.7,
    stock: 25,
    co2: -8.0,
    img: '/images/type2_charging_cable.jpg',
    gallery: [
      '/images/type2_charging_cable.jpg',
      '/images/ev_charging_cable.jpg',
      '/images/ev_cable.jpg'
    ],
    description: 'Premium Type 2 to Type 2 3-Phase 32A charging cable. Formulated with Arctic-Flex polyurethane jacketing that avoids stiffness or cracking in heavy Norwegian frost down to -40°C.',
    specs: {
      'Rating': '32A / 3-Phase (22 kW Capable)',
      'Length': '7.5 Meters High Visibility Orange Cable',
      'Connectors': 'Type 2 Silver-Plated Low-Resistance Pins',
      'IP Rating': 'IP67 Waterproof & Crush-Proof'
    },
    features: [
      'Self-recoiling cold-weather memory elastomer jacket',
      'Integrated lockable security eyes prevent cable theft',
      'Dust caps with water-resistant magnetic seal covers',
      'Tested to withstand vehicle drive-over loads up to 2 tons'
    ],
    materials: 'Halogen-Free Thermoplastic Polyurethane & 99.9% Oxygen-Free Copper',
    origin: 'Raufoss, Norway',
    warranty: '5-Year Durability Guarantee'
  },
  {
    id: 'prod-boots-1',
    name: 'Tromsø Hiking Boots',
    category: 'Outdoor Gear',
    price: 2890,
    rating: 4.8,
    stock: 15,
    co2: -14.0,
    img: '/images/mountain_boots.jpg',
    gallery: [
      '/images/mountain_boots.jpg',
      '/images/brown_hiking_boots.jpg',
      '/images/premium_hiking_boots.jpg'
    ],
    description: 'Handcrafted alpine trekking boots built for rocky Arctic scree and mossy bog paths. Genuine oiled full-grain leather outer lined with a waterproof Sympatex membrane and Vibram Arctic Grip lug soles.',
    specs: {
      'Upper': '2.6mm Waxed Full-Grain Norwegian Cattle Leather',
      'Outsole': 'Vibram Arctic Grip All-Terrain Rubber',
      'Midsole': 'Dual-Density EVA Shock Cushioning with TPU Shank',
      'Weight': '680 grams per boot (Size 42)'
    },
    features: [
      'Specialized rubber compound grips on wet ice and slimy wet stones',
      '360-degree protective high-abrasion rubber rand guard',
      'Ergonomic memory-foam ankle collar prevents heel blister lift',
      'Resoleable Goodyear welted construction for decades of use'
    ],
    materials: 'Sustainably Tanned Norwegian Leather & Recycled Vibram Soles',
    origin: 'Trondheim Artisan Tannery, Norway',
    warranty: 'Lifetime Resoleable Guarantee'
  },
  {
    id: 'prod-purifier-1',
    name: 'Airify Smart Air Purifier',
    category: 'Smart Home',
    price: 3490,
    rating: 4.6,
    stock: 12,
    co2: -28.0,
    img: '/images/smart_air_purifier.jpg',
    gallery: [
      '/images/smart_air_purifier.jpg',
      '/images/home_air_purifier.jpg',
      '/images/room_purifier.jpg'
    ],
    description: 'Medical-grade True HEPA H13 cylindrical air filtration system. Traps 99.97% of PM2.5 particulates, wood-smoke aerosols, birch pollen, and volatile organic compounds from modern indoor spaces.',
    specs: {
      'CADR Rate': '450 m³/h Clean Air Delivery Rate',
      'Coverage Area': 'Up to 65 m² Living Spaces',
      'Filtration': 'True HEPA H13 + Cold Catalyst + Coconut Carbon',
      'Sound Level': '19 dB in Ultra-Quiet Night Mode'
    },
    features: [
      'Real-time laser air quality sensor with RGB ring status display',
      'Smart sensor automatically adjusts fan speed when wood stoves spark',
      'Smartphone app monitoring with Matter and HomeKit integration',
      'Energy-efficient DC inverter motor consuming only 6W on eco mode'
    ],
    materials: 'Anodized Arctic Aluminium & Natural Wool Filter Surround',
    origin: 'Bergen Innovation Hub, Norway',
    warranty: '3-Year Scandinavian Warranty'
  },
  {
    id: 'prod-tent-1',
    name: 'Lofoten Tent (Eco-Nylon)',
    category: 'Outdoor Gear',
    price: 5490,
    rating: 4.9,
    stock: 9,
    co2: -25.0,
    img: '/images/nordic_tent.jpg',
    gallery: [
      '/images/nordic_tent.jpg',
      '/images/backpacking_tent.jpg',
      '/images/camping_tent.jpg'
    ],
    description: 'Ultralight 4-season tunnel tent designed and wind-tunnel tested to withstand fierce North Atlantic gale storms. Dual vestibules allow gear stowing and sheltered stove cooking in bad weather.',
    specs: {
      'Capacity': '2 Persons with Expedition Packs',
      'Packed Weight': '1.85 kg Complete',
      'Poles': 'DAC Featherlite NSL 9.0mm Aircraft Alloy',
      'Flysheet': '30D Ripstop Silicone-Coated Nylon (5000mm)'
    },
    features: [
      'Simultaneous inner and fly pitch keeps sleeping pod dry in rain',
      'Low-profile aerodynamic tunnel minimizes wind drag in arctic blizzards',
      'Reflective Dyneema guy lines visible with headlamps at night',
      'Substantial snow flaps and reinforced ground pegs included'
    ],
    materials: '100% Recycled Silicone-Treated Nylon & DAC Alloy',
    origin: 'Lofoten Alpine Lab, Svolvær, Norway',
    warranty: '5-Year Alpine Warranty'
  },
  {
    id: 'prod-plant-sensor-1',
    name: 'Smart Plant Moisture Sensor',
    category: 'Smart Home',
    price: 399,
    rating: 4.1,
    stock: 45,
    co2: -1.5,
    img: '/images/soil_moisture_sensor.jpg',
    gallery: [
      '/images/soil_moisture_sensor.jpg',
      '/images/smart_garden_sensor.jpg',
      '/images/plant_sensor.jpg'
    ],
    description: 'Precision capacitive soil probe measuring soil moisture percentage, ambient ground temperature, sunlight lux levels, and fertilizer electrical conductivity for indoor plants and herbs.',
    specs: {
      'Sensing Tech': 'Corrosion-Resistant Capacitive Probe',
      'Battery': 'CR2032 Lithium Coin Cell (2-Year Life)',
      'Connectivity': 'Bluetooth 5.0 LE & Zigbee Mesh',
      'Waterproof': 'IPX5 Moisture Sealed Casing'
    },
    features: [
      'Capacitive measurement avoids corroding probe pins over years',
      'Extensive database of over 3,000 Nordic house and garden plants',
      'Sends subtle smartphone alerts before leaves start to droop',
      'Syncs with smart irrigation valves for autonomous watering'
    ],
    materials: 'UV-Stabilized Recycled ABS Plastic & Gold-Plated PCB',
    origin: 'Aas Agricultural University Park, Norway',
    warranty: '2-Year Standard Warranty'
  },
  {
    id: 'prod-sleeping-bag-1',
    name: 'Polar Sleeping Bag',
    category: 'Outdoor Gear',
    price: 3200,
    rating: 4.7,
    stock: 13,
    co2: -19.0,
    img: '/images/arctic_sleeping_bag.jpg',
    gallery: [
      '/images/arctic_sleeping_bag.jpg',
      '/images/winter_sleeping_bag.jpg',
      '/images/sleeping_bag_snow.jpg'
    ],
    description: 'Expedition winter mummy sleeping bag insulated with hydrophobic 850-fill RDS goose down. Comfort rated to -22°C (Extreme -38°C) with internal neck baffle and water-resistant footbox.',
    specs: {
      'Temp Rating': 'Comfort: -15°C / Limit: -22°C / Extreme: -38°C',
      'Insulation': '850 Fill Power RDS Hydrophobic Goose Down (950g)',
      'Total Weight': '1.45 kg',
      'Shell': 'Pertex Quantum Pro Water-Repellent Breathable Fabric'
    },
    features: [
      'Differential baffle cut prevents cold spots at compressed elbows and hips',
      'Anatomically shaped 3D hood with rapid dual cord cinches',
      'Internal zippered stash pocket keeps phone batteries warm overnight',
      'Compression dry-bag sack included for compact waterproof packing'
    ],
    materials: '100% Recycled Pertex Nylon Shell & RDS Ethical Down',
    origin: 'Lillehammer Winter Lab, Norway',
    warranty: '5-Year Expedition Guarantee'
  },
  {
    id: 'prod-battery-storage-1',
    name: 'EV Home Battery Storage',
    category: 'EV Accessories',
    price: 45000,
    rating: 5.0,
    stock: 5,
    co2: -800.0,
    img: '/images/energy_storage_system.jpg',
    gallery: [
      '/images/energy_storage_system.jpg',
      '/images/home_solar_ev.jpg',
      '/images/solar_battery_ev.jpg'
    ],
    description: '10 kWh modular lithium iron phosphate (LiFePO4) home battery system. Buffers cheap nocturnal hydropower or rooftop solar energy to power household appliances and recharge your vehicle during peak tariff surges.',
    specs: {
      'Capacity': '10.24 kWh (Expandable to 40 kWh)',
      'Chemistry': 'Cobalt-Free Lithium Iron Phosphate (LiFePO4)',
      'Continuous Output': '5.0 kW (Peak 7.5 kW)',
      'Cycle Life': 'Over 8,000 Cycles to 80% Capacity (>20 Years)'
    },
    features: [
      'Built-in islanding gateway delivers instantaneous emergency backup during grid blackouts',
      'Automated peak-shaving cuts household electricity capacity tariff brackets',
      'Sub-zero internal battery thermal heating allows freezing garage installation',
      'Smart software automatically trades and stores based on Nord Pool day-ahead prices'
    ],
    materials: 'Powder-Coated Steel & Cobalt-Free LiFePO4 Cells',
    origin: 'Mo i Rana Battery Factory, Norway',
    warranty: '10-Year Full Performance Warranty'
  },
  {
    id: 'prod-utensils-1',
    name: 'Bamboo Utensil Travel Set',
    category: 'Lifestyle',
    price: 199,
    rating: 4.5,
    stock: 60,
    co2: -3.0,
    img: '/images/bamboo_cutlery_set.jpg',
    gallery: [
      '/images/bamboo_cutlery_set.jpg',
      '/images/bamboo_utensils.jpg',
      '/images/sustainable_cutlery.jpg'
    ],
    description: 'Pocket-sized zero-waste camp dining cutlery set. Includes lightweight fork, knife, spoon, chopsticks, and metal straw housed in a durable organic cotton canvas roll with carabiner clip.',
    specs: {
      'Contents': 'Fork, Serrated Knife, Spoon, Chopsticks, Straw, Cleaning Brush',
      'Weight': '85 grams Total',
      'Finish': 'Organic Food-Grade Tung Oil',
      'Pouch': '100% Unbleached Organic Cotton Canvas'
    },
    features: [
      'Naturally antibacterial bamboo will not impart metallic taste to food',
      'Lightweight and airline carry-on compliant for globetrotters',
      'Replaces hundreds of single-use plastic takeaway cutlery sets',
      'Hand-carved with smooth rounded mouth-feel'
    ],
    materials: 'FSC-Certified Organic Bamboo & Natural Canvas',
    origin: 'Voss Eco Craft, Norway',
    warranty: '2-Year Everyday Durability'
  },
  {
    id: 'prod-parka-1',
    name: 'Svalbard Extreme Expedition Parka',
    category: 'Outdoor Gear',
    price: 8900,
    rating: 4.9,
    stock: 7,
    co2: -30.0,
    img: '/images/yellow_parka.jpg',
    gallery: [
      '/images/yellow_parka.jpg',
      '/images/expedition_jackets.jpg',
      '/images/yellow_rain_jacket.jpg'
    ],
    description: 'The definitive arctic survivor parka, trusted by polar explorers and Svalbard dog-sled guides. Insulated with 900-fill down enclosed in a bulletproof Cordura shell with high-visibility safety detailing.',
    specs: {
      'Insulation': '900 Fill Power Hydrophobic Goose Down (550g Fill)',
      'Shell': '500D Ballistic Cordura with 20k/20k Membrane',
      'Temperature Rating': 'Comfort down to -45°C in gale blizzard conditions',
      'Weight': '1.78 kg'
    },
    features: [
      'Detachable deep snorkel hood with wired brim to deflect howling winds',
      'Internal suspender harness allows wearing jacket like a cape indoors',
      'Dual oversized front glove-warmer bellow pockets with fleece lining',
      'Internal snow gaiter skirt prevents cold updrafts while skiing or mushing'
    ],
    materials: 'Ballistic Recycled Cordura & Ethical RDS Goose Down',
    origin: 'Longyearbyen Field Station, Svalbard, Norway',
    warranty: 'Lifetime Polar Guarantee'
  },
  {
    id: 'prod-raincoat-1',
    name: 'Bergen Eco-Raincoat',
    category: 'Outdoor Gear',
    price: 2100,
    rating: 4.8,
    stock: 18,
    co2: -10.0,
    img: '/images/rain_coat.jpg',
    gallery: [
      '/images/rain_coat.jpg',
      '/images/yellow_rain_jacket.jpg',
      '/images/waterproof_jacket.jpg'
    ],
    description: 'Tailored for Europe’s wettest city. Classic unisex Norwegian fisherman’s mac rendered from plant-based polyurethane coated organic cotton, featuring high-frequency welded waterproof seams.',
    specs: {
      'Waterproofness': '15,000 mm Water Column (100% Impermeable)',
      'Weight': '780 grams',
      'Seams': 'High-Frequency Ultrasonic Welded Seams',
      'Hardware': 'Anticorrosive Matte Brass Snap Closures'
    },
    features: [
      'Underarm brass eyelets and rear vent cape for natural airflow',
      'Deep dual front pockets with protective anti-water drainage storm flaps',
      'Adjustable drawstring hood with structured visor cap',
      'Matte rubberized finish that remains soft and pliable in chilly weather'
    ],
    materials: 'Plant-Based Bio-PU Coated 100% Organic Cotton',
    origin: 'Bergen Coastal Rainwear Studio, Norway',
    warranty: '5-Year Waterproof Guarantee'
  },
  {
    id: 'prod-skincare-1',
    name: 'Lofoten Seaweed Skincare Set',
    category: 'Lifestyle',
    price: 650,
    rating: 4.7,
    stock: 35,
    co2: -5.0,
    img: '/images/skincare_gift_set.jpg',
    gallery: [
      '/images/skincare_gift_set.jpg',
      '/images/gift_set_bottles.jpg',
      '/images/oil_gift_box.jpg'
    ],
    description: 'Nourishing facial elixir and repair cream formulated with hand-harvested wild sugar kelp (Saccharina latissima) from the crystal-clear currents of the Lofoten islands. Rich in vitamins, marine peptides, and antioxidants.',
    specs: {
      'Set Includes': 'Marine Serum (50ml), Kelp Repair Cream (60ml), Botanical Cleanser (100ml)',
      'Certification': 'Nordic Swan Ecolabel & Vegan Certified',
      'Packaging': '100% Ocean Waste Plastic Bottles & UV Amber Glass'
    },
    features: [
      'Wild-foraged seaweed harvested sustainably by hand in Henningsvær',
      'Shields skin barrier from dry winter indoor radiator air and arctic windburn',
      'Zero synthetic parabens, microplastics, or artificial perfumes',
      'Cold-pressed botanical oils infused with wild cloudberry seed extract'
    ],
    materials: 'Organic Wild Arctic Kelp, Cloudberry Seed Oil, Recycled Amber Glass',
    origin: 'Henningsvær, Lofoten, Norway',
    warranty: '100% Organic Purity Guarantee'
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
      '/images/product_gift_set.jpg',
      '/images/oil_gift_box.jpg'
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

          const productImg = getProductImage(row.name, row.category, row.img);
          const productGallery = getProductGallery(row.name, row.category, matchedFallback?.gallery);

          return {
            id: row.id,
            name: row.name,
            category: row.category,
            price: Number(row.price),
            rating: Number(row.rating || matchedFallback?.rating || 4.8),
            stock: Number(row.stock ?? matchedFallback?.stock ?? 15),
            co2: Number(row.co2 || matchedFallback?.co2 || -10),
            img: productImg,
            gallery: productGallery,
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
        const productImg = getProductImage(data.name, data.category, data.img);
        const productGallery = getProductGallery(data.name, data.category, matchedFallback?.gallery);

        return {
          id: data.id,
          name: data.name,
          category: data.category,
          price: Number(data.price),
          rating: Number(data.rating || matchedFallback?.rating || 4.8),
          stock: Number(data.stock ?? matchedFallback?.stock ?? 15),
          co2: Number(data.co2 || matchedFallback?.co2 || -10),
          img: productImg,
          gallery: productGallery,
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
