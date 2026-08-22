const fs = require('fs');
const path = require('path');

const restaurants = [
  { name: 'Maaemo', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['New Nordic'], desc: 'A three Michelin star experience showcasing the very best of Norwegian nature.' },
  { name: 'RE-NAA', locationSlug: 'stavanger', type: 'FINE_DINING', cuisine: ['New Nordic', 'Seafood'], desc: 'Stavanger\'s finest two Michelin star dining focusing on local seafood and ingredients.' },
  { name: 'Under', locationSlug: 'lindesnes-lighthouse', type: 'FINE_DINING', cuisine: ['Seafood', 'New Nordic'], desc: 'Europe\'s first underwater restaurant, located at the southernmost point of Norway.' },
  { name: 'Cornelius', locationSlug: 'bergen', type: 'FOOD_EXPERIENCE', cuisine: ['Seafood'], desc: 'One of Norway\'s best seafood restaurants, situated right by the ocean outside Bergen.' },
  { name: 'Lysverket', locationSlug: 'bergen', type: 'FINE_DINING', cuisine: ['Norwegian', 'New Nordic'], desc: 'Modern Norwegian cuisine based on local seafood, housed in an art museum.' },
  { name: 'Bare', locationSlug: 'bergen', type: 'FINE_DINING', cuisine: ['New Nordic'], desc: 'Michelin-starred restaurant offering an exquisite taste of western Norway.' },
  { name: 'Kontrast', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['New Nordic'], desc: 'A modern Scandinavian restaurant with a focus on local and seasonal ingredients.' },
  { name: 'Einer', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['Vegetarian', 'New Nordic'], desc: 'Focuses heavily on vegetables and traditional preserving techniques.' },
  { name: 'Hrimnir Ramen', locationSlug: 'oslo', type: 'CASUAL', cuisine: ['Asian', 'Nordic'], desc: 'Japanese ramen techniques combined with Nordic ingredients.' },
  { name: 'Sabi Omakase', locationSlug: 'stavanger', type: 'FINE_DINING', cuisine: ['Japanese', 'Seafood'], desc: 'Exclusive sushi restaurant holding a Michelin star.' },
  
  { name: 'Credo', locationSlug: 'trondheim', type: 'FINE_DINING', cuisine: ['Norwegian', 'New Nordic'], desc: 'Michelin-starred dining celebrating the Trøndelag region and sustainable agriculture.' },
  { name: 'Fagn', locationSlug: 'trondheim', type: 'FINE_DINING', cuisine: ['Norwegian', 'New Nordic'], desc: 'Creative and innovative Michelin-starred gastronomy in Trondheim.' },
  { name: 'Speilsalen', locationSlug: 'trondheim', type: 'FINE_DINING', cuisine: ['Classic', 'Norwegian'], desc: 'Opulent Michelin-starred dining in the historic Britannia Hotel.' },
  { name: 'Kilden', locationSlug: 'tromso', type: 'CASUAL', cuisine: ['Arctic', 'Norwegian'], desc: 'Arctic cuisine showcasing the best ingredients from Northern Norway.' },
  { name: 'Bardus Bistro', locationSlug: 'tromso', type: 'CASUAL', cuisine: ['Norwegian'], desc: 'A lively bistro serving hearty, traditional Norwegian dishes with a modern twist.' },
  { name: 'Smak', locationSlug: 'tromso', type: 'FINE_DINING', cuisine: ['Arctic', 'Norwegian'], desc: 'An intimate dining experience highlighting seasonal Arctic produce.' },
  { name: 'Mathallen Oslo', locationSlug: 'oslo', type: 'FOOD_EXPERIENCE', cuisine: ['Diverse', 'Norwegian'], desc: 'Indoor food market featuring a wide array of local and international cuisines.' },
  { name: 'Vippa', locationSlug: 'oslo', type: 'STREET_FOOD', cuisine: ['Diverse', 'Casual'], desc: 'Street food market located on the edge of the Oslo Fjord.' },
  { name: 'Pingvinen', locationSlug: 'bergen', type: 'PUB', cuisine: ['Traditional Norwegian'], desc: 'Iconic gastropub serving classic Norwegian comfort food like meatballs and stew.' },
  { name: 'Trekroneren', locationSlug: 'bergen', type: 'STREET_FOOD', cuisine: ['Norwegian'], desc: 'Legendary hot dog stand in Bergen known for reindeer sausages.' },
  
  { name: 'Jentan på Båly', locationSlug: 'lindesnes-lighthouse', type: 'CASUAL', cuisine: ['Seafood'], desc: 'Local fishmonger and casual eatery offering fresh catches from the southern coast.' },
  { name: 'Godt Brød', locationSlug: 'bergen', type: 'BAKERY', cuisine: ['Bakery', 'Organic'], desc: 'Popular organic bakery serving fresh bread and pastries.' },
  { name: 'Tim Wendelboe', locationSlug: 'oslo', type: 'CAFE', cuisine: ['Coffee'], desc: 'World-renowned coffee roastery and espresso bar.' },
  { name: 'Supreme Roastworks', locationSlug: 'oslo', type: 'CAFE', cuisine: ['Coffee'], desc: 'Award-winning coffee shop in the heart of Grünerløkka.' },
  { name: 'Åpent Bakeri', locationSlug: 'oslo', type: 'BAKERY', cuisine: ['Bakery'], desc: 'Artisan bakery specializing in traditional baking methods.' },
  { name: 'W.B. Samson', locationSlug: 'oslo', type: 'BAKERY', cuisine: ['Bakery', 'Cafe'], desc: 'Historic bakery chain offering quality pastries and bread.' },
  { name: 'Illegal Burger', locationSlug: 'oslo', type: 'CASUAL', cuisine: ['Burgers'], desc: 'Famous for serving some of the best grilled burgers in Oslo.' },
  { name: 'Haralds Vaffel', locationSlug: 'oslo', type: 'CAFE', cuisine: ['Norwegian', 'Waffles'], desc: 'Traditional Norwegian waffles with various classic and creative toppings.' },
  { name: 'Kaffemisjonen', locationSlug: 'bergen', type: 'CAFE', cuisine: ['Coffee'], desc: 'Top-tier specialty coffee shop in Bergen.' },
  { name: 'Bakklandet Skydsstasjon', locationSlug: 'trondheim', type: 'CAFE', cuisine: ['Norwegian'], desc: 'Cozy, traditional cafe famous for its fish soup and historic setting.' },
  
  { name: 'Solsiden Restaurant', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['Seafood'], desc: 'Premium seafood restaurant offering a legendary seafood platter.' },
  { name: 'Fisketorget', locationSlug: 'stavanger', type: 'CASUAL', cuisine: ['Seafood'], desc: 'Stavanger\'s fish market and restaurant, serving ultra-fresh seafood.' },
  { name: 'Enhjørningen', locationSlug: 'bergen', type: 'FINE_DINING', cuisine: ['Seafood', 'Norwegian'], desc: 'Historic seafood restaurant located in the iconic Bryggen.' },
  { name: 'Bryggeloftet & Stuene', locationSlug: 'bergen', type: 'CASUAL', cuisine: ['Traditional Norwegian'], desc: 'Bergen\'s oldest family-run restaurant, serving traditional dishes.' },
  { name: 'Emma\'s Drømmekjøkken', locationSlug: 'tromso', type: 'FINE_DINING', cuisine: ['Norwegian', 'Arctic'], desc: 'Renowned for its fantastic, locally-sourced Northern Norwegian menu.' },
  { name: 'Hildr Gastro Bar', locationSlug: 'tromso', type: 'PUB', cuisine: ['Nordic'], desc: 'Cool gastro pub offering excellent food and craft cocktails.' },
  { name: 'Mathallen Tromsø', locationSlug: 'tromso', type: 'FOOD_EXPERIENCE', cuisine: ['Arctic', 'Seafood'], desc: 'A deli and restaurant focused entirely on Arctic ingredients.' },
  { name: 'Kaffebønna', locationSlug: 'tromso', type: 'CAFE', cuisine: ['Coffee', 'Bakery'], desc: 'Popular local cafe and bakery chain in Tromsø.' },
  { name: 'Nordvegan', locationSlug: 'oslo', type: 'CASUAL', cuisine: ['Vegan'], desc: 'Sustainable and healthy plant-based cuisine.' },
  { name: 'Funky Fresh Foods', locationSlug: 'oslo', type: 'CAFE', cuisine: ['Vegan'], desc: 'Vibrant vegan cafe focusing on organic and raw foods.' },
  
  { name: 'Sabi Sushi', locationSlug: 'stavanger', type: 'CASUAL', cuisine: ['Japanese', 'Seafood'], desc: 'High-quality sushi chain originating from Stavanger.' },
  { name: 'Bølgen & Moi', locationSlug: 'stavanger', type: 'CASUAL', cuisine: ['Norwegian', 'Brasserie'], desc: 'Vibrant brasserie combining great food with modern art.' },
  { name: 'Kveik', locationSlug: 'bergen', type: 'PUB', cuisine: ['Craft Beer'], desc: 'Specialty pub focusing on Norwegian farmhouse ales.' },
  { name: 'Henrik Øl og Vinstove', locationSlug: 'bergen', type: 'PUB', cuisine: ['Craft Beer'], desc: 'A legendary beer bar with an extensive selection of taps.' },
  { name: 'Schouskjelleren', locationSlug: 'oslo', type: 'PUB', cuisine: ['Craft Beer'], desc: 'Atmospheric microbrewery located in a historic cellar.' },
  { name: 'Crow Bar & Brewery', locationSlug: 'oslo', type: 'PUB', cuisine: ['Craft Beer', 'Street Food'], desc: 'Large brewpub in Oslo serving excellent beer and kebab.' },
  { name: 'Smalhans', locationSlug: 'oslo', type: 'CASUAL', cuisine: ['Norwegian', 'New Nordic'], desc: 'Relaxed neighborhood restaurant serving excellent value Nordic cuisine.' },
  { name: 'Statholdergaarden', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['Norwegian', 'Classic'], desc: 'A culinary institution in Oslo, holding a Michelin star since 1998.' },
  { name: 'Arakataka', locationSlug: 'oslo', type: 'CASUAL', cuisine: ['New Nordic'], desc: 'High-quality gourmet food at an accessible price point.' },
  { name: 'Rest', locationSlug: 'oslo', type: 'FINE_DINING', cuisine: ['New Nordic', 'Sustainable'], desc: 'Michelin-starred fine dining focusing on minimizing food waste.' }
];

