-- Phase 12: Restaurant Data Expansion


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
    ('oslo', 'Maaemo', 'FINE_DINING', '{"New Nordic"}'::text[], 'A three Michelin star experience showcasing the very best of Norwegian nature.', 'PUBLISHED'),
    ('stavanger', 'RE-NAA', 'FINE_DINING', '{"New Nordic", "Seafood"}'::text[], 'Stavanger''s finest two Michelin star dining focusing on local seafood and ingredients.', 'PUBLISHED'),
    ('lindesnes-lighthouse', 'Under', 'FINE_DINING', '{"Seafood", "New Nordic"}'::text[], 'Europe''s first underwater restaurant, located at the southernmost point of Norway.', 'PUBLISHED'),
    ('bergen', 'Cornelius', 'FOOD_EXPERIENCE', '{"Seafood"}'::text[], 'One of Norway''s best seafood restaurants, situated right by the ocean outside Bergen.', 'PUBLISHED'),
    ('bergen', 'Lysverket', 'FINE_DINING', '{"Norwegian", "New Nordic"}'::text[], 'Modern Norwegian cuisine based on local seafood, housed in an art museum.', 'PUBLISHED'),
    ('bergen', 'Bare', 'FINE_DINING', '{"New Nordic"}'::text[], 'Michelin-starred restaurant offering an exquisite taste of western Norway.', 'PUBLISHED'),
    ('oslo', 'Kontrast', 'FINE_DINING', '{"New Nordic"}'::text[], 'A modern Scandinavian restaurant with a focus on local and seasonal ingredients.', 'PUBLISHED'),
    ('oslo', 'Einer', 'FINE_DINING', '{"Vegetarian", "New Nordic"}'::text[], 'Focuses heavily on vegetables and traditional preserving techniques.', 'PUBLISHED'),
    ('oslo', 'Hrimnir Ramen', 'CASUAL', '{"Asian", "Nordic"}'::text[], 'Japanese ramen techniques combined with Nordic ingredients.', 'PUBLISHED'),
    ('stavanger', 'Sabi Omakase', 'FINE_DINING', '{"Japanese", "Seafood"}'::text[], 'Exclusive sushi restaurant holding a Michelin star.', 'PUBLISHED'),
    ('trondheim', 'Credo', 'FINE_DINING', '{"Norwegian", "New Nordic"}'::text[], 'Michelin-starred dining celebrating the Trøndelag region and sustainable agriculture.', 'PUBLISHED'),
    ('trondheim', 'Fagn', 'FINE_DINING', '{"Norwegian", "New Nordic"}'::text[], 'Creative and innovative Michelin-starred gastronomy in Trondheim.', 'PUBLISHED'),
    ('trondheim', 'Speilsalen', 'FINE_DINING', '{"Classic", "Norwegian"}'::text[], 'Opulent Michelin-starred dining in the historic Britannia Hotel.', 'PUBLISHED'),
    ('tromso', 'Kilden', 'CASUAL', '{"Arctic", "Norwegian"}'::text[], 'Arctic cuisine showcasing the best ingredients from Northern Norway.', 'PUBLISHED'),
    ('tromso', 'Bardus Bistro', 'CASUAL', '{"Norwegian"}'::text[], 'A lively bistro serving hearty, traditional Norwegian dishes with a modern twist.', 'PUBLISHED'),
    ('tromso', 'Smak', 'FINE_DINING', '{"Arctic", "Norwegian"}'::text[], 'An intimate dining experience highlighting seasonal Arctic produce.', 'PUBLISHED'),
    ('oslo', 'Mathallen Oslo', 'FOOD_EXPERIENCE', '{"Diverse", "Norwegian"}'::text[], 'Indoor food market featuring a wide array of local and international cuisines.', 'PUBLISHED'),
    ('oslo', 'Vippa', 'STREET_FOOD', '{"Diverse", "Casual"}'::text[], 'Street food market located on the edge of the Oslo Fjord.', 'PUBLISHED'),
    ('bergen', 'Pingvinen', 'PUB', '{"Traditional Norwegian"}'::text[], 'Iconic gastropub serving classic Norwegian comfort food like meatballs and stew.', 'PUBLISHED'),
    ('bergen', 'Trekroneren', 'STREET_FOOD', '{"Norwegian"}'::text[], 'Legendary hot dog stand in Bergen known for reindeer sausages.', 'PUBLISHED'),
    ('lindesnes-lighthouse', 'Jentan på Båly', 'CASUAL', '{"Seafood"}'::text[], 'Local fishmonger and casual eatery offering fresh catches from the southern coast.', 'PUBLISHED'),
    ('bergen', 'Godt Brød', 'BAKERY', '{"Bakery", "Organic"}'::text[], 'Popular organic bakery serving fresh bread and pastries.', 'PUBLISHED'),
    ('oslo', 'Tim Wendelboe', 'CAFE', '{"Coffee"}'::text[], 'World-renowned coffee roastery and espresso bar.', 'PUBLISHED'),
    ('oslo', 'Supreme Roastworks', 'CAFE', '{"Coffee"}'::text[], 'Award-winning coffee shop in the heart of Grünerløkka.', 'PUBLISHED'),
    ('oslo', 'Åpent Bakeri', 'BAKERY', '{"Bakery"}'::text[], 'Artisan bakery specializing in traditional baking methods.', 'PUBLISHED'),
    ('oslo', 'W.B. Samson', 'BAKERY', '{"Bakery", "Cafe"}'::text[], 'Historic bakery chain offering quality pastries and bread.', 'PUBLISHED'),
    ('oslo', 'Illegal Burger', 'CASUAL', '{"Burgers"}'::text[], 'Famous for serving some of the best grilled burgers in Oslo.', 'PUBLISHED'),
    ('oslo', 'Haralds Vaffel', 'CAFE', '{"Norwegian", "Waffles"}'::text[], 'Traditional Norwegian waffles with various classic and creative toppings.', 'PUBLISHED'),
    ('bergen', 'Kaffemisjonen', 'CAFE', '{"Coffee"}'::text[], 'Top-tier specialty coffee shop in Bergen.', 'PUBLISHED'),
    ('trondheim', 'Bakklandet Skydsstasjon', 'CAFE', '{"Norwegian"}'::text[], 'Cozy, traditional cafe famous for its fish soup and historic setting.', 'PUBLISHED'),
    ('oslo', 'Solsiden Restaurant', 'FINE_DINING', '{"Seafood"}'::text[], 'Premium seafood restaurant offering a legendary seafood platter.', 'PUBLISHED'),
    ('stavanger', 'Fisketorget', 'CASUAL', '{"Seafood"}'::text[], 'Stavanger''s fish market and restaurant, serving ultra-fresh seafood.', 'PUBLISHED'),
    ('bergen', 'Enhjørningen', 'FINE_DINING', '{"Seafood", "Norwegian"}'::text[], 'Historic seafood restaurant located in the iconic Bryggen.', 'PUBLISHED'),
    ('bergen', 'Bryggeloftet & Stuene', 'CASUAL', '{"Traditional Norwegian"}'::text[], 'Bergen''s oldest family-run restaurant, serving traditional dishes.', 'PUBLISHED'),
    ('tromso', 'Emma''s Drømmekjøkken', 'FINE_DINING', '{"Norwegian", "Arctic"}'::text[], 'Renowned for its fantastic, locally-sourced Northern Norwegian menu.', 'PUBLISHED'),
    ('tromso', 'Hildr Gastro Bar', 'PUB', '{"Nordic"}'::text[], 'Cool gastro pub offering excellent food and craft cocktails.', 'PUBLISHED'),
    ('tromso', 'Mathallen Tromsø', 'FOOD_EXPERIENCE', '{"Arctic", "Seafood"}'::text[], 'A deli and restaurant focused entirely on Arctic ingredients.', 'PUBLISHED'),
    ('tromso', 'Kaffebønna', 'CAFE', '{"Coffee", "Bakery"}'::text[], 'Popular local cafe and bakery chain in Tromsø.', 'PUBLISHED'),
    ('oslo', 'Nordvegan', 'CASUAL', '{"Vegan"}'::text[], 'Sustainable and healthy plant-based cuisine.', 'PUBLISHED'),
    ('oslo', 'Funky Fresh Foods', 'CAFE', '{"Vegan"}'::text[], 'Vibrant vegan cafe focusing on organic and raw foods.', 'PUBLISHED'),
    ('stavanger', 'Sabi Sushi', 'CASUAL', '{"Japanese", "Seafood"}'::text[], 'High-quality sushi chain originating from Stavanger.', 'PUBLISHED'),
    ('stavanger', 'Bølgen & Moi', 'CASUAL', '{"Norwegian", "Brasserie"}'::text[], 'Vibrant brasserie combining great food with modern art.', 'PUBLISHED'),
    ('bergen', 'Kveik', 'PUB', '{"Craft Beer"}'::text[], 'Specialty pub focusing on Norwegian farmhouse ales.', 'PUBLISHED'),
    ('bergen', 'Henrik Øl og Vinstove', 'PUB', '{"Craft Beer"}'::text[], 'A legendary beer bar with an extensive selection of taps.', 'PUBLISHED'),
    ('oslo', 'Schouskjelleren', 'PUB', '{"Craft Beer"}'::text[], 'Atmospheric microbrewery located in a historic cellar.', 'PUBLISHED'),
    ('oslo', 'Crow Bar & Brewery', 'PUB', '{"Craft Beer", "Street Food"}'::text[], 'Large brewpub in Oslo serving excellent beer and kebab.', 'PUBLISHED'),
    ('oslo', 'Smalhans', 'CASUAL', '{"Norwegian", "New Nordic"}'::text[], 'Relaxed neighborhood restaurant serving excellent value Nordic cuisine.', 'PUBLISHED'),
    ('oslo', 'Statholdergaarden', 'FINE_DINING', '{"Norwegian", "Classic"}'::text[], 'A culinary institution in Oslo, holding a Michelin star since 1998.', 'PUBLISHED'),
    ('oslo', 'Arakataka', 'CASUAL', '{"New Nordic"}'::text[], 'High-quality gourmet food at an accessible price point.', 'PUBLISHED'),
    ('oslo', 'Rest', 'FINE_DINING', '{"New Nordic", "Sustainable"}'::text[], 'Michelin-starred fine dining focusing on minimizing food waste.', 'PUBLISHED')
) AS new_rest(slug, name, type, cuisine, description, status)
LEFT JOIN public.locations loc ON loc.slug = new_rest.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.restaurants AS rest WHERE rest.name = new_rest.name
);
