CREATE EXTENSION IF NOT EXISTS postgis CASCADE;
CREATE EXTENSION IF NOT EXISTS vector CASCADE;
--
-- Name: accommodation_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.accommodation_type AS ENUM (
    'HOTEL',
    'CABIN',
    'HOSTEL',
    'RESORT',
    'LODGE',
    'CAMPING',
    'APARTMENT',
    'ECO_STAY',
    'UNIQUE_STAY'
);



--
-- Name: activity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activity_type AS ENUM (
    'HIKING',
    'SKIING',
    'SIGHTSEEING',
    'CULTURE',
    'WATER_SPORTS',
    'NATURE',
    'ADVENTURE',
    'WINTER',
    'WILDLIFE'
);



--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'PENDING_PAYMENT'
);



--
-- Name: booking_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_type AS ENUM (
    'ACCOMMODATION',
    'ACTIVITY',
    'TRANSPORT',
    'RESTAURANT',
    'PACKAGE',
    'EVENT',
    'PRODUCT'
);



--
-- Name: content_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.content_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);



--
-- Name: event_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_category AS ENUM (
    'FESTIVAL',
    'CONCERT',
    'SPORTS',
    'CULTURAL',
    'SEASONAL'
);



--
-- Name: location_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.location_type AS ENUM (
    'FJORD',
    'MOUNTAIN',
    'CITY',
    'VILLAGE',
    'ISLAND',
    'NATIONAL_PARK',
    'SKI_RESORT',
    'TRAIL',
    'FOREST',
    'COAST',
    'BEACH',
    'VIEWPOINT',
    'MUSEUM',
    'LANDMARK',
    'WILDLIFE',
    'ATTRACTION'
);



--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'SYSTEM',
    'BOOKING',
    'TRIP',
    'PROMOTION',
    'SAFETY',
    'PAYMENT',
    'WEATHER',
    'AURORA',
    'TRANSPORT'
);



--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PENDING_PAYMENT'
);



--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'CARD',
    'VIPPS',
    'APPLE_PAY',
    'GOOGLE_PAY'
);



--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'SUCCESS',
    'FAILED',
    'REFUND_PENDING',
    'REFUNDED'
);



--
-- Name: restaurant_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.restaurant_type AS ENUM (
    'FINE_DINING',
    'CASUAL',
    'CAFE',
    'STREET_FOOD',
    'PUB',
    'BAKERY',
    'FOOD_EXPERIENCE'
);



--
-- Name: transport_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transport_type AS ENUM (
    'TRAIN',
    'BUS',
    'FERRY',
    'FLIGHT',
    'CAR_RENTAL',
    'WALKING',
    'BIKE'
);



--
-- Name: trip_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trip_status AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);



--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'PROVIDER',
    'ADMIN',
    'SUPER_ADMIN',
    'ANALYST'
);



--
-- Name: check_availability(text, uuid, timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_availability(p_item_type text, p_item_id uuid, p_start_date timestamp with time zone, p_end_date timestamp with time zone) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_conflicts INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_conflicts
    FROM public.bookings
    WHERE item_id = p_item_id
      AND item_type = p_item_type::booking_type
      AND status IN ('PAID', 'PENDING_PAYMENT', 'CONFIRMED')
      AND (
          (start_time <= p_end_date AND end_time >= p_start_date)
      );
      
    RETURN v_conflicts = 0;
END;
$$;



--
-- Name: get_admin_dashboard_stats(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_admin_dashboard_stats() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'active_providers', (SELECT count(*) FROM public.profiles WHERE role = 'PROVIDER'),
    'total_bookings', (SELECT count(*) FROM public.bookings),
    'total_revenue', COALESCE((SELECT sum(total_amount) FROM public.orders WHERE status = 'PAID'), 0),
    'active_alerts', (SELECT count(*) FROM public.safety_alerts WHERE active_until > now()),
    'co2_saved_kg', COALESCE((SELECT sum(co2_saved_kg) FROM public.user_sustainability_impact), 0)
  ) INTO stats;
  RETURN stats;
END;
$$;



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    type public.activity_type NOT NULL,
    description text,
    duration_minutes integer,
    difficulty text,
    price numeric(10,2),
    currency text DEFAULT 'NOK'::text,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tags text[] DEFAULT '{}'::text[],
    difficulty_level text,
    equipment_needed text[],
    provider_id uuid
);



--
-- Name: get_nearby_activities(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_nearby_activities(target_location_id uuid, max_results integer DEFAULT 5) RETURNS SETOF public.activities
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.activities
  WHERE location_id = target_location_id
  LIMIT max_results;
END;
$$;



--
-- Name: get_nearby_candidates(double precision, double precision, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_nearby_candidates(p_lat double precision, p_lon double precision, p_radius_km double precision DEFAULT 50, p_limit integer DEFAULT 30) RETURNS TABLE(location_id uuid, name text, category text, subcategory text, base_price_nok numeric, average_rating numeric, distance_km double precision)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH all_candidates AS (
    -- Accommodations
    SELECT 
      a.id AS location_id,
      a.name AS name,
      'ACCOMMODATION'::TEXT AS category,
      a.type::TEXT AS subcategory,
      a.price_per_night AS base_price_nok,
      a.rating AS average_rating,
      ST_Distance(
        ST_SetSRID(ST_MakePoint(a.lng, a.lat), 4326)::geography,
        ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography
      ) / 1000.0 AS distance_km
    FROM public.accommodations a
    WHERE a.lat IS NOT NULL AND a.lng IS NOT NULL
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(a.lng, a.lat), 4326)::geography, 
      ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, 
      p_radius_km * 1000
    )

    UNION ALL

    -- Restaurants
    SELECT 
      r.id AS location_id,
      r.name AS name,
      'RESTAURANT'::TEXT AS category,
      r.type::TEXT AS subcategory,
      0.0::DECIMAL AS base_price_nok, -- Restaurants usually have price_range text, default to 0
      r.rating AS average_rating,
      ST_Distance(
        ST_SetSRID(ST_MakePoint(r.lng, r.lat), 4326)::geography,
        ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography
      ) / 1000.0 AS distance_km
    FROM public.restaurants r
    WHERE r.lat IS NOT NULL AND r.lng IS NOT NULL
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(r.lng, r.lat), 4326)::geography, 
      ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, 
      p_radius_km * 1000
    )

    UNION ALL

    -- Activities (join with locations for coordinates)
    SELECT 
      act.id AS location_id,
      act.name AS name,
      'ACTIVITY'::TEXT AS category,
      act.type::TEXT AS subcategory,
      act.price AS base_price_nok,
      NULL::DECIMAL AS average_rating, -- Activities don't have rating in the base table
      ST_Distance(
        loc.coordinates::geography,
        ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography
      ) / 1000.0 AS distance_km
    FROM public.activities act
    JOIN public.locations loc ON act.location_id = loc.id
    WHERE ST_DWithin(
      loc.coordinates::geography, 
      ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, 
      p_radius_km * 1000
    )
  )
  SELECT 
    c.location_id,
    c.name,
    c.category,
    c.subcategory,
    c.base_price_nok,
    c.average_rating,
    c.distance_km
  FROM all_candidates c
  ORDER BY c.distance_km ASC
  LIMIT p_limit;
END;
$$;



--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    region text,
    type public.location_type NOT NULL,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    coordinates public.geometry(Point,4326),
    lat double precision,
    lng double precision,
    hero_image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: get_nearby_locations(double precision, double precision, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_nearby_locations(target_lat double precision, target_lng double precision, radius_meters double precision DEFAULT 100000, max_results integer DEFAULT 5) RETURNS SETOF public.locations
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.locations
  WHERE ST_DWithin(
    coordinates::geography, 
    ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography, 
    radius_meters
  )
  AND (lat != target_lat OR lng != target_lng) -- exclude the exact same location
  ORDER BY coordinates <-> ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)
  LIMIT max_results;
