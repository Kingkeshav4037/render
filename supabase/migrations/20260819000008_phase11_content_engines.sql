-- Phase 11: Content Engines Architecture

-- 1. Content Media
DO $$ BEGIN
    CREATE TYPE public.media_type AS ENUM ('HERO', 'GALLERY', 'THUMBNAIL', 'DOCUMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.content_media (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type text NOT NULL, -- e.g., 'location', 'wildlife_species', 'hotel'
    entity_id uuid NOT NULL,
    media_type public.media_type DEFAULT 'GALLERY'::public.media_type,
    media_url text NOT NULL,
    alt_text text,
    credits text,
    license text,
    sort_order integer DEFAULT 0,
    width integer,
    height integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_content_media_entity ON public.content_media(entity_type, entity_id);

-- 2. Content Relationships
CREATE TABLE IF NOT EXISTS public.content_relationships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    source_type text NOT NULL,
    source_id uuid NOT NULL,
    relationship_type text NOT NULL, -- e.g., 'related_activity', 'located_in', 'featured_wildlife'
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    status public.content_status DEFAULT 'PUBLISHED'::public.content_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(source_type, source_id, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_content_rels_source ON public.content_relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_content_rels_target ON public.content_relationships(target_type, target_id);

-- 3. Content Translations
CREATE TABLE IF NOT EXISTS public.content_translations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    language_code text NOT NULL, -- e.g., 'en', 'no'
    field_name text NOT NULL,
    translated_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(entity_type, entity_id, language_code, field_name)
);
CREATE INDEX IF NOT EXISTS idx_content_translations_entity ON public.content_translations(entity_type, entity_id, language_code);

-- 4. New Specialized Content Tables
CREATE TABLE IF NOT EXISTS public.wildlife_species (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    common_name text NOT NULL,
    scientific_name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    conservation_status text,
    behavior text,
    facts text[],
    published_at timestamp with time zone,
    source_type public.data_source_type DEFAULT 'demo',
    source_name text,
    external_id text,
    verified_at timestamp with time zone,
    verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    seo_title text,
    seo_description text,
    canonical_url text,
    og_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wildlife_habitats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    species_id uuid REFERENCES public.wildlife_species(id) ON DELETE CASCADE,
    region text NOT NULL,
    best_months text[],
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ski_resorts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
    lifts integer,
    runs integer,
    difficulty_breakdown jsonb,
    snow_season text,
    published_at timestamp with time zone,
    source_type public.data_source_type DEFAULT 'demo',
    source_name text,
    external_id text,
    verified_at timestamp with time zone,
    verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    seo_title text,
    seo_description text,
    canonical_url text,
    og_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.aurora_destinations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
    best_months text[],
    viewing_locations text[],
    cloud_conditions_notes text,
    published_at timestamp with time zone,
    source_type public.data_source_type DEFAULT 'demo',
    source_name text,
    external_id text,
    verified_at timestamp with time zone,
    verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    seo_title text,
    seo_description text,
    canonical_url text,
    og_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.road_trips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    duration_days integer,
    distance_km integer,
    season text,
    difficulty text,
    scenic_highlights text[],
    map_route text,
    published_at timestamp with time zone,
    source_type public.data_source_type DEFAULT 'demo',
    source_name text,
    external_id text,
    verified_at timestamp with time zone,
    verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    seo_title text,
    seo_description text,
    canonical_url text,
    og_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.road_trip_stops (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    road_trip_id uuid REFERENCES public.road_trips(id) ON DELETE CASCADE,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
    stop_order integer NOT NULL,
    description text,
    recommended_duration text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(road_trip_id, stop_order)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_media TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_relationships TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_translations TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wildlife_species TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wildlife_habitats TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ski_resorts TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aurora_destinations TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.road_trips TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.road_trip_stops TO anon, authenticated, service_role;
