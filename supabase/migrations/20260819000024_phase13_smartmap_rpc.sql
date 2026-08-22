-- Phase 13: Update Smart Map RPC to include all entities

CREATE OR REPLACE FUNCTION public.get_smart_map_markers(
  min_lat double precision, 
  max_lat double precision, 
  min_lng double precision, 
  max_lng double precision, 
  filter_layers text[] DEFAULT NULL::text[]
) 
RETURNS TABLE(
  id uuid, 
  location_id uuid, 
  name text, 
  slug text, 
  type text, 
  category text, 
  subcategory text, 
  description text, 
  base_price_nok numeric, 
  latitude double precision, 
  longitude double precision, 
  image_url text, 
  featured boolean, 
  average_rating double precision
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- 1. DESTINATIONS (Locations)
  SELECT 
    l.id, l.id as location_id, l.name, l.slug, 'DESTINATION'::TEXT as type, 'DESTINATION'::TEXT as category,
    NULL::TEXT as subcategory, l.description, NULL::NUMERIC as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.locations l
  WHERE (filter_layers IS NULL OR 'DESTINATION' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 2. ACCOMMODATIONS (Hotels)
  SELECT 
    a.id, a.location_id, a.name, l.slug, a.type::TEXT, 'HOTEL'::TEXT as category,
    a.type::TEXT as subcategory, a.description, a.price_per_night as base_price_nok,
    a.lat as latitude, a.lng as longitude, a.image_url, a.featured, a.rating as average_rating
  FROM public.accommodations a
  JOIN public.locations l ON a.location_id = l.id
  WHERE (filter_layers IS NULL OR 'HOTEL' = ANY(filter_layers))
    AND a.lng BETWEEN min_lng AND max_lng
    AND a.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 3. RESTAURANTS (Food)
  SELECT 
    r.id, r.location_id, r.name, l.slug, r.type::TEXT as type, 'RESTAURANT'::TEXT as category,
    r.type::TEXT as subcategory, r.description, NULL::NUMERIC as base_price_nok,
    r.lat as latitude, r.lng as longitude, r.image_url, r.featured, r.rating as average_rating
  FROM public.restaurants r
  JOIN public.locations l ON r.location_id = l.id
  WHERE (filter_layers IS NULL OR 'RESTAURANT' = ANY(filter_layers))
    AND r.lng BETWEEN min_lng AND max_lng
    AND r.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 4. ACTIVITIES
  SELECT 
    ac.id, ac.location_id, ac.name, l.slug, ac.type::TEXT as type, 'ACTIVITY'::TEXT as category,
    ac.type::TEXT as subcategory, ac.description, ac.price as base_price_nok,
    l.lat as latitude, l.lng as longitude, ac.image_url, ac.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.activities ac
  JOIN public.locations l ON ac.location_id = l.id
  WHERE (filter_layers IS NULL OR 'ACTIVITY' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 5. EVENTS
  SELECT 
    e.id, e.location_id, e.name, l.slug, e.category::TEXT as type, 'EVENT'::TEXT as category,
    e.category::TEXT as subcategory, e.description, e.ticket_price as base_price_nok,
    e.lat as latitude, e.lng as longitude, e.image_url, e.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.events e
  JOIN public.locations l ON e.location_id = l.id
  WHERE (filter_layers IS NULL OR 'EVENT' = ANY(filter_layers))
    AND e.lng BETWEEN min_lng AND max_lng
    AND e.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 6. TRAILS
  SELECT 
    t.id, t.location_id, t.name, l.slug, 'TRAIL'::TEXT as type, 'TRAIL'::TEXT as category,
    t.difficulty::TEXT as subcategory, t.description, NULL::NUMERIC as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.trails t
  JOIN public.locations l ON t.location_id = l.id
  WHERE (filter_layers IS NULL OR 'TRAIL' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 7. EV CHARGERS
  SELECT 
    ev.id, ev.location_id, ev.station_name as name, l.slug, 'EV_CHARGER'::TEXT as type, 'EV'::TEXT as category,
    ev.operator as subcategory, 'EV Charging Station' as description, ev.price_per_kwh::NUMERIC as base_price_nok,
    ev.latitude, ev.longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.ev_chargers ev
  LEFT JOIN public.locations l ON ev.location_id = l.id
  WHERE (filter_layers IS NULL OR 'EV' = ANY(filter_layers))
    AND ev.longitude BETWEEN min_lng AND max_lng
    AND ev.latitude BETWEEN min_lat AND max_lat

  UNION ALL

  -- 8. AURORA DESTINATIONS
  SELECT 
    au.id, au.location_id, l.name, l.slug, 'AURORA'::TEXT as type, 'AURORA'::TEXT as category,
    'Aurora Spot'::TEXT as subcategory, l.description, NULL::NUMERIC as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.aurora_destinations au
  JOIN public.locations l ON au.location_id = l.id
  WHERE (filter_layers IS NULL OR 'AURORA' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 9. SKI RESORTS
  SELECT 
    sr.id, sr.location_id, l.name, l.slug, 'SKI_RESORT'::TEXT as type, 'SKI_RESORT'::TEXT as category,
    'Resort'::TEXT as subcategory, l.description, NULL::NUMERIC as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.ski_resorts sr
  JOIN public.locations l ON sr.location_id = l.id
  WHERE (filter_layers IS NULL OR 'SKI_RESORT' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- 10. TRANSPORT ROUTES (Origins)
  SELECT 
    tr.id, tr.origin_id as location_id, tr.name, l.slug, tr.type::TEXT as type, 'FERRY'::TEXT as category, -- Assuming FERRY for map icon, or transport
    tr.operator as subcategory, 'Transport Route Origin' as description, tr.price_estimate as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.transport_routes tr
  JOIN public.locations l ON tr.origin_id = l.id
  WHERE (filter_layers IS NULL OR 'FERRY' = ANY(filter_layers) OR 'TRANSPORT' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat;
END;
$$;
