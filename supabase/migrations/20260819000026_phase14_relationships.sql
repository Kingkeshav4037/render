-- Phase 14: Populate Content Relationships

DO $$
DECLARE
    tromso_id uuid;
    geirangerfjord_id uuid;
    lofoten_id uuid;
    target_id uuid;
BEGIN
    -- 1. Resolve Location IDs
    SELECT id INTO tromso_id FROM public.locations WHERE name = 'Tromsø' LIMIT 1;
    SELECT id INTO geirangerfjord_id FROM public.locations WHERE name = 'Geirangerfjord' LIMIT 1;
    SELECT id INTO lofoten_id FROM public.locations WHERE name = 'Lofoten' LIMIT 1;

    -- 2. Tromsø Relationships
    IF tromso_id IS NOT NULL THEN
        -- Aurora Destination
        SELECT id INTO target_id FROM public.aurora_destinations WHERE location_id = tromso_id LIMIT 1;
        IF target_id IS NOT NULL THEN
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_aurora', 'aurora', target_id) ON CONFLICT DO NOTHING;
        END IF;

        -- Wildlife (e.g., Orca)
        SELECT id INTO target_id FROM public.wildlife_species WHERE common_name ILIKE '%Orca%' LIMIT 1;
        IF target_id IS NOT NULL THEN
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_wildlife', 'wildlife', target_id) ON CONFLICT DO NOTHING;
        END IF;

        -- Restaurants
        FOR target_id IN SELECT id FROM public.restaurants WHERE location_id = tromso_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_restaurant', 'restaurant', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Accommodations
        FOR target_id IN SELECT id FROM public.accommodations WHERE location_id = tromso_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_accommodation', 'accommodation', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Activities
        FOR target_id IN SELECT id FROM public.activities WHERE location_id = tromso_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_activity', 'activity', target_id) ON CONFLICT DO NOTHING;
        END LOOP;
        
        -- Events
        FOR target_id IN SELECT id FROM public.events WHERE location_id = tromso_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', tromso_id, 'has_event', 'event', target_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- 3. Geirangerfjord Relationships
    IF geirangerfjord_id IS NOT NULL THEN
        -- Accommodations
        FOR target_id IN SELECT id FROM public.accommodations WHERE location_id = geirangerfjord_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', geirangerfjord_id, 'has_accommodation', 'accommodation', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Restaurants
        FOR target_id IN SELECT id FROM public.restaurants WHERE location_id = geirangerfjord_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', geirangerfjord_id, 'has_restaurant', 'restaurant', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Activities
        FOR target_id IN SELECT id FROM public.activities WHERE location_id = geirangerfjord_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', geirangerfjord_id, 'has_activity', 'activity', target_id) ON CONFLICT DO NOTHING;
        END LOOP;
        
        -- Trails (Hiking)
        FOR target_id IN SELECT id FROM public.trails WHERE location_id = geirangerfjord_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', geirangerfjord_id, 'has_trail', 'trail', target_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- 4. Lofoten Relationships
    IF lofoten_id IS NOT NULL THEN
        -- Wildlife (e.g., Puffin)
        SELECT id INTO target_id FROM public.wildlife_species WHERE common_name ILIKE '%Puffin%' LIMIT 1;
        IF target_id IS NOT NULL THEN
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', lofoten_id, 'has_wildlife', 'wildlife', target_id) ON CONFLICT DO NOTHING;
        END IF;

        -- Accommodations
        FOR target_id IN SELECT id FROM public.accommodations WHERE location_id = lofoten_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', lofoten_id, 'has_accommodation', 'accommodation', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Restaurants
        FOR target_id IN SELECT id FROM public.restaurants WHERE location_id = lofoten_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', lofoten_id, 'has_restaurant', 'restaurant', target_id) ON CONFLICT DO NOTHING;
        END LOOP;

        -- Trails
        FOR target_id IN SELECT id FROM public.trails WHERE location_id = lofoten_id LIMIT 3 LOOP
            INSERT INTO public.content_relationships (source_type, source_id, relationship_type, target_type, target_id)
            VALUES ('location', lofoten_id, 'has_trail', 'trail', target_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

END $$;
