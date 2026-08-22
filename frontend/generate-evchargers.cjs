const fs = require('fs');
const path = require('path');

const evChargers = [
  { device_id: 'ev-oslo-s-1', name: 'Oslo S Supercharger', operator: 'Mer', type: 'CITY', loc: 'Oslo', lat: 59.9115, lng: 10.7522, power: 150, conns: ['CCS', 'CHAdeMO'], price: 5.50 },
  { device_id: 'ev-bergen-center-1', name: 'Bergen Sentrum Fast Charger', operator: 'Recharge', type: 'CITY', loc: 'Bergen', lat: 60.3929, lng: 5.3220, power: 50, conns: ['CCS', 'Type 2'], price: 6.00 },
  { device_id: 'ev-tromso-airport-1', name: 'Tromsø Lufthavn Charger', operator: 'Eviny', type: 'CITY', loc: 'Tromsø', lat: 69.6833, lng: 18.9167, power: 150, conns: ['CCS'], price: 6.50 },
  { device_id: 'ev-flam-1', name: 'Flåm Tourist Charger', operator: 'Mer', type: 'VILLAGE', loc: 'Flåm', lat: 60.8624, lng: 7.1129, power: 100, conns: ['CCS', 'CHAdeMO'], price: 6.20 },
  { device_id: 'ev-geiranger-1', name: 'Geirangerfjord Supercharger', operator: 'Tesla', type: 'VILLAGE', loc: 'Geiranger', lat: 62.1009, lng: 7.2059, power: 250, conns: ['CCS'], price: 4.80 },
  { device_id: 'ev-trollstigen-1', name: 'Trollstigen Base Charger', operator: 'Recharge', type: 'VIEWPOINT', loc: 'Trollstigen Viewpoint', lat: 62.4534, lng: 7.6644, power: 50, conns: ['CCS', 'Type 2'], price: 6.00 },
  { device_id: 'ev-lofoten-svolvaer', name: 'Svolvær Port Charger', operator: 'Eviny', type: 'CITY', loc: 'Svolvær', lat: 68.2343, lng: 14.5621, power: 150, conns: ['CCS', 'CHAdeMO'], price: 6.50 },
  { device_id: 'ev-nordkapp-1', name: 'North Cape Charger', operator: 'Mer', type: 'VIEWPOINT', loc: 'Nordkapp', lat: 71.1709, lng: 25.7830, power: 50, conns: ['CCS', 'Type 2'], price: 7.00 },
  { device_id: 'ev-e6-oppdal', name: 'E6 Oppdal Highway Charger', operator: 'Ionity', type: 'CITY', loc: 'Oppdal', lat: 62.5937, lng: 9.6917, power: 350, conns: ['CCS'], price: 8.50 },
  { device_id: 'ev-e39-stavanger', name: 'E39 Stavanger Hub', operator: 'Recharge', type: 'CITY', loc: 'Stavanger', lat: 58.9699, lng: 5.7331, power: 150, conns: ['CCS', 'CHAdeMO', 'Type 2'], price: 5.80 },
  { device_id: 'ev-atlantic-road-1', name: 'Atlantic Road Rest Stop', operator: 'Eviny', type: 'VIEWPOINT', loc: 'Eldhusøya', lat: 63.0167, lng: 7.3500, power: 50, conns: ['CCS'], price: 6.20 }
];

let sql = `-- Phase 12: EV Charger Data Expansion

-- 1. Insert locations
INSERT INTO public.locations (id, slug, name, description, region, type, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_loc.slug,
  new_loc.name,
  'Location for EV Charger',
  'Norway',
  new_loc.loc_type::public.location_type,
  'PUBLISHED'::public.content_status,
  new_loc.lat,
  new_loc.lng
FROM (
  VALUES
`;

sql += evChargers.map(c => `    ('${c.loc.toLowerCase().replace(/\\s+/g, '-')}', '${c.loc.replace(/'/g, "''")}', '${c.type}', ${c.lat}, ${c.lng})`).join(',\n');

sql += `
) AS new_loc(slug, name, loc_type, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations l WHERE l.slug = new_loc.slug
);

-- 2. Insert into iot_devices
INSERT INTO public.iot_devices (id, device_id, name, device_type, status, location_id, latitude, longitude)
SELECT
  gen_random_uuid(),
  new_dev.device_id,
  new_dev.name,
  'EV_CHARGER',
  'ONLINE',
  loc.id,
  new_dev.lat,
  new_dev.lng
FROM (
  VALUES
`;

sql += evChargers.map(c => `    ('${c.device_id}', '${c.name.replace(/'/g, "''")}', '${c.loc.toLowerCase().replace(/\\s+/g, '-')}', ${c.lat}, ${c.lng})`).join(',\n');

sql += `
) AS new_dev(device_id, name, loc_slug, lat, lng)
JOIN public.locations loc ON loc.slug = new_dev.loc_slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.iot_devices d WHERE d.device_id = new_dev.device_id
);

-- 3. Insert into ev_chargers
INSERT INTO public.ev_chargers (id, device_id, station_name, operator, location_id, latitude, longitude, connector_types, max_power_kw, status, price_per_kwh)
SELECT
  gen_random_uuid(),
  new_ev.device_id,
  new_ev.name,
  new_ev.operator,
  d.location_id,
  new_ev.lat,
  new_ev.lng,
  new_ev.conns::text[],
  new_ev.power,
  'AVAILABLE',
  new_ev.price
FROM (
  VALUES
`;

sql += evChargers.map(c => `    ('${c.device_id}', '${c.name.replace(/'/g, "''")}', '${c.operator}', ${c.lat}, ${c.lng}, ARRAY[${c.conns.map(x => `'${x}'`).join(', ')}], ${c.power}, ${c.price})`).join(',\n');

sql += `
) AS new_ev(device_id, name, operator, lat, lng, conns, power, price)
JOIN public.iot_devices d ON d.device_id = new_ev.device_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.ev_chargers e WHERE e.device_id = new_ev.device_id
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000020_phase12_ev_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('EV migration generated at ' + outPath);