END;
$$;



--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    type public.restaurant_type NOT NULL,
    cuisine text[],
    description text,
    price_range text,
    rating numeric(3,2),
    sustainability_score integer,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    lat double precision,
    lng double precision,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    opening_hours jsonb,
    menu jsonb,
    photos text[],
    contact_info jsonb,
    provider_id uuid
);



--
-- Name: get_nearby_restaurants(double precision, double precision, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_nearby_restaurants(target_lat double precision, target_lng double precision, radius_meters double precision DEFAULT 50000, max_results integer DEFAULT 5) RETURNS SETOF public.restaurants
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.restaurants
  WHERE lat IS NOT NULL AND lng IS NOT NULL 
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, 
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography, 
      radius_meters
    )
  ORDER BY ST_SetSRID(ST_MakePoint(lng, lat), 4326) <-> ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)
  LIMIT max_results;
END;
$$;



--
-- Name: accommodations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accommodations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    type public.accommodation_type NOT NULL,
    description text,
    price_per_night numeric(10,2),
    currency text DEFAULT 'NOK'::text,
    rating numeric(3,2),
    amenities jsonb DEFAULT '[]'::jsonb,
    eco_certified boolean DEFAULT false,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    lat double precision,
    lng double precision,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    provider_id uuid
);



--
-- Name: get_nearby_stays(double precision, double precision, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_nearby_stays(target_lat double precision, target_lng double precision, radius_meters double precision DEFAULT 50000, max_results integer DEFAULT 5) RETURNS SETOF public.accommodations
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.accommodations
  WHERE lat IS NOT NULL AND lng IS NOT NULL 
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, 
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography, 
      radius_meters
    )
  ORDER BY ST_SetSRID(ST_MakePoint(lng, lat), 4326) <-> ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)
  LIMIT max_results;
END;
$$;



