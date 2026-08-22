-- PHASE 19: Realtime IoT & Smart Infrastructure Seed Data
-- Simulated IoT Data for demonstration

-- Assuming the provider_id corresponds to provider@test.com
DO $$ 
DECLARE
    v_provider_id UUID;
    v_location_oslo UUID;
    v_location_bergen UUID;
    v_location_tromso UUID;
    v_device_ev1_id TEXT := 'dev-ev-001';
    v_device_ev2_id TEXT := 'dev-ev-002';
    v_device_ferry1_id TEXT := 'dev-ferry-001';
    v_device_sensor1_id TEXT := 'dev-sensor-001';
BEGIN
    SELECT id INTO v_provider_id FROM public.profiles WHERE email = 'provider@test.com' LIMIT 1;
    SELECT id INTO v_location_oslo FROM public.locations WHERE slug = 'oslo' LIMIT 1;
    SELECT id INTO v_location_bergen FROM public.locations WHERE slug = 'bergen' LIMIT 1;
    SELECT id INTO v_location_tromso FROM public.locations WHERE slug = 'tromso' LIMIT 1;

    -- 1. IoT Devices
    INSERT INTO public.iot_devices (device_id, name, device_type, provider_id, location_id, latitude, longitude, status, metadata)
    VALUES 
        (v_device_ev1_id, 'Oslo Central EV Station', 'EV_CHARGER', v_provider_id, v_location_oslo, 59.9139, 10.7522, 'ONLINE', '{"is_simulated": true}'),
        (v_device_ev2_id, 'Bergen Port EV Station', 'EV_CHARGER', v_provider_id, v_location_bergen, 60.3929, 5.3241, 'ONLINE', '{"is_simulated": true}'),
        (v_device_ferry1_id, 'Aurora Smart Ferry', 'FERRY', v_provider_id, v_location_tromso, 69.6492, 18.9553, 'ONLINE', '{"is_simulated": true}'),
        (v_device_sensor1_id, 'Oslo Weather Sensor A1', 'WEATHER_SENSOR', v_provider_id, v_location_oslo, 59.9140, 10.7530, 'ONLINE', '{"is_simulated": true}')
    ON CONFLICT (device_id) DO NOTHING;

    -- 2. EV Chargers
    INSERT INTO public.ev_chargers (device_id, station_name, operator, location_id, latitude, longitude, address, connector_types, max_power_kw, status, availability, current_power_kw, price_per_kwh)
    VALUES 
        (v_device_ev1_id, 'Oslo Central EV Station', 'SmartCharge Norway', v_location_oslo, 59.9139, 10.7522, 'Jernbanetorget 1, Oslo', ARRAY['CCS', 'Type 2'], 150, 'AVAILABLE', 4, 0, 4.5),
        (v_device_ev2_id, 'Bergen Port EV Station', 'SmartCharge Norway', v_location_bergen, 60.3929, 5.3241, 'Vågen, Bergen', ARRAY['CCS', 'CHAdeMO'], 50, 'OCCUPIED', 0, 45, 5.0)
    ON CONFLICT (device_id) DO NOTHING;

    -- 3. Ferries
    INSERT INTO public.ferries (device_id, name, operator, route_id, capacity, battery_capacity, current_battery, latitude, longitude, speed, status, eta)
    VALUES 
        (v_device_ferry1_id, 'Aurora Smart Ferry', 'FjordLine', 'R-01', 300, 2000, 1850, 69.6492, 18.9553, 12.5, 'IN_TRANSIT', now() + interval '45 minutes')
    ON CONFLICT (device_id) DO NOTHING;

    -- 4. Infrastructure Assets
    INSERT INTO public.infrastructure_assets (name, asset_type, location_id, latitude, longitude, status, provider_id, metadata)
    VALUES 
        ('Oslo Weather Sensor A1', 'WEATHER', v_location_oslo, 59.9140, 10.7530, 'ONLINE', v_provider_id, '{"is_simulated": true, "model": "WX-500"}');

    -- 5. IoT Telemetry (Simulated initial values)
    INSERT INTO public.iot_telemetry (device_id, metric, value, unit, metadata)
    VALUES 
        (v_device_ev1_id, 'power_kw', 0, 'kW', '{"is_simulated": true}'),
        (v_device_ev2_id, 'power_kw', 45, 'kW', '{"is_simulated": true}'),
        (v_device_ferry1_id, 'battery_percent', 92.5, '%', '{"is_simulated": true}'),
        (v_device_sensor1_id, 'temperature', -2.5, 'C', '{"is_simulated": true}');

    -- 6. Smart Alerts
    INSERT INTO public.smart_alerts (device_id, alert_type, severity, title, message, value, threshold, status)
    VALUES 
        (v_device_sensor1_id, 'ICE_WARNING', 'WARNING', 'Ice Warning', 'Temperatures dropped below freezing. Potential ice on roads.', -2.5, 0, 'ACTIVE');

END $$;
