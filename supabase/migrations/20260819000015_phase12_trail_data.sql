-- Phase 12: Trail Data Expansion

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
    ('stavanger', 'Preikestolen', 8, 500, 'MODERATE', 240, 'Famous flat-topped cliff rising 604 meters over Lysefjorden. Best season: May - October.', 'PUBLISHED'),
    ('hardangerfjord', 'Trolltunga', 28, 800, 'HARD', 600, 'The Troll''s Tongue hovering 700 meters above Lake Ringedalsvatnet. Best season: June - September.', 'PUBLISHED'),
    ('jotunheimen', 'Besseggen', 14, 1100, 'HARD', 420, 'Iconic ridge hike offering views of green Gjende and blue Bessvatnet lakes. Best season: Mid-June - September.', 'PUBLISHED'),
    ('romsdalsfjord', 'Romsdalseggen', 10, 970, 'HARD', 420, 'Spectacular ridge hike offering views over Romsdalen valley and Trollveggen. Best season: July - September.', 'PUBLISHED'),
    ('reine', 'Reinebringen', 2, 450, 'HARD', 120, 'Steep sherpa stairs leading to the most iconic viewpoint in Lofoten. Best season: May - September.', 'PUBLISHED'),
    ('lysefjord', 'Kjerag', 11, 570, 'HARD', 360, 'Hike to the famous Kjeragbolten boulder wedged between two cliffs. Best season: June - September.', 'PUBLISHED'),
    ('hardangerfjord', 'Dronningstien', 16, 1100, 'HARD', 360, 'HM Queen Sonja''s Panoramic Trail offering fantastic fjord views. Best season: July - September.', 'PUBLISHED'),
    ('jotunheimen', 'Galdhøpiggen', 12, 600, 'HARD', 360, 'Hike to Norway''s highest peak. Requires glacier guide from Juvasshytta. Best season: June - September.', 'PUBLISHED'),
    ('bergen', 'Fløyen', 6, 320, 'EASY', 120, 'Classic Bergen hike starting directly from the city center. Best season: All year.', 'PUBLISHED'),
    ('bergen', 'Vidden', 13, 200, 'MODERATE', 300, 'Plateau hike between Mt. Ulriken and Mt. Fløyen. Best season: May - October.', 'PUBLISHED'),
    ('bergen', 'Ulriken', 4, 600, 'HARD', 120, 'Steep climb up the sherpa stairs (Oppstemten) to Bergen''s highest city mountain. Best season: May - October.', 'PUBLISHED'),
    ('senja', 'Segla', 5, 590, 'HARD', 240, 'Senja''s most iconic peak rising vertically from the ocean. Best season: June - September.', 'PUBLISHED'),
    ('senja', 'Hesten', 4, 500, 'MODERATE', 150, 'Offers the best view of the famous Segla peak. Best season: June - September.', 'PUBLISHED'),
    ('lofoten-islands', 'Ryten', 7, 543, 'MODERATE', 240, 'Spectacular views overlooking Kvalvika Beach. Best season: May - October.', 'PUBLISHED'),
    ('lofoten-islands', 'Festvågtind', 3, 541, 'HARD', 150, 'Steep climb providing an incredible panorama of Henningsvær. Best season: June - September.', 'PUBLISHED'),
    ('lofoten-islands', 'Kvalvika Beach', 5, 200, 'EASY', 120, 'Hike to an isolated arctic beach accessible only by foot. Best season: May - October.', 'PUBLISHED'),
    ('bodo', 'Keiservarden', 5, 360, 'EASY', 120, 'Bodø''s most popular hike with 360-degree views including the Lofoten wall. Best season: May - October.', 'PUBLISHED'),
    ('nordfjord', 'Skåla', 16, 1843, 'HARD', 420, 'One of the longest continuous uphill hikes in Norway, ending at the Skåla tower. Best season: July - September.', 'PUBLISHED'),
    ('nordfjord', 'Mount Hoven', 12, 1000, 'HARD', 360, 'Steep hike up, or you can take the Loen Skylift. Best season: June - September.', 'PUBLISHED'),
    ('flam', 'Prest', 5, 500, 'MODERATE', 180, 'Incredible panoramic views of the Aurlandsfjord. Best season: June - September.', 'PUBLISHED'),
    ('flam', 'Aurlandsdalen', 19, 300, 'MODERATE', 360, 'Norway''s Grand Canyon, a historic route through a wild and beautiful valley. Best season: July - September.', 'PUBLISHED'),
    ('oslo', 'Kolsåstoppen', 5, 350, 'MODERATE', 120, 'Great hike offering fantastic views over Oslo and the Oslofjord. Best season: All year.', 'PUBLISHED'),
    ('oslo', 'Vettakollen', 3, 200, 'EASY', 90, 'A short hike near Oslo providing one of the best views of the city. Best season: All year.', 'PUBLISHED'),
    ('tromso', 'Fjellheisen to Tromsdalstinden', 10, 800, 'HARD', 300, 'Continuing from the cable car station to the iconic Tromsø mountain. Best season: July - September.', 'PUBLISHED'),
    ('tromso', 'Sherpatrappa', 2, 420, 'MODERATE', 60, 'Sherpa stairs leading up to the Fjellheisen upper station. Best season: May - October.', 'PUBLISHED'),
    ('jotunheimen', 'Knutshøe', 13, 700, 'HARD', 360, 'A wilder, uncrowded alternative to Besseggen with some scrambling. Best season: July - September.', 'PUBLISHED'),
    ('rondane', 'Rondslottet', 22, 1000, 'HARD', 540, 'The highest peak in Rondane National Park. Best season: July - September.', 'PUBLISHED'),
    ('rondane', 'Peer Gynt Hytta', 12, 200, 'EASY', 240, 'Scenic and flat family-friendly hike in the heart of Rondane. Best season: June - October.', 'PUBLISHED'),
    ('dovrefjell-sunndalsfjella', 'Snøhetta', 14, 800, 'MODERATE', 360, 'Hike to the roof of Dovrefjell. Chance to see wild musk oxen. Best season: July - September.', 'PUBLISHED'),
    ('hardangervidda', 'Gaustatoppen', 9, 700, 'MODERATE', 300, 'Views of one-sixth of Norway from the top on a clear day. Best season: July - September.', 'PUBLISHED'),
    ('hardangervidda', 'Vøringsfossen Viewpoint Hike', 3, 150, 'EASY', 60, 'Short walk to spectacular viewpoints around Norway''s most famous waterfall. Best season: May - October.', 'PUBLISHED'),
    ('geirangerfjord', 'Storsæterfossen', 4, 350, 'MODERATE', 120, 'Hike to a waterfall where you can walk behind the cascading water. Best season: May - October.', 'PUBLISHED'),
    ('geirangerfjord', 'Løsta', 5, 400, 'MODERATE', 150, 'Great viewpoint overlooking the Geirangerfjord. Best season: May - October.', 'PUBLISHED'),
    ('alesund', 'Sukkertoppen', 4, 300, 'MODERATE', 120, 'The "Sugar Top" offers beautiful 360-degree views over Ålesund and the archipelago. Best season: All year.', 'PUBLISHED'),
    ('kristiansand', 'Baneheia', 5, 100, 'EASY', 90, 'Relaxing forest trails around lakes right next to the city center. Best season: All year.', 'PUBLISHED'),
    ('kristiansand', 'Odderøya', 4, 80, 'EASY', 60, 'Coastal walk around an island featuring historical fortresses and ocean views. Best season: All year.', 'PUBLISHED'),
    ('svalbard', 'Plateaufjellet', 6, 400, 'MODERATE', 180, 'Classic Svalbard hike overlooking Longyearbyen. Polar bear protection required! Best season: July - September.', 'PUBLISHED'),
    ('svalbard', 'Trollsteinen', 15, 850, 'HARD', 420, 'Glacier hike to a unique rock formation. Guide and rifle necessary. Best season: February - August.', 'PUBLISHED'),
    ('bodo', 'Per Karsa', 8, 300, 'MODERATE', 200, 'Hike leading to spectacular viewpoints of the Børvasstindan mountain range. Best season: June - September.', 'PUBLISHED'),
    ('narvik', 'Linken', 4, 350, 'MODERATE', 120, 'Hike from the cable car station to the Linken tower for a great view over Narvik. Best season: June - October.', 'PUBLISHED')
) AS new_trail(slug, name, dist, elev, diff, dur, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_trail.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.trails AS t WHERE t.name = new_trail.name
);

