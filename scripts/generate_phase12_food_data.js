const fs = require('fs');
const path = require('path');

const foods = [
  { name: 'Fårikål', slug: 'farikal', desc: 'Norway\'s national dish consisting of pieces of mutton with bone, cabbage, whole black pepper and a little wheat flour, cooked for several hours in a casserole.', image: 'https://images.unsplash.com/photo-1600336153113-d66c79eaec6c?q=farikal&w=1080', featured: true },
  { name: 'Brunost', slug: 'brunost', desc: 'A sweet, brown cheese made by boiling whey, milk, and cream. Often eaten on waffles or bread.', image: 'https://images.unsplash.com/photo-1623065322967-0c7f76901e91?q=brown+cheese&w=1080', featured: true },
  { name: 'Kjøttkaker', slug: 'kjottkaker', desc: 'Traditional Norwegian meatballs, slightly larger and rougher than Swedish ones, usually served with brown sauce, potatoes, and lingonberry jam.', image: 'https://images.unsplash.com/photo-1529042419736-8626c7104d53?q=meatballs&w=1080', featured: true },
  { name: 'Pinnekjøtt', slug: 'pinnekjott', desc: 'A traditional Norwegian Christmas dish made from ribs of lamb or mutton that have been salted and dried.', image: 'https://images.unsplash.com/photo-1612470198083-20efbe41b711?q=lamb+ribs&w=1080', featured: true },
  { name: 'Ribbe', slug: 'ribbe', desc: 'Roasted pork belly with crispy crackling, a very popular Christmas dish in eastern Norway.', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=pork+belly&w=1080', featured: true },
  { name: 'Lutefisk', slug: 'lutefisk', desc: 'A traditional dish made from aged stockfish or dried/salted whitefish and lye.', image: 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=fish+dish&w=1080', featured: false },
  { name: 'Raspeballer', slug: 'raspeballer', desc: 'Potato dumplings, often mixed with flour and barley, served with salted meat, bacon, and rutabaga.', image: 'https://images.unsplash.com/photo-1555546252-a5e2f7596a2e?q=potato+dumplings&w=1080', featured: false },
  { name: 'Lapskaus', slug: 'lapskaus', desc: 'A traditional Norwegian stew made of meat, potatoes, and vegetables like carrots and rutabaga.', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=stew&w=1080', featured: false },
  { name: 'Finnbiff', slug: 'finnbiff', desc: 'Sautéed reindeer meat, typically served with mushrooms, bacon, and a creamy sauce.', image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=reindeer+stew&w=1080', featured: true },
  { name: 'Rømmegrøt', slug: 'rommegrot', desc: 'A porridge made with sour cream, whole milk, wheat flour, butter, and salt.', image: 'https://images.unsplash.com/photo-1582298642767-f40c76ce83b9?q=porridge&w=1080', featured: false },
  { name: 'Lefse', slug: 'lefse', desc: 'A traditional soft Norwegian flatbread made with potatoes, flour, butter, and milk or cream.', image: 'https://images.unsplash.com/photo-1579705912301-44755ebbc6f9?q=flatbread&w=1080', featured: true },
  { name: 'Svele', slug: 'svele', desc: 'A traditional Norwegian batter-based pancake, typically eaten as a snack with coffee.', image: 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=pancakes&w=1080', featured: false },
  { name: 'Skillingsboller', slug: 'skillingsboller', desc: 'Traditional cinnamon buns from Bergen, sprinkled with sugar.', image: 'https://images.unsplash.com/photo-1509365465994-3e549eb128ee?q=cinnamon+buns&w=1080', featured: true },
  { name: 'Krumkake', slug: 'krumkake', desc: 'A Norwegian waffle cookie made of flour, butter, eggs, sugar, and cream.', image: 'https://images.unsplash.com/photo-1605388308892-dbec79529457?q=waffle+cookie&w=1080', featured: false },
  { name: 'Multekrem', slug: 'multekrem', desc: 'A traditional dessert made of cloudberries mixed with whipped cream and sugar.', image: 'https://images.unsplash.com/photo-1498424075199-270f2fce5ba7?q=berries+cream&w=1080', featured: true },
  { name: 'Trollkrem', slug: 'trollkrem', desc: 'A simple dessert consisting of whipped egg whites, sugar, and lingonberries.', image: 'https://images.unsplash.com/photo-1551024506-0cb9842f10b2?q=lingonberry+dessert&w=1080', featured: false },
  { name: 'Norwegian waffles', slug: 'norwegian-waffles', desc: 'Heart-shaped waffles often served with jam, sour cream, or brown cheese.', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f5f14?q=heart+waffles&w=1080', featured: true },
  { name: 'Smalahove', slug: 'smalahove', desc: 'A traditional dish made from a sheep\'s head, originally eaten by the poor but now a delicacy.', image: 'https://images.unsplash.com/photo-1524317112028-ebbb667823f9?q=meat+dish&w=1080', featured: false },
  { name: 'Rakfisk', slug: 'rakfisk', desc: 'A fish dish made from trout or char, salted and fermented for two to three months.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fermented+fish&w=1080', featured: false },
  { name: 'Spekemat', slug: 'spekemat', desc: 'A variety of cured meats, often served with flatbread and sour cream.', image: 'https://images.unsplash.com/photo-1603598716301-d703db543596?q=cured+meats&w=1080', featured: false },
  { name: 'Gravlaks', slug: 'gravlaks', desc: 'Salmon that is cured using salt, sugar, and dill.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=salmon+cured&w=1080', featured: true },
  { name: 'Klippfisk', slug: 'klippfisk', desc: 'Dried and salted cod, a major Norwegian export and ingredient in Bacalao.', image: 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=salted+cod&w=1080', featured: false },
  { name: 'Tørrfisk', slug: 'torrfisk', desc: 'Stockfish, unsalted fish (usually cod) dried by cold air and wind on wooden racks.', image: 'https://images.unsplash.com/photo-1596796931580-c113bd8a203a?q=dried+fish&w=1080', featured: false },
  { name: 'Fiskesuppe', slug: 'fiskesuppe', desc: 'A creamy fish soup filled with various types of fish, root vegetables, and herbs.', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=fish+soup&w=1080', featured: true },
  { name: 'Bergensk fiskesuppe', slug: 'bergensk-fiskesuppe', desc: 'A specific type of rich, creamy fish soup originating from Bergen, often containing fish dumplings.', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=bergen+fish+soup&w=1080', featured: false },
  { name: 'King crab', slug: 'king-crab', desc: 'A highly sought-after delicacy primarily fished in the Barents Sea off the coast of Finnmark.', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=king+crab&w=1080', featured: true },
  { name: 'Norwegian salmon', slug: 'norwegian-salmon', desc: 'World-renowned farmed and wild salmon, essential to modern Norwegian cuisine and exports.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=fresh+salmon&w=1080', featured: true },
  { name: 'Sodd', slug: 'sodd', desc: 'A traditional soup-like meal with mutton and meatballs, originating from Trøndelag.', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=soup+meatballs&w=1080', featured: false },
  { name: 'Pølse i lompe', slug: 'polse-i-lompe', desc: 'A Norwegian hot dog served wrapped in a potato flatbread instead of a bun.', image: 'https://images.unsplash.com/photo-1599598425947-33002629ee98?q=hot+dog&w=1080', featured: false },
  { name: 'Norwegian pancakes', slug: 'norwegian-pancakes', desc: 'Thin pancakes (pannekaker), often eaten with bacon or blueberry jam.', image: 'https://images.unsplash.com/photo-1554520735-0a1452ce45bc?q=crepes&w=1080', featured: false },
];

let sql = `-- Phase 12: National Content Expansion - Food Data\n\n`;

const mediaSqlLines = [];

for (const food of foods) {
  const escapedName = food.name.replace(/'/g, "''");
  const escapedDesc = food.desc.replace(/'/g, "''");
  
  sql += `INSERT INTO public.foods (id, name, slug, description, image_url, status, featured)\n`;
  sql += `VALUES (gen_random_uuid(), '${escapedName}', '${food.slug}', '${escapedDesc}', '${food.image}', 'PUBLISHED', ${food.featured})\n`;
  sql += `ON CONFLICT (slug) DO UPDATE SET\n`;
  sql += `  name = EXCLUDED.name,\n`;
  sql += `  description = EXCLUDED.description,\n`;
  sql += `  image_url = EXCLUDED.image_url,\n`;
  sql += `  status = EXCLUDED.status,\n`;
  sql += `  featured = EXCLUDED.featured;\n\n`;
  
  // Create media entry
  mediaSqlLines.push(`INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text)`);
  mediaSqlLines.push(`SELECT gen_random_uuid(), 'food', id, 'GALLERY', '${food.image}', '${escapedName}' FROM public.foods WHERE slug = '${food.slug}'`);
  mediaSqlLines.push(`AND NOT EXISTS (SELECT 1 FROM public.content_media WHERE entity_type = 'food' AND media_url = '${food.image}' AND entity_id = (SELECT id FROM public.foods WHERE slug = '${food.slug}'));\n`);
}

sql += `-- Media associated with foods\n`;
sql += mediaSqlLines.join('\n') + '\n';

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const targetFile = path.join(migrationsDir, '20260819000010_phase12_national_data.sql');
fs.writeFileSync(targetFile, sql, 'utf8');

console.log('Successfully generated SQL script at:', targetFile);
