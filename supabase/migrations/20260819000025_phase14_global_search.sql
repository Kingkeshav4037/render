-- Phase 14: Expand Global Search RPC and add search_vectors

-- 1. Add search_vector to new tables
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_foods_search ON public.foods USING GIN (search_vector);

ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_restaurants_search ON public.restaurants USING GIN (search_vector);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;
CREATE INDEX IF NOT EXISTS idx_events_search ON public.events USING GIN (search_vector);

ALTER TABLE public.road_trips ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(difficulty, '')), 'C')
) STORED;
CREATE INDEX IF NOT EXISTS idx_road_trips_search ON public.road_trips USING GIN (search_vector);

-- 2. Update Global Search RPC
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
            id::text AS slug,
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
            NULL AS hero_image_url,
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
          
        UNION ALL
        
        -- Trails
        SELECT 
            id AS entity_id,
            'trail' AS entity_type,
            name AS title,
            NULL::text AS description,
            slug,
            NULL AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            'editorial'::text AS source_type
        FROM public.trails
        WHERE (filter_category IS NULL OR filter_category = 'trails')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Foods
        SELECT 
            id AS entity_id,
            'food' AS entity_type,
            name AS title,
            description,
            slug,
            image_url AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            'editorial'::text AS source_type
        FROM public.foods
        WHERE (filter_category IS NULL OR filter_category = 'foods')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Restaurants
        SELECT 
            id AS entity_id,
            'restaurant' AS entity_type,
            name AS title,
            description,
            slug,
            image_url AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            'editorial'::text AS source_type
        FROM public.restaurants
        WHERE (filter_category IS NULL OR filter_category = 'restaurants')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Events
        SELECT 
            id AS entity_id,
            'event' AS entity_type,
            name AS title,
            description,
            id::text AS slug,
            image_url AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            'editorial'::text AS source_type
        FROM public.events
        WHERE (filter_category IS NULL OR filter_category = 'events')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Road Trips
        SELECT 
            id AS entity_id,
            'road_trip' AS entity_type,
            name AS title,
            description,
            slug,
            NULL AS hero_image_url,
            ts_rank(search_vector, parsed_query) AS rank,
            'editorial'::text AS source_type
        FROM public.road_trips
        WHERE (filter_category IS NULL OR filter_category = 'road_trips')
          AND search_vector @@ parsed_query
          
        UNION ALL
        
        -- Ski Resorts (Joined with locations)
        SELECT 
            sr.id AS entity_id,
            'ski_resort' AS entity_type,
            loc.name AS title,
            loc.description,
            loc.slug,
            loc.hero_image_url,
            ts_rank(loc.search_vector, parsed_query) AS rank,
            sr.source_type::text
        FROM public.ski_resorts sr
        JOIN public.locations loc ON sr.location_id = loc.id
        WHERE (filter_category IS NULL OR filter_category = 'ski_resorts')
          AND loc.search_vector @@ parsed_query
          
        UNION ALL
        
        -- Aurora Destinations (Joined with locations)
        SELECT 
            ad.id AS entity_id,
            'aurora' AS entity_type,
            loc.name AS title,
            loc.description,
            loc.slug,
            loc.hero_image_url,
            ts_rank(loc.search_vector, parsed_query) AS rank,
            ad.source_type::text
        FROM public.aurora_destinations ad
        JOIN public.locations loc ON ad.location_id = loc.id
        WHERE (filter_category IS NULL OR filter_category = 'aurora_destinations')
          AND loc.search_vector @@ parsed_query
    )
    SELECT * FROM all_results
    ORDER BY rank DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$;