--
-- Name: get_provider_dashboard_stats(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_provider_dashboard_stats(p_provider_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total_revenue DECIMAL := 0;
    v_total_bookings INT := 0;
    v_active_listings INT := 0;
BEGIN
    -- Only allow the provider themselves or admins
    IF auth.uid() != p_provider_id AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')) THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    -- 1. Calculate Revenue and Bookings
    SELECT 
        COALESCE(SUM(total_amount), 0),
        COUNT(*)
    INTO v_total_revenue, v_total_bookings
    FROM public.bookings
    WHERE provider_id = p_provider_id AND status IN ('CONFIRMED', 'COMPLETED');

    -- 2. Count Active Listings
    SELECT COUNT(*)
    INTO v_active_listings
    FROM public.provider_listings_view
    WHERE provider_id = p_provider_id AND status = 'PUBLISHED';

    RETURN jsonb_build_object(
        'total_revenue', v_total_revenue,
        'total_bookings', v_total_bookings,
        'active_listings', v_active_listings
    );
END;
$$;



--
-- Name: get_smart_map_markers(double precision, double precision, double precision, double precision, text[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_smart_map_markers(min_lat double precision, max_lat double precision, min_lng double precision, max_lng double precision, filter_layers text[] DEFAULT NULL::text[]) RETURNS TABLE(id uuid, location_id uuid, name text, slug text, type text, category text, subcategory text, description text, base_price_nok numeric, latitude double precision, longitude double precision, image_url text, featured boolean, average_rating double precision)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  -- DESTINATIONS (Locations)
  SELECT 
    l.id, l.id as location_id, l.name, l.slug, 'DESTINATION'::TEXT as type, 'DESTINATION'::TEXT as category,
    NULL::TEXT as subcategory, l.description, NULL::NUMERIC as base_price_nok,
    l.lat as latitude, l.lng as longitude, l.hero_image_url as image_url, l.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.locations l
  WHERE (filter_layers IS NULL OR 'DESTINATION' = ANY(filter_layers))
    AND l.lng BETWEEN min_lng AND max_lng
    AND l.lat BETWEEN min_lat AND max_lat

  UNION ALL

  -- ACCOMMODATIONS (Hotels)
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

  -- RESTAURANTS (Food)
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

  -- ACTIVITIES
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

  -- EVENTS
  SELECT 
    e.id, e.location_id, e.name, l.slug, e.category::TEXT as type, 'EVENT'::TEXT as category,
    e.category::TEXT as subcategory, e.description, e.ticket_price as base_price_nok,
    e.lat as latitude, e.lng as longitude, e.image_url, e.featured, NULL::DOUBLE PRECISION as average_rating
  FROM public.events e
  JOIN public.locations l ON e.location_id = l.id
  WHERE (filter_layers IS NULL OR 'EVENT' = ANY(filter_layers))
    AND e.lng BETWEEN min_lng AND max_lng
    AND e.lat BETWEEN min_lat AND max_lat;
END;
$$;



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE 
      WHEN new.raw_user_meta_data->>'role' IN ('USER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN', 'ANALYST') 
      THEN (new.raw_user_meta_data->>'role')::public.user_role
      ELSE 'USER'::public.user_role
    END
  );
  RETURN new;
END;
$$;



--
-- Name: process_checkout(uuid, text, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_checkout(p_user_id uuid, p_currency text, p_items jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_booking_id UUID;
    v_calculated_amount DECIMAL;
    v_total_amount DECIMAL := 0;
    v_nights INTEGER;
BEGIN
    INSERT INTO public.orders (user_id, total_amount, currency, status)
    VALUES (p_user_id, 0, p_currency, 'PENDING_PAYMENT')
    RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_booking_id := NULL;
        v_calculated_amount := 0;
        v_nights := 1;
        
        -- Secure price calculation
        IF v_item->>'item_type' = 'ACCOMMODATION' THEN
            SELECT COALESCE(price_per_night, 0) INTO v_calculated_amount 
            FROM public.accommodations 
            WHERE id = (v_item->>'item_id')::UUID;
            
            -- Calculate nights if dates provided
            IF v_item->>'start_time' IS NOT NULL AND v_item->>'end_time' IS NOT NULL THEN
                v_nights := GREATEST(1, EXTRACT(DAY FROM ((v_item->>'end_time')::TIMESTAMP - (v_item->>'start_time')::TIMESTAMP))::INTEGER);
            END IF;
            
            v_calculated_amount := v_calculated_amount * v_nights;
            
        ELSIF v_item->>'item_type' = 'ACTIVITY' THEN
            SELECT COALESCE(price, 0) INTO v_calculated_amount 
            FROM public.activities 
            WHERE id = (v_item->>'item_id')::UUID;
        END IF;

        -- Multiply by quantity and pax
        v_calculated_amount := COALESCE(v_calculated_amount, 0) * 
                               COALESCE((v_item->>'quantity')::INTEGER, 1) * 
                               COALESCE((v_item->>'pax')::INTEGER, 1);

        v_total_amount := v_total_amount + v_calculated_amount;
        
        IF (v_item->>'item_type') IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT') THEN
            INSERT INTO public.bookings (
                user_id, item_type, item_id, status, start_time, end_time, pax, total_amount, currency
            ) VALUES (
                p_user_id, (v_item->>'item_type')::booking_type, (v_item->>'item_id')::UUID, 'PENDING_PAYMENT',
                (v_item->>'start_time')::TIMESTAMPTZ, (v_item->>'end_time')::TIMESTAMPTZ,
                COALESCE((v_item->>'pax')::INTEGER, 1), v_calculated_amount, p_currency
            ) RETURNING id INTO v_booking_id;
        END IF;

        INSERT INTO public.order_items (
            order_id, booking_id, amount, currency, description
        ) VALUES (
            v_order_id, v_booking_id, v_calculated_amount, p_currency, v_item->>'description'
        );
    END LOOP;

    UPDATE public.orders SET total_amount = v_total_amount WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$;



--
-- Name: process_checkout(uuid, numeric, text, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_checkout(p_user_id uuid, p_total_amount numeric, p_currency text, p_items jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_booking_id UUID;
    v_amount DECIMAL;
BEGIN
    -- 1. Create the master order record
    INSERT INTO public.orders (user_id, total_amount, currency, status)
    VALUES (p_user_id, p_total_amount, p_currency, 'PENDING_PAYMENT')
    RETURNING id INTO v_order_id;

    -- 2. Process each item in the cart
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_booking_id := NULL;
        v_amount := COALESCE((v_item->>'amount')::DECIMAL, 0);
        
        -- If the item is a bookable entity
        IF (v_item->>'item_type') IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT') THEN
            INSERT INTO public.bookings (
                user_id, 
                item_type, 
                item_id, 
                status, 
                start_time, 
                end_time, 
                pax, 
                total_amount, 
                currency
            ) VALUES (
                p_user_id,
                (v_item->>'item_type')::booking_type,
                (v_item->>'item_id')::UUID,
                'PENDING_PAYMENT',
                (v_item->>'start_time')::TIMESTAMPTZ,
                (v_item->>'end_time')::TIMESTAMPTZ,
                COALESCE((v_item->>'pax')::INTEGER, 1),
                v_amount,
                p_currency
            ) RETURNING id INTO v_booking_id;
        END IF;

        -- Create order item linking everything
        INSERT INTO public.order_items (
            order_id, 
            booking_id, 
            amount, 
            currency, 
            description
        ) VALUES (
            v_order_id,
            v_booking_id,
            v_amount,
            p_currency,
            v_item->>'description'
        );
    END LOOP;

    RETURN v_order_id;
END;
$$;



--
-- Name: process_payment_webhook(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_payment_webhook(p_gateway_order_id text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
BEGIN
    -- Find the order via payment_transactions
    SELECT order_id INTO v_order_id
    FROM public.payment_transactions
    WHERE gateway_order_id = p_gateway_order_id
    LIMIT 1;
    
    IF v_order_id IS NULL THEN
        RAISE EXCEPTION 'Order not found for gateway order ID %', p_gateway_order_id;
    END IF;
    
    -- Update transaction
    UPDATE public.payment_transactions
    SET status = 'SUCCESS'
    WHERE gateway_order_id = p_gateway_order_id;
    
    -- Update order
    UPDATE public.orders
    SET status = 'PAID'
    WHERE id = v_order_id;
    
    -- Update bookings
    UPDATE public.bookings
    SET status = 'CONFIRMED'
    WHERE id IN (
        SELECT booking_id 
        FROM public.order_items 
        WHERE order_id = v_order_id
    );
    
    RETURN TRUE;
END;
$$;



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;



--
-- Name: accommodation_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accommodation_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    preferred_types text[] DEFAULT '{}'::text[],
    price_range text DEFAULT 'moderate'::text,
    star_rating integer DEFAULT 3,
    amenities jsonb DEFAULT '{}'::jsonb,
    location_preference text DEFAULT 'city_center'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: accommodation_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accommodation_rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accommodation_id uuid,
    name text NOT NULL,
    description text,
    capacity integer DEFAULT 2,
    price_per_night numeric(10,2),
    amenities jsonb DEFAULT '[]'::jsonb,
    image_url text,
    available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: admin_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role public.user_role NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    cover_image_url text,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: aurora_forecasts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aurora_forecasts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    kp_index numeric(3,1),
    probability_pct integer,
    forecast_time timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    trip_id uuid,
    item_type public.booking_type NOT NULL,
    item_id uuid NOT NULL,
    status public.booking_status DEFAULT 'PENDING'::public.booking_status,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    pax integer DEFAULT 1,
    total_amount numeric(10,2),
    currency text DEFAULT 'NOK'::text,
    provider_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    relationship text,
    phone text NOT NULL,
    email text,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: equipment_rentals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_rentals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    description text,
    rental_type text,
    price_per_day numeric(10,2) NOT NULL,
    currency text DEFAULT 'NOK'::text,
    available_stock integer DEFAULT 0,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    provider_id uuid
);



--
-- Name: ev_chargers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ev_chargers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id text,
    station_name text NOT NULL,
    operator text,
    location_id uuid,
    latitude double precision,
    longitude double precision,
    address text,
    connector_types text[] DEFAULT '{}'::text[],
    max_power_kw double precision,
    status text DEFAULT 'UNKNOWN'::text NOT NULL,
    availability integer DEFAULT 0,
    current_power_kw double precision DEFAULT 0,
    price_per_kwh double precision DEFAULT 0,
    last_updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    category public.event_category NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    ticket_price numeric(10,2),
    currency text DEFAULT 'NOK'::text,
    image_url text,
    status public.content_status DEFAULT 'PUBLISHED'::public.content_status,
    featured boolean DEFAULT false,
    lat double precision,
    lng double precision,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    provider_id uuid
);



--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    item_type text NOT NULL,
    item_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: ferries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ferries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id text,
    name text NOT NULL,
    operator text,
    route_id text,
    capacity integer,
    battery_capacity double precision,
    current_battery double precision,
    latitude double precision,
    longitude double precision,
    speed double precision DEFAULT 0,
    status text DEFAULT 'OFFLINE'::text NOT NULL,
    eta timestamp with time zone,
    last_updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: ferry_route_stops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ferry_route_stops (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    route_id uuid,
    location_id uuid,
    stop_order integer NOT NULL,
    arrival_time time without time zone,
    departure_time time without time zone
);



--
-- Name: ferry_routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ferry_routes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    origin_id uuid,
    destination_id uuid
);



--
-- Name: food_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    favorite_cuisines text[] DEFAULT '{}'::text[],
    dietary_preferences text[] DEFAULT '{}'::text[],
    allergies text[] DEFAULT '{}'::text[],
    food_dislikes text[] DEFAULT '{}'::text[],
    seafood_preference text DEFAULT 'neutral'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: foods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: infrastructure_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infrastructure_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    asset_type text NOT NULL,
    location_id uuid,
    latitude double precision,
    longitude double precision,
    status text DEFAULT 'OFFLINE'::text NOT NULL,
    provider_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: iot_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iot_devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id text NOT NULL,
    name text NOT NULL,
    device_type text NOT NULL,
    provider_id uuid,
    location_id uuid,
    latitude double precision,
    longitude double precision,
    status text DEFAULT 'OFFLINE'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    last_seen_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: iot_telemetry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iot_telemetry (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id text,
    metric text NOT NULL,
    value double precision NOT NULL,
    unit text,
    recorded_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);



--
-- Name: location_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    url text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT false,
    marketing_emails boolean DEFAULT false,
    booking_updates boolean DEFAULT true,
    trip_reminders boolean DEFAULT true,
    weather_alerts boolean DEFAULT false,
    aurora_alerts boolean DEFAULT false,
    marketing boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type public.notification_type NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    link_url text,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    booking_id uuid,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'NOK'::text,
    description text,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    total_amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'NOK'::text,
    status public.order_status DEFAULT 'PENDING'::public.order_status,
    stripe_session_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid,
    order_id uuid,
    user_id uuid,
    gateway text NOT NULL,
    gateway_order_id text,
    amount numeric NOT NULL,
    currency text DEFAULT 'NOK'::text,
    status public.payment_status DEFAULT 'PENDING'::public.payment_status,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT positive_payment_amount CHECK ((amount >= (0)::numeric))
);



--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'NOK'::text,
    method public.payment_method,
    provider_transaction_id text,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: privacy_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.privacy_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    profile_visibility text DEFAULT 'PRIVATE'::text,
    share_activity boolean DEFAULT false,
    allow_recommendations boolean DEFAULT true,
    location_access boolean DEFAULT false,
    personalized_recommendations boolean DEFAULT true,
    analytics_tracking boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'USER'::public.user_role,
    full_name text,
    avatar_url text,
    preferred_language text DEFAULT 'en'::text,
    phone text,
    phone_verified boolean DEFAULT false,
    country text,
    city text,
    date_of_birth date,
    gender text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: transport_routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_routes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type public.transport_type NOT NULL,
    origin_id uuid,
    destination_id uuid,
    operator text,
    duration_minutes integer,
    price_estimate numeric(10,2),
    currency text DEFAULT 'NOK'::text,
    co2_emissions_kg numeric(10,2),
    route_line public.geometry(LineString,4326),
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    stops jsonb DEFAULT '[]'::jsonb,
    timetable jsonb DEFAULT '[]'::jsonb,
    live_status text DEFAULT 'ON_TIME'::text,
    alerts jsonb DEFAULT '[]'::jsonb,
    provider_id uuid
);



--
-- Name: provider_listings_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.provider_listings_view AS
 SELECT accommodations.id,
    'ACCOMMODATION'::text AS item_type,
    accommodations.name,
    (accommodations.type)::text AS category,
    accommodations.price_per_night AS base_price,
    accommodations.currency,
    (accommodations.status)::text AS status,
    accommodations.created_at,
    accommodations.provider_id
   FROM public.accommodations
UNION ALL
 SELECT activities.id,
    'ACTIVITY'::text AS item_type,
    activities.name,
    (activities.type)::text AS category,
    activities.price AS base_price,
    activities.currency,
    (activities.status)::text AS status,
    activities.created_at,
    activities.provider_id
   FROM public.activities
UNION ALL
 SELECT transport_routes.id,
    'TRANSPORT'::text AS item_type,
    transport_routes.name,
    (transport_routes.type)::text AS category,
    transport_routes.price_estimate AS base_price,
    transport_routes.currency,
    (transport_routes.status)::text AS status,
    transport_routes.created_at,
    transport_routes.provider_id
   FROM public.transport_routes
UNION ALL
 SELECT restaurants.id,
    'RESTAURANT'::text AS item_type,
    restaurants.name,
    (restaurants.type)::text AS category,
    0 AS base_price,
    'NOK'::text AS currency,
    (restaurants.status)::text AS status,
    restaurants.created_at,
    restaurants.provider_id
   FROM public.restaurants;



--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    product_type text NOT NULL,
    product_id uuid NOT NULL,
    rating integer,
    title text,
    description text,
    status text DEFAULT 'APPROVED'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    photos text[] DEFAULT '{}'::text[],
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT valid_rating CHECK (((rating >= 1) AND (rating <= 5)))
);



--
-- Name: safety_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.safety_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    severity text NOT NULL,
    title text NOT NULL,
    description text,
    active_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);



--
-- Name: smart_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.smart_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id text,
    alert_type text NOT NULL,
    severity text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    value double precision,
    threshold double precision,
    status text DEFAULT 'ACTIVE'::text,
    created_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone
);



--
-- Name: trails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trails (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    description text,
    distance_km numeric(10,2),
    elevation_gain_m integer,
    difficulty text,
    estimated_duration_minutes integer,
    route_line public.geometry(LineString,4326),
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: transport_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    preferred_modes text[] DEFAULT '{}'::text[],
    priority text DEFAULT 'balanced'::text,
    driving_license boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: travel_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.travel_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    preferred_trip_style text[] DEFAULT '{}'::text[],
    budget_level text DEFAULT 'moderate'::text,
    preferred_trip_duration text DEFAULT 'week'::text,
    preferred_destinations text[] DEFAULT '{}'::text[],
    activity_interests text[] DEFAULT '{}'::text[],
    hiking_difficulty text DEFAULT 'moderate'::text,
    accessibility_requirements text[] DEFAULT '{}'::text[],
    travel_companions text DEFAULT 'solo'::text,
    children_ages integer[] DEFAULT '{}'::integer[],
    sustainability_priority text DEFAULT 'moderate'::text,
    preferred_travel_pace text DEFAULT 'moderate'::text,
    indoor_outdoor_preference text DEFAULT 'both'::text,
    photography_interest boolean DEFAULT false,
    cultural_interest text DEFAULT 'moderate'::text,
    nightlife_preference text DEFAULT 'low'::text,
    adventure_level text DEFAULT 'moderate'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: trip_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trip_id uuid,
    location_id uuid,
    activity_title text,
    activity_type text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    notes text,
    co2_kg numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    trip_day_id uuid
);



--
-- Name: trip_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_days (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trip_id uuid,
    day_number integer NOT NULL,
    date date,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: trip_segments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_segments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trip_id uuid,
    start_location_id uuid,
    end_location_id uuid,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    sequence_order integer NOT NULL,
    transport_mode text,
    distance_km numeric(10,2),
    co2_kg numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    trip_day_id uuid
);



--
-- Name: trip_stays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_stays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trip_id uuid,
    location_id uuid,
    accommodation_name text,
    check_in timestamp with time zone,
    check_out timestamp with time zone,
    booking_reference text,
    co2_kg numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    trip_day_id uuid
);



