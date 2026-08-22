-- PHASE 20: Weather & Aurora Intelligence Seed Data
-- Simulated perfect Aurora conditions in Tromsø

DO $$ 
DECLARE
    v_location_tromso UUID;
    v_location_oslo UUID;
BEGIN
    SELECT id INTO v_location_tromso FROM public.locations WHERE slug = 'tromso' LIMIT 1;
    SELECT id INTO v_location_oslo FROM public.locations WHERE slug = 'oslo' LIMIT 1;

    -- Clear old forecasts/weather to prevent duplicate clutter
    DELETE FROM public.weather_snapshots WHERE location_id IN (v_location_tromso, v_location_oslo);
    DELETE FROM public.aurora_forecasts WHERE location_id IN (v_location_tromso, v_location_oslo);

    -- 1. Weather Data
    -- Tromsø: Clear skies, high visibility
    INSERT INTO public.weather_snapshots (location_id, temperature_c, condition, wind_speed_kmh, cloud_cover_pct, visibility_km)
    VALUES (v_location_tromso, -5.5, 'CLEAR', 12.0, 5, 20.0);

    -- Oslo: Cloudy
    INSERT INTO public.weather_snapshots (location_id, temperature_c, condition, wind_speed_kmh, cloud_cover_pct, visibility_km)
    VALUES (v_location_oslo, 2.0, 'CLOUDY', 8.5, 85, 8.0);

    -- 2. Aurora Forecast
    -- Tromsø: High KP index and probability
    INSERT INTO public.aurora_forecasts (location_id, kp_index, probability_pct, forecast_time)
    VALUES (v_location_tromso, 5.5, 85, now());

    -- Oslo: Low probability
    INSERT INTO public.aurora_forecasts (location_id, kp_index, probability_pct, forecast_time)
    VALUES (v_location_oslo, 2.0, 15, now());

END $$;
