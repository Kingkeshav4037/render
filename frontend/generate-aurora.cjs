const fs = require('fs');
const path = require('path');

const auroraDestinations = [
  { slug: 'tromso', name: 'Tromsø', loc_type: 'CITY', desc: "The capital of the Arctic, renowned as one of the world's best places to see the Northern Lights.", region: 'Northern Norway', lat: 69.6492, lng: 18.9553, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Fjellheisen', 'Ersfjordbotn', 'Sommarøy'] },
  { slug: 'alta', name: 'Alta', loc_type: 'CITY', desc: "The City of the Northern Lights, home to the first modern Aurora observatory.", region: 'Northern Norway', lat: 69.9689, lng: 23.2716, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'], viewing: ['Haldde Observatory', 'Alta Fjord', 'Sautso'] },
  { slug: 'kirkenes', name: 'Kirkenes', loc_type: 'CITY', desc: "A remote frontier town near the Russian border with extremely dry, clear winter skies.", region: 'Northern Norway', lat: 69.7271, lng: 30.0450, best: ['October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Pasvik Valley', 'Snowhotel Kirkenes', 'Barents Sea Coast'] },
  { slug: 'svalbard', name: 'Svalbard', loc_type: 'ISLAND', desc: "Located midway between continental Norway and the North Pole; experiences the polar night allowing daytime Aurora viewing.", region: 'Svalbard', lat: 78.2232, lng: 15.6267, best: ['November', 'December', 'January', 'February'], viewing: ['Longyearbyen', 'Camp Barentz', 'Adventdalen'] },
  { slug: 'senja', name: 'Senja', loc_type: 'ISLAND', desc: "Norway's second-largest island offers dramatic mountains meeting the sea under dark skies.", region: 'Northern Norway', lat: 69.3090, lng: 17.2917, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Tungeneset', 'Bergsbotn', 'Mefjordvær'] },
  { slug: 'lofoten', name: 'Lofoten', loc_type: 'ISLAND', desc: "An archipelago known for its dramatic scenery, with auroras reflecting over the ocean and fishing villages.", region: 'Northern Norway', lat: 68.1408, lng: 13.5684, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Haukland Beach', 'Reine', 'Uttakleiv Beach'] },
  { slug: 'vesteralen', name: 'Vesterålen', loc_type: 'ISLAND', desc: "A peaceful archipelago offering incredible whale watching during the day and auroras at night.", region: 'Northern Norway', lat: 68.6946, lng: 15.4162, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Andøya Space', 'Bleik', 'Sortland'] },
  { slug: 'narvik', name: 'Narvik', loc_type: 'CITY', desc: "Surrounded by mountains and fjords, offering unique high-altitude viewing from Narvikfjellet.", region: 'Northern Norway', lat: 68.4385, lng: 17.4273, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Narvikfjellet', 'Ofotfjord', 'Skjomen'] },
  { slug: 'bodo', name: 'Bodø', loc_type: 'CITY', desc: "A vibrant coastal city just north of the Arctic Circle with excellent transport links.", region: 'Northern Norway', lat: 67.2804, lng: 14.4049, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Mount Rønvikfjellet', 'Mjelle Beach', 'Saltstraumen'] },
  { slug: 'lyngen', name: 'Lyngen', loc_type: 'CITY', desc: "The majestic Lyngen Alps create a dramatic jagged silhouette against the glowing night sky.", region: 'Northern Norway', lat: 69.5786, lng: 20.2185, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Lyngseidet', 'Koppangen', 'Svensby'] },
  { slug: 'hammerfest', name: 'Hammerfest', loc_type: 'CITY', desc: "One of the northernmost towns in the world, historically important and great for Northern Lights hunting.", region: 'Northern Norway', lat: 70.6634, lng: 23.6821, best: ['October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Mount Salen', 'Forsøl', 'Seiland National Park'] },
  { slug: 'nordkapp', name: 'Nordkapp', loc_type: 'VIEWPOINT', desc: "The northernmost point of mainland Europe, offering an unobstructed view of the Arctic sky.", region: 'Northern Norway', lat: 71.1709, lng: 25.7830, best: ['October', 'November', 'December', 'January', 'February', 'March'], viewing: ['North Cape Plateau', 'Skarsvåg', 'Gjesvær'] },
  { slug: 'kautokeino', name: 'Kautokeino', loc_type: 'VILLAGE', desc: "The heart of Sami culture in the Finnmark plateau, offering very stable, cold, and clear weather.", region: 'Northern Norway', lat: 69.0118, lng: 23.0416, best: ['October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Finnmarksvidda', 'Juhls Silver Gallery area', 'Masi'] },
  { slug: 'karasjok', name: 'Karasjok', loc_type: 'VILLAGE', desc: "Another major Sami hub known for extreme winter cold and very clear skies, perfect for the aurora.", region: 'Northern Norway', lat: 69.4727, lng: 25.5113, best: ['October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Sami Parliament area', 'Engholm Husky Lodge', 'Karasjohka River'] },
  { slug: 'andoya', name: 'Andøya', loc_type: 'ISLAND', desc: "Northernmost island in the Vesterålen archipelago, offering dark skies over the Norwegian sea.", region: 'Northern Norway', lat: 69.1026, lng: 15.8943, best: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], viewing: ['Andøya Space Observatory', 'Bleik Beach', 'Andenes Lighthouse'] }
];

let sql = `-- Phase 12: Aurora Data Expansion

-- 1. Insert into locations first if they don't exist
INSERT INTO public.locations (id, slug, name, description, region, type, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_loc.slug,
  new_loc.name,
  new_loc.description,
  new_loc.region,
  new_loc.loc_type::public.location_type,
  'PUBLISHED'::public.content_status,
  new_loc.lat,
  new_loc.lng
FROM (
  VALUES
`;

sql += auroraDestinations.map(a => `    ('${a.slug}', '${a.name.replace(/'/g, "''")}', '${a.desc.replace(/'/g, "''")}', '${a.region}', '${a.loc_type}', ${a.lat}, ${a.lng})`).join(',\n');

sql += `
) AS new_loc(slug, name, description, region, loc_type, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations l WHERE l.slug = new_loc.slug
);

-- 2. Insert into aurora_destinations
INSERT INTO public.aurora_destinations (id, location_id, best_months, viewing_locations, cloud_conditions_notes, published_at, source_type)
SELECT
  gen_random_uuid(),
  loc.id,
  new_aurora.best_months::text[],
  new_aurora.viewing::text[],
  'Varies based on coastal vs inland weather.',
  now(),
  'editorial'
FROM (
  VALUES
`;

sql += auroraDestinations.map(a => `    ('${a.slug}', ARRAY[${a.best.map(b => `'${b}'`).join(', ')}], ARRAY[${a.viewing.map(v => `'${v.replace(/'/g, "''")}'`).join(', ')}])`).join(',\n');

sql += `
) AS new_aurora(slug, best_months, viewing)
JOIN public.locations loc ON loc.slug = new_aurora.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.aurora_destinations ad WHERE ad.location_id = loc.id
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000018_phase12_aurora_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Aurora destinations migration generated at ' + outPath);