--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    description text,
    start_date date,
    end_date date,
    budget_nok integer,
    total_co2_kg numeric(10,2),
    status public.trip_status DEFAULT 'PLANNED'::public.trip_status,
    visibility text DEFAULT 'PRIVATE'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: user_sustainability_impact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sustainability_impact (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    co2_saved_kg numeric(10,2) DEFAULT 0,
    eco_trips_completed integer DEFAULT 0,
    sustainability_score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: weather_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weather_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    temperature_c numeric(5,2),
    condition text,
    wind_speed_kmh numeric(5,2),
    recorded_at timestamp with time zone DEFAULT now(),
    cloud_cover_pct integer DEFAULT 0,
    visibility_km numeric(5,2) DEFAULT 10.0
);



--
-- Name: wildlife; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wildlife (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    scientific_name text,
    description text,
    habitat text,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: winter_resorts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.winter_resorts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    location_id uuid,
    name text NOT NULL,
    description text,
    total_lifts integer,
    open_lifts integer,
    snow_depth_cm integer,
    avalanche_risk integer,
    status public.content_status DEFAULT 'DRAFT'::public.content_status,
    featured boolean DEFAULT false,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    snow_conditions text,
    weather_data jsonb,
    rentals_available boolean DEFAULT false,
    base_pass_price numeric(10,2)
);



--
-- Name: accommodation_preferences accommodation_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodation_preferences
    ADD CONSTRAINT accommodation_preferences_pkey PRIMARY KEY (id);


--
-- Name: accommodation_preferences accommodation_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodation_preferences
    ADD CONSTRAINT accommodation_preferences_user_id_key UNIQUE (user_id);


--
-- Name: accommodation_rooms accommodation_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodation_rooms
    ADD CONSTRAINT accommodation_rooms_pkey PRIMARY KEY (id);


--
-- Name: accommodations accommodations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions admin_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_key UNIQUE (slug);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: aurora_forecasts aurora_forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aurora_forecasts
    ADD CONSTRAINT aurora_forecasts_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- Name: equipment_rentals equipment_rentals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_rentals
    ADD CONSTRAINT equipment_rentals_pkey PRIMARY KEY (id);


--
-- Name: ev_chargers ev_chargers_device_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev_chargers
    ADD CONSTRAINT ev_chargers_device_id_key UNIQUE (device_id);


--
-- Name: ev_chargers ev_chargers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev_chargers
    ADD CONSTRAINT ev_chargers_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_item_type_item_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_item_type_item_id_key UNIQUE (user_id, item_type, item_id);


