const fs = require('fs');
const path = require('path');

const trails = [
  { locationSlug: 'stavanger', name: 'Preikestolen', dist: 8, elev: 500, diff: 'MODERATE', dur: 240, desc: "Famous flat-topped cliff rising 604 meters over Lysefjorden. Best season: May - October.", img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080' },
  { locationSlug: 'hardangerfjord', name: 'Trolltunga', dist: 28, elev: 800, diff: 'HARD', dur: 600, desc: "The Troll's Tongue hovering 700 meters above Lake Ringedalsvatnet. Best season: June - September.", img: 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080' },
  { locationSlug: 'jotunheimen', name: 'Besseggen', dist: 14, elev: 1100, diff: 'HARD', dur: 420, desc: "Iconic ridge hike offering views of green Gjende and blue Bessvatnet lakes. Best season: Mid-June - September.", img: 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080' },
  { locationSlug: 'romsdalsfjord', name: 'Romsdalseggen', dist: 10, elev: 970, diff: 'HARD', dur: 420, desc: "Spectacular ridge hike offering views over Romsdalen valley and Trollveggen. Best season: July - September.", img: 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080' },
  { locationSlug: 'reine', name: 'Reinebringen', dist: 2, elev: 450, diff: 'HARD', dur: 120, desc: "Steep sherpa stairs leading to the most iconic viewpoint in Lofoten. Best season: May - September.", img: 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080' },
  { locationSlug: 'lysefjord', name: 'Kjerag', dist: 11, elev: 570, diff: 'HARD', dur: 360, desc: "Hike to the famous Kjeragbolten boulder wedged between two cliffs. Best season: June - September.", img: 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080' },
  { locationSlug: 'hardangerfjord', name: 'Dronningstien', dist: 16, elev: 1100, diff: 'HARD', dur: 360, desc: "HM Queen Sonja's Panoramic Trail offering fantastic fjord views. Best season: July - September.", img: 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080' },
  { locationSlug: 'jotunheimen', name: 'Galdhøpiggen', dist: 12, elev: 600, diff: 'HARD', dur: 360, desc: "Hike to Norway's highest peak. Requires glacier guide from Juvasshytta. Best season: June - September.", img: 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080' },
  { locationSlug: 'bergen', name: 'Fløyen', dist: 6, elev: 320, diff: 'EASY', dur: 120, desc: "Classic Bergen hike starting directly from the city center. Best season: All year.", img: 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080' },
  { locationSlug: 'bergen', name: 'Vidden', dist: 13, elev: 200, diff: 'MODERATE', dur: 300, desc: "Plateau hike between Mt. Ulriken and Mt. Fløyen. Best season: May - October.", img: 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080' },
  { locationSlug: 'bergen', name: 'Ulriken', dist: 4, elev: 600, diff: 'HARD', dur: 120, desc: "Steep climb up the sherpa stairs (Oppstemten) to Bergen's highest city mountain. Best season: May - October.", img: 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080' },
  { locationSlug: 'senja', name: 'Segla', dist: 5, elev: 590, diff: 'HARD', dur: 240, desc: "Senja's most iconic peak rising vertically from the ocean. Best season: June - September.", img: 'https://images.unsplash.com/photo-1617482650047-9dc2d1fdf27f?w=1080' },
  { locationSlug: 'senja', name: 'Hesten', dist: 4, elev: 500, diff: 'MODERATE', dur: 150, desc: "Offers the best view of the famous Segla peak. Best season: June - September.", img: 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080' },
  { locationSlug: 'lofoten-islands', name: 'Ryten', dist: 7, elev: 543, diff: 'MODERATE', dur: 240, desc: "Spectacular views overlooking Kvalvika Beach. Best season: May - October.", img: 'https://images.unsplash.com/photo-1624806509633-87a1772652b6?w=1080' },
  { locationSlug: 'lofoten-islands', name: 'Festvågtind', dist: 3, elev: 541, diff: 'HARD', dur: 150, desc: "Steep climb providing an incredible panorama of Henningsvær. Best season: June - September.", img: 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080' },
  { locationSlug: 'lofoten-islands', name: 'Kvalvika Beach', dist: 5, elev: 200, diff: 'EASY', dur: 120, desc: "Hike to an isolated arctic beach accessible only by foot. Best season: May - October.", img: 'https://images.unsplash.com/photo-1544321397-ff0b1d033a36?w=1080' },
  { locationSlug: 'bodo', name: 'Keiservarden', dist: 5, elev: 360, diff: 'EASY', dur: 120, desc: "Bodø's most popular hike with 360-degree views including the Lofoten wall. Best season: May - October.", img: 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080' },
  { locationSlug: 'nordfjord', name: 'Skåla', dist: 16, elev: 1843, diff: 'HARD', dur: 420, desc: "One of the longest continuous uphill hikes in Norway, ending at the Skåla tower. Best season: July - September.", img: 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080' },
  { locationSlug: 'nordfjord', name: 'Mount Hoven', dist: 12, elev: 1000, diff: 'HARD', dur: 360, desc: "Steep hike up, or you can take the Loen Skylift. Best season: June - September.", img: 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080' },
  { locationSlug: 'flam', name: 'Prest', dist: 5, elev: 500, diff: 'MODERATE', dur: 180, desc: "Incredible panoramic views of the Aurlandsfjord. Best season: June - September.", img: 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080' },
  { locationSlug: 'flam', name: 'Aurlandsdalen', dist: 19, elev: 300, diff: 'MODERATE', dur: 360, desc: "Norway's Grand Canyon, a historic route through a wild and beautiful valley. Best season: July - September.", img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080' },
  { locationSlug: 'oslo', name: 'Kolsåstoppen', dist: 5, elev: 350, diff: 'MODERATE', dur: 120, desc: 'Great hike offering fantastic views over Oslo and the Oslofjord. Best season: All year.', img: 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080' },
  { locationSlug: 'oslo', name: 'Vettakollen', dist: 3, elev: 200, diff: 'EASY', dur: 90, desc: 'A short hike near Oslo providing one of the best views of the city. Best season: All year.', img: 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080' },
  { locationSlug: 'tromso', name: 'Fjellheisen to Tromsdalstinden', dist: 10, elev: 800, diff: 'HARD', dur: 300, desc: 'Continuing from the cable car station to the iconic Tromsø mountain. Best season: July - September.', img: 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080' },
  { locationSlug: 'tromso', name: 'Sherpatrappa', dist: 2, elev: 420, diff: 'MODERATE', dur: 60, desc: 'Sherpa stairs leading up to the Fjellheisen upper station. Best season: May - October.', img: 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080' },
  { locationSlug: 'jotunheimen', name: 'Knutshøe', dist: 13, elev: 700, diff: 'HARD', dur: 360, desc: 'A wilder, uncrowded alternative to Besseggen with some scrambling. Best season: July - September.', img: 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080' },
  { locationSlug: 'rondane', name: 'Rondslottet', dist: 22, elev: 1000, diff: 'HARD', dur: 540, desc: 'The highest peak in Rondane National Park. Best season: July - September.', img: 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080' },
  { locationSlug: 'rondane', name: 'Peer Gynt Hytta', dist: 12, elev: 200, diff: 'EASY', dur: 240, desc: 'Scenic and flat family-friendly hike in the heart of Rondane. Best season: June - October.', img: 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080' },
  { locationSlug: 'dovrefjell-sunndalsfjella', name: 'Snøhetta', dist: 14, elev: 800, diff: 'MODERATE', dur: 360, desc: 'Hike to the roof of Dovrefjell. Chance to see wild musk oxen. Best season: July - September.', img: 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080' },
  { locationSlug: 'hardangervidda', name: 'Gaustatoppen', dist: 9, elev: 700, diff: 'MODERATE', dur: 300, desc: 'Views of one-sixth of Norway from the top on a clear day. Best season: July - September.', img: 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080' },
  { locationSlug: 'hardangervidda', name: 'Vøringsfossen Viewpoint Hike', dist: 3, elev: 150, diff: 'EASY', dur: 60, desc: "Short walk to spectacular viewpoints around Norway's most famous waterfall. Best season: May - October.", img: 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080' },
  { locationSlug: 'geirangerfjord', name: 'Storsæterfossen', dist: 4, elev: 350, diff: 'MODERATE', dur: 120, desc: 'Hike to a waterfall where you can walk behind the cascading water. Best season: May - October.', img: 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080' },
  { locationSlug: 'geirangerfjord', name: 'Løsta', dist: 5, elev: 400, diff: 'MODERATE', dur: 150, desc: 'Great viewpoint overlooking the Geirangerfjord. Best season: May - October.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080' },
  { locationSlug: 'alesund', name: 'Sukkertoppen', dist: 4, elev: 300, diff: 'MODERATE', dur: 120, desc: 'The "Sugar Top" offers beautiful 360-degree views over Ålesund and the archipelago. Best season: All year.', img: 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080' },
  { locationSlug: 'kristiansand', name: 'Baneheia', dist: 5, elev: 100, diff: 'EASY', dur: 90, desc: 'Relaxing forest trails around lakes right next to the city center. Best season: All year.', img: 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080' },
  { locationSlug: 'kristiansand', name: 'Odderøya', dist: 4, elev: 80, diff: 'EASY', dur: 60, desc: 'Coastal walk around an island featuring historical fortresses and ocean views. Best season: All year.', img: 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080' },
  { locationSlug: 'svalbard', name: 'Plateaufjellet', dist: 6, elev: 400, diff: 'MODERATE', dur: 180, desc: 'Classic Svalbard hike overlooking Longyearbyen. Polar bear protection required! Best season: July - September.', img: 'https://images.unsplash.com/photo-1577717646549-3543b35beaa7?w=1080' },
  { locationSlug: 'svalbard', name: 'Trollsteinen', dist: 15, elev: 850, diff: 'HARD', dur: 420, desc: 'Glacier hike to a unique rock formation. Guide and rifle necessary. Best season: February - August.', img: 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080' },
  { locationSlug: 'bodo', name: 'Per Karsa', dist: 8, elev: 300, diff: 'MODERATE', dur: 200, desc: 'Hike leading to spectacular viewpoints of the Børvasstindan mountain range. Best season: June - September.', img: 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080' },
  { locationSlug: 'narvik', name: 'Linken', dist: 4, elev: 350, diff: 'MODERATE', dur: 120, desc: 'Hike from the cable car station to the Linken tower for a great view over Narvik. Best season: June - October.', img: 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080' }
];

let sql = `-- Phase 12: Trail Data Expansion

INSERT INTO public.trails (id, location_id, name, distance_km, elevation_gain_m, difficulty, estimated_duration_minutes, description, status)
SELECT 
  gen_random_uuid(),
  loc.id,
  new_trail.name,
  new_trail.dist,
  new_trail.elev,
  new_trail.diff,
  new_trail.dur,
  new_trail.description,
  new_trail.status::public.content_status
FROM (
  VALUES
`;

sql += trails.map(t => {
  return `    ('${t.locationSlug}', '${t.name.replace(/'/g, "''")}', ${t.dist}, ${t.elev}, '${t.diff}', ${t.dur}, '${t.desc.replace(/'/g, "''")}', 'PUBLISHED')`;
}).join(',\n');

sql += `
) AS new_trail(slug, name, dist, elev, diff, dur, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_trail.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.trails AS t WHERE t.name = new_trail.name
);

-- Insert trail media
`;

trails.forEach(t => {
  sql += `
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', '${t.img}', '${t.name.replace(/'/g, "''")} Hike in Norway'
FROM public.trails t
WHERE t.name = '${t.name.replace(/'/g, "''")}'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = '${t.img}'
);
`;
});

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000015_phase12_trail_data.sql');
fs.writeFileSync(outPath, sql);
console.log('Trail migration generated at', outPath);
