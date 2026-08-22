-- Phase 16: Cleanup and Activities Data Population

-- 1. Create Activities Data
INSERT INTO public.activities (id, location_id, name, type, description, duration_minutes, difficulty_level, price, currency, equipment_needed, featured, status, tags)
SELECT
  gen_random_uuid(),
  loc.id,
  new_activity.name,
  new_activity.type::public.activity_type,
  new_activity.description,
  new_activity.duration_minutes,
  new_activity.difficulty_level,
  new_activity.price,
  new_activity.currency,
  new_activity.equipment_needed,
  new_activity.featured,
  new_activity.status::public.content_status,
  new_activity.tags::text[]
FROM (
  VALUES
    ('tromso', 'Fjord & Wildlife Cruise', 'WILDLIFE', 'Experience the stunning fjords and arctic wildlife from a hybrid-electric catamaran.', 300, 'EASY', 1400, 'NOK', '{"Warm layers"}'::text[], true, 'PUBLISHED', '{"Wildlife", "Fjords", "Boat"}'),
    ('tromso', 'Northern Lights Dog Sledding', 'ADVENTURE', 'Drive your own team of huskies under the Aurora Borealis in the Arctic wilderness.', 240, 'MODERATE', 2100, 'NOK', '{"Thermal suit provided"}'::text[], true, 'PUBLISHED', '{"Aurora", "Dogs", "Winter"}'),
    ('tromso', 'Arctic Snowmobile Safari', 'ADVENTURE', 'High-speed adventure across the Lyngen Alps snowscapes.', 270, 'MODERATE', 1950, 'NOK', '{"Driver''s License"}'::text[], false, 'PUBLISHED', '{"Snow", "Action"}'),
    ('tromso', 'Sami Culture & Reindeer Experience', 'CULTURE', 'Feed the reindeer and listen to ancient Sami storytelling in a traditional lavvu.', 240, 'EASY', 1500, 'NOK', '{"Warm clothing"}'::text[], false, 'PUBLISHED', '{"Culture", "Animals"}'),
    ('bergen', 'Fjord Safari to Mostraumen', 'SIGHTSEEING', 'A high-speed RIB boat tour through narrow, steep-sided fjords near Bergen.', 180, 'EASY', 1100, 'NOK', '{"Warm layers"}'::text[], true, 'PUBLISHED', '{"Fjords", "Boat", "Nature"}'),
    ('bergen', 'Mt. Ulriken Zipline', 'ADVENTURE', 'Soar through the air high above Bergen on Norway''s fastest zipline.', 60, 'MODERATE', 450, 'NOK', '{"Comfortable clothes"}'::text[], false, 'PUBLISHED', '{"Action", "Views"}'),
    ('bergen', 'Bryggen Historical Walk', 'CULTURE', 'Guided walking tour through the UNESCO World Heritage Hanseatic wharf.', 90, 'EASY', 350, 'NOK', '{"Walking shoes"}'::text[], false, 'PUBLISHED', '{"History", "City"}'),
    ('geirangerfjord', 'Geirangerfjord Kayak Tour', 'WATER_SPORTS', 'Paddle close to the famous Seven Sisters waterfall in a sea kayak.', 180, 'MODERATE', 1200, 'NOK', '{"Waterproof gear"}'::text[], true, 'PUBLISHED', '{"Fjords", "Kayak", "Nature"}'),
    ('geirangerfjord', 'Rib Boat Safari', 'ADVENTURE', 'Fast-paced nature safari on the Geirangerfjord.', 90, 'EASY', 950, 'NOK', '{"Warm clothes"}'::text[], false, 'PUBLISHED', '{"Action", "Fjords"}'),
    ('lofoten', 'Midnight Sun Surfing', 'WATER_SPORTS', 'Surfing lessons in the Arctic Ocean under the midnight sun at Unstad beach.', 240, 'HARD', 1500, 'NOK', '{"Swimwear (Wetsuit provided)"}'::text[], true, 'PUBLISHED', '{"Surf", "Arctic", "Summer"}'),
    ('lofoten', 'Sea Eagle Safari', 'WILDLIFE', 'RIB boat tour to Trollfjord to witness giant sea eagles diving for fish.', 120, 'EASY', 1050, 'NOK', '{"Warm clothing"}'::text[], true, 'PUBLISHED', '{"Wildlife", "Boat"}'),
    ('lofoten', 'Reinebringen Guided Hike', 'HIKING', 'Guided hike up the famous Reinebringen steps for the iconic Lofoten view.', 180, 'HARD', 800, 'NOK', '{"Hiking boots", "Water"}'::text[], false, 'PUBLISHED', '{"Hiking", "Views"}'),
    ('lofoten', 'Arctic Cod Fishing', 'CULTURE', 'Traditional Lofoten fishing experience on a historic vessel.', 240, 'MODERATE', 1200, 'NOK', '{"Warm layers"}'::text[], false, 'PUBLISHED', '{"Fishing", "Culture"}'),
    ('oslo', 'Oslo Fjord Sauna', 'CULTURE', 'Floating sauna session followed by a refreshing dip in the Oslo Fjord.', 120, 'EASY', 250, 'NOK', '{"Swimwear", "Towel"}'::text[], true, 'PUBLISHED', '{"Sauna", "City", "Wellness"}'),
    ('oslo', 'Vigeland Park Segway Tour', 'SIGHTSEEING', 'Glide through the world''s largest sculpture park by a single artist.', 120, 'EASY', 600, 'NOK', '{"Comfortable shoes"}'::text[], false, 'PUBLISHED', '{"City", "Art"}'),
    ('oslo', 'Nordmarka Cross-Country Skiing', 'SKIING', 'Guided cross-country skiing in the forests surrounding Oslo.', 180, 'MODERATE', 850, 'NOK', '{"Winter sports gear"}'::text[], false, 'PUBLISHED', '{"Skiing", "Winter"}'),
    ('oslo', 'Munch Museum Art Tour', 'CULTURE', 'In-depth guided tour focusing on Edvard Munch''s life and work.', 90, 'EASY', 450, 'NOK', '{"None"}'::text[], false, 'PUBLISHED', '{"Art", "Museum"}'),
    ('stavanger', 'Pulpit Rock Sunrise Hike', 'HIKING', 'Beat the crowds with an early morning guided hike to Preikestolen.', 360, 'MODERATE', 1300, 'NOK', '{"Hiking boots", "Headlamp", "Water"}'::text[], true, 'PUBLISHED', '{"Hiking", "Views", "Sunrise"}'),
    ('stavanger', 'Lysefjord Cruise', 'SIGHTSEEING', 'Electric boat cruise deep into the Lysefjord, passing under Pulpit Rock.', 180, 'EASY', 850, 'NOK', '{"Windproof jacket"}'::text[], false, 'PUBLISHED', '{"Fjords", "Boat"}'),
    ('stavanger', 'NuArt Street Art Walk', 'CULTURE', 'Guided walking tour of Stavanger''s famous international street art.', 90, 'EASY', 300, 'NOK', '{"Walking shoes"}'::text[], false, 'PUBLISHED', '{"Art", "City"}'),
    ('flam', 'Flåm Railway & Cycling', 'ADVENTURE', 'Take the train up the mountain and cycle back down the spectacular Rallarvegen.', 300, 'MODERATE', 1600, 'NOK', '{"Activewear", "Windproof jacket"}'::text[], true, 'PUBLISHED', '{"Train", "Cycling", "Nature"}'),
    ('flam', 'Nærøyfjord RIB Safari', 'SIGHTSEEING', 'Explore the narrowest and most spectacular branch of the Sognefjord.', 120, 'EASY', 950, 'NOK', '{"Warm layers"}'::text[], false, 'PUBLISHED', '{"Fjords", "UNESCO", "Boat"}'),
    ('flam', 'Stegastein Viewpoint Tour', 'SIGHTSEEING', 'Bus tour to the spectacular platform jutting 30 meters out over the Aurlandsfjord.', 90, 'EASY', 400, 'NOK', '{"Camera"}'::text[], false, 'PUBLISHED', '{"Views", "Nature"}'),
    ('trondheim', 'Nidaros Cathedral Tower Climb', 'CULTURE', 'Climb the dark, narrow stairs to the top of the cathedral for city views.', 60, 'MODERATE', 250, 'NOK', '{"Comfortable shoes"}'::text[], true, 'PUBLISHED', '{"History", "Views"}'),
    ('trondheim', 'Nidelva Urban Kayaking', 'WATER_SPORTS', 'Paddle through the heart of Trondheim along the historic colorful wharves.', 120, 'EASY', 750, 'NOK', '{"Change of clothes"}'::text[], false, 'PUBLISHED', '{"Kayak", "City"}'),
    ('trondheim', 'Bymarka Foraging Walk', 'NATURE', 'Learn to find and identify edible wild plants, berries, and mushrooms.', 180, 'EASY', 600, 'NOK', '{"Hiking shoes", "Basket"}'::text[], false, 'PUBLISHED', '{"Nature", "Food"}'),
    ('svalbard', 'Glacier Ice Cave Exploration', 'ADVENTURE', 'Hike into a meltwater channel inside an ancient glacier.', 240, 'HARD', 1400, 'NOK', '{"Winter gear", "Sturdy boots"}'::text[], true, 'PUBLISHED', '{"Arctic", "Ice", "Winter"}'),
    ('svalbard', 'Walrus Boat Safari', 'WILDLIFE', 'Boat trip to Borebukta to observe walruses lounging on the ice.', 300, 'EASY', 2100, 'NOK', '{"Warm clothing"}'::text[], false, 'PUBLISHED', '{"Wildlife", "Boat", "Arctic"}'),
    ('svalbard', 'Arctic Wilderness Expedition', 'NATURE', 'Multi-day guided snowmobile and cabin expedition.', 2880, 'HARD', 12500, 'NOK', '{"Extreme winter gear"}'::text[], false, 'PUBLISHED', '{"Expedition", "Action"}'),
    ('alesund', 'Art Nouveau City Walk', 'CULTURE', 'Guided tour of the town rebuilt in Jugendstil architecture after the 1904 fire.', 90, 'EASY', 350, 'NOK', '{"Walking shoes"}'::text[], true, 'PUBLISHED', '{"History", "Architecture"}')
) AS new_activity(slug, name, type, description, duration_minutes, difficulty_level, price, currency, equipment_needed, featured, status, tags)
LEFT JOIN public.locations loc ON loc.slug = new_activity.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.activities a WHERE a.name = new_activity.name
);

