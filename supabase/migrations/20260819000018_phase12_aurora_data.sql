-- Phase 12: Aurora Data Expansion

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
    ('tromso', 'Tromsø', 'The capital of the Arctic, renowned as one of the world''s best places to see the Northern Lights.', 'Northern Norway', 'CITY', 69.6492, 18.9553),
    ('alta', 'Alta', 'The City of the Northern Lights, home to the first modern Aurora observatory.', 'Northern Norway', 'CITY', 69.9689, 23.2716),
    ('kirkenes', 'Kirkenes', 'A remote frontier town near the Russian border with extremely dry, clear winter skies.', 'Northern Norway', 'CITY', 69.7271, 30.045),
    ('svalbard', 'Svalbard', 'Located midway between continental Norway and the North Pole; experiences the polar night allowing daytime Aurora viewing.', 'Svalbard', 'ISLAND', 78.2232, 15.6267),
    ('senja', 'Senja', 'Norway''s second-largest island offers dramatic mountains meeting the sea under dark skies.', 'Northern Norway', 'ISLAND', 69.309, 17.2917),
    ('lofoten', 'Lofoten', 'An archipelago known for its dramatic scenery, with auroras reflecting over the ocean and fishing villages.', 'Northern Norway', 'ISLAND', 68.1408, 13.5684),
    ('vesteralen', 'Vesterålen', 'A peaceful archipelago offering incredible whale watching during the day and auroras at night.', 'Northern Norway', 'ISLAND', 68.6946, 15.4162),
    ('narvik', 'Narvik', 'Surrounded by mountains and fjords, offering unique high-altitude viewing from Narvikfjellet.', 'Northern Norway', 'CITY', 68.4385, 17.4273),
    ('bodo', 'Bodø', 'A vibrant coastal city just north of the Arctic Circle with excellent transport links.', 'Northern Norway', 'CITY', 67.2804, 14.4049),
    ('lyngen', 'Lyngen', 'The majestic Lyngen Alps create a dramatic jagged silhouette against the glowing night sky.', 'Northern Norway', 'CITY', 69.5786, 20.2185),
    ('hammerfest', 'Hammerfest', 'One of the northernmost towns in the world, historically important and great for Northern Lights hunting.', 'Northern Norway', 'CITY', 70.6634, 23.6821),
    ('nordkapp', 'Nordkapp', 'The northernmost point of mainland Europe, offering an unobstructed view of the Arctic sky.', 'Northern Norway', 'VIEWPOINT', 71.1709, 25.783),
    ('kautokeino', 'Kautokeino', 'The heart of Sami culture in the Finnmark plateau, offering very stable, cold, and clear weather.', 'Northern Norway', 'VILLAGE', 69.0118, 23.0416),
    ('karasjok', 'Karasjok', 'Another major Sami hub known for extreme winter cold and very clear skies, perfect for the aurora.', 'Northern Norway', 'VILLAGE', 69.4727, 25.5113),
    ('andoya', 'Andøya', 'Northernmost island in the Vesterålen archipelago, offering dark skies over the Norwegian sea.', 'Northern Norway', 'ISLAND', 69.1026, 15.8943)
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
    ('tromso', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Fjellheisen', 'Ersfjordbotn', 'Sommarøy']),
    ('alta', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'], ARRAY['Haldde Observatory', 'Alta Fjord', 'Sautso']),
    ('kirkenes', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Pasvik Valley', 'Snowhotel Kirkenes', 'Barents Sea Coast']),
    ('svalbard', ARRAY['November', 'December', 'January', 'February'], ARRAY['Longyearbyen', 'Camp Barentz', 'Adventdalen']),
    ('senja', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Tungeneset', 'Bergsbotn', 'Mefjordvær']),
    ('lofoten', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Haukland Beach', 'Reine', 'Uttakleiv Beach']),
    ('vesteralen', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Andøya Space', 'Bleik', 'Sortland']),
    ('narvik', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Narvikfjellet', 'Ofotfjord', 'Skjomen']),
    ('bodo', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Mount Rønvikfjellet', 'Mjelle Beach', 'Saltstraumen']),
    ('lyngen', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Lyngseidet', 'Koppangen', 'Svensby']),
    ('hammerfest', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Mount Salen', 'Forsøl', 'Seiland National Park']),
    ('nordkapp', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], ARRAY['North Cape Plateau', 'Skarsvåg', 'Gjesvær']),
    ('kautokeino', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Finnmarksvidda', 'Juhls Silver Gallery area', 'Masi']),
    ('karasjok', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Sami Parliament area', 'Engholm Husky Lodge', 'Karasjohka River']),
    ('andoya', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Andøya Space Observatory', 'Bleik Beach', 'Andenes Lighthouse'])
) AS new_aurora(slug, best_months, viewing)
JOIN public.locations loc ON loc.slug = new_aurora.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.aurora_destinations ad WHERE ad.location_id = loc.id
);
