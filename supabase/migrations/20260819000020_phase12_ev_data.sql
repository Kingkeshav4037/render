-- Phase 12: EV Charger Data Expansion

-- 1. Insert locations
INSERT INTO public.locations (id, slug, name, description, region, type, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_loc.slug,
  new_loc.name,
  'Location for EV Charger',
  'Norway',
  new_loc.loc_type::public.location_type,
  'PUBLISHED'::public.content_status,
  new_loc.lat,
  new_loc.lng
FROM (
  VALUES
    ('oslo', 'Oslo', 'CITY', 59.9115, 10.7522),
    ('bergen', 'Bergen', 'CITY', 60.3929, 5.322),
    ('tromsø', 'Tromsø', 'CITY', 69.6833, 18.9167),
    ('flåm', 'Flåm', 'VILLAGE', 60.8624, 7.1129),
    ('geiranger', 'Geiranger', 'VILLAGE', 62.1009, 7.2059),
    ('trollstigen viewpoint', 'Trollstigen Viewpoint', 'VIEWPOINT', 62.4534, 7.6644),
    ('svolvær', 'Svolvær', 'CITY', 68.2343, 14.5621),
    ('nordkapp', 'Nordkapp', 'VIEWPOINT', 71.1709, 25.783),
    ('oppdal', 'Oppdal', 'CITY', 62.5937, 9.6917),
    ('stavanger', 'Stavanger', 'CITY', 58.9699, 5.7331),
    ('eldhusøya', 'Eldhusøya', 'VIEWPOINT', 63.0167, 7.35)
) AS new_loc(slug, name, loc_type, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations l WHERE l.slug = new_loc.slug
);

-- 2. Insert into iot_devices
INSERT INTO public.iot_devices (id, device_id, name, device_type, status, location_id, latitude, longitude)
SELECT
  gen_random_uuid(),
  new_dev.device_id,
  new_dev.name,
  'EV_CHARGER',
  'ONLINE',
  loc.id,
  new_dev.lat,
  new_dev.lng
FROM (
  VALUES
    ('ev-oslo-s-1', 'Oslo S Supercharger', 'oslo', 59.9115, 10.7522),
    ('ev-bergen-center-1', 'Bergen Sentrum Fast Charger', 'bergen', 60.3929, 5.322),
    ('ev-tromso-airport-1', 'Tromsø Lufthavn Charger', 'tromsø', 69.6833, 18.9167),
    ('ev-flam-1', 'Flåm Tourist Charger', 'flåm', 60.8624, 7.1129),
    ('ev-geiranger-1', 'Geirangerfjord Supercharger', 'geiranger', 62.1009, 7.2059),
    ('ev-trollstigen-1', 'Trollstigen Base Charger', 'trollstigen viewpoint', 62.4534, 7.6644),
    ('ev-lofoten-svolvaer', 'Svolvær Port Charger', 'svolvær', 68.2343, 14.5621),
    ('ev-nordkapp-1', 'North Cape Charger', 'nordkapp', 71.1709, 25.783),
    ('ev-e6-oppdal', 'E6 Oppdal Highway Charger', 'oppdal', 62.5937, 9.6917),
    ('ev-e39-stavanger', 'E39 Stavanger Hub', 'stavanger', 58.9699, 5.7331),
    ('ev-atlantic-road-1', 'Atlantic Road Rest Stop', 'eldhusøya', 63.0167, 7.35)
) AS new_dev(device_id, name, loc_slug, lat, lng)
JOIN public.locations loc ON loc.slug = new_dev.loc_slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.iot_devices d WHERE d.device_id = new_dev.device_id
);

-- 3. Insert into ev_chargers
INSERT INTO public.ev_chargers (id, device_id, station_name, operator, location_id, latitude, longitude, connector_types, max_power_kw, status, price_per_kwh)
SELECT
  gen_random_uuid(),
  new_ev.device_id,
  new_ev.name,
  new_ev.operator,
  d.location_id,
  new_ev.lat,
  new_ev.lng,
  new_ev.conns::text[],
  new_ev.power,
  'AVAILABLE',
  new_ev.price
FROM (
  VALUES
    ('ev-oslo-s-1', 'Oslo S Supercharger', 'Mer', 59.9115, 10.7522, ARRAY['CCS', 'CHAdeMO'], 150, 5.5),
    ('ev-bergen-center-1', 'Bergen Sentrum Fast Charger', 'Recharge', 60.3929, 5.322, ARRAY['CCS', 'Type 2'], 50, 6),
    ('ev-tromso-airport-1', 'Tromsø Lufthavn Charger', 'Eviny', 69.6833, 18.9167, ARRAY['CCS'], 150, 6.5),
    ('ev-flam-1', 'Flåm Tourist Charger', 'Mer', 60.8624, 7.1129, ARRAY['CCS', 'CHAdeMO'], 100, 6.2),
    ('ev-geiranger-1', 'Geirangerfjord Supercharger', 'Tesla', 62.1009, 7.2059, ARRAY['CCS'], 250, 4.8),
    ('ev-trollstigen-1', 'Trollstigen Base Charger', 'Recharge', 62.4534, 7.6644, ARRAY['CCS', 'Type 2'], 50, 6),
    ('ev-lofoten-svolvaer', 'Svolvær Port Charger', 'Eviny', 68.2343, 14.5621, ARRAY['CCS', 'CHAdeMO'], 150, 6.5),
    ('ev-nordkapp-1', 'North Cape Charger', 'Mer', 71.1709, 25.783, ARRAY['CCS', 'Type 2'], 50, 7),
    ('ev-e6-oppdal', 'E6 Oppdal Highway Charger', 'Ionity', 62.5937, 9.6917, ARRAY['CCS'], 350, 8.5),
    ('ev-e39-stavanger', 'E39 Stavanger Hub', 'Recharge', 58.9699, 5.7331, ARRAY['CCS', 'CHAdeMO', 'Type 2'], 150, 5.8),
    ('ev-atlantic-road-1', 'Atlantic Road Rest Stop', 'Eviny', 63.0167, 7.35, ARRAY['CCS'], 50, 6.2)
) AS new_ev(device_id, name, operator, lat, lng, conns, power, price)
JOIN public.iot_devices d ON d.device_id = new_ev.device_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.ev_chargers e WHERE e.device_id = new_ev.device_id
);
