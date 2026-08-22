const fs = require('fs');
const path = require('path');

const deals = [
  { name: 'Norway in a Nutshell: Winter Edition', desc: "Experience the magic of winter in the fjords with this comprehensive tour package, including train and ferry travel.", price: 2100, original: 2500, discount: 16, valid: '2027-03-31', img: 'https://example.com/images/deals/nutshell-winter.jpg' },
  { name: 'Tromsø Northern Lights Cruise', desc: "Sail out into the dark Arctic waters to hunt for the Aurora away from city light pollution. Includes hot meal.", price: 850, original: 1100, discount: 22, valid: '2027-03-15', img: 'https://example.com/images/deals/aurora-cruise.jpg' },
  { name: 'Oslo Pass - 48 Hours', desc: "Get free entry to over 30 museums, free public transport, and discounts on sightseeing in Oslo.", price: 650, original: 750, discount: 13, valid: '2027-12-31', img: 'https://example.com/images/deals/oslo-pass.jpg' },
  { name: 'Svalbard Polar Bear Safari (Editorial Promo)', desc: "Join an expert-led snowmobile safari in Svalbard. Note: This is an editorial seeded example.", price: 3200, original: 4000, discount: 20, valid: '2027-04-30', img: 'https://example.com/images/deals/polar-safari.jpg' },
  { name: 'Bergen Card - 72 Hours', desc: "Your practical and reasonable ticket to Bergen, the city between the seven mountains.", price: 420, original: 500, discount: 16, valid: '2027-12-31', img: 'https://example.com/images/deals/bergen-card.jpg' },
  { name: 'Geirangerfjord RIB Boat Tour', desc: "Get close to the famous waterfalls 'The Seven Sisters' and 'The Suitor' on a fast RIB boat.", price: 590, original: 750, discount: 21, valid: '2027-09-30', img: 'https://example.com/images/deals/geiranger-rib.jpg' },
  { name: 'Lofoten Surfing Weekend Package', desc: "A full weekend of Arctic surfing in Unstad, including gear rental, instruction, and beachfront cabin stay.", price: 3500, original: 4500, discount: 22, valid: '2027-10-31', img: 'https://example.com/images/deals/lofoten-surf.jpg' },
  { name: 'Flåm Railway & Zipline Combo', desc: "Take the world's most beautiful train ride, then ride Scandinavia's longest zipline down the valley.", price: 950, original: 1150, discount: 17, valid: '2027-09-15', img: 'https://example.com/images/deals/flam-zipline.jpg' },
  { name: 'Hardangerfjord Cider Tasting Tour', desc: "Cruise the Hardangerfjord and visit award-winning cider farms. Includes tastings and local lunch.", price: 1200, original: 1400, discount: 14, valid: '2027-08-31', img: 'https://example.com/images/deals/hardanger-cider.jpg' },
  { name: 'Vy Train Pass: 7 Days (Editorial Example)', desc: "Unlimited train travel across Norway for one week. Seeded editorial deal.", price: 2900, original: 3500, discount: 17, valid: '2027-12-31', img: 'https://example.com/images/deals/vy-pass.jpg' },
  { name: 'Hurtigruten Coastal Voyage (Port-to-Port)', desc: "Special offer on short voyages between Trondheim and Tromsø. Includes a cabin and breakfast.", price: 4500, original: 6000, discount: 25, valid: '2027-11-30', img: 'https://example.com/images/deals/hurtigruten-short.jpg' },
  { name: 'Preikestolen Guided Sunrise Hike', desc: "Beat the crowds with a guided night hike to see the sunrise over the Lysefjord from Pulpit Rock.", price: 790, original: 990, discount: 20, valid: '2027-08-31', img: 'https://example.com/images/deals/sunrise-hike.jpg' },
  { name: 'Dog Sledding in Alta', desc: "A half-day dog sledding adventure in the snowy forests of Alta. Drive your own team!", price: 1600, original: 1900, discount: 15, valid: '2027-04-15', img: 'https://example.com/images/deals/dogsledding.jpg' },
  { name: 'Fjord Sauna & Cold Plunge Pass', desc: "10-punch card for floating saunas in the Oslofjord. Perfect for winter wellness.", price: 1500, original: 2000, discount: 25, valid: '2027-12-31', img: 'https://example.com/images/deals/oslo-sauna.jpg' },
  { name: 'Stavanger Museum Multi-Pass', desc: "Access to MUST (Museum Stavanger) including the Norwegian Petroleum Museum and Canning Museum.", price: 300, original: 450, discount: 33, valid: '2027-12-31', img: 'https://example.com/images/deals/stavanger-museum.jpg' },
  { name: 'Jotunheimen Glacier Walk', desc: "Guided glacier hike on Nigardsbreen. Ice axes, crampons, and ropes included.", price: 650, original: 800, discount: 18, valid: '2027-09-15', img: 'https://example.com/images/deals/glacier-walk.jpg' },
  { name: 'Trolltunga Via Ferrata (Editorial Deal)', desc: "Climb the Tyssedal Via Ferrata up to Trolltunga instead of hiking the trail. (Editorial seeded example).", price: 1300, original: 1500, discount: 13, valid: '2027-09-01', img: 'https://example.com/images/deals/trolltunga-ferrata.jpg' },
  { name: 'Arctic Whale Safari - Andenes', desc: "Year-round whale watching with a 100% whale guarantee. See sperm whales, orcas, and humpbacks.", price: 1100, original: 1300, discount: 15, valid: '2027-12-31', img: 'https://example.com/images/deals/whale-safari.jpg' },
  { name: 'Trondheim Nidaros Cathedral Tower Tour', desc: "Skip-the-line ticket to climb the tower of Norway's national sanctuary.", price: 120, original: 150, discount: 20, valid: '2027-10-31', img: 'https://example.com/images/deals/nidaros-tower.jpg' },
  { name: 'Kautokeino Sami Cultural Experience', desc: "Spend a day with a Sami family, feed reindeer, and enjoy a traditional Bidos meal.", price: 1400, original: 1750, discount: 20, valid: '2027-03-31', img: 'https://example.com/images/deals/sami-experience.jpg' }
];

let sql = `-- Phase 12: Deals Data Expansion

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
`;

sql += deals.map(d => `    ('${d.name.replace(/'/g, "''")}', '${d.desc.replace(/'/g, "''")}', ${d.price}, ${d.original}, ${d.discount}, '${d.valid} 23:59:59Z', '${d.img}')`).join(',\n');

sql += `
) AS new_deal(name, description, price, original, discount, valid, img)
WHERE NOT EXISTS (
  SELECT 1 FROM public.deals d WHERE d.name = new_deal.name
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000022_phase12_deals_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Deals migration generated at ' + outPath);
