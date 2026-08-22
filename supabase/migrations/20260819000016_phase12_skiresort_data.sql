-- Phase 12: Ski Resort Data Expansion

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
    ('trysil', 'Trysil', 'Norway''s largest ski resort with 69 slopes and 32 lifts.', 'Eastern Norway', 61.3148, 12.2612),
    ('hemsedal', 'Hemsedal', 'Known as the Scandinavian Alps, offering steep mountains and great freeriding.', 'Eastern Norway', 60.8584, 8.5447),
    ('hafjell', 'Hafjell', 'Family-friendly resort built for the 1994 Winter Olympics.', 'Eastern Norway', 61.2327, 10.456),
    ('kvitfjell', 'Kvitfjell', 'World Cup downhill course and great snow reliability.', 'Eastern Norway', 61.4724, 10.134),
    ('geilo', 'Geilo', 'One of Norway''s oldest ski resorts with excellent family facilities.', 'Eastern Norway', 60.5332, 8.2091),
    ('oppdal', 'Oppdal', 'Four mountains connected by lifts, popular for off-piste and large areas.', 'Trøndelag', 62.5937, 9.6917),
    ('voss', 'Voss', 'The adventure capital of Norway, with two distinct ski centers (Voss Resort and Myrkdalen).', 'Western Norway', 60.6277, 6.4258),
    ('myrkdalen', 'Myrkdalen', 'Known for massive snowfalls and incredible off-piste skiing.', 'Western Norway', 60.8359, 6.4716),
    ('narvikfjellet', 'Narvikfjellet', 'Urban skiing with stunning fjord and ocean views well north of the Arctic Circle.', 'Northern Norway', 68.4312, 17.4475),
    ('hovden', 'Hovden', 'The largest ski resort in southern Norway.', 'Southern Norway', 59.5583, 7.3551),
    ('norefjell', 'Norefjell', 'A short drive from Oslo, with the greatest elevation drop of any resort in Northern Europe.', 'Eastern Norway', 60.2319, 9.516),
    ('beitostolen', 'Beitostølen', 'Family-friendly with reliable snow and amazing cross-country networks.', 'Eastern Norway', 61.2486, 8.9056),
    ('gaustablikk', 'Gaustablikk', 'Iconic views towards Gaustatoppen and beautiful family skiing.', 'Eastern Norway', 59.8797, 8.7456),
    ('skeikampen', 'Skeikampen', 'Charming family resort offering great alpine and cross-country.', 'Eastern Norway', 61.3468, 10.0818),
    ('roldal', 'Røldal', 'Known as the snowiest place in Norway, an absolute mecca for freeriders.', 'Western Norway', 59.8327, 6.8202),
    ('kongberg', 'Kongsberg', 'Local favourite near Oslo with varied slopes.', 'Eastern Norway', 59.6644, 9.6108),
    ('strandafjellet', 'Strandafjellet', 'Powder paradise with spectacular views of the Storfjord.', 'Western Norway', 62.3087, 6.8624),
    ('sirdal', 'Sirdal', 'The largest ski area in the south-west of Norway.', 'Southern Norway', 58.9103, 6.9458),
    ('tromso-alpinpark', 'Tromsø Alpinpark', 'Urban skiing with aurora possibilities.', 'Northern Norway', 69.6457, 19.0436),
    ('vradal', 'Vrådal', 'Picturesque and family-friendly resort in Telemark.', 'Eastern Norway', 59.3248, 8.4691),
    ('stryn-sommerski', 'Stryn Sommerski', 'Famous summer ski centre located on the Tystigbreen glacier.', 'Western Norway', 61.9442, 7.3752),
    ('bjorli', 'Bjorli', 'One of the first places to get natural snow in Norway.', 'Eastern Norway', 62.2573, 8.1963),
    ('gola', 'Gålå', 'Scenic family resort in the Gudbrandsdalen valley.', 'Eastern Norway', 61.5034, 9.8),
    ('oslo-vinterpark', 'Oslo Vinterpark', 'Tryvann – largest ski resort in the Oslo area.', 'Eastern Norway', 59.9868, 10.6672),
    ('raufjell', 'Rauland', 'One of Telemark''s largest ski destinations with interconnected ski areas.', 'Eastern Norway', 59.7341, 8.0068)
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
    ('trysil', 32, 69, '{"green": 21, "blue": 17, "red": 18, "black": 13}', 'November - April'),
    ('hemsedal', 21, 53, '{"green": 19, "blue": 14, "red": 11, "black": 9}', 'November - May'),
    ('hafjell', 19, 50, '{"green": 12, "blue": 15, "red": 15, "black": 8}', 'November - April'),
    ('kvitfjell', 14, 34, '{"green": 7, "blue": 10, "red": 13, "black": 4}', 'October - April'),
    ('geilo', 20, 40, '{"green": 10, "blue": 15, "red": 10, "black": 5}', 'November - April'),
    ('oppdal', 14, 39, '{"green": 10, "blue": 10, "red": 15, "black": 4}', 'December - April'),
    ('voss', 11, 24, '{"green": 4, "blue": 7, "red": 10, "black": 3}', 'December - April'),
    ('myrkdalen', 9, 22, '{"green": 6, "blue": 7, "red": 6, "black": 3}', 'November - May'),
    ('narvikfjellet', 6, 15, '{"green": 2, "blue": 4, "red": 6, "black": 3}', 'December - May'),
    ('hovden', 8, 32, '{"green": 10, "blue": 10, "red": 10, "black": 2}', 'November - April'),
    ('norefjell', 14, 30, '{"green": 8, "blue": 8, "red": 10, "black": 4}', 'November - April'),
    ('beitostolen', 9, 21, '{"green": 12, "blue": 5, "red": 3, "black": 1}', 'November - April'),
    ('gaustablikk', 13, 35, '{"green": 15, "blue": 10, "red": 7, "black": 3}', 'November - April'),
    ('skeikampen', 11, 21, '{"green": 8, "blue": 6, "red": 5, "black": 2}', 'November - April'),
    ('roldal', 6, 12, '{"green": 2, "blue": 4, "red": 4, "black": 2}', 'December - May'),
    ('kongberg', 5, 11, '{"green": 2, "blue": 3, "red": 4, "black": 2}', 'December - April'),
    ('strandafjellet', 7, 17, '{"green": 3, "blue": 5, "red": 7, "black": 2}', 'December - April'),
    ('sirdal', 9, 22, '{"green": 6, "blue": 8, "red": 6, "black": 2}', 'December - April'),
    ('tromso-alpinpark', 3, 6, '{"green": 1, "blue": 2, "red": 2, "black": 1}', 'January - May'),
    ('vradal', 8, 15, '{"green": 5, "blue": 5, "red": 4, "black": 1}', 'December - April'),
    ('stryn-sommerski', 1, 3, '{"green": 1, "blue": 1, "red": 1, "black": 0}', 'June - July'),
    ('bjorli', 6, 11, '{"green": 3, "blue": 4, "red": 3, "black": 1}', 'November - April'),
    ('gola', 7, 15, '{"green": 5, "blue": 5, "red": 4, "black": 1}', 'December - April'),
    ('oslo-vinterpark', 11, 18, '{"green": 5, "blue": 6, "red": 4, "black": 3}', 'December - April'),
    ('raufjell', 18, 49, '{"green": 15, "blue": 15, "red": 14, "black": 5}', 'December - April')
) AS new_resort(slug, lifts, runs, diff, season)
JOIN public.locations l ON l.slug = new_resort.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.ski_resorts s WHERE s.location_id = l.id
);