-- 2. Update missing images for Restaurants (Use contextually appropriate Unsplash placeholders)
UPDATE public.restaurants
SET image_url = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600'
WHERE image_url IS NULL AND type = 'FINE_DINING';

UPDATE public.restaurants
SET image_url = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600'
WHERE image_url IS NULL AND type = 'CASUAL';

UPDATE public.restaurants
SET image_url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1600'
WHERE image_url IS NULL AND type = 'CAFE';

UPDATE public.restaurants
SET image_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600'
WHERE image_url IS NULL;

-- 3. Update missing images for Accommodations
UPDATE public.accommodations
SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600'
WHERE image_url IS NULL AND type = 'HOTEL';

UPDATE public.accommodations
SET image_url = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600'
WHERE image_url IS NULL AND type = 'CABIN';

UPDATE public.accommodations
SET image_url = 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1600'
WHERE image_url IS NULL;

-- 4. Update missing images for Events
UPDATE public.events
SET image_url = 'https://images.unsplash.com/photo-1533174000273-e18fa440a340?q=80&w=1600'
WHERE image_url IS NULL AND category = 'FESTIVAL';

UPDATE public.events
SET image_url = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600'
WHERE image_url IS NULL AND category = 'CONCERT';

UPDATE public.events
SET image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600'
WHERE image_url IS NULL;

-- 5. Fix missing location IDs for Events
-- Distribute events randomly across major cities where location is currently missing
WITH missing_locs AS (
  SELECT e.id,
         (ARRAY(SELECT id FROM public.locations WHERE status = 'PUBLISHED' LIMIT 5))[floor(random() * 5 + 1)] AS random_loc_id
  FROM public.events e
  WHERE e.location_id IS NULL
)
UPDATE public.events
SET location_id = missing_locs.random_loc_id
FROM missing_locs
WHERE public.events.id = missing_locs.id;
