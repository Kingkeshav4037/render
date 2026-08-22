-- Insert comprehensive nation-wide locations for Norway Smartlife
-- This data powers the main /map and /explore pages

INSERT INTO locations (id, name, slug, type, latitude, longitude, description, featured)
VALUES
  (gen_random_uuid(), 'Oslo', 'oslo', 'CITY', 59.9139, 10.7522, 'The capital city known for its green spaces, museums, and innovative architecture like the Opera House.', true),
  (gen_random_uuid(), 'Bergen', 'bergen', 'CITY', 60.3913, 5.3221, 'The Gateway to the Fjords, famous for the colorful Bryggen Hanseatic Wharf.', true),
  (gen_random_uuid(), 'Tromsø', 'tromso', 'CITY', 69.6492, 18.9553, 'The Capital of the Arctic, a major cultural hub above the Arctic Circle known for Northern Lights.', true),
  (gen_random_uuid(), 'Trondheim', 'trondheim', 'CITY', 63.4305, 10.3951, 'Norway''s historical capital, home to the magnificent Nidaros Cathedral.', false),
  (gen_random_uuid(), 'Stavanger', 'stavanger', 'CITY', 58.9690, 5.7331, 'The oil capital turned culinary hotspot, close to the stunning Lysefjord.', false),
  (gen_random_uuid(), 'Longyearbyen (Svalbard)', 'svalbard', 'CITY', 78.2232, 15.6267, 'One of the world''s northernmost settlements, situated in the rugged High Arctic.', true),
  (gen_random_uuid(), 'Lofoten Islands', 'lofoten', 'ATTRACTION', 68.1494, 13.6121, 'An archipelago known for its dramatic scenery, peaks, open ocean, and sheltered bays.', true),
  (gen_random_uuid(), 'North Cape', 'north-cape', 'ATTRACTION', 71.1706, 25.7831, 'A cape on the northern coast of the island of Magerøya in Northern Norway. The northernmost point of Europe.', true),
  (gen_random_uuid(), 'Geirangerfjord', 'geirangerfjord', 'FJORD', 62.1015, 7.0941, 'A UNESCO World Heritage site featuring dramatic waterfalls like the Seven Sisters.', true),
  (gen_random_uuid(), 'Nærøyfjord', 'naeroyfjord', 'FJORD', 60.9328, 6.9381, 'One of the narrowest and most spectacular fjords in the world, also UNESCO protected.', false),
  (gen_random_uuid(), 'Jotunheimen National Park', 'jotunheimen', 'NATIONAL_PARK', 61.6333, 8.3167, 'Home to Norway''s highest mountains, Galdhøpiggen and Glittertind.', true),
  (gen_random_uuid(), 'Hardangervidda', 'hardangervidda', 'NATIONAL_PARK', 60.1333, 7.5500, 'The largest national park in Norway and the largest mountain plateau in Europe.', false),
  (gen_random_uuid(), 'Rondane', 'rondane', 'NATIONAL_PARK', 61.9167, 9.8333, 'Norway''s oldest national park, famous for its wild reindeer herds and rocky landscapes.', false)
ON CONFLICT (slug) DO UPDATE 
SET 
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured;
