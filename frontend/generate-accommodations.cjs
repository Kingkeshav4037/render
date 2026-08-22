const fs = require('fs');
const path = require('path');

const accommodations = [
  { name: 'The Thief', locationSlug: 'oslo', type: 'HOTEL', desc: 'Luxury boutique hotel located on Tjuvholmen in Oslo.' },
  { name: 'Grand Hotel', locationSlug: 'oslo', type: 'HOTEL', desc: 'Historic luxury hotel on Karl Johan gate in the heart of Oslo.' },
  { name: 'Sommerro', locationSlug: 'oslo', type: 'HOTEL', desc: 'A glamorous art deco hotel, reviving a historic 1930s building in Frogner.' },
  { name: 'Clarion Hotel The Hub', locationSlug: 'oslo', type: 'HOTEL', desc: 'Norway\'s largest hotel, featuring a rooftop bar with spectacular city views.' },
  { name: 'Anker Hostel', locationSlug: 'oslo', type: 'HOSTEL', desc: 'Popular and affordable hostel located in the vibrant Grünerløkka district.' },
  
  { name: 'Opus XVI', locationSlug: 'bergen', type: 'HOTEL', desc: 'A luxury hotel housed in a historic building, managed by descendants of Edvard Grieg.' },
  { name: 'Hotel Norge by Scandic', locationSlug: 'bergen', type: 'HOTEL', desc: 'An iconic Bergen hotel that has been a meeting place since 1885.' },
  { name: 'Det Hanseatiske Hotel', locationSlug: 'bergen', type: 'HOTEL', desc: 'Charming boutique hotel located right in the historic Bryggen area.' },
  { name: 'Bergen Børs Hotel', locationSlug: 'bergen', type: 'HOTEL', desc: 'Exclusive design hotel set in the old stock exchange building.' },
  { name: 'Solstrand Hotel & Bad', locationSlug: 'bergen', type: 'RESORT', desc: 'A historic spa hotel located right by the Bjørnefjord outside Bergen.' },
  
  { name: 'Britannia Hotel', locationSlug: 'trondheim', type: 'HOTEL', desc: 'A meticulously restored classic 5-star hotel offering world-class luxury.' },
  { name: 'Clarion Hotel Trondheim', locationSlug: 'trondheim', type: 'HOTEL', desc: 'Modern design hotel situated right by the fjord in Trondheim.' },
  { name: 'Bakklandet Hotel', locationSlug: 'trondheim', type: 'HOTEL', desc: 'Cozy, traditional hotel in Trondheim\'s most charming neighborhood.' },
  
  { name: 'Eilert Smith Hotel', locationSlug: 'stavanger', type: 'HOTEL', desc: 'Exclusive boutique hotel offering understated luxury and personalized service.' },
  { name: 'Clarion Hotel Energy', locationSlug: 'stavanger', type: 'HOTEL', desc: 'Modern and vibrant hotel located in Stavanger\'s new forum area.' },
  { name: 'Preikestolen Basecamp', locationSlug: 'stavanger', type: 'LODGE', desc: 'The perfect starting point for hiking the famous Pulpit Rock.' },
  
  { name: 'The Edge', locationSlug: 'tromso', type: 'HOTEL', desc: 'An innovative hotel reflecting Tromsø\'s beautiful Arctic light and nature.' },
  { name: 'Scandic Ishavshotel', locationSlug: 'tromso', type: 'HOTEL', desc: 'Award-winning hotel located right on the quay in Tromsø with panoramic views.' },
  { name: 'Arctic Panorama Lodge', locationSlug: 'tromso', type: 'LODGE', desc: 'An exclusive lodge offering spectacular views of the Lyngen Alps.' },
  { name: 'Malangen Resort', locationSlug: 'tromso', type: 'RESORT', desc: 'A beautiful resort offering cabins and hotel rooms right by the fjord.' },
  { name: 'Tromsø Activities Hostel', locationSlug: 'tromso', type: 'HOSTEL', desc: 'Friendly hostel organizing numerous Northern Lights and hiking tours.' },
  
  { name: 'Sorrisniva Igloo Hotel', locationSlug: 'alta', type: 'UNIQUE_STAY', desc: 'The northernmost ice hotel in the world, rebuilt entirely every winter.' },
  { name: 'Snowhotel Kirkenes', locationSlug: 'kirkenes', type: 'UNIQUE_STAY', desc: 'An unforgettable hotel completely constructed of snow and ice.' },
  
  { name: 'Juvet Landscape Hotel', locationSlug: 'geiranger', type: 'UNIQUE_STAY', desc: 'Award-winning architectural masterpiece blending seamlessly with nature.' },
  { name: 'Hotel Union', locationSlug: 'geiranger', type: 'HOTEL', desc: 'Historic spa hotel offering breathtaking views of the Geirangerfjord.' },
  { name: 'Grande Fjord Hotel', locationSlug: 'geiranger', type: 'HOTEL', desc: 'Family-run hotel situated directly on the shores of the Geirangerfjord.' },
  { name: 'Geiranger Fjordsenter', locationSlug: 'geiranger', type: 'CAMPING', desc: 'Excellent camping facilities right next to the iconic fjord.' },
  
  { name: 'Eliassen Rorbuer', locationSlug: 'reine', type: 'CABIN', desc: 'Iconic red fishermen\'s cabins offering the quintessential Lofoten experience.' },
  { name: 'Nusfjord Arctic Resort', locationSlug: 'nusfjord', type: 'RESORT', desc: 'A historic fishing village transformed into a premium resort.' },
  { name: 'Hattvika Lodge', locationSlug: 'lofoten-islands', type: 'LODGE', desc: 'Exclusive basecamp combining modern luxury with traditional Lofoten heritage.' },
  { name: 'Svinøya Rorbuer', locationSlug: 'svolvaer', type: 'CABIN', desc: 'Authentic rorbuer situated on a small island in Svolvær.' },
  
  { name: 'Hamn i Senja', locationSlug: 'senja', type: 'RESORT', desc: 'A spectacular resort located in a sheltered harbor on Senja.' },
  { name: 'Mefjord Brygge', locationSlug: 'senja', type: 'LODGE', desc: 'A paradise for fishing and exploring the rugged nature of Senja.' },
  
  { name: 'Fretheim Hotel', locationSlug: 'flam', type: 'HOTEL', desc: 'A historical hotel located at the inner end of the Aurlandsfjord.' },
  { name: 'Flåm Marina & Apartments', locationSlug: 'flam', type: 'APARTMENT', desc: 'Comfortable apartments right on the waterfront in Flåm.' },
  { name: 'Vatnahalsen Hotel', locationSlug: 'flam', type: 'LODGE', desc: 'A historic mountain lodge only accessible by the Flåm Railway or hiking.' },
  
  { name: 'Ullensvang Hotel', locationSlug: 'hardangerfjord', type: 'RESORT', desc: 'Historic hotel by the Hardangerfjord, beloved by composer Edvard Grieg.' },
  { name: 'Kviknes Hotel', locationSlug: 'sognefjord', type: 'HOTEL', desc: 'A classic hotel featuring Swiss-style architecture right on the Sognefjord.' },
  { name: 'Walaker Hotel', locationSlug: 'sognefjord', type: 'HOTEL', desc: 'Norway\'s oldest hotel, family-run since 1690, offering a unique historic atmosphere.' },
  
  { name: 'Dalen Hotel', locationSlug: 'oslo', type: 'HOTEL', desc: 'Known as the "fairy tale hotel," a spectacular wooden hotel from 1894.' },
  { name: 'Finse 1222', locationSlug: 'geilo', type: 'LODGE', desc: 'The highest situated hotel in Norway, only accessible by train.' },
  { name: 'Dr. Holms Hotel', locationSlug: 'geilo', type: 'RESORT', desc: 'Iconic mountain resort and spa in the famous ski destination of Geilo.' },
  { name: 'Vestlia Resort', locationSlug: 'geilo', type: 'RESORT', desc: 'A beautiful lodge-style resort perfect for both winter and summer activities.' },
  
  { name: 'Basecamp Hotel', locationSlug: 'svalbard', type: 'UNIQUE_STAY', desc: 'An authentic trapper\'s lodge style hotel in the center of Longyearbyen.' },
  { name: 'Funken Lodge', locationSlug: 'svalbard', type: 'LODGE', desc: 'Boutique luxury lodge offering Arctic elegance and historical atmosphere.' },
  
  { name: 'Manshausen Island Resort', locationSlug: 'bodo', type: 'ECO_STAY', desc: 'Award-winning eco-resort featuring sea cabins with floor-to-ceiling windows.' },
  { name: 'Kjerag Lysebotn Resort', locationSlug: 'lysefjord', type: 'CAMPING', desc: 'Great camping spot right at the base of the spectacular Lysefjord and Kjeragbolten.' },
  { name: 'Wood Hotel', locationSlug: 'lillehammer', type: 'UNIQUE_STAY', desc: 'One of the world\'s tallest wooden buildings, located right by lake Mjøsa.' },
  { name: 'Lyngen North', locationSlug: 'tromso', type: 'UNIQUE_STAY', desc: 'Glass igloos offering uninterrupted views of the Northern Lights.' },
  { name: 'Trolltunga Hotel', locationSlug: 'hardangerfjord', type: 'HOTEL', desc: 'The perfect base camp for hikers preparing for the Trolltunga trek.' },
  { name: 'Radisson Blu Mountain Resort', locationSlug: 'lillehammer', type: 'RESORT', desc: 'Excellent ski-in/ski-out resort.' }
];

let sql = `-- Phase 12: Accommodation Data Expansion\n\n`;

sql += `
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
`;

sql += accommodations.map(a => {
  return `    ('${a.locationSlug}', '${a.name.replace(/'/g, "''")}', '${a.type}', '${a.desc.replace(/'/g, "''")}', 'PUBLISHED')`;
}).join(',\n');

sql += `
) AS new_acc(slug, name, type, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_acc.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.accommodations AS acc WHERE acc.name = new_acc.name
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000014_phase12_accommodation_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Accommodation migration generated at ' + outPath);
