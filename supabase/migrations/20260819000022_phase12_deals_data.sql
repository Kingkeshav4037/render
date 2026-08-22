-- Phase 12: Deals Data Expansion

INSERT INTO public.deals (id, name, description, price, original_price, discount_percentage, valid_until, image_url, featured, status)
SELECT
  gen_random_uuid(),
  new_deal.name,
  new_deal.description,
  new_deal.price,
  new_deal.original,
  new_deal.discount,
  new_deal.valid::timestamp with time zone,
  new_deal.img,
  true,
  'PUBLISHED'::public.content_status
FROM (
  VALUES
    ('Norway in a Nutshell: Winter Edition', 'Experience the magic of winter in the fjords with this comprehensive tour package, including train and ferry travel.', 2100, 2500, 16, '2027-03-31 23:59:59Z', 'https://example.com/images/deals/nutshell-winter.jpg'),
    ('Tromsø Northern Lights Cruise', 'Sail out into the dark Arctic waters to hunt for the Aurora away from city light pollution. Includes hot meal.', 850, 1100, 22, '2027-03-15 23:59:59Z', 'https://example.com/images/deals/aurora-cruise.jpg'),
    ('Oslo Pass - 48 Hours', 'Get free entry to over 30 museums, free public transport, and discounts on sightseeing in Oslo.', 650, 750, 13, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/oslo-pass.jpg'),
    ('Svalbard Polar Bear Safari (Editorial Promo)', 'Join an expert-led snowmobile safari in Svalbard. Note: This is an editorial seeded example.', 3200, 4000, 20, '2027-04-30 23:59:59Z', 'https://example.com/images/deals/polar-safari.jpg'),
    ('Bergen Card - 72 Hours', 'Your practical and reasonable ticket to Bergen, the city between the seven mountains.', 420, 500, 16, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/bergen-card.jpg'),
    ('Geirangerfjord RIB Boat Tour', 'Get close to the famous waterfalls ''The Seven Sisters'' and ''The Suitor'' on a fast RIB boat.', 590, 750, 21, '2027-09-30 23:59:59Z', 'https://example.com/images/deals/geiranger-rib.jpg'),
    ('Lofoten Surfing Weekend Package', 'A full weekend of Arctic surfing in Unstad, including gear rental, instruction, and beachfront cabin stay.', 3500, 4500, 22, '2027-10-31 23:59:59Z', 'https://example.com/images/deals/lofoten-surf.jpg'),
    ('Flåm Railway & Zipline Combo', 'Take the world''s most beautiful train ride, then ride Scandinavia''s longest zipline down the valley.', 950, 1150, 17, '2027-09-15 23:59:59Z', 'https://example.com/images/deals/flam-zipline.jpg'),
    ('Hardangerfjord Cider Tasting Tour', 'Cruise the Hardangerfjord and visit award-winning cider farms. Includes tastings and local lunch.', 1200, 1400, 14, '2027-08-31 23:59:59Z', 'https://example.com/images/deals/hardanger-cider.jpg'),
    ('Vy Train Pass: 7 Days (Editorial Example)', 'Unlimited train travel across Norway for one week. Seeded editorial deal.', 2900, 3500, 17, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/vy-pass.jpg'),
    ('Hurtigruten Coastal Voyage (Port-to-Port)', 'Special offer on short voyages between Trondheim and Tromsø. Includes a cabin and breakfast.', 4500, 6000, 25, '2027-11-30 23:59:59Z', 'https://example.com/images/deals/hurtigruten-short.jpg'),
    ('Preikestolen Guided Sunrise Hike', 'Beat the crowds with a guided night hike to see the sunrise over the Lysefjord from Pulpit Rock.', 790, 990, 20, '2027-08-31 23:59:59Z', 'https://example.com/images/deals/sunrise-hike.jpg'),
    ('Dog Sledding in Alta', 'A half-day dog sledding adventure in the snowy forests of Alta. Drive your own team!', 1600, 1900, 15, '2027-04-15 23:59:59Z', 'https://example.com/images/deals/dogsledding.jpg'),
    ('Fjord Sauna & Cold Plunge Pass', '10-punch card for floating saunas in the Oslofjord. Perfect for winter wellness.', 1500, 2000, 25, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/oslo-sauna.jpg'),
    ('Stavanger Museum Multi-Pass', 'Access to MUST (Museum Stavanger) including the Norwegian Petroleum Museum and Canning Museum.', 300, 450, 33, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/stavanger-museum.jpg'),
    ('Jotunheimen Glacier Walk', 'Guided glacier hike on Nigardsbreen. Ice axes, crampons, and ropes included.', 650, 800, 18, '2027-09-15 23:59:59Z', 'https://example.com/images/deals/glacier-walk.jpg'),
    ('Trolltunga Via Ferrata (Editorial Deal)', 'Climb the Tyssedal Via Ferrata up to Trolltunga instead of hiking the trail. (Editorial seeded example).', 1300, 1500, 13, '2027-09-01 23:59:59Z', 'https://example.com/images/deals/trolltunga-ferrata.jpg'),
    ('Arctic Whale Safari - Andenes', 'Year-round whale watching with a 100% whale guarantee. See sperm whales, orcas, and humpbacks.', 1100, 1300, 15, '2027-12-31 23:59:59Z', 'https://example.com/images/deals/whale-safari.jpg'),
    ('Trondheim Nidaros Cathedral Tower Tour', 'Skip-the-line ticket to climb the tower of Norway''s national sanctuary.', 120, 150, 20, '2027-10-31 23:59:59Z', 'https://example.com/images/deals/nidaros-tower.jpg'),
    ('Kautokeino Sami Cultural Experience', 'Spend a day with a Sami family, feed reindeer, and enjoy a traditional Bidos meal.', 1400, 1750, 20, '2027-03-31 23:59:59Z', 'https://example.com/images/deals/sami-experience.jpg')
) AS new_deal(name, description, price, original, discount, valid, img)
WHERE NOT EXISTS (
  SELECT 1 FROM public.deals d WHERE d.name = new_deal.name
);
