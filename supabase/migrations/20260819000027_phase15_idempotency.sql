-- Phase 15: Idempotency and Data Integrity Constraints

-- 1. Tables with slugs
-- Make slug unique where it exists

DO $$
BEGIN
    -- locations
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_location_slug'
    ) THEN
        ALTER TABLE public.locations ADD CONSTRAINT unique_location_slug UNIQUE (slug);
    END IF;

    -- foods
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_food_slug'
    ) THEN
        ALTER TABLE public.foods ADD CONSTRAINT unique_food_slug UNIQUE (slug);
    END IF;

    -- wildlife_species
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_wildlife_slug'
    ) THEN
        ALTER TABLE public.wildlife_species ADD CONSTRAINT unique_wildlife_slug UNIQUE (slug);
    END IF;

    -- road_trips
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_road_trip_slug'
    ) THEN
        -- Check if road_trips has a slug column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'road_trips' AND column_name = 'slug') THEN
            ALTER TABLE public.road_trips ADD CONSTRAINT unique_road_trip_slug UNIQUE (slug);
        END IF;
    END IF;

    -- ski_resorts
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_ski_resort_slug'
    ) THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ski_resorts' AND column_name = 'slug') THEN
            ALTER TABLE public.ski_resorts ADD CONSTRAINT unique_ski_resort_slug UNIQUE (slug);
        END IF;
    END IF;
END $$;


-- 2. Tables without guaranteed slugs
-- Make (name, location_id) unique to prevent duplicates in the same region
-- For tables without location_id, just (name)

DO $$
BEGIN
    -- activities (name, location_id)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_activity_name_loc'
    ) THEN
        ALTER TABLE public.activities ADD CONSTRAINT unique_activity_name_loc UNIQUE (name, location_id);
    END IF;

    -- restaurants (name, location_id)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_restaurant_name_loc'
    ) THEN
        ALTER TABLE public.restaurants ADD CONSTRAINT unique_restaurant_name_loc UNIQUE (name, location_id);
    END IF;

    -- accommodations (name, location_id)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_accommodation_name_loc'
    ) THEN
        ALTER TABLE public.accommodations ADD CONSTRAINT unique_accommodation_name_loc UNIQUE (name, location_id);
    END IF;

    -- events (name, location_id)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_event_name_loc'
    ) THEN
        ALTER TABLE public.events ADD CONSTRAINT unique_event_name_loc UNIQUE (name, location_id);
    END IF;

    -- aurora_destinations (location_id)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_aurora_loc'
    ) THEN
        ALTER TABLE public.aurora_destinations ADD CONSTRAINT unique_aurora_loc UNIQUE (location_id);
    END IF;
    
    -- trails (name) - Location ID is start_location_id which was missing, let's just use name for trails
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_trail_name'
    ) THEN
        ALTER TABLE public.trails ADD CONSTRAINT unique_trail_name UNIQUE (name);
    END IF;
END $$;
