const fs = require('fs');
const path = require('path');

const skiResorts = [
  { slug: 'trysil', name: 'Trysil', desc: "Norway's largest ski resort with 69 slopes and 32 lifts.", region: 'Eastern Norway', lat: 61.3148, lng: 12.2612, lifts: 32, runs: 69, diff: '{"green": 21, "blue": 17, "red": 18, "black": 13}', season: 'November - April', img: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080' },
  { slug: 'hemsedal', name: 'Hemsedal', desc: "Known as the Scandinavian Alps, offering steep mountains and great freeriding.", region: 'Eastern Norway', lat: 60.8584, lng: 8.5447, lifts: 21, runs: 53, diff: '{"green": 19, "blue": 14, "red": 11, "black": 9}', season: 'November - May', img: 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080' },
  { slug: 'hafjell', name: 'Hafjell', desc: "Family-friendly resort built for the 1994 Winter Olympics.", region: 'Eastern Norway', lat: 61.2327, lng: 10.4560, lifts: 19, runs: 50, diff: '{"green": 12, "blue": 15, "red": 15, "black": 8}', season: 'November - April', img: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080' },
  { slug: 'kvitfjell', name: 'Kvitfjell', desc: "World Cup downhill course and great snow reliability.", region: 'Eastern Norway', lat: 61.4724, lng: 10.1340, lifts: 14, runs: 34, diff: '{"green": 7, "blue": 10, "red": 13, "black": 4}', season: 'October - April', img: 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080' },
  { slug: 'geilo', name: 'Geilo', desc: "One of Norway's oldest ski resorts with excellent family facilities.", region: 'Eastern Norway', lat: 60.5332, lng: 8.2091, lifts: 20, runs: 40, diff: '{"green": 10, "blue": 15, "red": 10, "black": 5}', season: 'November - April', img: 'https://images.unsplash.com/photo-1478719059408-592965723cbc?w=1080' },
  { slug: 'oppdal', name: 'Oppdal', desc: "Four mountains connected by lifts, popular for off-piste and large areas.", region: 'Trøndelag', lat: 62.5937, lng: 9.6917, lifts: 14, runs: 39, diff: '{"green": 10, "blue": 10, "red": 15, "black": 4}', season: 'December - April', img: 'https://images.unsplash.com/photo-1605548230624-8d2d0419c517?w=1080' },
  { slug: 'voss', name: 'Voss', desc: "The adventure capital of Norway, with two distinct ski centers (Voss Resort and Myrkdalen).", region: 'Western Norway', lat: 60.6277, lng: 6.4258, lifts: 11, runs: 24, diff: '{"green": 4, "blue": 7, "red": 10, "black": 3}', season: 'December - April', img: 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080' },
  { slug: 'myrkdalen', name: 'Myrkdalen', desc: "Known for massive snowfalls and incredible off-piste skiing.", region: 'Western Norway', lat: 60.8359, lng: 6.4716, lifts: 9, runs: 22, diff: '{"green": 6, "blue": 7, "red": 6, "black": 3}', season: 'November - May', img: 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080' },
  { slug: 'narvikfjellet', name: 'Narvikfjellet', desc: "Urban skiing with stunning fjord and ocean views well north of the Arctic Circle.", region: 'Northern Norway', lat: 68.4312, lng: 17.4475, lifts: 6, runs: 15, diff: '{"green": 2, "blue": 4, "red": 6, "black": 3}', season: 'December - May', img: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080' },
  { slug: 'hovden', name: 'Hovden', desc: "The largest ski resort in southern Norway.", region: 'Southern Norway', lat: 59.5583, lng: 7.3551, lifts: 8, runs: 32, diff: '{"green": 10, "blue": 10, "red": 10, "black": 2}', season: 'November - April', img: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080' },
  { slug: 'norefjell', name: 'Norefjell', desc: "A short drive from Oslo, with the greatest elevation drop of any resort in Northern Europe.", region: 'Eastern Norway', lat: 60.2319, lng: 9.5160, lifts: 14, runs: 30, diff: '{"green": 8, "blue": 8, "red": 10, "black": 4}', season: 'November - April', img: 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080' },
  { slug: 'beitostolen', name: 'Beitostølen', desc: "Family-friendly with reliable snow and amazing cross-country networks.", region: 'Eastern Norway', lat: 61.2486, lng: 8.9056, lifts: 9, runs: 21, diff: '{"green": 12, "blue": 5, "red": 3, "black": 1}', season: 'November - April', img: 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080' },
  { slug: 'gaustablikk', name: 'Gaustablikk', desc: "Iconic views towards Gaustatoppen and beautiful family skiing.", region: 'Eastern Norway', lat: 59.8797, lng: 8.7456, lifts: 13, runs: 35, diff: '{"green": 15, "blue": 10, "red": 7, "black": 3}', season: 'November - April', img: 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080' },
  { slug: 'skeikampen', name: 'Skeikampen', desc: "Charming family resort offering great alpine and cross-country.", region: 'Eastern Norway', lat: 61.3468, lng: 10.0818, lifts: 11, runs: 21, diff: '{"green": 8, "blue": 6, "red": 5, "black": 2}', season: 'November - April', img: 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080' },
  { slug: 'roldal', name: 'Røldal', desc: "Known as the snowiest place in Norway, an absolute mecca for freeriders.", region: 'Western Norway', lat: 59.8327, lng: 6.8202, lifts: 6, runs: 12, diff: '{"green": 2, "blue": 4, "red": 4, "black": 2}', season: 'December - May', img: 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080' },
  { slug: 'kongberg', name: 'Kongsberg', desc: "Local favourite near Oslo with varied slopes.", region: 'Eastern Norway', lat: 59.6644, lng: 9.6108, lifts: 5, runs: 11, diff: '{"green": 2, "blue": 3, "red": 4, "black": 2}', season: 'December - April', img: 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080' },
  { slug: 'strandafjellet', name: 'Strandafjellet', desc: "Powder paradise with spectacular views of the Storfjord.", region: 'Western Norway', lat: 62.3087, lng: 6.8624, lifts: 7, runs: 17, diff: '{"green": 3, "blue": 5, "red": 7, "black": 2}', season: 'December - April', img: 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080' },
  { slug: 'sirdal', name: 'Sirdal', desc: "The largest ski area in the south-west of Norway.", region: 'Southern Norway', lat: 58.9103, lng: 6.9458, lifts: 9, runs: 22, diff: '{"green": 6, "blue": 8, "red": 6, "black": 2}', season: 'December - April', img: 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080' },
  { slug: 'tromso-alpinpark', name: 'Tromsø Alpinpark', desc: "Urban skiing with aurora possibilities.", region: 'Northern Norway', lat: 69.6457, lng: 19.0436, lifts: 3, runs: 6, diff: '{"green": 1, "blue": 2, "red": 2, "black": 1}', season: 'January - May', img: 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080' },
  { slug: 'vradal', name: 'Vrådal', desc: "Picturesque and family-friendly resort in Telemark.", region: 'Eastern Norway', lat: 59.3248, lng: 8.4691, lifts: 8, runs: 15, diff: '{"green": 5, "blue": 5, "red": 4, "black": 1}', season: 'December - April', img: 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080' },
  { slug: 'stryn-sommerski', name: 'Stryn Sommerski', desc: "Famous summer ski centre located on the Tystigbreen glacier.", region: 'Western Norway', lat: 61.9442, lng: 7.3752, lifts: 1, runs: 3, diff: '{"green": 1, "blue": 1, "red": 1, "black": 0}', season: 'June - July', img: 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080' },
  { slug: 'bjorli', name: 'Bjorli', desc: "One of the first places to get natural snow in Norway.", region: 'Eastern Norway', lat: 62.2573, lng: 8.1963, lifts: 6, runs: 11, diff: '{"green": 3, "blue": 4, "red": 3, "black": 1}', season: 'November - April', img: 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080' },
  { slug: 'gola', name: 'Gålå', desc: "Scenic family resort in the Gudbrandsdalen valley.", region: 'Eastern Norway', lat: 61.5034, lng: 9.8000, lifts: 7, runs: 15, diff: '{"green": 5, "blue": 5, "red": 4, "black": 1}', season: 'December - April', img: 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080' },
  { slug: 'oslo-vinterpark', name: 'Oslo Vinterpark', desc: "Tryvann – largest ski resort in the Oslo area.", region: 'Eastern Norway', lat: 59.9868, lng: 10.6672, lifts: 11, runs: 18, diff: '{"green": 5, "blue": 6, "red": 4, "black": 3}', season: 'December - April', img: 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080' },
  { slug: 'raufjell', name: 'Rauland', desc: "One of Telemark's largest ski destinations with interconnected ski areas.", region: 'Eastern Norway', lat: 59.7341, lng: 8.0068, lifts: 18, runs: 49, diff: '{"green": 15, "blue": 15, "red": 14, "black": 5}', season: 'December - April', img: 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080' },
];

let sql = `-- Phase 12: Ski Resort Data Expansion

-- 1. Insert into locations first if they don't exist
INSERT INTO public.locations (id, slug, name, description, region, type, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_loc.slug,
  new_loc.name,
  new_loc.description,
  new_loc.region,
  'SKI_RESORT'::public.location_type,
  'PUBLISHED'::public.content_status,
  new_loc.lat,
  new_loc.lng
FROM (
  VALUES
`;

sql += skiResorts.map(s => `    ('${s.slug}', '${s.name.replace(/'/g, "''")}', '${s.desc.replace(/'/g, "''")}', '${s.region}', ${s.lat}, ${s.lng})`).join(',\n');

sql += `
) AS new_loc(slug, name, description, region, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations l WHERE l.slug = new_loc.slug
);

-- 2. Insert into ski_resorts
INSERT INTO public.ski_resorts (id, location_id, lifts, runs, difficulty_breakdown, snow_season, published_at, source_type)
SELECT
  gen_random_uuid(),
  l.id,
  new_resort.lifts,
  new_resort.runs,
  new_resort.diff::jsonb,
  new_resort.season,
  now(),
  'editorial'
FROM (
  VALUES
`;

sql += skiResorts.map(s => `    ('${s.slug}', ${s.lifts}, ${s.runs}, '${s.diff}', '${s.season}')`).join(',\n');

sql += `
) AS new_resort(slug, lifts, runs, diff, season)
JOIN public.locations l ON l.slug = new_resort.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.ski_resorts s WHERE s.location_id = l.id
);

-- 3. Insert media
`;

skiResorts.forEach(s => {
  sql += `
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', '${s.img}', '${s.name.replace(/'/g, "''")} Ski Resort'
FROM public.locations l
WHERE l.slug = '${s.slug}'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = '${s.img}'
);
`;
});

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000016_phase12_skiresort_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Ski resort migration generated at ' + outPath);