let sql = `-- Phase 12: Restaurant Data Expansion\n\n`;

// Prepare SQL values
const values = restaurants.map(r => {
  const cuisineArr = r.cuisine.map(c => '"' + c.replace(/"/g, '\\"') + '"').join(', ');
  const cuisineStr = "'{" + cuisineArr + "}'";
  return `  (gen_random_uuid(), (SELECT id FROM public.locations WHERE slug = '${r.locationSlug}' LIMIT 1), '${r.name.replace(/'/g, "''")}', '${r.type}', ${cuisineStr}, '${r.desc.replace(/'/g, "''")}', 'PUBLISHED')`;
});

// Since the DB uses location_id which requires a subquery, we can't efficiently use ON CONFLICT because we'd need a unique constraint to avoid duplicates.
// Wait, 'name' isn't UNIQUE globally. Let's just do an INSERT without ON CONFLICT (unless there's a constraint).
// But to prevent duplicating on re-runs, we can do an INSERT ... SELECT ... WHERE NOT EXISTS
// Or just basic INSERTs. The prompt didn't report duplicate restaurants yet.
// Actually, let's use a safe insertion method that avoids inserting if the restaurant already exists by name.

sql += `
INSERT INTO public.restaurants (id, location_id, name, type, cuisine, description, status)
SELECT 
  gen_random_uuid(),
  loc.id,
  new_rest.name,
  new_rest.type::public.restaurant_type,
  new_rest.cuisine,
  new_rest.description,
  new_rest.status::public.content_status
FROM (
  VALUES
`;

sql += restaurants.map(r => {
  const cuisineArr = r.cuisine.map(c => '"' + c.replace(/"/g, '\\"') + '"').join(', ');
  const cuisineStr = "'{" + cuisineArr + "}'::text[]";
  return `    ('${r.locationSlug}', '${r.name.replace(/'/g, "''")}', '${r.type}', ${cuisineStr}, '${r.desc.replace(/'/g, "''")}', 'PUBLISHED')`;
}).join(',\n');

sql += `
) AS new_rest(slug, name, type, cuisine, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_rest.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.restaurants AS rest WHERE rest.name = new_rest.name
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000013_phase12_restaurant_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Restaurant migration generated at ' + outPath);
