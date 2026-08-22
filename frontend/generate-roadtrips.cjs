const fs = require('fs');
const path = require('path');

const roadTrips = [
  { slug: 'atlantic-ocean-road', name: 'Atlantic Ocean Road', desc: "The world's most beautiful drive, crossing eight bridges between islets.", dist: 36, dur: 1, season: 'May - September', diff: 'EASY', highlights: ['Storseisundet Bridge', 'Eldhusøya', 'Askevågen'] },
  { slug: 'trollstigen', name: 'Trollstigen', desc: "A dramatic, winding mountain road with eleven hairpin bends.", dist: 106, dur: 1, season: 'June - September', diff: 'MODERATE', highlights: ['Trollstigen Viewpoint', 'Stigfossen', 'Gudbrandsjuvet'] },
  { slug: 'lofoten-scenic-route', name: 'Lofoten Scenic Route', desc: "A breathtaking journey through the Lofoten archipelago.", dist: 230, dur: 3, season: 'May - September', diff: 'EASY', highlights: ['Reine', 'Henningsvær', 'Nusfjord'] },
  { slug: 'helgeland-coast', name: 'Helgeland Coast', desc: "The longest scenic route in Norway, offering thousands of islands and mountains.", dist: 433, dur: 4, season: 'June - August', diff: 'EASY', highlights: ['Torghatten', 'De Syv Søstre', 'Svartisen Glacier'] },
  { slug: 'senja-route', name: 'Senja', desc: "A spectacular ocean drive with steep mountains dropping straight into the sea.", dist: 90, dur: 1, season: 'May - September', diff: 'MODERATE', highlights: ['Tungeneset', 'Bergsbotn', 'Ersfjordstranda'] },
  { slug: 'hardanger-route', name: 'Hardanger', desc: "Drive through the orchard of Norway alongside the majestic Hardangerfjord.", dist: 158, dur: 2, season: 'May - September', diff: 'EASY', highlights: ['Vøringsfossen', 'Låtefoss', 'Steinsdalsfossen'] },
  { slug: 'aurlandsfjellet', name: 'Aurlandsfjellet', desc: "The snow road between the fjords.", dist: 47, dur: 1, season: 'June - October', diff: 'MODERATE', highlights: ['Stegastein Viewpoint', 'Flotane', 'Vedahaugane'] },
  { slug: 'sognefjellet', name: 'Sognefjellet', desc: "Northern Europe's highest mountain pass.", dist: 108, dur: 1, season: 'May - September', diff: 'MODERATE', highlights: ['Fantesteinen', 'Mefjellet', 'Liasanden'] },
  { slug: 'valdresflye', name: 'Valdresflye', desc: "A scenic mountain drive offering expansive plateaus and mountain peaks.", dist: 49, dur: 1, season: 'June - September', diff: 'MODERATE', highlights: ['Gjende', 'Bygdin', 'Rjupa'] },
  { slug: 'rondane-route', name: 'Rondane', desc: "Driving along the blue mountains of Norway's oldest national park.", dist: 75, dur: 1, season: 'May - October', diff: 'EASY', highlights: ['Sohlbergplassen', 'Strømbu', 'Atnsjøen'] },
  { slug: 'gamle-strynefjellsvegen', name: 'Gamle Strynefjellsvegen', desc: "A historical masterpiece of engineering winding through the mountains.", dist: 27, dur: 1, season: 'June - September', diff: 'MODERATE', highlights: ['Videfossen', 'Øvstefoss', 'Hjelle'] },
  { slug: 'ryfylke', name: 'Ryfylke', desc: "Contrasting landscapes with green archipelagos and steep mountains.", dist: 260, dur: 2, season: 'May - September', diff: 'MODERATE', highlights: ['Lysefjord', 'Sauda Zinc Mines', 'Svandalsfossen'] },
  { slug: 'jaeren', name: 'Jæren', desc: "A drive with wide horizons and endless sandy beaches.", dist: 41, dur: 1, season: 'All year', diff: 'EASY', highlights: ['Orrestranda', 'Kvassheim Lighthouse', 'Borestranda'] },
  { slug: 'andoya', name: 'Andøya', desc: "Where the ocean meets the steep mountains.", dist: 58, dur: 1, season: 'May - September', diff: 'EASY', highlights: ['Kleivodden', 'Bukkekjerka', 'Bleik'] },
  { slug: 'varanger', name: 'Varanger', desc: "Journey to the Arctic Ocean, surrounded by tundra and dramatic coastline.", dist: 160, dur: 2, season: 'June - September', diff: 'MODERATE', highlights: ['Steilneset Memorial', 'Hamningberg', 'Ekkerøy'] },
  { slug: 'gaularfjellet', name: 'Gaularfjellet', desc: "The road of waterfalls along the mighty Gaularvassdraget river.", dist: 114, dur: 1, season: 'May - October', diff: 'MODERATE', highlights: ['Utsikten Viewpoint', 'Likholefossen', 'Vallestadfossen'] },
  { slug: 'geiranger-trollstigen', name: 'Geiranger–Trollstigen', desc: "The golden route connecting the most dramatic fjord and mountain landscapes.", dist: 104, dur: 1, season: 'June - September', diff: 'HARD', highlights: ['Geirangerfjord', 'Trollstigen', 'Ørnesvingen'] },
  { slug: 'nordkapp-route', name: 'Nordkapp Route', desc: "The epic drive to the northernmost point of Europe.", dist: 120, dur: 2, season: 'May - September', diff: 'MODERATE', highlights: ['North Cape', 'Skarsvåg', 'Gjesvær'] },
  { slug: 'lyngenfjord', name: 'Lyngenfjord Coastal Drive', desc: "A beautiful drive flanking the Lyngen Alps.", dist: 150, dur: 2, season: 'May - October', diff: 'EASY', highlights: ['Lyngen Alps', 'Spåkenes', 'Steindalsbreen'] },
  { slug: 'sogn-og-fjordane-explorer', name: 'Sogn og Fjordane Explorer', desc: "A massive loop encompassing glaciers and the deepest fjords.", dist: 350, dur: 4, season: 'June - September', diff: 'MODERATE', highlights: ['Jostedalsbreen', 'Fjærland', 'Sognefjord'] }
];

let sql = `-- Phase 12: Road Trip Data Expansion

INSERT INTO public.road_trips (id, name, slug, description, distance_km, duration_days, season, difficulty, scenic_highlights, published_at, source_type)
SELECT
  gen_random_uuid(),
  new_trip.name,
  new_trip.slug,
  new_trip.description,
  new_trip.dist,
  new_trip.dur,
  new_trip.season,
  new_trip.diff,
  new_trip.highlights::text[],
  now(),
  'editorial'
FROM (
  VALUES
`;

sql += roadTrips.map(r => `    ('${r.slug}', '${r.name.replace(/'/g, "''")}', '${r.desc.replace(/'/g, "''")}', ${r.dist}, ${r.dur}, '${r.season}', '${r.diff}', ARRAY[${r.highlights.map(h => `'${h.replace(/'/g, "''")}'`).join(', ')}])`).join(',\n');

sql += `
) AS new_trip(slug, name, description, dist, dur, season, diff, highlights)
WHERE NOT EXISTS (
  SELECT 1 FROM public.road_trips rt WHERE rt.slug = new_trip.slug
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000017_phase12_roadtrip_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Road trip migration generated at ' + outPath);
