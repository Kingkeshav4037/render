-- Phase 11: Seed Places (Regions, Cities, Fjords)

-- Clear existing demo places if necessary (assuming fresh reset for demo data)
-- DELETE FROM public.locations WHERE source_type = 'demo';

-- Insert Regions
INSERT INTO public.locations (id, slug, name, description, region, type, status, source_type, lat, lng)
VALUES
('10000000-0000-0000-0000-000000000001', 'northern-norway', 'Northern Norway', 'Experience the midnight sun and northern lights.', 'Northern Norway', 'REGION', 'PUBLISHED', 'editorial', 69.6492, 18.9553),
('10000000-0000-0000-0000-000000000002', 'western-norway', 'Western Norway', 'Home to the iconic Norwegian fjords.', 'Western Norway', 'REGION', 'PUBLISHED', 'editorial', 60.3913, 5.3221),
('10000000-0000-0000-0000-000000000003', 'eastern-norway', 'Eastern Norway', 'Forests, mountains, and the capital city.', 'Eastern Norway', 'REGION', 'PUBLISHED', 'editorial', 59.9139, 10.7522)
ON CONFLICT DO NOTHING;

-- Insert Cities
INSERT INTO public.locations (id, parent_location_id, slug, name, description, region, type, status, source_type, lat, lng)
VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'oslo', 'Oslo', 'The vibrant capital surrounded by nature.', 'Eastern Norway', 'CITY', 'PUBLISHED', 'editorial', 59.9139, 10.7522),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'bergen', 'Bergen', 'The gateway to the fjords.', 'Western Norway', 'CITY', 'PUBLISHED', 'editorial', 60.3913, 5.3221),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'tromso', 'Tromsø', 'Capital of the Arctic.', 'Northern Norway', 'CITY', 'PUBLISHED', 'editorial', 69.6492, 18.9553)
ON CONFLICT DO NOTHING;

-- Insert Fjords
INSERT INTO public.locations (id, parent_location_id, slug, name, description, region, type, status, source_type, lat, lng)
VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'geirangerfjord', 'Geirangerfjord', 'A UNESCO World Heritage site known for spectacular waterfalls.', 'Western Norway', 'FJORD', 'PUBLISHED', 'editorial', 62.1015, 7.0941),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'sognefjord', 'Sognefjord', 'The longest and deepest fjord in Norway.', 'Western Norway', 'FJORD', 'PUBLISHED', 'editorial', 61.1000, 6.0000)
ON CONFLICT DO NOTHING;
