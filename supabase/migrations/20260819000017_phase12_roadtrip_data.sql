-- Phase 12: Road Trip Data Expansion

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
    ('atlantic-ocean-road', 'Atlantic Ocean Road', 'The world''s most beautiful drive, crossing eight bridges between islets.', 36, 1, 'May - September', 'EASY', ARRAY['Storseisundet Bridge', 'Eldhusøya', 'Askevågen']),
    ('trollstigen', 'Trollstigen', 'A dramatic, winding mountain road with eleven hairpin bends.', 106, 1, 'June - September', 'MODERATE', ARRAY['Trollstigen Viewpoint', 'Stigfossen', 'Gudbrandsjuvet']),
    ('lofoten-scenic-route', 'Lofoten Scenic Route', 'A breathtaking journey through the Lofoten archipelago.', 230, 3, 'May - September', 'EASY', ARRAY['Reine', 'Henningsvær', 'Nusfjord']),
    ('helgeland-coast', 'Helgeland Coast', 'The longest scenic route in Norway, offering thousands of islands and mountains.', 433, 4, 'June - August', 'EASY', ARRAY['Torghatten', 'De Syv Søstre', 'Svartisen Glacier']),
    ('senja-route', 'Senja', 'A spectacular ocean drive with steep mountains dropping straight into the sea.', 90, 1, 'May - September', 'MODERATE', ARRAY['Tungeneset', 'Bergsbotn', 'Ersfjordstranda']),
    ('hardanger-route', 'Hardanger', 'Drive through the orchard of Norway alongside the majestic Hardangerfjord.', 158, 2, 'May - September', 'EASY', ARRAY['Vøringsfossen', 'Låtefoss', 'Steinsdalsfossen']),
    ('aurlandsfjellet', 'Aurlandsfjellet', 'The snow road between the fjords.', 47, 1, 'June - October', 'MODERATE', ARRAY['Stegastein Viewpoint', 'Flotane', 'Vedahaugane']),
    ('sognefjellet', 'Sognefjellet', 'Northern Europe''s highest mountain pass.', 108, 1, 'May - September', 'MODERATE', ARRAY['Fantesteinen', 'Mefjellet', 'Liasanden']),
    ('valdresflye', 'Valdresflye', 'A scenic mountain drive offering expansive plateaus and mountain peaks.', 49, 1, 'June - September', 'MODERATE', ARRAY['Gjende', 'Bygdin', 'Rjupa']),
    ('rondane-route', 'Rondane', 'Driving along the blue mountains of Norway''s oldest national park.', 75, 1, 'May - October', 'EASY', ARRAY['Sohlbergplassen', 'Strømbu', 'Atnsjøen']),
    ('gamle-strynefjellsvegen', 'Gamle Strynefjellsvegen', 'A historical masterpiece of engineering winding through the mountains.', 27, 1, 'June - September', 'MODERATE', ARRAY['Videfossen', 'Øvstefoss', 'Hjelle']),
    ('ryfylke', 'Ryfylke', 'Contrasting landscapes with green archipelagos and steep mountains.', 260, 2, 'May - September', 'MODERATE', ARRAY['Lysefjord', 'Sauda Zinc Mines', 'Svandalsfossen']),
    ('jaeren', 'Jæren', 'A drive with wide horizons and endless sandy beaches.', 41, 1, 'All year', 'EASY', ARRAY['Orrestranda', 'Kvassheim Lighthouse', 'Borestranda']),
    ('andoya', 'Andøya', 'Where the ocean meets the steep mountains.', 58, 1, 'May - September', 'EASY', ARRAY['Kleivodden', 'Bukkekjerka', 'Bleik']),
    ('varanger', 'Varanger', 'Journey to the Arctic Ocean, surrounded by tundra and dramatic coastline.', 160, 2, 'June - September', 'MODERATE', ARRAY['Steilneset Memorial', 'Hamningberg', 'Ekkerøy']),
    ('gaularfjellet', 'Gaularfjellet', 'The road of waterfalls along the mighty Gaularvassdraget river.', 114, 1, 'May - October', 'MODERATE', ARRAY['Utsikten Viewpoint', 'Likholefossen', 'Vallestadfossen']),
    ('geiranger-trollstigen', 'Geiranger–Trollstigen', 'The golden route connecting the most dramatic fjord and mountain landscapes.', 104, 1, 'June - September', 'HARD', ARRAY['Geirangerfjord', 'Trollstigen', 'Ørnesvingen']),
    ('nordkapp-route', 'Nordkapp Route', 'The epic drive to the northernmost point of Europe.', 120, 2, 'May - September', 'MODERATE', ARRAY['North Cape', 'Skarsvåg', 'Gjesvær']),
    ('lyngenfjord', 'Lyngenfjord Coastal Drive', 'A beautiful drive flanking the Lyngen Alps.', 150, 2, 'May - October', 'EASY', ARRAY['Lyngen Alps', 'Spåkenes', 'Steindalsbreen']),
    ('sogn-og-fjordane-explorer', 'Sogn og Fjordane Explorer', 'A massive loop encompassing glaciers and the deepest fjords.', 350, 4, 'June - September', 'MODERATE', ARRAY['Jostedalsbreen', 'Fjærland', 'Sognefjord'])
) AS new_trip(slug, name, description, dist, dur, season, diff, highlights)
WHERE NOT EXISTS (
  SELECT 1 FROM public.road_trips rt WHERE rt.slug = new_trip.slug
);