-- 3. Insert media

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080', 'Trysil Ski Resort'
FROM public.locations l
WHERE l.slug = 'trysil'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080', 'Hemsedal Ski Resort'
FROM public.locations l
WHERE l.slug = 'hemsedal'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080', 'Hafjell Ski Resort'
FROM public.locations l
WHERE l.slug = 'hafjell'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080', 'Kvitfjell Ski Resort'
FROM public.locations l
WHERE l.slug = 'kvitfjell'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1478719059408-592965723cbc?w=1080', 'Geilo Ski Resort'
FROM public.locations l
WHERE l.slug = 'geilo'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1478719059408-592965723cbc?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1605548230624-8d2d0419c517?w=1080', 'Oppdal Ski Resort'
FROM public.locations l
WHERE l.slug = 'oppdal'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1605548230624-8d2d0419c517?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080', 'Voss Ski Resort'
FROM public.locations l
WHERE l.slug = 'voss'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080', 'Myrkdalen Ski Resort'
FROM public.locations l
WHERE l.slug = 'myrkdalen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1542456485-bd36ce0cc91d?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080', 'Narvikfjellet Ski Resort'
FROM public.locations l
WHERE l.slug = 'narvikfjellet'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080', 'Hovden Ski Resort'
FROM public.locations l
WHERE l.slug = 'hovden'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080', 'Norefjell Ski Resort'
FROM public.locations l
WHERE l.slug = 'norefjell'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1612089297654-206e2e28a506?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080', 'Beitostølen Ski Resort'
FROM public.locations l
WHERE l.slug = 'beitostolen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1610023602987-9bc952ba5c2d?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080', 'Gaustablikk Ski Resort'
FROM public.locations l
WHERE l.slug = 'gaustablikk'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1547820690-0b60e61d8481?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080', 'Skeikampen Ski Resort'
FROM public.locations l
WHERE l.slug = 'skeikampen'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080', 'Røldal Ski Resort'
FROM public.locations l
WHERE l.slug = 'roldal'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700813955-46b5bd2563ea?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080', 'Kongsberg Ski Resort'
FROM public.locations l
WHERE l.slug = 'kongberg'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1601633513338-724d2719a712?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080', 'Strandafjellet Ski Resort'
FROM public.locations l
WHERE l.slug = 'strandafjellet'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1596422846543-74c6924e037c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080', 'Sirdal Ski Resort'
FROM public.locations l
WHERE l.slug = 'sirdal'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1596700778736-2bf9e0239cf2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080', 'Tromsø Alpinpark Ski Resort'
FROM public.locations l
WHERE l.slug = 'tromso-alpinpark'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080', 'Vrådal Ski Resort'
FROM public.locations l
WHERE l.slug = 'vradal'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080', 'Stryn Sommerski Ski Resort'
FROM public.locations l
WHERE l.slug = 'stryn-sommerski'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1629806497148-390494cf018c?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080', 'Bjorli Ski Resort'
FROM public.locations l
WHERE l.slug = 'bjorli'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1616421098675-9b247fcf64bc?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080', 'Gålå Ski Resort'
FROM public.locations l
WHERE l.slug = 'gola'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1549880193-2771d9dcb8e1?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080', 'Oslo Vinterpark Ski Resort'
FROM public.locations l
WHERE l.slug = 'oslo-vinterpark'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1601111626074-60144fbb61c2?w=1080'
);

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'locations', l.id, 'GALLERY', 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080', 'Rauland Ski Resort'
FROM public.locations l
WHERE l.slug = 'raufjell'
AND NOT EXISTS (
  SELECT 1 FROM public.content_media cm 
  WHERE cm.entity_type = 'locations' 
  AND cm.entity_id = l.id
  AND cm.media_url = 'https://images.unsplash.com/photo-1628174542289-548c7c77c6ed?w=1080'
);
