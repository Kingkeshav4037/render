-- Phase 12: National Content Expansion - Wildlife Data

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Moose', 'Alces alces', 'moose', 'The largest and heaviest extant species in the deer family, widely distributed across Norway''s forests.', 'Least Concern', 'Solitary, browses on leaves and aquatic plants.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Eastern and Central Norway', ARRAY['May-October'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'moose'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose&w=1080', 'Moose' FROM public.wildlife_species WHERE slug = 'moose'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1588698716380-60b77b949ab1?q=moose&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'moose'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Reindeer', 'Rangifer tarandus', 'reindeer', 'A species of deer with circumpolar distribution, native to Arctic, subarctic, tundra, boreal, and mountainous regions.', 'Vulnerable', 'Migratory herds, active foraging.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Hardangervidda, Northern Norway', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'reindeer'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1543702404-03aeb69bfb01?q=reindeer&w=1080', 'Reindeer' FROM public.wildlife_species WHERE slug = 'reindeer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1543702404-03aeb69bfb01?q=reindeer&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'reindeer'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Arctic fox', 'Vulpes lagopus', 'arctic-fox', 'A small fox native to the Arctic regions of the Northern Hemisphere, known for its thick, warm fur.', 'Endangered in Norway', 'Nomadic, hunts small rodents.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Svalbard, Alpine tundra', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'arctic-fox'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1457459686225-c75dd9cfa426?q=arctic+fox&w=1080', 'Arctic fox' FROM public.wildlife_species WHERE slug = 'arctic-fox'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1457459686225-c75dd9cfa426?q=arctic+fox&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'arctic-fox'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Red fox', 'Vulpes vulpes', 'red-fox', 'The largest of the true foxes and one of the most widely distributed members of the order Carnivora.', 'Least Concern', 'Solitary hunter, adaptable.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'All over Norway', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'red-fox'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=red+fox&w=1080', 'Red fox' FROM public.wildlife_species WHERE slug = 'red-fox'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=red+fox&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'red-fox'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Eurasian lynx', 'Lynx lynx', 'eurasian-lynx', 'A medium-sized wild cat occurring from Northern, Central and Eastern Europe to Central Asia.', 'Near Threatened (Norway)', 'Elusive, nocturnal hunter.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Boreal forests', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'eurasian-lynx'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1582215264375-926d83eeebfb?q=lynx&w=1080', 'Eurasian lynx' FROM public.wildlife_species WHERE slug = 'eurasian-lynx'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1582215264375-926d83eeebfb?q=lynx&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'eurasian-lynx'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Wolverine', 'Gulo gulo', 'wolverine', 'The largest land-dwelling species of the family Mustelidae. It is a muscular carnivore.', 'Endangered (Norway)', 'Solitary, scavenges and hunts.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Mountainous regions, Finnmark', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'wolverine'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=wolverine+animal&w=1080', 'Wolverine' FROM public.wildlife_species WHERE slug = 'wolverine'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=wolverine+animal&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'wolverine'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Brown bear', 'Ursus arctos', 'brown-bear', 'A large bear species found across Eurasia and North America.', 'Endangered (Norway)', 'Solitary, hibernates in winter.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Pasvik, Hedmark', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'brown-bear'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?q=brown+bear&w=1080', 'Brown bear' FROM public.wildlife_species WHERE slug = 'brown-bear'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1534062060195-2c8c69ee386a?q=brown+bear&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'brown-bear'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Wolf', 'Canis lupus', 'wolf', 'A large canine native to Eurasia and North America.', 'Critically Endangered (Norway)', 'Pack hunter, highly territorial.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Eastern Norway (Østerdalen)', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'wolf'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1560879311-370fd4561a0d?q=wolf&w=1080', 'Wolf' FROM public.wildlife_species WHERE slug = 'wolf'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1560879311-370fd4561a0d?q=wolf&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'wolf'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Musk ox', 'Ovibos moschatus', 'musk-ox', 'An Arctic hoofed mammal of the family Bovidae, noted for its thick coat and the strong odor emitted by males.', 'Least Concern', 'Forms defensive herds.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Dovrefjell National Park', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'musk-ox'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?q=musk+ox&w=1080', 'Musk ox' FROM public.wildlife_species WHERE slug = 'musk-ox'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1589136190760-b74751f043e7?q=musk+ox&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'musk-ox'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Roe deer', 'Capreolus capreolus', 'roe-deer', 'A species of deer. The male of the species is sometimes referred to as a roebuck.', 'Least Concern', 'Crepuscular, solitary or small groups.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Southern and Central Norway', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'roe-deer'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1498661858852-c07a346536b5?q=roe+deer&w=1080', 'Roe deer' FROM public.wildlife_species WHERE slug = 'roe-deer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1498661858852-c07a346536b5?q=roe+deer&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'roe-deer'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Red deer', 'Cervus elaphus', 'red-deer', 'One of the largest deer species. The red deer inhabits most of Europe.', 'Least Concern', 'Herd-living, vocal during rut.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Western Norway', ARRAY['Autumn'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'red-deer'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=red+deer&w=1080', 'Red deer' FROM public.wildlife_species WHERE slug = 'red-deer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=red+deer&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'red-deer'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Wild reindeer', 'Rangifer tarandus tarandus', 'wild-reindeer', 'Norway has the last remaining populations of wild tundra reindeer in Europe.', 'Near Threatened', 'Migratory.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Hardangervidda, Rondane', ARRAY['Summer-Autumn'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'wild-reindeer'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1512411939103-605bb16e8dd1?q=reindeer+wild&w=1080', 'Wild reindeer' FROM public.wildlife_species WHERE slug = 'wild-reindeer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1512411939103-605bb16e8dd1?q=reindeer+wild&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'wild-reindeer'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Orca', 'Orcinus orca', 'orca', 'Also known as the killer whale, is a toothed whale belonging to the oceanic dolphin family, of which it is the largest member.', 'Data Deficient', 'Highly social, hunts in pods.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Northern Norway fjords', ARRAY['November-January'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'orca'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1582236113203-9bb6eb827a4f?q=orca&w=1080', 'Orca' FROM public.wildlife_species WHERE slug = 'orca'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1582236113203-9bb6eb827a4f?q=orca&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'orca'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Humpback whale', 'Megaptera novaeangliae', 'humpback-whale', 'A species of baleen whale. It is one of the larger rorqual species.', 'Least Concern', 'Acrobatic, complex songs.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Tromsø, Vesterålen', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'humpback-whale'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1502015243396-745aebf132e4?q=humpback+whale&w=1080', 'Humpback whale' FROM public.wildlife_species WHERE slug = 'humpback-whale'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1502015243396-745aebf132e4?q=humpback+whale&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'humpback-whale'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Sperm whale', 'Physeter macrocephalus', 'sperm-whale', 'The largest of the toothed whales and the largest toothed predator.', 'Vulnerable', 'Deep diver, hunts squid.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Vesterålen (Andenes)', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'sperm-whale'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=sperm+whale&w=1080', 'Sperm whale' FROM public.wildlife_species WHERE slug = 'sperm-whale'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=sperm+whale&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'sperm-whale'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Minke whale', 'Balaenoptera acutorostrata', 'minke-whale', 'A species of minke whale within the suborder of baleen whales.', 'Least Concern', 'Solitary, fast swimmer.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal Norway', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'minke-whale'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1521740924089-23db975de3bd?q=whale&w=1080', 'Minke whale' FROM public.wildlife_species WHERE slug = 'minke-whale'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1521740924089-23db975de3bd?q=whale&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'minke-whale'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Harbour seal', 'Phoca vitulina', 'harbour-seal', 'Also known as the common seal, is a true seal found along temperate and Arctic marine coastlines of the Northern Hemisphere.', 'Least Concern', 'Hauls out on rocks, solitary hunter.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal Norway', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'harbour-seal'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1565575514660-8f3e53ba54ff?q=harbour+seal&w=1080', 'Harbour seal' FROM public.wildlife_species WHERE slug = 'harbour-seal'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1565575514660-8f3e53ba54ff?q=harbour+seal&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'harbour-seal'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Grey seal', 'Halichoerus grypus', 'grey-seal', 'Found on both shores of the North Atlantic Ocean. It is a large seal of the family Phocidae.', 'Least Concern', 'Gregarious on land, dives deep.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal islands', ARRAY['Autumn'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'grey-seal'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1614210667496-e2448375086d?q=grey+seal&w=1080', 'Grey seal' FROM public.wildlife_species WHERE slug = 'grey-seal'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1614210667496-e2448375086d?q=grey+seal&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'grey-seal'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Walrus', 'Odobenus rosmarus', 'walrus', 'A large flippered marine mammal with a discontinuous distribution about the North Pole.', 'Vulnerable', 'Uses tusks to haul out, feeds on benthos.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Svalbard', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'walrus'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1577717646549-3543b35beaa7?q=walrus&w=1080', 'Walrus' FROM public.wildlife_species WHERE slug = 'walrus'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1577717646549-3543b35beaa7?q=walrus&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'walrus'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Harbour porpoise', 'Phocoena phocoena', 'harbour-porpoise', 'One of eight extant species of porpoise. It is one of the smallest marine mammals.', 'Least Concern', 'Shy, found in shallow coastal waters.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Marine'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Fjords and coast', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'harbour-porpoise'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1601328005886-f81dff90d96d?q=porpoise&w=1080', 'Harbour porpoise' FROM public.wildlife_species WHERE slug = 'harbour-porpoise'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1601328005886-f81dff90d96d?q=porpoise&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'harbour-porpoise'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Atlantic puffin', 'Fratercula arctica', 'atlantic-puffin', 'A species of seabird in the auk family. It is the only puffin native to the Atlantic Ocean.', 'Vulnerable', 'Nests in burrows, dives for fish.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Røst, Bleik, Svalbard', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'atlantic-puffin'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1552554523-c90a880bf618?q=puffin&w=1080', 'Atlantic puffin' FROM public.wildlife_species WHERE slug = 'atlantic-puffin'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1552554523-c90a880bf618?q=puffin&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'atlantic-puffin'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'White-tailed eagle', 'Haliaeetus albicilla', 'white-tailed-eagle', 'A very large species of sea eagle widely distributed across temperate Eurasia.', 'Least Concern', 'Soars along coastlines, hunts fish.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Nordland, coastal areas', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'white-tailed-eagle'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1530263628045-814197cc4bb4?q=eagle&w=1080', 'White-tailed eagle' FROM public.wildlife_species WHERE slug = 'white-tailed-eagle'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1530263628045-814197cc4bb4?q=eagle&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'white-tailed-eagle'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Golden eagle', 'Aquila chrysaetos', 'golden-eagle', 'One of the best-known birds of prey in the Northern Hemisphere.', 'Least Concern', 'Hunts small mammals in open areas.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Mountainous regions', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'golden-eagle'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1496660144983-500b904944ec?q=golden+eagle&w=1080', 'Golden eagle' FROM public.wildlife_species WHERE slug = 'golden-eagle'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1496660144983-500b904944ec?q=golden+eagle&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'golden-eagle'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Gyrfalcon', 'Falco rusticolus', 'gyrfalcon', 'The largest of the falcon species. It breeds on Arctic coasts and tundra.', 'Least Concern', 'Fast pursuit hunter.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Finnmark, Svalbard', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'gyrfalcon'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1526435071190-bdfcb7547248?q=falcon&w=1080', 'Gyrfalcon' FROM public.wildlife_species WHERE slug = 'gyrfalcon'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1526435071190-bdfcb7547248?q=falcon&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'gyrfalcon'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Snowy owl', 'Bubo scandiacus', 'snowy-owl', 'A large, white owl of the true owl family. Native to the Arctic regions.', 'Vulnerable', 'Diurnal hunter, feeds on lemmings.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Finnmark, Hardangervidda', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'snowy-owl'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1518118014316-29a39f60e9a7?q=snowy+owl&w=1080', 'Snowy owl' FROM public.wildlife_species WHERE slug = 'snowy-owl'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1518118014316-29a39f60e9a7?q=snowy+owl&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'snowy-owl'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Arctic tern', 'Sterna paradisaea', 'arctic-tern', 'A seabird of the tern family Sternidae. Has the longest migration of any animal.', 'Least Concern', 'Aggressively defends nests.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Svalbard, Northern coast', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'arctic-tern'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1621532057393-0be9df863925?q=tern&w=1080', 'Arctic tern' FROM public.wildlife_species WHERE slug = 'arctic-tern'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1621532057393-0be9df863925?q=tern&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'arctic-tern'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Razorbill', 'Alca torda', 'razorbill', 'A colonial seabird that comes to land only to breed. It is an agile swimmer.', 'Near Threatened', 'Dives deeply for schooling fish.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal cliffs', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'razorbill'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1606558113264-b8d1b32d18cb?q=seabird&w=1080', 'Razorbill' FROM public.wildlife_species WHERE slug = 'razorbill'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1606558113264-b8d1b32d18cb?q=seabird&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'razorbill'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Common guillemot', 'Uria aalge', 'common-guillemot', 'A large auk. It is also known as the common murre.', 'Least Concern', 'Nests in dense colonies on cliffs.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal cliffs, Svalbard', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'common-guillemot'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1581022986873-1f1c713be246?q=guillemot&w=1080', 'Common guillemot' FROM public.wildlife_species WHERE slug = 'common-guillemot'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1581022986873-1f1c713be246?q=guillemot&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'common-guillemot'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Northern gannet', 'Morus bassanus', 'northern-gannet', 'A seabird and the largest species of the gannet family, Sulidae.', 'Least Concern', 'Plunge dives from heights to catch fish.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Runde, coastal islands', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'northern-gannet'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=gannet&w=1080', 'Northern gannet' FROM public.wildlife_species WHERE slug = 'northern-gannet'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1549420088-251f28b2ad46?q=gannet&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'northern-gannet'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Black-legged kittiwake', 'Rissa tridactyla', 'kittiwake', 'A species of seabird in the gull family Laridae.', 'Vulnerable', 'Pelagic gull, nests on steep cliffs.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Birds'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Bird cliffs, Svalbard', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'kittiwake'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1502470712753-4eb08e6f1f26?q=seagull&w=1080', 'Black-legged kittiwake' FROM public.wildlife_species WHERE slug = 'kittiwake'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1502470712753-4eb08e6f1f26?q=seagull&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'kittiwake'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Polar bear', 'Ursus maritimus', 'polar-bear', 'A hypercarnivorous bear whose native range lies largely within the Arctic Circle.', 'Vulnerable', 'Hunts seals on sea ice.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Svalbard', ARRAY['Spring-Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'polar-bear'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=polar+bear&w=1080', 'Polar bear' FROM public.wildlife_species WHERE slug = 'polar-bear'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=polar+bear&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'polar-bear'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Eurasian elk', 'Alces alces', 'eurasian-elk', 'Also known as the moose in North America. The largest species in the deer family.', 'Least Concern', 'Solitary, woodland browser.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Boreal forests', ARRAY['Autumn'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'eurasian-elk'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1517726589332-9c3db6cb2b6e?q=moose&w=1080', 'Eurasian elk' FROM public.wildlife_species WHERE slug = 'eurasian-elk'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1517726589332-9c3db6cb2b6e?q=moose&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'eurasian-elk'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'European otter', 'Lutra lutra', 'european-otter', 'A semiaquatic mammal native to Eurasia.', 'Near Threatened', 'Playful, hunts fish in rivers and coasts.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Coastal and inland waterways', ARRAY['All year'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'european-otter'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1534005856417-64dfdf7a19bb?q=otter&w=1080', 'European otter' FROM public.wildlife_species WHERE slug = 'european-otter'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1534005856417-64dfdf7a19bb?q=otter&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'european-otter'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Mountain hare', 'Lepus timidus', 'mountain-hare', 'A palearctic hare that is largely adapted to polar and mountainous habitats.', 'Least Concern', 'Changes coat color in winter.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Alpine tundra and forests', ARRAY['Winter'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'mountain-hare'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1518063001712-45e0a6d71b30?q=hare&w=1080', 'Mountain hare' FROM public.wildlife_species WHERE slug = 'mountain-hare'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1518063001712-45e0a6d71b30?q=hare&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'mountain-hare'));

INSERT INTO public.wildlife_species (id, common_name, scientific_name, slug, description, conservation_status, behavior, facts, source_type)
VALUES (gen_random_uuid(), 'Svalbard reindeer', 'Rangifer tarandus platyrhynchus', 'svalbard-reindeer', 'A small subspecies of reindeer endemic to the Svalbard archipelago.', 'Least Concern', 'Sedentary, accumulates heavy fat reserves.', ARRAY['Diet: Carnivore/Herbivore', 'Category: Mammals'], 'editorial')
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  description = EXCLUDED.description,
  conservation_status = EXCLUDED.conservation_status,
  behavior = EXCLUDED.behavior;

INSERT INTO public.wildlife_habitats (id, species_id, region, best_months, description)
SELECT gen_random_uuid(), id, 'Svalbard', ARRAY['Summer'], 'Preferred habitat region' FROM public.wildlife_species WHERE slug = 'svalbard-reindeer'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'wildlife_species', id, 'GALLERY', 'https://images.unsplash.com/photo-1543702404-03aeb69bfb01?q=reindeer&w=1080', 'Svalbard reindeer' FROM public.wildlife_species WHERE slug = 'svalbard-reindeer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'wildlife_species' AND media_url = 'https://images.unsplash.com/photo-1543702404-03aeb69bfb01?q=reindeer&w=1080' AND entity_id = (SELECT id FROM public.wildlife_species WHERE slug = 'svalbard-reindeer'));

