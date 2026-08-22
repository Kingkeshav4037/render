const fs = require('fs');
const path = require('path');

const transports = [
  { slug: 'oslo-bergen-railway', name: 'Oslo–Bergen Railway', type: 'TRAIN', operator: 'Vy', duration: 420, price: 900, co2: 5 },
  { slug: 'flam-railway', name: 'Flåm Railway', type: 'TRAIN', operator: 'Norway in a Nutshell', duration: 60, price: 500, co2: 1 },
  { slug: 'raumabanen', name: 'Raumabanen', type: 'TRAIN', operator: 'SJ Nord', duration: 100, price: 300, co2: 2 },
  { slug: 'nordland-railway', name: 'Nordland Railway', type: 'TRAIN', operator: 'SJ Nord', duration: 600, price: 1100, co2: 8 },
  { slug: 'hurtigruten-coastal', name: 'Hurtigruten Coastal Route', type: 'FERRY', operator: 'Hurtigruten', duration: 15840, price: 15000, co2: 500 },
  { slug: 'havila-coastal', name: 'Havila Coastal Route', type: 'FERRY', operator: 'Havila Voyages', duration: 15840, price: 14000, co2: 400 },
  { slug: 'oslo-tromso-flight', name: 'Oslo to Tromsø Flight', type: 'FLIGHT', operator: 'SAS', duration: 115, price: 1200, co2: 150 },
  { slug: 'bergen-tromso-flight', name: 'Bergen to Tromsø Flight', type: 'FLIGHT', operator: 'Widerøe', duration: 130, price: 1500, co2: 160 },
  { slug: 'lofoten-express-boat', name: 'Bodø - Lofoten Express Boat', type: 'FERRY', operator: 'Torghatten Nord', duration: 200, price: 800, co2: 30 },
  { slug: 'geiranger-ferry', name: 'Geirangerfjord Ferry', type: 'FERRY', operator: 'The Fjords', duration: 90, price: 400, co2: 5 },
  { slug: 'nor-way-bussekspress', name: 'Sognefjord Express Bus', type: 'BUS', operator: 'NOR-WAY Bussekspress', duration: 300, price: 600, co2: 15 },
  { slug: 'arctic-route-bus', name: 'The Arctic Route (Tromsø - Narvik)', type: 'BUS', operator: 'Best Arctic', duration: 240, price: 700, co2: 12 }
];

let sql = `-- Phase 12: Transport Routes Data Expansion

INSERT INTO public.transport_routes (id, name, type, operator, duration_minutes, price_estimate, currency, co2_emissions_kg, status)
SELECT
  gen_random_uuid(),
  new_route.name,
  new_route.type::public.transport_type,
  new_route.operator,
  new_route.duration,
  new_route.price,
  'NOK',
  new_route.co2,
  'PUBLISHED'::public.content_status
FROM (
  VALUES
`;

sql += transports.map(t => `    ('${t.name.replace(/'/g, "''")}', '${t.type}', '${t.operator.replace(/'/g, "''")}', ${t.duration}, ${t.price}, ${t.co2})`).join(',\n');

sql += `
) AS new_route(name, type, operator, duration, price, co2)
WHERE NOT EXISTS (
  SELECT 1 FROM public.transport_routes tr WHERE tr.name = new_route.name
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000019_phase12_transport_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Transport migration generated at ' + outPath);
