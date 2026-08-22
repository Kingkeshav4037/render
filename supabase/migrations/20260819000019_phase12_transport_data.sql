-- Phase 12: Transport Routes Data Expansion

INSERT INTO public.transport_routes (id, name, type, operator, duration_minutes, price_estimate, currency, co2_emissions_kg, status)
SELECT
  gen_random_uuid(),
  new_route.name,
  new_route.type::public.transport_type,
  new_route.operator,
  new_route.duration,
  new_route.price,
  'NOK',
  new_route.co2,
  'PUBLISHED'::public.content_status
FROM (
  VALUES
    ('Oslo–Bergen Railway', 'TRAIN', 'Vy', 420, 900, 5),
    ('Flåm Railway', 'TRAIN', 'Norway in a Nutshell', 60, 500, 1),
    ('Raumabanen', 'TRAIN', 'SJ Nord', 100, 300, 2),
    ('Nordland Railway', 'TRAIN', 'SJ Nord', 600, 1100, 8),
    ('Hurtigruten Coastal Route', 'FERRY', 'Hurtigruten', 15840, 15000, 500),
    ('Havila Coastal Route', 'FERRY', 'Havila Voyages', 15840, 14000, 400),
    ('Oslo to Tromsø Flight', 'FLIGHT', 'SAS', 115, 1200, 150),
    ('Bergen to Tromsø Flight', 'FLIGHT', 'Widerøe', 130, 1500, 160),
    ('Bodø - Lofoten Express Boat', 'FERRY', 'Torghatten Nord', 200, 800, 30),
    ('Geirangerfjord Ferry', 'FERRY', 'The Fjords', 90, 400, 5),
    ('Sognefjord Express Bus', 'BUS', 'NOR-WAY Bussekspress', 300, 600, 15),
    ('The Arctic Route (Tromsø - Narvik)', 'BUS', 'Best Arctic', 240, 700, 12)
) AS new_route(name, type, operator, duration, price, co2)
WHERE NOT EXISTS (
  SELECT 1 FROM public.transport_routes tr WHERE tr.name = new_route.name
);
