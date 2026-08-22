-- Phase 11: Seed Relationships & Media

-- Insert Content Media
INSERT INTO public.content_media (entity_type, entity_id, media_type, media_url, alt_text, sort_order)
VALUES
('location', '30000000-0000-0000-0000-000000000001', 'HERO', 'https://images.unsplash.com/photo-1513519965511-2eb26fc2689b', 'Geirangerfjord aerial view', 0),
('location', '30000000-0000-0000-0000-000000000002', 'HERO', 'https://images.unsplash.com/photo-1549480397-90c7f2122615', 'Sognefjord landscape', 0),
('wildlife_species', '40000000-0000-0000-0000-000000000001', 'HERO', 'https://images.unsplash.com/photo-1473216892550-96f7e8a94689', 'Arctic Fox in snow', 0),
('wildlife_species', '40000000-0000-0000-0000-000000000003', 'HERO', 'https://images.unsplash.com/photo-1563219323-95248dbcc091', 'Orca breaching', 0),
('aurora_destinations', '80000000-0000-0000-0000-000000000001', 'HERO', 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73', 'Northern Lights over Tromsø', 0)
ON CONFLICT DO NOTHING;

-- Insert Content Relationships
INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
VALUES
-- Tromso (Location) offers Aurora Tracking (Aurora Destination)
('location', '20000000-0000-0000-0000-000000000003', 'offers_activity', 'aurora_destinations', '80000000-0000-0000-0000-000000000001'),
-- Tromso (Location) offers Orca watching (Wildlife)
('location', '20000000-0000-0000-0000-000000000003', 'has_wildlife', 'wildlife_species', '40000000-0000-0000-0000-000000000003'),
-- Trysil (Ski Resort) is located in Eastern Norway
('ski_resorts', '70000000-0000-0000-0000-000000000001', 'located_in', 'location', '10000000-0000-0000-0000-000000000003')
ON CONFLICT (source_type, source_id, target_type, target_id) DO NOTHING;
