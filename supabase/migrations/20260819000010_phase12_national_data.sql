-- Phase 12: National Content Expansion - Food Data

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Fårikål', 'farikal', 'Norway''s national dish consisting of pieces of mutton with bone, cabbage, whole black pepper and a little wheat flour, cooked for several hours in a casserole.', 'https://images.unsplash.com/photo-1600336153113-d66c79eaec6c?q=farikal&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Brunost', 'brunost', 'A sweet, brown cheese made by boiling whey, milk, and cream. Often eaten on waffles or bread.', 'https://images.unsplash.com/photo-1623065322967-0c7f76901e91?q=brown+cheese&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Kjøttkaker', 'kjottkaker', 'Traditional Norwegian meatballs, slightly larger and rougher than Swedish ones, usually served with brown sauce, potatoes, and lingonberry jam.', 'https://images.unsplash.com/photo-1529042419736-8626c7104d53?q=meatballs&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Pinnekjøtt', 'pinnekjott', 'A traditional Norwegian Christmas dish made from ribs of lamb or mutton that have been salted and dried.', 'https://images.unsplash.com/photo-1612470198083-20efbe41b711?q=lamb+ribs&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Ribbe', 'ribbe', 'Roasted pork belly with crispy crackling, a very popular Christmas dish in eastern Norway.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=pork+belly&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Lutefisk', 'lutefisk', 'A traditional dish made from aged stockfish or dried/salted whitefish and lye.', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=fish+dish&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Raspeballer', 'raspeballer', 'Potato dumplings, often mixed with flour and barley, served with salted meat, bacon, and rutabaga.', 'https://images.unsplash.com/photo-1555546252-a5e2f7596a2e?q=potato+dumplings&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Lapskaus', 'lapskaus', 'A traditional Norwegian stew made of meat, potatoes, and vegetables like carrots and rutabaga.', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=stew&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Finnbiff', 'finnbiff', 'Sautéed reindeer meat, typically served with mushrooms, bacon, and a creamy sauce.', 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=reindeer+stew&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Rømmegrøt', 'rommegrot', 'A porridge made with sour cream, whole milk, wheat flour, butter, and salt.', 'https://images.unsplash.com/photo-1582298642767-f40c76ce83b9?q=porridge&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Lefse', 'lefse', 'A traditional soft Norwegian flatbread made with potatoes, flour, butter, and milk or cream.', 'https://images.unsplash.com/photo-1579705912301-44755ebbc6f9?q=flatbread&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Svele', 'svele', 'A traditional Norwegian batter-based pancake, typically eaten as a snack with coffee.', 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=pancakes&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Skillingsboller', 'skillingsboller', 'Traditional cinnamon buns from Bergen, sprinkled with sugar.', 'https://images.unsplash.com/photo-1509365465994-3e549eb128ee?q=cinnamon+buns&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Krumkake', 'krumkake', 'A Norwegian waffle cookie made of flour, butter, eggs, sugar, and cream.', 'https://images.unsplash.com/photo-1605388308892-dbec79529457?q=waffle+cookie&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Multekrem', 'multekrem', 'A traditional dessert made of cloudberries mixed with whipped cream and sugar.', 'https://images.unsplash.com/photo-1498424075199-270f2fce5ba7?q=berries+cream&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Trollkrem', 'trollkrem', 'A simple dessert consisting of whipped egg whites, sugar, and lingonberries.', 'https://images.unsplash.com/photo-1551024506-0cb9842f10b2?q=lingonberry+dessert&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Norwegian waffles', 'norwegian-waffles', 'Heart-shaped waffles often served with jam, sour cream, or brown cheese.', 'https://images.unsplash.com/photo-1562376552-0d160a2f5f14?q=heart+waffles&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Smalahove', 'smalahove', 'A traditional dish made from a sheep''s head, originally eaten by the poor but now a delicacy.', 'https://images.unsplash.com/photo-1524317112028-ebbb667823f9?q=meat+dish&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Rakfisk', 'rakfisk', 'A fish dish made from trout or char, salted and fermented for two to three months.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fermented+fish&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Spekemat', 'spekemat', 'A variety of cured meats, often served with flatbread and sour cream.', 'https://images.unsplash.com/photo-1603598716301-d703db543596?q=cured+meats&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Gravlaks', 'gravlaks', 'Salmon that is cured using salt, sugar, and dill.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=salmon+cured&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Klippfisk', 'klippfisk', 'Dried and salted cod, a major Norwegian export and ingredient in Bacalao.', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=salted+cod&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Tørrfisk', 'torrfisk', 'Stockfish, unsalted fish (usually cod) dried by cold air and wind on wooden racks.', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=dried+fish&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Fiskesuppe', 'fiskesuppe', 'A creamy fish soup filled with various types of fish, root vegetables, and herbs.', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=fish+soup&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Bergensk fiskesuppe', 'bergensk-fiskesuppe', 'A specific type of rich, creamy fish soup originating from Bergen, often containing fish dumplings.', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=bergen+fish+soup&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'King crab', 'king-crab', 'A highly sought-after delicacy primarily fished in the Barents Sea off the coast of Finnmark.', 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=king+crab&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Norwegian salmon', 'norwegian-salmon', 'World-renowned farmed and wild salmon, essential to modern Norwegian cuisine and exports.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fresh+salmon&w=1080', 'PUBLISHED', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Sodd', 'sodd', 'A traditional soup-like meal with mutton and meatballs, originating from Trøndelag.', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=soup+meatballs&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Pølse i lompe', 'polse-i-lompe', 'A Norwegian hot dog served wrapped in a potato flatbread instead of a bun.', 'https://images.unsplash.com/photo-1599598425947-33002629ee98?q=hot+dog&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)
VALUES (gen_random_uuid(), 'Norwegian pancakes', 'norwegian-pancakes', 'Thin pancakes (pannekaker), often eaten with bacon or blueberry jam.', 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=crepes&w=1080', 'PUBLISHED', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

-- Media associated with foods
INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1600336153113-d66c79eaec6c?q=farikal&w=1080', 'Fårikål' FROM public.foods WHERE slug = 'farikal'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1600336153113-d66c79eaec6c?q=farikal&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'farikal'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1623065322967-0c7f76901e91?q=brown+cheese&w=1080', 'Brunost' FROM public.foods WHERE slug = 'brunost'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1623065322967-0c7f76901e91?q=brown+cheese&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'brunost'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1529042419736-8626c7104d53?q=meatballs&w=1080', 'Kjøttkaker' FROM public.foods WHERE slug = 'kjottkaker'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1529042419736-8626c7104d53?q=meatballs&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'kjottkaker'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1612470198083-20efbe41b711?q=lamb+ribs&w=1080', 'Pinnekjøtt' FROM public.foods WHERE slug = 'pinnekjott'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1612470198083-20efbe41b711?q=lamb+ribs&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'pinnekjott'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=pork+belly&w=1080', 'Ribbe' FROM public.foods WHERE slug = 'ribbe'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=pork+belly&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'ribbe'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=fish+dish&w=1080', 'Lutefisk' FROM public.foods WHERE slug = 'lutefisk'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=fish+dish&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'lutefisk'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1555546252-a5e2f7596a2e?q=potato+dumplings&w=1080', 'Raspeballer' FROM public.foods WHERE slug = 'raspeballer'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1555546252-a5e2f7596a2e?q=potato+dumplings&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'raspeballer'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=stew&w=1080', 'Lapskaus' FROM public.foods WHERE slug = 'lapskaus'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=stew&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'lapskaus'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=reindeer+stew&w=1080', 'Finnbiff' FROM public.foods WHERE slug = 'finnbiff'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=reindeer+stew&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'finnbiff'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1582298642767-f40c76ce83b9?q=porridge&w=1080', 'Rømmegrøt' FROM public.foods WHERE slug = 'rommegrot'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1582298642767-f40c76ce83b9?q=porridge&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'rommegrot'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1579705912301-44755ebbc6f9?q=flatbread&w=1080', 'Lefse' FROM public.foods WHERE slug = 'lefse'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1579705912301-44755ebbc6f9?q=flatbread&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'lefse'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=pancakes&w=1080', 'Svele' FROM public.foods WHERE slug = 'svele'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=pancakes&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'svele'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1509365465994-3e549eb128ee?q=cinnamon+buns&w=1080', 'Skillingsboller' FROM public.foods WHERE slug = 'skillingsboller'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1509365465994-3e549eb128ee?q=cinnamon+buns&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'skillingsboller'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1605388308892-dbec79529457?q=waffle+cookie&w=1080', 'Krumkake' FROM public.foods WHERE slug = 'krumkake'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1605388308892-dbec79529457?q=waffle+cookie&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'krumkake'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1498424075199-270f2fce5ba7?q=berries+cream&w=1080', 'Multekrem' FROM public.foods WHERE slug = 'multekrem'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1498424075199-270f2fce5ba7?q=berries+cream&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'multekrem'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1551024506-0cb9842f10b2?q=lingonberry+dessert&w=1080', 'Trollkrem' FROM public.foods WHERE slug = 'trollkrem'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1551024506-0cb9842f10b2?q=lingonberry+dessert&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'trollkrem'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1562376552-0d160a2f5f14?q=heart+waffles&w=1080', 'Norwegian waffles' FROM public.foods WHERE slug = 'norwegian-waffles'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1562376552-0d160a2f5f14?q=heart+waffles&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'norwegian-waffles'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1524317112028-ebbb667823f9?q=meat+dish&w=1080', 'Smalahove' FROM public.foods WHERE slug = 'smalahove'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1524317112028-ebbb667823f9?q=meat+dish&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'smalahove'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fermented+fish&w=1080', 'Rakfisk' FROM public.foods WHERE slug = 'rakfisk'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fermented+fish&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'rakfisk'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1603598716301-d703db543596?q=cured+meats&w=1080', 'Spekemat' FROM public.foods WHERE slug = 'spekemat'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1603598716301-d703db543596?q=cured+meats&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'spekemat'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=salmon+cured&w=1080', 'Gravlaks' FROM public.foods WHERE slug = 'gravlaks'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=salmon+cured&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'gravlaks'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=salted+cod&w=1080', 'Klippfisk' FROM public.foods WHERE slug = 'klippfisk'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=salted+cod&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'klippfisk'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=dried+fish&w=1080', 'Tørrfisk' FROM public.foods WHERE slug = 'torrfisk'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=dried+fish&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'torrfisk'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=fish+soup&w=1080', 'Fiskesuppe' FROM public.foods WHERE slug = 'fiskesuppe'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=fish+soup&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'fiskesuppe'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=bergen+fish+soup&w=1080', 'Bergensk fiskesuppe' FROM public.foods WHERE slug = 'bergensk-fiskesuppe'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=bergen+fish+soup&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'bergensk-fiskesuppe'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=king+crab&w=1080', 'King crab' FROM public.foods WHERE slug = 'king-crab'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=king+crab&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'king-crab'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fresh+salmon&w=1080', 'Norwegian salmon' FROM public.foods WHERE slug = 'norwegian-salmon'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fresh+salmon&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'norwegian-salmon'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=soup+meatballs&w=1080', 'Sodd' FROM public.foods WHERE slug = 'sodd'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=soup+meatballs&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'sodd'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1599598425947-33002629ee98?q=hot+dog&w=1080', 'Pølse i lompe' FROM public.foods WHERE slug = 'polse-i-lompe'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1599598425947-33002629ee98?q=hot+dog&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'polse-i-lompe'));

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)
SELECT gen_random_uuid(), 'food', id, 'GALLERY', 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=crepes&w=1080', 'Norwegian pancakes' FROM public.foods WHERE slug = 'norwegian-pancakes'
AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=crepes&w=1080' AND entity_id = (SELECT id FROM public.foods WHERE slug = 'norwegian-pancakes'));

