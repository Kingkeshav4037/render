-- Migration: Add image audit metadata columns to major image-driven tables

-- Locations
ALTER TABLE public.locations 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Accommodations
ALTER TABLE public.accommodations 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Restaurants
ALTER TABLE public.restaurants 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Foods
ALTER TABLE public.foods 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Wildlife Species
ALTER TABLE public.wildlife_species 
    ADD COLUMN IF NOT EXISTS image_url text,
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Activities
ALTER TABLE public.activities 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Events
ALTER TABLE public.events 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Trails
ALTER TABLE public.trails 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;

-- Winter Resorts
ALTER TABLE public.winter_resorts 
    ADD COLUMN IF NOT EXISTS image_alt text,
    ADD COLUMN IF NOT EXISTS image_source text,
    ADD COLUMN IF NOT EXISTS image_credit text,
    ADD COLUMN IF NOT EXISTS image_category text,
    ADD COLUMN IF NOT EXISTS image_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS image_verified_at timestamp with time zone;
