-- Phase 12: Events Data Expansion

INSERT INTO public.events (id, name, category, description, start_date, end_date, ticket_price, currency, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_event.name,
  new_event.cat::public.event_category,
  new_event.description,
  new_event.start_date::timestamp with time zone,
  new_event.end_date::timestamp with time zone,
  new_event.price,
  'NOK',
  'PUBLISHED'::public.content_status,
  new_event.lat,
  new_event.lng
FROM (
  VALUES
    ('Oslo Jazz Festival', 'FESTIVAL', 'Annual jazz festival filling the streets and venues of Oslo.', '2027-08-15 10:00:00Z', '2027-08-22 23:59:00Z', 1200, 59.9139, 10.7522),
    ('Bergen International Festival', 'FESTIVAL', 'The largest festival for music and performing arts in the Nordic region.', '2027-05-26 10:00:00Z', '2027-06-09 23:59:00Z', 900, 60.3929, 5.322),
    ('Tromsø International Film Festival (TIFF)', 'CULTURAL', 'Norway''s largest film festival, taking place during the polar night.', '2027-01-18 10:00:00Z', '2027-01-24 23:59:00Z', 1500, 69.6492, 18.9553),
    ('Holmenkollen Ski Festival', 'SPORTS', 'World Cup Nordic skiing events, drawing massive crowds for cross-country and ski jumping.', '2027-03-11 10:00:00Z', '2027-03-14 23:59:00Z', 400, 59.9639, 10.6672),
    ('Trøndelag Food Festival', 'FESTIVAL', 'A major culinary event celebrating local produce and Nordic cuisine in Trondheim.', '2027-08-05 10:00:00Z', '2027-08-07 23:59:00Z', 0, 63.4305, 10.3951),
    ('Gladmat Festival', 'FESTIVAL', 'Scandinavia''s leading food festival, taking place in Stavanger.', '2027-06-30 10:00:00Z', '2027-07-03 23:59:00Z', 0, 58.9699, 5.7331),
    ('Bukta Open Air Festival', 'FESTIVAL', 'Rock music festival in Tromsø, known for its midnight sun setting.', '2027-07-15 10:00:00Z', '2027-07-17 23:59:00Z', 2100, 69.6492, 18.9553),
    ('Øyafestivalen', 'FESTIVAL', 'Oslo''s largest music festival, featuring international and Norwegian artists.', '2027-08-10 10:00:00Z', '2027-08-14 23:59:00Z', 3400, 59.9139, 10.7522),
    ('Northern Lights Festival', 'FESTIVAL', 'A classical and contemporary music festival held in Tromsø.', '2027-01-28 10:00:00Z', '2027-02-06 23:59:00Z', 800, 69.6492, 18.9553),
    ('Peer Gynt Festival', 'CULTURAL', 'Celebrating Henrik Ibsen''s famous play with outdoor performances in Gudbrandsdalen.', '2027-08-04 10:00:00Z', '2027-08-14 23:59:00Z', 600, 61.3431, 9.9839),
    ('Viking Festival at Avaldsnes', 'CULTURAL', 'The largest Viking festival in Western Norway with re-enactments and markets.', '2027-06-10 10:00:00Z', '2027-06-13 23:59:00Z', 200, 59.3564, 5.2891),
    ('St. Olav Festival', 'CULTURAL', 'Norway''s largest church and cultural festival in Trondheim.', '2027-07-28 10:00:00Z', '2027-08-03 23:59:00Z', 500, 63.4305, 10.3951),
    ('Birkelunden Flea Market', 'CULTURAL', 'A classic Sunday market in the heart of Grünerløkka, Oslo.', '2027-05-02 10:00:00Z', '2027-05-02 23:59:00Z', 0, 59.9265, 10.7601),
    ('Oslo Marathon', 'SPORTS', 'An annual marathon running through the beautiful streets of the capital.', '2027-09-18 10:00:00Z', '2027-09-18 23:59:00Z', 950, 59.9139, 10.7522),
    ('Bergen City Marathon', 'SPORTS', 'A scenic marathon weaving through the historic neighborhoods of Bergen.', '2027-04-24 10:00:00Z', '2027-04-24 23:59:00Z', 850, 60.3929, 5.322),
    ('Birkebeinerrennet', 'SPORTS', 'A historic cross-country ski marathon carrying a 3.5kg backpack.', '2027-03-20 10:00:00Z', '2027-03-20 23:59:00Z', 1400, 61.1153, 10.4662),
    ('Midnight Sun Marathon', 'SPORTS', 'Run a marathon in Tromsø under the glow of the midnight sun.', '2027-06-19 10:00:00Z', '2027-06-19 23:59:00Z', 900, 69.6492, 18.9553),
    ('Ekstremsportveko (Extreme Sports Week)', 'SPORTS', 'The world''s largest extreme sports festival, held in Voss.', '2027-06-27 10:00:00Z', '2027-07-04 23:59:00Z', 1900, 60.6277, 6.4258),
    ('Finnmarksløpet', 'SPORTS', 'Europe''s longest sled dog race starting in Alta.', '2027-03-12 10:00:00Z', '2027-03-19 23:59:00Z', 0, 69.9689, 23.2716),
    ('Rørosmartnan', 'SEASONAL', 'A historic winter fair in the UNESCO heritage town of Røros.', '2027-02-16 10:00:00Z', '2027-02-20 23:59:00Z', 0, 62.575, 11.3833),
    ('Sami Week in Tromsø', 'CULTURAL', 'Celebrating Sami National Day with reindeer racing and cultural events.', '2027-02-01 10:00:00Z', '2027-02-07 23:59:00Z', 0, 69.6492, 18.9553),
    ('Riddu Riđđu', 'FESTIVAL', 'An international indigenous festival in Kåfjord.', '2027-07-14 10:00:00Z', '2027-07-18 23:59:00Z', 1800, 69.5312, 20.5401),
    ('Oslo Pride', 'FESTIVAL', 'Norway''s largest celebration of queer love and diversity.', '2027-06-18 10:00:00Z', '2027-06-27 23:59:00Z', 0, 59.9139, 10.7522),
    ('Regnbuedagene (Bergen Pride)', 'FESTIVAL', 'The second largest Pride festival in Norway.', '2027-06-03 10:00:00Z', '2027-06-10 23:59:00Z', 0, 60.3929, 5.322),
    ('Ice Music Festival', 'SEASONAL', 'Unique music festival where instruments are made of ice, held in Geilo or Finse.', '2027-02-04 10:00:00Z', '2027-02-06 23:59:00Z', 500, 60.5332, 8.2091),
    ('World Beard Day Celebration', 'CULTURAL', 'A fun cultural gathering celebrating Nordic beards.', '2027-09-04 10:00:00Z', '2027-09-04 23:59:00Z', 0, 59.9139, 10.7522),
    ('Kongsberg Jazzfestival', 'FESTIVAL', 'One of the oldest and most prominent jazz festivals in Europe.', '2027-07-07 10:00:00Z', '2027-07-10 23:59:00Z', 1300, 59.6644, 9.6108),
    ('Notodden Blues Festival', 'FESTIVAL', 'The largest blues festival in Europe.', '2027-08-05 10:00:00Z', '2027-08-08 23:59:00Z', 1500, 59.5594, 9.2585),
    ('Canal Street', 'FESTIVAL', 'Arendal''s jazz and blues festival with unique seaside venues.', '2027-07-28 10:00:00Z', '2027-07-31 23:59:00Z', 1200, 58.4615, 8.7725),
    ('Palmesus', 'FESTIVAL', 'Scandinavia''s biggest beach party in Kristiansand.', '2027-07-02 10:00:00Z', '2027-07-03 23:59:00Z', 2500, 58.1467, 7.9956)
) AS new_event(name, cat, description, start_date, end_date, price, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.events e WHERE e.name = new_event.name
);