--
-- Name: ferries ferries_device_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferries
    ADD CONSTRAINT ferries_device_id_key UNIQUE (device_id);


--
-- Name: ferries ferries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferries
    ADD CONSTRAINT ferries_pkey PRIMARY KEY (id);


--
-- Name: ferry_route_stops ferry_route_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_route_stops
    ADD CONSTRAINT ferry_route_stops_pkey PRIMARY KEY (id);


--
-- Name: ferry_routes ferry_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_routes
    ADD CONSTRAINT ferry_routes_pkey PRIMARY KEY (id);


--
-- Name: food_preferences food_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_preferences
    ADD CONSTRAINT food_preferences_pkey PRIMARY KEY (id);


--
-- Name: food_preferences food_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_preferences
    ADD CONSTRAINT food_preferences_user_id_key UNIQUE (user_id);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: foods foods_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_slug_key UNIQUE (slug);


--
-- Name: infrastructure_assets infrastructure_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infrastructure_assets
    ADD CONSTRAINT infrastructure_assets_pkey PRIMARY KEY (id);


--
-- Name: iot_devices iot_devices_device_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_device_id_key UNIQUE (device_id);


--
-- Name: iot_devices iot_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_pkey PRIMARY KEY (id);


--
-- Name: iot_telemetry iot_telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_telemetry
    ADD CONSTRAINT iot_telemetry_pkey PRIMARY KEY (id);


--
-- Name: location_images location_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_images
    ADD CONSTRAINT location_images_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: locations locations_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_slug_key UNIQUE (slug);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_gateway_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_gateway_order_id_key UNIQUE (gateway_order_id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: privacy_preferences privacy_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privacy_preferences
    ADD CONSTRAINT privacy_preferences_pkey PRIMARY KEY (id);


--
-- Name: privacy_preferences privacy_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privacy_preferences
    ADD CONSTRAINT privacy_preferences_user_id_key UNIQUE (user_id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: safety_alerts safety_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.safety_alerts
    ADD CONSTRAINT safety_alerts_pkey PRIMARY KEY (id);


--
-- Name: smart_alerts smart_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smart_alerts
    ADD CONSTRAINT smart_alerts_pkey PRIMARY KEY (id);


--
-- Name: trails trails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trails
    ADD CONSTRAINT trails_pkey PRIMARY KEY (id);


--
-- Name: transport_preferences transport_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_preferences
    ADD CONSTRAINT transport_preferences_pkey PRIMARY KEY (id);


--
-- Name: transport_preferences transport_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_preferences
    ADD CONSTRAINT transport_preferences_user_id_key UNIQUE (user_id);


--
-- Name: transport_routes transport_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_pkey PRIMARY KEY (id);


--
-- Name: travel_preferences travel_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel_preferences
    ADD CONSTRAINT travel_preferences_pkey PRIMARY KEY (id);


--
-- Name: travel_preferences travel_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel_preferences
    ADD CONSTRAINT travel_preferences_user_id_key UNIQUE (user_id);


--
-- Name: trip_activities trip_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_activities
    ADD CONSTRAINT trip_activities_pkey PRIMARY KEY (id);


--
-- Name: trip_days trip_days_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_days
    ADD CONSTRAINT trip_days_pkey PRIMARY KEY (id);


--
-- Name: trip_segments trip_segments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_segments
    ADD CONSTRAINT trip_segments_pkey PRIMARY KEY (id);


--
-- Name: trip_stays trip_stays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stays
    ADD CONSTRAINT trip_stays_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: user_sustainability_impact user_sustainability_impact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sustainability_impact
    ADD CONSTRAINT user_sustainability_impact_pkey PRIMARY KEY (id);


--
-- Name: user_sustainability_impact user_sustainability_impact_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sustainability_impact
    ADD CONSTRAINT user_sustainability_impact_user_id_key UNIQUE (user_id);


--
-- Name: weather_snapshots weather_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_snapshots
    ADD CONSTRAINT weather_snapshots_pkey PRIMARY KEY (id);


--
-- Name: wildlife wildlife_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wildlife
    ADD CONSTRAINT wildlife_pkey PRIMARY KEY (id);


--
-- Name: wildlife wildlife_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wildlife
    ADD CONSTRAINT wildlife_slug_key UNIQUE (slug);


--
-- Name: winter_resorts winter_resorts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.winter_resorts
    ADD CONSTRAINT winter_resorts_pkey PRIMARY KEY (id);


--
-- Name: idx_accommodations_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_accommodations_location ON public.accommodations USING btree (location_id);


--
-- Name: idx_activities_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_location ON public.activities USING btree (location_id);


--
-- Name: idx_bookings_trip; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_trip ON public.bookings USING btree (trip_id);


--
-- Name: idx_bookings_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user ON public.bookings USING btree (user_id);


--
-- Name: idx_ev_chargers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ev_chargers_status ON public.ev_chargers USING btree (status);


--
-- Name: idx_ferries_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ferries_status ON public.ferries USING btree (status);


--
-- Name: idx_iot_telemetry_device_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_iot_telemetry_device_id ON public.iot_telemetry USING btree (device_id);


--
-- Name: idx_iot_telemetry_metric; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_iot_telemetry_metric ON public.iot_telemetry USING btree (metric);


--
-- Name: idx_iot_telemetry_recorded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_iot_telemetry_recorded_at ON public.iot_telemetry USING btree (recorded_at);


--
-- Name: idx_locations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_locations_status ON public.locations USING btree (status);


--
-- Name: idx_locations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_locations_type ON public.locations USING btree (type);


--
-- Name: idx_restaurants_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_restaurants_location ON public.restaurants USING btree (location_id);


--
-- Name: idx_smart_alerts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_smart_alerts_status ON public.smart_alerts USING btree (status);


--
-- Name: idx_trips_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_user ON public.trips USING btree (user_id);


--
-- Name: accommodations update_accommodations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON public.accommodations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: locations update_locations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: trips update_trips_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: accommodation_preferences accommodation_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodation_preferences
    ADD CONSTRAINT accommodation_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: accommodation_rooms accommodation_rooms_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodation_rooms
    ADD CONSTRAINT accommodation_rooms_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: accommodations accommodations_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: accommodations accommodations_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: activities activities_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: activities activities_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: aurora_forecasts aurora_forecasts_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aurora_forecasts
    ADD CONSTRAINT aurora_forecasts_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: emergency_contacts emergency_contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: equipment_rentals equipment_rentals_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_rentals
    ADD CONSTRAINT equipment_rentals_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: equipment_rentals equipment_rentals_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_rentals
    ADD CONSTRAINT equipment_rentals_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: ev_chargers ev_chargers_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev_chargers
    ADD CONSTRAINT ev_chargers_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.iot_devices(device_id) ON DELETE CASCADE;


--
-- Name: ev_chargers ev_chargers_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev_chargers
    ADD CONSTRAINT ev_chargers_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: events events_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: events events_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: ferries ferries_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferries
    ADD CONSTRAINT ferries_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.iot_devices(device_id) ON DELETE CASCADE;


--
-- Name: ferry_route_stops ferry_route_stops_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_route_stops
    ADD CONSTRAINT ferry_route_stops_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: ferry_route_stops ferry_route_stops_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_route_stops
    ADD CONSTRAINT ferry_route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.ferry_routes(id) ON DELETE CASCADE;


--
-- Name: ferry_routes ferry_routes_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_routes
    ADD CONSTRAINT ferry_routes_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.locations(id);


--
-- Name: ferry_routes ferry_routes_origin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ferry_routes
    ADD CONSTRAINT ferry_routes_origin_id_fkey FOREIGN KEY (origin_id) REFERENCES public.locations(id);


--
-- Name: food_preferences food_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_preferences
    ADD CONSTRAINT food_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: infrastructure_assets infrastructure_assets_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infrastructure_assets
    ADD CONSTRAINT infrastructure_assets_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: infrastructure_assets infrastructure_assets_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infrastructure_assets
    ADD CONSTRAINT infrastructure_assets_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id);


--
-- Name: iot_devices iot_devices_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: iot_devices iot_devices_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id);


