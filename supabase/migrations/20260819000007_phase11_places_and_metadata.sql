-- Phase 11: Places and Metadata Architecture

-- 1. Create Enums for Metadata
DO $$ BEGIN
    CREATE TYPE public.data_source_type AS ENUM ('demo', 'editorial', 'external', 'imported', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Expand location_type enum with new place types if they don't exist
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'CITY';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'FJORD';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'MOUNTAIN';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'PARK';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'BEACH';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'ISLAND';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'AIRPORT';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'STATION';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'REGION';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'COUNTY';
ALTER TYPE public.location_type ADD VALUE IF NOT EXISTS 'MUNICIPALITY';

-- 2. Alter locations table to support Geographic Architecture and Metadata
ALTER TABLE public.locations 
    ADD COLUMN IF NOT EXISTS parent_location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Add indices for new locations columns
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON public.locations(parent_location_id);
CREATE INDEX IF NOT EXISTS idx_locations_source_type ON public.locations(source_type);

-- 3. Apply Metadata Columns to other core tables
-- Activities
ALTER TABLE public.activities 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Accommodations
ALTER TABLE public.accommodations 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Restaurants
ALTER TABLE public.restaurants 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Events
ALTER TABLE public.events 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Trails
ALTER TABLE public.trails 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;

-- Foods
ALTER TABLE public.foods 
    ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS source_type public.data_source_type DEFAULT 'demo',
    ADD COLUMN IF NOT EXISTS source_name text,
    ADD COLUMN IF NOT EXISTS external_id text,
    ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS seo_title text,
    ADD COLUMN IF NOT EXISTS seo_description text,
    ADD COLUMN IF NOT EXISTS canonical_url text,
    ADD COLUMN IF NOT EXISTS og_image text;
