DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Iterate over all tables in the public schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        -- 1. Revoke all privileges from anon and authenticated
        EXECUTE 'REVOKE ALL ON TABLE public.' || quote_ident(r.tablename) || ' FROM anon;';
        EXECUTE 'REVOKE ALL ON TABLE public.' || quote_ident(r.tablename) || ' FROM authenticated;';
        
        -- 2. Grant service_role full privileges (bypass RLS / backend tasks)
        EXECUTE 'GRANT ALL ON TABLE public.' || quote_ident(r.tablename) || ' TO service_role;';
        
        -- 3. Grant authenticated CRUD privileges. RLS policies will govern the actual access.
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.' || quote_ident(r.tablename) || ' TO authenticated;';
    END LOOP;
END $$;

-- 4. Explicitly grant SELECT to anon ONLY on public-facing tables
GRANT SELECT ON public.accommodations TO anon;
GRANT SELECT ON public.activities TO anon;
GRANT SELECT ON public.locations TO anon;
GRANT SELECT ON public.restaurants TO anon;
GRANT SELECT ON public.foods TO anon;
GRANT SELECT ON public.wildlife TO anon;
GRANT SELECT ON public.trails TO anon;
GRANT SELECT ON public.equipment_rentals TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.deals TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.ferries TO anon;
GRANT SELECT ON public.ferry_routes TO anon;
GRANT SELECT ON public.ferry_route_stops TO anon;
GRANT SELECT ON public.ev_chargers TO anon;
GRANT SELECT ON public.infrastructure_assets TO anon;
GRANT SELECT ON public.aurora_forecasts TO anon;
GRANT SELECT ON public.weather_snapshots TO anon;
GRANT SELECT ON public.location_images TO anon;