-- Insert trail media

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Preikestolen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Preikestolen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080', 'Trolltunga Hike in Norway'
FROM public.trails t
WHERE t.name = 'Trolltunga'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080', 'Besseggen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Besseggen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080', 'Romsdalseggen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Romsdalseggen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080', 'Reinebringen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Reinebringen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080', 'Kjerag Hike in Norway'
FROM public.trails t
WHERE t.name = 'Kjerag'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080', 'Dronningstien Hike in Norway'
FROM public.trails t
WHERE t.name = 'Dronningstien'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080', 'Galdhøpiggen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Galdhøpiggen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080', 'Fløyen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Fløyen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080', 'Vidden Hike in Norway'
FROM public.trails t
WHERE t.name = 'Vidden'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080', 'Ulriken Hike in Norway'
FROM public.trails t
WHERE t.name = 'Ulriken'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1617482650047-9dc2d1fdf27f?w=1080', 'Segla Hike in Norway'
FROM public.trails t
WHERE t.name = 'Segla'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1617482650047-9dc2d1fdf27f?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080', 'Hesten Hike in Norway'
FROM public.trails t
WHERE t.name = 'Hesten'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1624806509633-87a1772652b6?w=1080', 'Ryten Hike in Norway'
FROM public.trails t
WHERE t.name = 'Ryten'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1624806509633-87a1772652b6?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080', 'Festvågtind Hike in Norway'
FROM public.trails t
WHERE t.name = 'Festvågtind'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1544321397-ff0b1d033a36?w=1080', 'Kvalvika Beach Hike in Norway'
FROM public.trails t
WHERE t.name = 'Kvalvika Beach'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1544321397-ff0b1d033a36?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080', 'Keiservarden Hike in Norway'
FROM public.trails t
WHERE t.name = 'Keiservarden'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080', 'Skåla Hike in Norway'
FROM public.trails t
WHERE t.name = 'Skåla'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080', 'Mount Hoven Hike in Norway'
FROM public.trails t
WHERE t.name = 'Mount Hoven'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080', 'Prest Hike in Norway'
FROM public.trails t
WHERE t.name = 'Prest'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Aurlandsdalen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Aurlandsdalen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080', 'Kolsåstoppen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Kolsåstoppen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080', 'Vettakollen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Vettakollen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080', 'Fjellheisen to Tromsdalstinden Hike in Norway'
FROM public.trails t
WHERE t.name = 'Fjellheisen to Tromsdalstinden'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080', 'Sherpatrappa Hike in Norway'
FROM public.trails t
WHERE t.name = 'Sherpatrappa'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1606775986873-10e6a39d4863?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080', 'Knutshøe Hike in Norway'
FROM public.trails t
WHERE t.name = 'Knutshøe'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080', 'Rondslottet Hike in Norway'
FROM public.trails t
WHERE t.name = 'Rondslottet'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080', 'Peer Gynt Hytta Hike in Norway'
FROM public.trails t
WHERE t.name = 'Peer Gynt Hytta'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080', 'Snøhetta Hike in Norway'
FROM public.trails t
WHERE t.name = 'Snøhetta'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080', 'Gaustatoppen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Gaustatoppen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080', 'Vøringsfossen Viewpoint Hike Hike in Norway'
FROM public.trails t
WHERE t.name = 'Vøringsfossen Viewpoint Hike'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080', 'Storsæterfossen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Storsæterfossen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Løsta Hike in Norway'
FROM public.trails t
WHERE t.name = 'Løsta'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080', 'Sukkertoppen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Sukkertoppen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080', 'Baneheia Hike in Norway'
FROM public.trails t
WHERE t.name = 'Baneheia'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080', 'Odderøya Hike in Norway'
FROM public.trails t
WHERE t.name = 'Odderøya'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1577717646549-3543b35beaa7?w=1080', 'Plateaufjellet Hike in Norway'
FROM public.trails t
WHERE t.name = 'Plateaufjellet'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1577717646549-3543b35beaa7?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080', 'Trollsteinen Hike in Norway'
FROM public.trails t
WHERE t.name = 'Trollsteinen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080', 'Per Karsa Hike in Norway'
FROM public.trails t
WHERE t.name = 'Per Karsa'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1625902047395-97fcb5b0ddbb?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'trails', t.id, 'GALLERY', 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080', 'Linken Hike in Norway'
FROM public.trails t
WHERE t.name = 'Linken'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'trails' 
  AND cm.entity_id = t.id 
  AND cm.media_url = 'https://images.unsplash.com/photo-1505307559253-157d605cb497?w=1080'
);