--
-- Name: iot_telemetry iot_telemetry_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_telemetry
    ADD CONSTRAINT iot_telemetry_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.iot_devices(device_id) ON DELETE CASCADE;


--
-- Name: location_images location_images_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_images
    ADD CONSTRAINT location_images_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: payment_transactions payment_transactions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: payment_transactions payment_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payment_transactions payment_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: privacy_preferences privacy_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privacy_preferences
    ADD CONSTRAINT privacy_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: restaurants restaurants_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: restaurants restaurants_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: safety_alerts safety_alerts_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.safety_alerts
    ADD CONSTRAINT safety_alerts_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: smart_alerts smart_alerts_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smart_alerts
    ADD CONSTRAINT smart_alerts_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.iot_devices(device_id) ON DELETE CASCADE;


--
-- Name: trails trails_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trails
    ADD CONSTRAINT trails_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: transport_preferences transport_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_preferences
    ADD CONSTRAINT transport_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: transport_routes transport_routes_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: transport_routes transport_routes_origin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_origin_id_fkey FOREIGN KEY (origin_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: transport_routes transport_routes_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: travel_preferences travel_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel_preferences
    ADD CONSTRAINT travel_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: trip_activities trip_activities_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_activities
    ADD CONSTRAINT trip_activities_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: trip_activities trip_activities_trip_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_activities
    ADD CONSTRAINT trip_activities_trip_day_id_fkey FOREIGN KEY (trip_day_id) REFERENCES public.trip_days(id) ON DELETE CASCADE;


--
-- Name: trip_activities trip_activities_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_activities
    ADD CONSTRAINT trip_activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trip_days trip_days_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_days
    ADD CONSTRAINT trip_days_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trip_segments trip_segments_end_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_segments
    ADD CONSTRAINT trip_segments_end_location_id_fkey FOREIGN KEY (end_location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: trip_segments trip_segments_start_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_segments
    ADD CONSTRAINT trip_segments_start_location_id_fkey FOREIGN KEY (start_location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: trip_segments trip_segments_trip_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_segments
    ADD CONSTRAINT trip_segments_trip_day_id_fkey FOREIGN KEY (trip_day_id) REFERENCES public.trip_days(id) ON DELETE CASCADE;


--
-- Name: trip_segments trip_segments_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_segments
    ADD CONSTRAINT trip_segments_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trip_stays trip_stays_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stays
    ADD CONSTRAINT trip_stays_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: trip_stays trip_stays_trip_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stays
    ADD CONSTRAINT trip_stays_trip_day_id_fkey FOREIGN KEY (trip_day_id) REFERENCES public.trip_days(id) ON DELETE CASCADE;


--
-- Name: trip_stays trip_stays_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stays
    ADD CONSTRAINT trip_stays_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_sustainability_impact user_sustainability_impact_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sustainability_impact
    ADD CONSTRAINT user_sustainability_impact_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: weather_snapshots weather_snapshots_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_snapshots
    ADD CONSTRAINT weather_snapshots_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE CASCADE;


--
-- Name: winter_resorts winter_resorts_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.winter_resorts
    ADD CONSTRAINT winter_resorts_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: accommodations Accommodations viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Accommodations viewable by everyone." ON public.accommodations FOR SELECT USING (true);


--
-- Name: activities Activities viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Activities viewable by everyone." ON public.activities FOR SELECT USING (true);


--
-- Name: bookings Admins can manage all bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all bookings" ON public.bookings USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: trip_activities Admins can manage all trip_activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all trip_activities" ON public.trip_activities USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: trip_days Admins can manage all trip_days; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all trip_days" ON public.trip_days USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: trip_segments Admins can manage all trip_segments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all trip_segments" ON public.trip_segments USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: trip_stays Admins can manage all trip_stays; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all trip_stays" ON public.trip_stays USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: trips Admins can manage all trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all trips" ON public.trips USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: accommodations Admins can modify accommodations.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify accommodations." ON public.accommodations USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: activities Admins can modify activities.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify activities." ON public.activities USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: foods Admins can modify foods.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify foods." ON public.foods USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: locations Admins can modify locations.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify locations." ON public.locations USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: restaurants Admins can modify restaurants.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify restaurants." ON public.restaurants USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: wildlife Admins can modify wildlife.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can modify wildlife." ON public.wildlife USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role]))))));


--
-- Name: events Enable read access for all users on events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users on events" ON public.events FOR SELECT USING (true);


--
-- Name: equipment_rentals Enable read access for all users on rentals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users on rentals" ON public.equipment_rentals FOR SELECT USING (true);


--
-- Name: trip_days Enable read access for all users on trip_days; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users on trip_days" ON public.trip_days FOR SELECT USING (true);


--
-- Name: foods Foods viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Foods viewable by everyone." ON public.foods FOR SELECT USING (true);


--
-- Name: locations Locations viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Locations viewable by everyone." ON public.locations FOR SELECT USING (true);


--
-- Name: accommodations Providers can delete own accommodations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can delete own accommodations" ON public.accommodations FOR DELETE USING ((auth.uid() = provider_id));


--
-- Name: activities Providers can delete own activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can delete own activities" ON public.activities FOR DELETE USING ((auth.uid() = provider_id));


--
-- Name: restaurants Providers can delete own restaurants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can delete own restaurants" ON public.restaurants FOR DELETE USING ((auth.uid() = provider_id));


--
-- Name: transport_routes Providers can delete own transport_routes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can delete own transport_routes" ON public.transport_routes FOR DELETE USING ((auth.uid() = provider_id));


--
-- Name: accommodations Providers can insert accommodations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can insert accommodations" ON public.accommodations FOR INSERT WITH CHECK (((auth.uid() = provider_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['PROVIDER'::public.user_role, 'ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])))))));


--
-- Name: activities Providers can insert activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can insert activities" ON public.activities FOR INSERT WITH CHECK (((auth.uid() = provider_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['PROVIDER'::public.user_role, 'ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])))))));


--
-- Name: restaurants Providers can insert restaurants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can insert restaurants" ON public.restaurants FOR INSERT WITH CHECK (((auth.uid() = provider_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['PROVIDER'::public.user_role, 'ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])))))));


--
-- Name: iot_telemetry Providers can insert telemetry; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can insert telemetry" ON public.iot_telemetry FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.iot_devices
  WHERE ((iot_devices.device_id = iot_telemetry.device_id) AND (iot_devices.provider_id = auth.uid())))));


--
-- Name: transport_routes Providers can insert transport_routes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can insert transport_routes" ON public.transport_routes FOR INSERT WITH CHECK (((auth.uid() = provider_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['PROVIDER'::public.user_role, 'ADMIN'::public.user_role, 'SUPER_ADMIN'::public.user_role])))))));


--
-- Name: ev_chargers Providers can manage own ev_chargers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can manage own ev_chargers" ON public.ev_chargers USING ((EXISTS ( SELECT 1
   FROM public.iot_devices
  WHERE ((iot_devices.device_id = ev_chargers.device_id) AND (iot_devices.provider_id = auth.uid())))));


--
-- Name: ferries Providers can manage own ferries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can manage own ferries" ON public.ferries USING ((EXISTS ( SELECT 1
   FROM public.iot_devices
  WHERE ((iot_devices.device_id = ferries.device_id) AND (iot_devices.provider_id = auth.uid())))));


--
-- Name: iot_devices Providers can manage own iot_devices; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can manage own iot_devices" ON public.iot_devices USING ((auth.uid() = provider_id));


