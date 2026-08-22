-- Phase 12: Accommodation Data Expansion
-- Cache bust: updated alias to new_acc

INSERT INTO public.accommodations (id, location_id, name, type, description, status)
SELECT 
  gen_random_uuid(),
  loc.id,
  new_acc.name,
  new_acc.type::public.accommodation_type,
  new_acc.description,
  new_acc.status::public.content_status
FROM (
  VALUES
    ('oslo', 'The Thief', 'HOTEL', 'Luxury boutique hotel located on Tjuvholmen in Oslo.', 'PUBLISHED'),
    ('oslo', 'Grand Hotel', 'HOTEL', 'Historic luxury hotel on Karl Johan gate in the heart of Oslo.', 'PUBLISHED'),
    ('oslo', 'Sommerro', 'HOTEL', 'A glamorous art deco hotel, reviving a historic 1930s building in Frogner.', 'PUBLISHED'),
    ('oslo', 'Clarion Hotel The Hub', 'HOTEL', 'Norway''s largest hotel, featuring a rooftop bar with spectacular city views.', 'PUBLISHED'),
    ('oslo', 'Anker Hostel', 'HOSTEL', 'Popular and affordable hostel located in the vibrant Grünerløkka district.', 'PUBLISHED'),
    ('bergen', 'Opus XVI', 'HOTEL', 'A luxury hotel housed in a historic building, managed by descendants of Edvard Grieg.', 'PUBLISHED'),
    ('bergen', 'Hotel Norge by Scandic', 'HOTEL', 'An iconic Bergen hotel that has been a meeting place since 1885.', 'PUBLISHED'),
    ('bergen', 'Det Hanseatiske Hotel', 'HOTEL', 'Charming boutique hotel located right in the historic Bryggen area.', 'PUBLISHED'),
    ('bergen', 'Bergen Børs Hotel', 'HOTEL', 'Exclusive design hotel set in the old stock exchange building.', 'PUBLISHED'),
    ('bergen', 'Solstrand Hotel & Bad', 'RESORT', 'A historic spa hotel located right by the Bjørnefjord outside Bergen.', 'PUBLISHED'),
    ('trondheim', 'Britannia Hotel', 'HOTEL', 'A meticulously restored classic 5-star hotel offering world-class luxury.', 'PUBLISHED'),
    ('trondheim', 'Clarion Hotel Trondheim', 'HOTEL', 'Modern design hotel situated right by the fjord in Trondheim.', 'PUBLISHED'),
    ('trondheim', 'Bakklandet Hotel', 'HOTEL', 'Cozy, traditional hotel in Trondheim''s most charming neighborhood.', 'PUBLISHED'),
    ('stavanger', 'Eilert Smith Hotel', 'HOTEL', 'Exclusive boutique hotel offering understated luxury and personalized service.', 'PUBLISHED'),
    ('stavanger', 'Clarion Hotel Energy', 'HOTEL', 'Modern and vibrant hotel located in Stavanger''s new forum area.', 'PUBLISHED'),
    ('stavanger', 'Preikestolen Basecamp', 'LODGE', 'The perfect starting point for hiking the famous Pulpit Rock.', 'PUBLISHED'),
    ('tromso', 'The Edge', 'HOTEL', 'An innovative hotel reflecting Tromsø''s beautiful Arctic light and nature.', 'PUBLISHED'),
    ('tromso', 'Scandic Ishavshotel', 'HOTEL', 'Award-winning hotel located right on the quay in Tromsø with panoramic views.', 'PUBLISHED'),
    ('tromso', 'Arctic Panorama Lodge', 'LODGE', 'An exclusive lodge offering spectacular views of the Lyngen Alps.', 'PUBLISHED'),
    ('tromso', 'Malangen Resort', 'RESORT', 'A beautiful resort offering cabins and hotel rooms right by the fjord.', 'PUBLISHED'),
    ('tromso', 'Tromsø Activities Hostel', 'HOSTEL', 'Friendly hostel organizing numerous Northern Lights and hiking tours.', 'PUBLISHED'),
    ('alta', 'Sorrisniva Igloo Hotel', 'UNIQUE_STAY', 'The northernmost ice hotel in the world, rebuilt entirely every winter.', 'PUBLISHED'),
    ('kirkenes', 'Snowhotel Kirkenes', 'UNIQUE_STAY', 'An unforgettable hotel completely constructed of snow and ice.', 'PUBLISHED'),
    ('geiranger', 'Juvet Landscape Hotel', 'UNIQUE_STAY', 'Award-winning architectural masterpiece blending seamlessly with nature.', 'PUBLISHED'),
    ('geiranger', 'Hotel Union', 'HOTEL', 'Historic spa hotel offering breathtaking views of the Geirangerfjord.', 'PUBLISHED'),
    ('geiranger', 'Grande Fjord Hotel', 'HOTEL', 'Family-run hotel situated directly on the shores of the Geirangerfjord.', 'PUBLISHED'),
    ('geiranger', 'Geiranger Fjordsenter', 'CAMPING', 'Excellent camping facilities right next to the iconic fjord.', 'PUBLISHED'),
    ('reine', 'Eliassen Rorbuer', 'CABIN', 'Iconic red fishermen''s cabins offering the quintessential Lofoten experience.', 'PUBLISHED'),
    ('nusfjord', 'Nusfjord Arctic Resort', 'RESORT', 'A historic fishing village transformed into a premium resort.', 'PUBLISHED'),
    ('lofoten-islands', 'Hattvika Lodge', 'LODGE', 'Exclusive basecamp combining modern luxury with traditional Lofoten heritage.', 'PUBLISHED'),
    ('svolvaer', 'Svinøya Rorbuer', 'CABIN', 'Authentic rorbuer situated on a small island in Svolvær.', 'PUBLISHED'),
    ('senja', 'Hamn i Senja', 'RESORT', 'A spectacular resort located in a sheltered harbor on Senja.', 'PUBLISHED'),
    ('senja', 'Mefjord Brygge', 'LODGE', 'A paradise for fishing and exploring the rugged nature of Senja.', 'PUBLISHED'),
    ('flam', 'Fretheim Hotel', 'HOTEL', 'A historical hotel located at the inner end of the Aurlandsfjord.', 'PUBLISHED'),
    ('flam', 'Flåm Marina & Apartments', 'APARTMENT', 'Comfortable apartments right on the waterfront in Flåm.', 'PUBLISHED'),
    ('flam', 'Vatnahalsen Hotel', 'LODGE', 'A historic mountain lodge only accessible by the Flåm Railway or hiking.', 'PUBLISHED'),
    ('hardangerfjord', 'Ullensvang Hotel', 'RESORT', 'Historic hotel by the Hardangerfjord, beloved by composer Edvard Grieg.', 'PUBLISHED'),
    ('sognefjord', 'Kviknes Hotel', 'HOTEL', 'A classic hotel featuring Swiss-style architecture right on the Sognefjord.', 'PUBLISHED'),
    ('sognefjord', 'Walaker Hotel', 'HOTEL', 'Norway''s oldest hotel, family-run since 1690, offering a unique historic atmosphere.', 'PUBLISHED'),
    ('oslo', 'Dalen Hotel', 'HOTEL', 'Known as the "fairy tale hotel," a spectacular wooden hotel from 1894.', 'PUBLISHED'),
    ('geilo', 'Finse 1222', 'LODGE', 'The highest situated hotel in Norway, only accessible by train.', 'PUBLISHED'),
    ('geilo', 'Dr. Holms Hotel', 'RESORT', 'Iconic mountain resort and spa in the famous ski destination of Geilo.', 'PUBLISHED'),
    ('geilo', 'Vestlia Resort', 'RESORT', 'A beautiful lodge-style resort perfect for both winter and summer activities.', 'PUBLISHED'),
    ('svalbard', 'Basecamp Hotel', 'UNIQUE_STAY', 'An authentic trapper''s lodge style hotel in the center of Longyearbyen.', 'PUBLISHED'),
    ('svalbard', 'Funken Lodge', 'LODGE', 'Boutique luxury lodge offering Arctic elegance and historical atmosphere.', 'PUBLISHED'),
    ('bodo', 'Manshausen Island Resort', 'ECO_STAY', 'Award-winning eco-resort featuring sea cabins with floor-to-ceiling windows.', 'PUBLISHED'),
    ('lysefjord', 'Kjerag Lysebotn Resort', 'CAMPING', 'Great camping spot right at the base of the spectacular Lysefjord and Kjeragbolten.', 'PUBLISHED'),
    ('lillehammer', 'Wood Hotel', 'UNIQUE_STAY', 'One of the world''s tallest wooden buildings, located right by lake Mjøsa.', 'PUBLISHED'),
    ('tromso', 'Lyngen North', 'UNIQUE_STAY', 'Glass igloos offering uninterrupted views of the Northern Lights.', 'PUBLISHED'),
    ('hardangerfjord', 'Trolltunga Hotel', 'HOTEL', 'The perfect base camp for hikers preparing for the Trolltunga trek.', 'PUBLISHED'),
    ('lillehammer', 'Radisson Blu Mountain Resort', 'RESORT', 'Excellent ski-in/ski-out resort.', 'PUBLISHED')
) AS new_acc(slug, name, type, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_acc.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.accommodations AS acc WHERE acc.name = new_acc.name
);
