-- Phase 12: Location Data Expansion

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-00007f39a823', 'Oslo', 'oslo', 'The vibrant city of Oslo, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 59.3960, 16.7053),
  ('10c47100-0000-4000-8000-0000ca0a0597', 'Bergen', 'bergen', 'The vibrant city of Bergen, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 65.8530, 27.5038),
  ('10c47100-0000-4000-8000-000098530e09', 'Tromsø', 'tromso', 'The vibrant city of Tromsø, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 61.7315, 9.8043),
  ('10c47100-0000-4000-8000-00004669971e', 'Trondheim', 'trondheim', 'The vibrant city of Trondheim, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 66.6252, 28.1164),
  ('10c47100-0000-4000-8000-0000919d2599', 'Stavanger', 'stavanger', 'The vibrant city of Stavanger, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 58.9305, 11.6154),
  ('10c47100-0000-4000-8000-00019ccc1274', 'Ålesund', 'alesund', 'The vibrant city of Ålesund, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 63.1144, 22.9606),
  ('10c47100-0000-4000-8000-00009a29a02d', 'Kristiansand', 'kristiansand', 'The vibrant city of Kristiansand, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 65.8075, 17.3626),
  ('10c47100-0000-4000-8000-0000652e9b57', 'Bodø', 'bodo', 'The vibrant city of Bodø, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 58.1755, 28.2012),
  ('10c47100-0000-4000-8000-00001b2d7672', 'Drammen', 'drammen', 'The vibrant city of Drammen, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 61.5656, 8.0223),
  ('10c47100-0000-4000-8000-00012c3e7de4', 'Lillehammer', 'lillehammer', 'The vibrant city of Lillehammer, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 60.9924, 17.3327),
  ('10c47100-0000-4000-8000-0000050d1a03', 'Fredrikstad', 'fredrikstad', 'The vibrant city of Fredrikstad, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 64.5203, 15.4508),
  ('10c47100-0000-4000-8000-0000e938652e', 'Sandnes', 'sandnes', 'The vibrant city of Sandnes, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 67.6434, 9.8456),
  ('10c47100-0000-4000-8000-00010d8bfbc1', 'Molde', 'molde', 'The vibrant city of Molde, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 67.5096, 25.9340),
  ('10c47100-0000-4000-8000-0000cd28ed68', 'Haugesund', 'haugesund', 'The vibrant city of Haugesund, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 64.8767, 11.4173),
  ('10c47100-0000-4000-8000-000144349b31', 'Narvik', 'narvik', 'The vibrant city of Narvik, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 67.9745, 10.4515),
  ('10c47100-0000-4000-8000-0000e45ea2ae', 'Alta', 'alta', 'The vibrant city of Alta, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 65.1843, 22.5418),
  ('10c47100-0000-4000-8000-00003b06b33c', 'Kirkenes', 'kirkenes', 'The vibrant city of Kirkenes, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 65.1333, 28.3609),
  ('10c47100-0000-4000-8000-000036b06818', 'Svolvær', 'svolvaer', 'The vibrant city of Svolvær, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 65.5552, 19.8332),
  ('10c47100-0000-4000-8000-0000226dece6', 'Røros', 'roros', 'The vibrant city of Røros, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 61.7561, 12.7982),
  ('10c47100-0000-4000-8000-00006f11d77c', 'Flåm', 'flam', 'The vibrant city of Flåm, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 64.0805, 25.2364)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-000011522ee4', 'Geilo', 'geilo', 'The vibrant city of Geilo, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 59.1783, 7.2367),
  ('10c47100-0000-4000-8000-00008bdcbe7c', 'Kongsberg', 'kongsberg', 'The vibrant city of Kongsberg, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 59.8902, 5.1488),
  ('10c47100-0000-4000-8000-00010f5bc83b', 'Hamar', 'hamar', 'The vibrant city of Hamar, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 59.3343, 6.7010),
  ('10c47100-0000-4000-8000-00009846bed0', 'Skien', 'skien', 'The vibrant city of Skien, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 68.1072, 25.6898),
  ('10c47100-0000-4000-8000-0000701505c9', 'Tønsberg', 'tonsberg', 'The vibrant city of Tønsberg, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 63.5483, 15.4132),
  ('10c47100-0000-4000-8000-0000b53a9ad5', 'Arendal', 'arendal', 'The vibrant city of Arendal, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 60.5780, 25.5443),
  ('10c47100-0000-4000-8000-0001bcfcba1e', 'Mosjøen', 'mosjoen', 'The vibrant city of Mosjøen, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 64.4129, 18.5158),
  ('10c47100-0000-4000-8000-00023a9ccbd3', 'Harstad', 'harstad', 'The vibrant city of Harstad, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 59.1108, 23.5866),
  ('10c47100-0000-4000-8000-0000d3fe62c4', 'Hammerfest', 'hammerfest', 'The vibrant city of Hammerfest, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 66.4533, 12.0638),
  ('10c47100-0000-4000-8000-0000b125ca51', 'Longyearbyen', 'longyearbyen', 'The vibrant city of Longyearbyen, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 60.2062, 14.9431),
  ('10c47100-0000-4000-8000-00001fe6eb56', 'Honningsvåg', 'honningsvag', 'The vibrant city of Honningsvåg, rich in Norwegian culture and history.', 'CITY', 'PUBLISHED', 69.4684, 12.3809),
  ('10c47100-0000-4000-8000-00003f7f6145', 'Geirangerfjord', 'geirangerfjord', 'The majestic Geirangerfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 64.2110, 6.9209),
  ('10c47100-0000-4000-8000-00012a9de527', 'Sognefjord', 'sognefjord', 'The majestic Sognefjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 63.0003, 13.7264),
  ('10c47100-0000-4000-8000-00010eb042e1', 'Hardangerfjord', 'hardangerfjord', 'The majestic Hardangerfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 67.9779, 13.7734),
  ('10c47100-0000-4000-8000-0001ec6ebf80', 'Nærøyfjord', 'naeroyfjord', 'The majestic Nærøyfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 59.2100, 13.4286),
  ('10c47100-0000-4000-8000-0000f43ef25c', 'Lysefjord', 'lysefjord', 'The majestic Lysefjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 67.0845, 7.0505),
  ('10c47100-0000-4000-8000-000020e8c538', 'Nordfjord', 'nordfjord', 'The majestic Nordfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 60.7447, 13.7137),
  ('10c47100-0000-4000-8000-0000cb21b5cf', 'Aurlandsfjord', 'aurlandsfjord', 'The majestic Aurlandsfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 67.8928, 10.4482),
  ('10c47100-0000-4000-8000-0001e2d66c14', 'Romsdalsfjord', 'romsdalsfjord', 'The majestic Romsdalsfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 61.0094, 7.7709),
  ('10c47100-0000-4000-8000-00007df9bf94', 'Oslofjord', 'oslofjord', 'The majestic Oslofjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 59.9969, 10.6460)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-00007d1cf770', 'Trondheimsfjord', 'trondheimsfjord', 'The majestic Trondheimsfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 67.3000, 8.8183),
  ('10c47100-0000-4000-8000-0000d3b602f6', 'Trollfjord', 'trollfjord', 'The majestic Trollfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 68.8536, 6.5921),
  ('10c47100-0000-4000-8000-000047c540cc', 'Hjørundfjord', 'hjorundfjord', 'The majestic Hjørundfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 63.7455, 14.5868),
  ('10c47100-0000-4000-8000-000027a3cab4', 'Porsangerfjord', 'porsangerfjord', 'The majestic Porsangerfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 60.0845, 14.3295),
  ('10c47100-0000-4000-8000-0000aeeca0e5', 'Varangerfjord', 'varangerfjord', 'The majestic Varangerfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 61.1716, 10.1609),
  ('10c47100-0000-4000-8000-00024362f00a', 'Boknafjord', 'boknafjord', 'The majestic Boknafjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 60.0385, 10.4146),
  ('10c47100-0000-4000-8000-00006f4a9583', 'Altafjord', 'altafjord', 'The majestic Altafjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 60.5177, 8.7692),
  ('10c47100-0000-4000-8000-000026b13ef6', 'Lyngen Fjord', 'lyngen-fjord', 'The majestic Lyngen Fjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 59.0910, 9.4841),
  ('10c47100-0000-4000-8000-0000a4d6754d', 'Tysfjord', 'tysfjord', 'The majestic Tysfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 60.3635, 10.6755),
  ('10c47100-0000-4000-8000-0000bb19f6f5', 'Vestfjord', 'vestfjord', 'The majestic Vestfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 62.8142, 14.0811),
  ('10c47100-0000-4000-8000-0000cfca4b42', 'Osterfjord', 'osterfjord', 'The majestic Osterfjord, one of Norway''s iconic glacial valleys.', 'FJORD', 'PUBLISHED', 62.8633, 10.6548),
  ('10c47100-0000-4000-8000-00012f32ed36', 'Trolltunga', 'trolltunga', 'Stunning views from Trolltunga, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 65.7822, 14.9288),
  ('10c47100-0000-4000-8000-00005ce8137b', 'Preikestolen', 'preikestolen', 'Stunning views from Preikestolen, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 59.2143, 11.4336),
  ('10c47100-0000-4000-8000-000012235c9a', 'Kjerag', 'kjerag', 'Stunning views from Kjerag, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 65.2632, 11.8660),
  ('10c47100-0000-4000-8000-0000d0e1c5e8', 'Galdhøpiggen', 'galdhopiggen', 'Stunning views from Galdhøpiggen, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 67.2850, 8.0728),
  ('10c47100-0000-4000-8000-00000d3457d0', 'Glittertind', 'glittertind', 'Stunning views from Glittertind, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 58.8368, 9.3537),
  ('10c47100-0000-4000-8000-0000edc896ff', 'Besseggen', 'besseggen', 'Stunning views from Besseggen, a premier outdoor destination.', 'TRAIL', 'PUBLISHED', 65.1732, 10.5757),
  ('10c47100-0000-4000-8000-0001af72adfb', 'Romsdalseggen', 'romsdalseggen', 'Stunning views from Romsdalseggen, a premier outdoor destination.', 'TRAIL', 'PUBLISHED', 67.7503, 9.9795),
  ('10c47100-0000-4000-8000-00005a85c33e', 'Reinebringen', 'reinebringen', 'Stunning views from Reinebringen, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 61.3692, 7.7472),
  ('10c47100-0000-4000-8000-00004143011c', 'Fløyen', 'floyen', 'Stunning views from Fløyen, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 62.8951, 11.6659)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-0001de7181ba', 'Ulriken', 'ulriken', 'Stunning views from Ulriken, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 67.4052, 7.9820),
  ('10c47100-0000-4000-8000-0000a5d26ca3', 'Gaustatoppen', 'gaustatoppen', 'Stunning views from Gaustatoppen, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 66.7030, 11.1927),
  ('10c47100-0000-4000-8000-0000a2cb4ab2', 'Slogen', 'slogen', 'Stunning views from Slogen, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 64.8612, 13.5158),
  ('10c47100-0000-4000-8000-00012fbcd322', 'Romsdalshorn', 'romsdalshorn', 'Stunning views from Romsdalshorn, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 60.8704, 7.4672),
  ('10c47100-0000-4000-8000-0000b1efb8bd', 'Trollveggen', 'trollveggen', 'Stunning views from Trollveggen, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 62.4314, 9.1817),
  ('10c47100-0000-4000-8000-0000344f518e', 'Skala', 'skala', 'Stunning views from Skala, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 63.2252, 6.4063),
  ('10c47100-0000-4000-8000-00000dc46e6b', 'Fannaråki', 'fannaraki', 'Stunning views from Fannaråki, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 63.7198, 11.1782),
  ('10c47100-0000-4000-8000-000081ed303b', 'Snøhetta', 'snohetta', 'Stunning views from Snøhetta, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 64.2993, 5.5507),
  ('10c47100-0000-4000-8000-00012aaeee2d', 'Bitihorn', 'bitihorn', 'Stunning views from Bitihorn, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 60.7005, 15.1546),
  ('10c47100-0000-4000-8000-0000649e8607', 'Store Skagastølstind', 'store-skagastolstind', 'Stunning views from Store Skagastølstind, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 60.8908, 14.2918),
  ('10c47100-0000-4000-8000-000105626725', 'Mount Hoven', 'mount-hoven', 'Stunning views from Mount Hoven, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 58.5079, 15.0806),
  ('10c47100-0000-4000-8000-0000966cb1dd', 'Stetind', 'stetind', 'Stunning views from Stetind, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 63.1261, 15.6626),
  ('10c47100-0000-4000-8000-00023498f53e', 'Segla', 'segla', 'Stunning views from Segla, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 65.3701, 10.3872),
  ('10c47100-0000-4000-8000-0001babafbaa', 'Ryten', 'ryten', 'Stunning views from Ryten, a premier outdoor destination.', 'VIEWPOINT', 'PUBLISHED', 66.1626, 6.0730),
  ('10c47100-0000-4000-8000-0000d0122337', 'Festvågtind', 'festvagtind', 'Stunning views from Festvågtind, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 58.6711, 16.9534),
  ('10c47100-0000-4000-8000-000057498d42', 'Munken', 'munken', 'Stunning views from Munken, a premier outdoor destination.', 'MOUNTAIN', 'PUBLISHED', 64.7060, 15.8259),
  ('10c47100-0000-4000-8000-0000a42ef3c9', 'Jotunheimen National Park', 'jotunheimen-national-park', 'Vast wilderness in Jotunheimen National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 61.5686, 8.8130),
  ('10c47100-0000-4000-8000-00004e9d843c', 'Rondane National Park', 'rondane-national-park', 'Vast wilderness in Rondane National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 63.4736, 11.2812),
  ('10c47100-0000-4000-8000-0000f06eb8e7', 'Dovrefjell-Sunndalsfjella National Park', 'dovrefjell-sunndalsfjella-national-park', 'Vast wilderness in Dovrefjell-Sunndalsfjella National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 69.1183, 14.3884),
  ('10c47100-0000-4000-8000-000215ac9817', 'Hardangervidda National Park', 'hardangervidda-national-park', 'Vast wilderness in Hardangervidda National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 62.4125, 10.6716)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-00009eb76a12', 'Folgefonna National Park', 'folgefonna-national-park', 'Vast wilderness in Folgefonna National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 63.4670, 19.8151),
  ('10c47100-0000-4000-8000-0000db208415', 'Femundsmarka National Park', 'femundsmarka-national-park', 'Vast wilderness in Femundsmarka National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 66.0435, 16.4193),
  ('10c47100-0000-4000-8000-0000876601e9', 'Saltfjellet-Svartisen National Park', 'saltfjellet-svartisen-national-park', 'Vast wilderness in Saltfjellet-Svartisen National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 63.9941, 19.1751),
  ('10c47100-0000-4000-8000-000137bcc1fb', 'Reisa National Park', 'reisa-national-park', 'Vast wilderness in Reisa National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 67.0341, 13.8749),
  ('10c47100-0000-4000-8000-000082ac2294', 'Varangerhalvøya National Park', 'varangerhalvoya-national-park', 'Vast wilderness in Varangerhalvøya National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 67.1440, 16.3454),
  ('10c47100-0000-4000-8000-0000892937d2', 'Jostedalsbreen National Park', 'jostedalsbreen-national-park', 'Vast wilderness in Jostedalsbreen National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 67.2857, 6.5201),
  ('10c47100-0000-4000-8000-0000ee73bce6', 'Forlandet National Park', 'forlandet-national-park', 'Vast wilderness in Forlandet National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 67.0130, 12.0951),
  ('10c47100-0000-4000-8000-0000986dd7f9', 'Nordvest-Spitsbergen National Park', 'nordvest-spitsbergen-national-park', 'Vast wilderness in Nordvest-Spitsbergen National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 68.3636, 18.7440),
  ('10c47100-0000-4000-8000-000281a69d23', 'Sør-Spitsbergen National Park', 'sor-spitsbergen-national-park', 'Vast wilderness in Sør-Spitsbergen National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 68.8317, 7.7835),
  ('10c47100-0000-4000-8000-00007cacc3f9', 'Lofotodden National Park', 'lofotodden-national-park', 'Vast wilderness in Lofotodden National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 63.4432, 7.1966),
  ('10c47100-0000-4000-8000-0000164d562f', 'Ytre Hvaler National Park', 'ytre-hvaler-national-park', 'Vast wilderness in Ytre Hvaler National Park, home to diverse Norwegian wildlife.', 'NATIONAL_PARK', 'PUBLISHED', 66.8916, 7.6790),
  ('10c47100-0000-4000-8000-00024af0f580', 'Lofoten Islands', 'lofoten-islands', 'Experience the unique beauty and culture of Lofoten Islands.', 'ISLAND', 'PUBLISHED', 59.8874, 8.5966),
  ('10c47100-0000-4000-8000-0000136f3244', 'Senja', 'senja', 'Experience the unique beauty and culture of Senja.', 'ISLAND', 'PUBLISHED', 70.5508, 20.6144),
  ('10c47100-0000-4000-8000-0000d3382f90', 'Svalbard', 'svalbard', 'Experience the unique beauty and culture of Svalbard.', 'ISLAND', 'PUBLISHED', 60.8142, 10.0395),
  ('10c47100-0000-4000-8000-0000cc92a2e1', 'Sommarøy', 'sommaroy', 'Experience the unique beauty and culture of Sommarøy.', 'ISLAND', 'PUBLISHED', 61.4446, 24.6349),
  ('10c47100-0000-4000-8000-0000e0ef2d03', 'Karmøy', 'karmoy', 'Experience the unique beauty and culture of Karmøy.', 'ISLAND', 'PUBLISHED', 62.7285, 10.9720),
  ('10c47100-0000-4000-8000-000085bf4bd1', 'Geiranger', 'geiranger', 'Experience the unique beauty and culture of Geiranger.', 'VILLAGE', 'PUBLISHED', 64.3589, 12.1386),
  ('10c47100-0000-4000-8000-00006bc3cfe2', 'Undredal', 'undredal', 'Experience the unique beauty and culture of Undredal.', 'VILLAGE', 'PUBLISHED', 68.6435, 10.9708),
  ('10c47100-0000-4000-8000-00010c51f4fe', 'Reine', 'reine', 'Experience the unique beauty and culture of Reine.', 'VILLAGE', 'PUBLISHED', 62.5794, 11.9927),
  ('10c47100-0000-4000-8000-00025fe51afe', 'Nusfjord', 'nusfjord', 'Experience the unique beauty and culture of Nusfjord.', 'VILLAGE', 'PUBLISHED', 59.2585, 6.5464)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.locations (id, name, slug, description, type, status, lat, lng)
VALUES
  ('10c47100-0000-4000-8000-000001ca79a5', 'Henningsvær', 'henningsvaer', 'Experience the unique beauty and culture of Henningsvær.', 'VILLAGE', 'PUBLISHED', 66.0658, 21.1873),
  ('10c47100-0000-4000-8000-0000b6fabe32', 'Haukland Beach', 'haukland-beach', 'Experience the unique beauty and culture of Haukland Beach.', 'BEACH', 'PUBLISHED', 67.2164, 21.8178),
  ('10c47100-0000-4000-8000-0000fe6b764d', 'Kvalvika Beach', 'kvalvika-beach', 'Experience the unique beauty and culture of Kvalvika Beach.', 'BEACH', 'PUBLISHED', 59.4995, 16.7022),
  ('10c47100-0000-4000-8000-0001043db79b', 'Sola Beach', 'sola-beach', 'Experience the unique beauty and culture of Sola Beach.', 'BEACH', 'PUBLISHED', 67.2394, 22.4602),
  ('10c47100-0000-4000-8000-0001231e5baf', 'Viking Ship Museum', 'viking-ship-museum', 'Experience the unique beauty and culture of Viking Ship Museum.', 'MUSEUM', 'PUBLISHED', 68.9568, 11.7782),
  ('10c47100-0000-4000-8000-00008228b5c8', 'Munch Museum', 'munch-museum', 'Experience the unique beauty and culture of Munch Museum.', 'MUSEUM', 'PUBLISHED', 58.0447, 10.0459),
  ('10c47100-0000-4000-8000-0000caac17cb', 'Fram Museum', 'fram-museum', 'Experience the unique beauty and culture of Fram Museum.', 'MUSEUM', 'PUBLISHED', 59.9715, 11.7218),
  ('10c47100-0000-4000-8000-00018bf9c31b', 'Nidaros Cathedral', 'nidaros-cathedral', 'Experience the unique beauty and culture of Nidaros Cathedral.', 'ATTRACTION', 'PUBLISHED', 65.4304, 10.8253),
  ('10c47100-0000-4000-8000-00009b4407a3', 'Bryggen', 'bryggen', 'Experience the unique beauty and culture of Bryggen.', 'ATTRACTION', 'PUBLISHED', 61.7761, 15.6591),
  ('10c47100-0000-4000-8000-00014daa70df', 'Vigeland Park', 'vigeland-park', 'Experience the unique beauty and culture of Vigeland Park.', 'ATTRACTION', 'PUBLISHED', 58.6699, 24.4246),
  ('10c47100-0000-4000-8000-00022b070f75', 'Atlantic Ocean Road', 'atlantic-ocean-road', 'Experience the unique beauty and culture of Atlantic Ocean Road.', 'COAST', 'PUBLISHED', 66.1620, 5.3612),
  ('10c47100-0000-4000-8000-0000a4de8086', 'Nordkapp', 'nordkapp', 'Experience the unique beauty and culture of Nordkapp.', 'COAST', 'PUBLISHED', 65.1678, 24.6680),
  ('10c47100-0000-4000-8000-000044146600', 'Lindesnes Lighthouse', 'lindesnes-lighthouse', 'Experience the unique beauty and culture of Lindesnes Lighthouse.', 'COAST', 'PUBLISHED', 65.5152, 20.3569)
ON CONFLICT (slug) DO NOTHING;

