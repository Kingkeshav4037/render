-- Phase 11: Seed Activities & Experiences (Trails, Skiing, Road Trips, Aurora)

-- Insert Trails (using existing 'trails' table)
INSERT INTO public.trails (id, name, description, difficulty, distance_km, estimated_duration_minutes)
VALUES
('60000000-0000-0000-0000-000000000001', 'Preikestolen (Pulpit Rock)', 'A steep cliff which rises 604 metres above the Lysefjorden.', 'Moderate', 8.0, 240),
('60000000-0000-0000-0000-000000000002', 'Trolltunga', 'A rock formation situated about 1,100 metres above sea level.', 'Expert', 28.0, 720),
('60000000-0000-0000-0000-000000000003', 'Besseggen Ridge', 'One of Norway’s most popular mountain hikes, offering views of green and blue lakes.', 'Difficult', 14.0, 480)
ON CONFLICT DO NOTHING;

-- Insert Ski Resorts
INSERT INTO public.ski_resorts (id, location_id, lifts, runs, snow_season, source_type, seo_title)
VALUES
('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 31, 68, 'November - May', 'editorial', 'Trysil Ski Resort - Norway SmartLife'),
('70000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 20, 49, 'November - May', 'editorial', 'Hemsedal Ski Resort - Norway SmartLife')
ON CONFLICT DO NOTHING;

-- Insert Aurora Destinations
INSERT INTO public.aurora_destinations (id, location_id, best_months, viewing_locations, source_type)
VALUES
('80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], ARRAY['Tromsø Cable Car', 'Kvaløya'], 'editorial')
ON CONFLICT DO NOTHING;

-- Insert Road Trips
INSERT INTO public.road_trips (id, name, slug, description, duration_days, distance_km, season, source_type)
VALUES
('90000000-0000-0000-0000-000000000001', 'Atlantic Ocean Road', 'atlantic-ocean-road', 'A breathtakingly scenic 8.3-kilometer long section of County Road 64 that runs through an archipelago.', 1, 8, 'Summer', 'editorial'),
('90000000-0000-0000-0000-000000000002', 'Trollstigen (The Troll''s Path)', 'trollstigen', 'A serpentine mountain road with eleven hairpin bends.', 1, 106, 'Summer', 'editorial')
ON CONFLICT (slug) DO NOTHING;