--
-- Name: accommodations Providers can update own accommodations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can update own accommodations" ON public.accommodations FOR UPDATE USING ((auth.uid() = provider_id));


--
-- Name: activities Providers can update own activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can update own activities" ON public.activities FOR UPDATE USING ((auth.uid() = provider_id));


--
-- Name: restaurants Providers can update own restaurants; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can update own restaurants" ON public.restaurants FOR UPDATE USING ((auth.uid() = provider_id));


--
-- Name: transport_routes Providers can update own transport_routes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Providers can update own transport_routes" ON public.transport_routes FOR UPDATE USING ((auth.uid() = provider_id));


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: aurora_forecasts Public read aurora_forecasts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read aurora_forecasts" ON public.aurora_forecasts FOR SELECT USING (true);


--
-- Name: ev_chargers Public read ev_chargers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read ev_chargers" ON public.ev_chargers FOR SELECT USING (true);


--
-- Name: ferries Public read ferries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read ferries" ON public.ferries FOR SELECT USING (true);


--
-- Name: ferry_route_stops Public read ferry_route_stops; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read ferry_route_stops" ON public.ferry_route_stops FOR SELECT USING (true);


--
-- Name: ferry_routes Public read ferry_routes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read ferry_routes" ON public.ferry_routes FOR SELECT USING (true);


--
-- Name: infrastructure_assets Public read infrastructure_assets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read infrastructure_assets" ON public.infrastructure_assets FOR SELECT USING (true);


--
-- Name: iot_devices Public read iot_devices; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read iot_devices" ON public.iot_devices FOR SELECT USING (true);


--
-- Name: iot_telemetry Public read iot_telemetry; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read iot_telemetry" ON public.iot_telemetry FOR SELECT USING (true);


--
-- Name: safety_alerts Public read safety_alerts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read safety_alerts" ON public.safety_alerts FOR SELECT USING (true);


--
-- Name: smart_alerts Public read smart_alerts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read smart_alerts" ON public.smart_alerts FOR SELECT USING (true);


--
-- Name: weather_snapshots Public read weather_snapshots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read weather_snapshots" ON public.weather_snapshots FOR SELECT USING (true);


--
-- Name: restaurants Restaurants viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Restaurants viewable by everyone." ON public.restaurants FOR SELECT USING (true);


--
-- Name: payment_transactions Users can create their own payment transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own payment transactions" ON public.payment_transactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: trips Users can delete own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own trips" ON public.trips FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: bookings Users can insert own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: trips Users can insert own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own trips" ON public.trips FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: accommodation_preferences Users can manage own accommodation preferences.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own accommodation preferences." ON public.accommodation_preferences USING ((auth.uid() = user_id));


--
-- Name: bookings Users can manage own bookings.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own bookings." ON public.bookings USING ((auth.uid() = user_id));


--
-- Name: food_preferences Users can manage own food preferences.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own food preferences." ON public.food_preferences USING ((auth.uid() = user_id));


--
-- Name: transport_preferences Users can manage own transport preferences.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own transport preferences." ON public.transport_preferences USING ((auth.uid() = user_id));


--
-- Name: travel_preferences Users can manage own travel preferences.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own travel preferences." ON public.travel_preferences USING ((auth.uid() = user_id));


--
-- Name: trip_activities Users can manage own trip_activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own trip_activities" ON public.trip_activities USING ((EXISTS ( SELECT 1
   FROM public.trips
  WHERE ((trips.id = trip_activities.trip_id) AND (trips.user_id = auth.uid())))));


--
-- Name: trip_days Users can manage own trip_days; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own trip_days" ON public.trip_days USING ((EXISTS ( SELECT 1
   FROM public.trips
  WHERE ((trips.id = trip_days.trip_id) AND (trips.user_id = auth.uid())))));


--
-- Name: trip_segments Users can manage own trip_segments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own trip_segments" ON public.trip_segments USING ((EXISTS ( SELECT 1
   FROM public.trips
  WHERE ((trips.id = trip_segments.trip_id) AND (trips.user_id = auth.uid())))));


--
-- Name: trip_stays Users can manage own trip_stays; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own trip_stays" ON public.trip_stays USING ((EXISTS ( SELECT 1
   FROM public.trips
  WHERE ((trips.id = trip_stays.trip_id) AND (trips.user_id = auth.uid())))));


--
-- Name: trips Users can manage own trips.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own trips." ON public.trips USING ((auth.uid() = user_id));


--
-- Name: bookings Users can update own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (((auth.uid() = user_id) OR (auth.uid() = provider_id)));


--
-- Name: profiles Users can update own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: trips Users can update own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bookings Users can view own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (((auth.uid() = user_id) OR (auth.uid() = provider_id)));


--
-- Name: trips Users can view own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own trips" ON public.trips FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: payment_transactions Users can view their own payment transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own payment transactions" ON public.payment_transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: wildlife Wildlife viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Wildlife viewable by everyone." ON public.wildlife FOR SELECT USING (true);


--
-- Name: accommodation_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.accommodation_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: accommodations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

--
-- Name: activities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

--
-- Name: aurora_forecasts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.aurora_forecasts ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: equipment_rentals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;

--
-- Name: ev_chargers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ev_chargers ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: ferries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ferries ENABLE ROW LEVEL SECURITY;

--
-- Name: ferry_route_stops; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ferry_route_stops ENABLE ROW LEVEL SECURITY;

--
-- Name: ferry_routes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ferry_routes ENABLE ROW LEVEL SECURITY;

--
-- Name: food_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: foods; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

--
-- Name: infrastructure_assets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.infrastructure_assets ENABLE ROW LEVEL SECURITY;

--
-- Name: iot_devices; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;

--
-- Name: iot_telemetry; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;

--
-- Name: locations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

--
-- Name: payment_transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: restaurants; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

--
-- Name: safety_alerts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: smart_alerts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: transport_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transport_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: travel_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: trip_days; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;

--
-- Name: trips; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

--
-- Name: weather_snapshots; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.weather_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: wildlife; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wildlife ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: TABLE activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.activities TO anon;
GRANT ALL ON TABLE public.activities TO authenticated;
GRANT ALL ON TABLE public.activities TO service_role;


--
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.locations TO anon;
GRANT ALL ON TABLE public.locations TO authenticated;
GRANT ALL ON TABLE public.locations TO service_role;


--
-- Name: TABLE restaurants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.restaurants TO anon;
GRANT ALL ON TABLE public.restaurants TO authenticated;
GRANT ALL ON TABLE public.restaurants TO service_role;


--
-- Name: TABLE accommodations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accommodations TO anon;
GRANT ALL ON TABLE public.accommodations TO authenticated;
GRANT ALL ON TABLE public.accommodations TO service_role;


