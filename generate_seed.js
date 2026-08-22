const fs = require('fs');

const mockProducts = [
  { id: '1', name: 'Nordic Eco-Stat Thermostat', category: 'Smart Home', price: 2490, co2: -45.5, img: '/images/product_thermostat.jpg', rating: 4.8 },
  { id: '2', name: 'Zaptec Go EV Charger', category: 'EV Accessories', price: 6990, co2: -120.0, img: '/images/product_charger.jpg', rating: 4.9 },
  { id: '3', name: 'Fjord 40L Recycled Backpack', category: 'Outdoor Gear', price: 1290, co2: -12.5, img: 'https://picsum.photos/id/10/500/500', rating: 4.5 },
  { id: '4', name: 'Aura Solar Pathway Lights', category: 'Smart Home', price: 890, co2: -8.0, img: 'https://picsum.photos/id/11/500/500', rating: 4.2 },
  { id: '5', name: 'Voss Reusable Water Bottle', category: 'Lifestyle', price: 349, co2: -2.1, img: 'https://picsum.photos/id/12/500/500', rating: 4.7 },
  { id: '6', name: 'Smart Grid Energy Monitor', category: 'Smart Home', price: 1190, co2: -35.0, img: 'https://picsum.photos/id/13/500/500', rating: 4.4 },
  { id: '7', name: 'Oslo Winter Shell Jacket', category: 'Outdoor Gear', price: 4500, co2: -15.0, img: 'https://picsum.photos/id/14/500/500', rating: 4.9 },
  { id: '8', name: 'Easee Home EV Charger', category: 'EV Accessories', price: 7200, co2: -115.0, img: 'https://picsum.photos/id/15/500/500', rating: 4.8 },
  { id: '9', name: 'Eco-Wool Base Layer', category: 'Outdoor Gear', price: 890, co2: -5.5, img: 'https://picsum.photos/id/16/500/500', rating: 4.6 },
  { id: '10', name: 'Mill Wi-Fi Panel Heater', category: 'Smart Home', price: 1890, co2: -22.0, img: 'https://picsum.photos/id/17/500/500', rating: 4.5 },
  { id: '11', name: 'Barents Sea Kayak (Recycled)', category: 'Outdoor Gear', price: 12500, co2: -80.0, img: 'https://picsum.photos/id/18/500/500', rating: 4.9 },
  { id: '12', name: 'Smart Blinds Controller', category: 'Smart Home', price: 1450, co2: -18.5, img: 'https://picsum.photos/id/19/500/500', rating: 4.3 },
  { id: '13', name: 'EV Charging Cable Type 2', category: 'EV Accessories', price: 1990, co2: -8.0, img: 'https://picsum.photos/id/20/500/500', rating: 4.7 },
  { id: '14', name: 'Tromsø Hiking Boots', category: 'Outdoor Gear', price: 2890, co2: -14.0, img: 'https://picsum.photos/id/21/500/500', rating: 4.8 },
  { id: '15', name: 'Airify Smart Air Purifier', category: 'Smart Home', price: 3490, co2: -28.0, img: 'https://picsum.photos/id/22/500/500', rating: 4.6 },
  { id: '16', name: 'Lofoten Tent (Eco-Nylon)', category: 'Outdoor Gear', price: 5490, co2: -25.0, img: 'https://picsum.photos/id/23/500/500', rating: 4.9 },
  { id: '17', name: 'Smart Plant Moisture Sensor', category: 'Smart Home', price: 399, co2: -1.5, img: 'https://picsum.photos/id/24/500/500', rating: 4.1 },
  { id: '18', name: 'Polar Sleeping Bag', category: 'Outdoor Gear', price: 3200, co2: -19.0, img: 'https://picsum.photos/id/25/500/500', rating: 4.7 },
  { id: '19', name: 'EV Home Battery Storage', category: 'EV Accessories', price: 45000, co2: -800.0, img: 'https://picsum.photos/id/26/500/500', rating: 5.0 },
  { id: '20', name: 'Bamboo Utensil Travel Set', category: 'Lifestyle', price: 199, co2: -3.0, img: 'https://picsum.photos/id/27/500/500', rating: 4.5 },
  { id: '21', name: 'Svalbard Extreme Expedition Parka', category: 'Outdoor Gear', price: 8900, co2: -30.0, img: 'https://picsum.photos/id/28/500/500', rating: 4.9 },
  { id: '22', name: 'Bergen Eco-Raincoat', category: 'Outdoor Gear', price: 2100, co2: -10.0, img: 'https://picsum.photos/id/29/500/500', rating: 4.8 },
  { id: '23', name: 'Lofoten Seaweed Skincare Set', category: 'Lifestyle', price: 650, co2: -5.0, img: 'https://picsum.photos/id/30/500/500', rating: 4.7 }
];

let sql = '-- Seed Products\nINSERT INTO public.products (id, name, category, price, co2, img, rating) VALUES\n';
sql += mockProducts.map(p => `  (gen_random_uuid(), '${p.name.replace(/'/g, "''")}', '${p.category}', ${p.price}, ${p.co2}, '${p.img}', ${p.rating})`).join(',\n');
sql += ';\n';

fs.appendFileSync('supabase/seed.sql', sql);
console.log('Appended to seed.sql');
