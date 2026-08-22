-- Phase 11: Full Text Search and RLS Architecture

-- 1. Create standardized search result type
DO $$ BEGIN
    CREATE TYPE public.search_result AS (
        entity_id uuid,
        entity_type text,
        title text,
        description text,
        slug text,
        hero_image_url text,
        rank real,
        source_type text
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add GIN Indexes for fast text search on core content tables
-- locations
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(region, '')), 'C')
) STORED;
CREATE INDEX IF NOT EXISTS idx_locations_search ON public.locations USING GIN (search_vector);

-- activities
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_activities_search ON public.activities USING GIN (search_vector);

-- wildlife_species
ALTER TABLE public.wildlife_species ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(common_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(scientific_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
) STORED;
CREATE INDEX IF NOT EXISTS idx_wildlife_search ON public.wildlife_species USING GIN (search_vector);

-- accommodations
ALTER TABLE public.accommodations ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_accommodations_search ON public.accommodations USING GIN (search_vector);

-- trails
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(difficulty, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_trails_search ON public.trails USING GIN (search_vector);

-- 3. Global Search RPC
CREATE OR REPLACE FUNCTION public.global_search(
    search_query text, 
    filter_category text DEFAULT NULL, 
    limit_count integer DEFAULT 20, 
    offset_count integer DEFAULT 0
) RETURNS SETOF public.search_result
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    parsed_query tsquery;
BEGIN
    -- Only allow published content for standard users, but since this runs as SECURITY DEFINER,
    -- we manually enforce publication status if the user lacks 'manage_content' permission.
    -- (Assuming Phase 10 has_permission function exists)
    
    parsed_query := websearch_to_tsquery('english', search_query);

    RETURN QUERY
    WITH all_results AS (
        -- Locations
        SELECT 
            id AS entity_id,
            'location' AS entity_type,
            name AS title,
            description,
            slug,
            hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            source_type::text
        FROM public.locations
        WHERE (filter_category IS NULL OR filter_category = 'locations')
          AND search_vector @@ parsed_query
          AND (status = 'PUBLISHED' OR public.has_permission(auth.uid(), 'manage_content'))
        
        UNION ALL
        
        -- Activities
        SELECT 
            id AS entity_id,
            'activity' AS entity_type,
            name AS title,
            description,
            id::text AS slug, -- Activities might not have a slug field yet
            image_url AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            source_type::text
        FROM public.activities
        WHERE (filter_category IS NULL OR filter_category = 'activities')
          AND search_vector @@ parsed_query
        
        UNION ALL
        
        -- Wildlife
        SELECT 
            id AS entity_id,
            'wildlife' AS entity_type,
            common_name AS title,
            description,
            slug,
            NULL AS hero_image_url, -- Media is fetched via content_media
            ts_rank(search_vector, parsed_query) AS rank,
            source_type::text
        FROM public.wildlife_species
        WHERE (filter_category IS NULL OR filter_category = 'wildlife')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Accommodations
        SELECT 
            id AS entity_id,
            'accommodation' AS entity_type,
            name AS title,
            description,
            id::text AS slug,
            images[1] AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            source_type::text
        FROM public.accommodations
        WHERE (filter_category IS NULL OR filter_category = 'accommodations')
          AND search_vector @@ parsed_query
    )
    SELECT * FROM all_results
    ORDER BY rank DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$;

-- 4. Apply Row Level Security (RLS) policies for Phase 11 tables
ALTER TABLE public.content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_habitats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ski_resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aurora_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_trip_stops ENABLE ROW LEVEL SECURITY;

-- Read policies: public can read anything
CREATE POLICY "Public read content_media" ON public.content_media FOR SELECT USING (true);
CREATE POLICY "Public read content_relationships" ON public.content_relationships FOR SELECT USING (status = 'PUBLISHED'::public.content_status);
CREATE POLICY "Public read content_translations" ON public.content_translations FOR SELECT USING (true);
CREATE POLICY "Public read wildlife_species" ON public.wildlife_species FOR SELECT USING (true);
CREATE POLICY "Public read wildlife_habitats" ON public.wildlife_habitats FOR SELECT USING (true);
CREATE POLICY "Public read ski_resorts" ON public.ski_resorts FOR SELECT USING (true);
CREATE POLICY "Public read aurora_destinations" ON public.aurora_destinations FOR SELECT USING (true);
CREATE POLICY "Public read road_trips" ON public.road_trips FOR SELECT USING (true);
CREATE POLICY "Public read road_trip_stops" ON public.road_trip_stops FOR SELECT USING (true);

-- Write policies: only users with 'manage_content' permission can write
CREATE POLICY "Admin write content_media" ON public.content_media FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write content_relationships" ON public.content_relationships FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write content_translations" ON public.content_translations FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write wildlife_species" ON public.wildlife_species FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write wildlife_habitats" ON public.wildlife_habitats FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write ski_resorts" ON public.ski_resorts FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write aurora_destinations" ON public.aurora_destinations FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write road_trips" ON public.road_trips FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
CREATE POLICY "Admin write road_trip_stops" ON public.road_trip_stops FOR ALL USING (public.has_permission(auth.uid(), 'manage_content'));