--
-- Name: FUNCTION get_smart_map_markers(min_lat double precision, max_lat double precision, min_lng double precision, max_lng double precision, filter_layers text[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_smart_map_markers(min_lat double precision, max_lat double precision, min_lng double precision, max_lng double precision, filter_layers text[]) TO anon;
GRANT ALL ON FUNCTION public.get_smart_map_markers(min_lat double precision, max_lat double precision, min_lng double precision, max_lng double precision, filter_layers text[]) TO authenticated;
GRANT ALL ON FUNCTION public.get_smart_map_markers(min_lat double precision, max_lat double precision, min_lng double precision, max_lng double precision, filter_layers text[]) TO service_role;


--
-- Name: TABLE accommodation_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accommodation_preferences TO anon;
GRANT ALL ON TABLE public.accommodation_preferences TO authenticated;
GRANT ALL ON TABLE public.accommodation_preferences TO service_role;


--
-- Name: TABLE accommodation_rooms; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accommodation_rooms TO anon;
GRANT ALL ON TABLE public.accommodation_rooms TO authenticated;
GRANT ALL ON TABLE public.accommodation_rooms TO service_role;


--
-- Name: TABLE admin_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_permissions TO anon;
GRANT ALL ON TABLE public.admin_permissions TO authenticated;
GRANT ALL ON TABLE public.admin_permissions TO service_role;


--
-- Name: TABLE articles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.articles TO anon;
GRANT ALL ON TABLE public.articles TO authenticated;
GRANT ALL ON TABLE public.articles TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: TABLE aurora_forecasts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.aurora_forecasts TO anon;
GRANT ALL ON TABLE public.aurora_forecasts TO authenticated;
GRANT ALL ON TABLE public.aurora_forecasts TO service_role;


--
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;


--
-- Name: TABLE emergency_contacts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.emergency_contacts TO anon;
GRANT ALL ON TABLE public.emergency_contacts TO authenticated;
GRANT ALL ON TABLE public.emergency_contacts TO service_role;


--
-- Name: TABLE equipment_rentals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.equipment_rentals TO anon;
GRANT ALL ON TABLE public.equipment_rentals TO authenticated;
GRANT ALL ON TABLE public.equipment_rentals TO service_role;


--
-- Name: TABLE ev_chargers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ev_chargers TO anon;
GRANT ALL ON TABLE public.ev_chargers TO authenticated;
GRANT ALL ON TABLE public.ev_chargers TO service_role;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;
GRANT ALL ON TABLE public.events TO service_role;


--
-- Name: TABLE favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.favorites TO anon;
GRANT ALL ON TABLE public.favorites TO authenticated;
GRANT ALL ON TABLE public.favorites TO service_role;


--
-- Name: TABLE ferries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ferries TO anon;
GRANT ALL ON TABLE public.ferries TO authenticated;
GRANT ALL ON TABLE public.ferries TO service_role;


--
-- Name: TABLE ferry_route_stops; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ferry_route_stops TO anon;
GRANT ALL ON TABLE public.ferry_route_stops TO authenticated;
GRANT ALL ON TABLE public.ferry_route_stops TO service_role;


--
-- Name: TABLE ferry_routes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ferry_routes TO anon;
GRANT ALL ON TABLE public.ferry_routes TO authenticated;
GRANT ALL ON TABLE public.ferry_routes TO service_role;


--
-- Name: TABLE food_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.food_preferences TO anon;
GRANT ALL ON TABLE public.food_preferences TO authenticated;
GRANT ALL ON TABLE public.food_preferences TO service_role;


--
-- Name: TABLE foods; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.foods TO anon;
GRANT ALL ON TABLE public.foods TO authenticated;
GRANT ALL ON TABLE public.foods TO service_role;


--
-- Name: TABLE infrastructure_assets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.infrastructure_assets TO anon;
GRANT ALL ON TABLE public.infrastructure_assets TO authenticated;
GRANT ALL ON TABLE public.infrastructure_assets TO service_role;


--
-- Name: TABLE iot_devices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.iot_devices TO anon;
GRANT ALL ON TABLE public.iot_devices TO authenticated;
GRANT ALL ON TABLE public.iot_devices TO service_role;


--
-- Name: TABLE iot_telemetry; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.iot_telemetry TO anon;
GRANT ALL ON TABLE public.iot_telemetry TO authenticated;
GRANT ALL ON TABLE public.iot_telemetry TO service_role;


--
-- Name: TABLE location_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.location_images TO anon;
GRANT ALL ON TABLE public.location_images TO authenticated;
GRANT ALL ON TABLE public.location_images TO service_role;


--
-- Name: TABLE notification_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_preferences TO anon;
GRANT ALL ON TABLE public.notification_preferences TO authenticated;
GRANT ALL ON TABLE public.notification_preferences TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO anon;
GRANT ALL ON TABLE public.order_items TO authenticated;
GRANT ALL ON TABLE public.order_items TO service_role;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- Name: TABLE payment_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_transactions TO anon;
GRANT ALL ON TABLE public.payment_transactions TO authenticated;
GRANT ALL ON TABLE public.payment_transactions TO service_role;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;


--
-- Name: TABLE privacy_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.privacy_preferences TO anon;
GRANT ALL ON TABLE public.privacy_preferences TO authenticated;
GRANT ALL ON TABLE public.privacy_preferences TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE transport_routes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transport_routes TO anon;
GRANT ALL ON TABLE public.transport_routes TO authenticated;
GRANT ALL ON TABLE public.transport_routes TO service_role;


--
-- Name: TABLE provider_listings_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.provider_listings_view TO anon;
GRANT ALL ON TABLE public.provider_listings_view TO authenticated;
GRANT ALL ON TABLE public.provider_listings_view TO service_role;


--
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;
GRANT ALL ON TABLE public.reviews TO service_role;


--
-- Name: TABLE safety_alerts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.safety_alerts TO anon;
GRANT ALL ON TABLE public.safety_alerts TO authenticated;
GRANT ALL ON TABLE public.safety_alerts TO service_role;


--
-- Name: TABLE smart_alerts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.smart_alerts TO anon;
GRANT ALL ON TABLE public.smart_alerts TO authenticated;
GRANT ALL ON TABLE public.smart_alerts TO service_role;


--
-- Name: TABLE trails; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trails TO anon;
GRANT ALL ON TABLE public.trails TO authenticated;
GRANT ALL ON TABLE public.trails TO service_role;


--
-- Name: TABLE transport_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transport_preferences TO anon;
GRANT ALL ON TABLE public.transport_preferences TO authenticated;
GRANT ALL ON TABLE public.transport_preferences TO service_role;


--
-- Name: TABLE travel_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.travel_preferences TO anon;
GRANT ALL ON TABLE public.travel_preferences TO authenticated;
GRANT ALL ON TABLE public.travel_preferences TO service_role;


--
-- Name: TABLE trip_activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_activities TO anon;
GRANT ALL ON TABLE public.trip_activities TO authenticated;
GRANT ALL ON TABLE public.trip_activities TO service_role;


--
-- Name: TABLE trip_days; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_days TO anon;
GRANT ALL ON TABLE public.trip_days TO authenticated;
GRANT ALL ON TABLE public.trip_days TO service_role;


--
-- Name: TABLE trip_segments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_segments TO anon;
GRANT ALL ON TABLE public.trip_segments TO authenticated;
GRANT ALL ON TABLE public.trip_segments TO service_role;


--
-- Name: TABLE trip_stays; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_stays TO anon;
GRANT ALL ON TABLE public.trip_stays TO authenticated;
GRANT ALL ON TABLE public.trip_stays TO service_role;


--
-- Name: TABLE trips; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trips TO anon;
GRANT ALL ON TABLE public.trips TO authenticated;
GRANT ALL ON TABLE public.trips TO service_role;


--
-- Name: TABLE user_sustainability_impact; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_sustainability_impact TO anon;
GRANT ALL ON TABLE public.user_sustainability_impact TO authenticated;
GRANT ALL ON TABLE public.user_sustainability_impact TO service_role;


--
-- Name: TABLE weather_snapshots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.weather_snapshots TO anon;
GRANT ALL ON TABLE public.weather_snapshots TO authenticated;
GRANT ALL ON TABLE public.weather_snapshots TO service_role;


--
-- Name: TABLE wildlife; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wildlife TO anon;
GRANT ALL ON TABLE public.wildlife TO authenticated;
GRANT ALL ON TABLE public.wildlife TO service_role;


--
-- Name: TABLE winter_resorts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.winter_resorts TO anon;
GRANT ALL ON TABLE public.winter_resorts TO authenticated;
GRANT ALL ON TABLE public.winter_resorts TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--



--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- PostgreSQL database dump complete
--



