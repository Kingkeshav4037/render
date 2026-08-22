const fs = require('fs');
const path = require('path');

const events = [
  { slug: 'oslo-jazz-festival', name: 'Oslo Jazz Festival', cat: 'FESTIVAL', desc: "Annual jazz festival filling the streets and venues of Oslo.", start: '2027-08-15', end: '2027-08-22', price: 1200, lat: 59.9139, lng: 10.7522 },
  { slug: 'bergen-international-festival', name: 'Bergen International Festival', cat: 'FESTIVAL', desc: "The largest festival for music and performing arts in the Nordic region.", start: '2027-05-26', end: '2027-06-09', price: 900, lat: 60.3929, lng: 5.3220 },
  { slug: 'tromso-international-film-festival', name: 'Tromsø International Film Festival (TIFF)', cat: 'CULTURAL', desc: "Norway's largest film festival, taking place during the polar night.", start: '2027-01-18', end: '2027-01-24', price: 1500, lat: 69.6492, lng: 18.9553 },
  { slug: 'holmenkollen-ski-festival', name: 'Holmenkollen Ski Festival', cat: 'SPORTS', desc: "World Cup Nordic skiing events, drawing massive crowds for cross-country and ski jumping.", start: '2027-03-11', end: '2027-03-14', price: 400, lat: 59.9639, lng: 10.6672 },
  { slug: 'trondheim-food-festival', name: 'Trøndelag Food Festival', cat: 'FESTIVAL', desc: "A major culinary event celebrating local produce and Nordic cuisine in Trondheim.", start: '2027-08-05', end: '2027-08-07', price: 0, lat: 63.4305, lng: 10.3951 },
  { slug: 'gladmat-festival', name: 'Gladmat Festival', cat: 'FESTIVAL', desc: "Scandinavia's leading food festival, taking place in Stavanger.", start: '2027-06-30', end: '2027-07-03', price: 0, lat: 58.9699, lng: 5.7331 },
  { slug: 'bukta-festival', name: 'Bukta Open Air Festival', cat: 'FESTIVAL', desc: "Rock music festival in Tromsø, known for its midnight sun setting.", start: '2027-07-15', end: '2027-07-17', price: 2100, lat: 69.6492, lng: 18.9553 },
  { slug: 'oya-festival', name: 'Øyafestivalen', cat: 'FESTIVAL', desc: "Oslo's largest music festival, featuring international and Norwegian artists.", start: '2027-08-10', end: '2027-08-14', price: 3400, lat: 59.9139, lng: 10.7522 },
  { slug: 'northern-lights-festival', name: 'Northern Lights Festival', cat: 'FESTIVAL', desc: "A classical and contemporary music festival held in Tromsø.", start: '2027-01-28', end: '2027-02-06', price: 800, lat: 69.6492, lng: 18.9553 },
  { slug: 'peer-gynt-festival', name: 'Peer Gynt Festival', cat: 'CULTURAL', desc: "Celebrating Henrik Ibsen's famous play with outdoor performances in Gudbrandsdalen.", start: '2027-08-04', end: '2027-08-14', price: 600, lat: 61.3431, lng: 9.9839 },
  { slug: 'viking-festival-avaldsnes', name: 'Viking Festival at Avaldsnes', cat: 'CULTURAL', desc: "The largest Viking festival in Western Norway with re-enactments and markets.", start: '2027-06-10', end: '2027-06-13', price: 200, lat: 59.3564, lng: 5.2891 },
  { slug: 'st-olav-festival', name: 'St. Olav Festival', cat: 'CULTURAL', desc: "Norway's largest church and cultural festival in Trondheim.", start: '2027-07-28', end: '2027-08-03', price: 500, lat: 63.4305, lng: 10.3951 },
  { slug: 'birkelunden-flea-market', name: 'Birkelunden Flea Market', cat: 'CULTURAL', desc: "A classic Sunday market in the heart of Grünerløkka, Oslo.", start: '2027-05-02', end: '2027-05-02', price: 0, lat: 59.9265, lng: 10.7601 },
  { slug: 'oslo-marathon', name: 'Oslo Marathon', cat: 'SPORTS', desc: "An annual marathon running through the beautiful streets of the capital.", start: '2027-09-18', end: '2027-09-18', price: 950, lat: 59.9139, lng: 10.7522 },
  { slug: 'bergen-city-marathon', name: 'Bergen City Marathon', cat: 'SPORTS', desc: "A scenic marathon weaving through the historic neighborhoods of Bergen.", start: '2027-04-24', end: '2027-04-24', price: 850, lat: 60.3929, lng: 5.3220 },
  { slug: 'birkebeinerrennet', name: 'Birkebeinerrennet', cat: 'SPORTS', desc: "A historic cross-country ski marathon carrying a 3.5kg backpack.", start: '2027-03-20', end: '2027-03-20', price: 1400, lat: 61.1153, lng: 10.4662 },
  { slug: 'midnattsol-marathon', name: 'Midnight Sun Marathon', cat: 'SPORTS', desc: "Run a marathon in Tromsø under the glow of the midnight sun.", start: '2027-06-19', end: '2027-06-19', price: 900, lat: 69.6492, lng: 18.9553 },
  { slug: 'ekstremsportveko', name: 'Ekstremsportveko (Extreme Sports Week)', cat: 'SPORTS', desc: "The world's largest extreme sports festival, held in Voss.", start: '2027-06-27', end: '2027-07-04', price: 1900, lat: 60.6277, lng: 6.4258 },
  { slug: 'finnmarkslopet', name: 'Finnmarksløpet', cat: 'SPORTS', desc: "Europe's longest sled dog race starting in Alta.", start: '2027-03-12', end: '2027-03-19', price: 0, lat: 69.9689, lng: 23.2716 },
  { slug: 'rha-festival', name: 'Rørosmartnan', cat: 'SEASONAL', desc: "A historic winter fair in the UNESCO heritage town of Røros.", start: '2027-02-16', end: '2027-02-20', price: 0, lat: 62.5750, lng: 11.3833 },
  { slug: 'sami-week-tromso', name: 'Sami Week in Tromsø', cat: 'CULTURAL', desc: "Celebrating Sami National Day with reindeer racing and cultural events.", start: '2027-02-01', end: '2027-02-07', price: 0, lat: 69.6492, lng: 18.9553 },
  { slug: 'riddu-riddu', name: 'Riddu Riđđu', cat: 'FESTIVAL', desc: "An international indigenous festival in Kåfjord.", start: '2027-07-14', end: '2027-07-18', price: 1800, lat: 69.5312, lng: 20.5401 },
  { slug: 'oslo-pride', name: 'Oslo Pride', cat: 'FESTIVAL', desc: "Norway's largest celebration of queer love and diversity.", start: '2027-06-18', end: '2027-06-27', price: 0, lat: 59.9139, lng: 10.7522 },
  { slug: 'bergen-pride', name: 'Regnbuedagene (Bergen Pride)', cat: 'FESTIVAL', desc: "The second largest Pride festival in Norway.", start: '2027-06-03', end: '2027-06-10', price: 0, lat: 60.3929, lng: 5.3220 },
  { slug: 'icemusic-festival', name: 'Ice Music Festival', cat: 'SEASONAL', desc: "Unique music festival where instruments are made of ice, held in Geilo or Finse.", start: '2027-02-04', end: '2027-02-06', price: 500, lat: 60.5332, lng: 8.2091 },
  { slug: 'world-beard-championship', name: 'World Beard Day Celebration', cat: 'CULTURAL', desc: "A fun cultural gathering celebrating Nordic beards.", start: '2027-09-04', end: '2027-09-04', price: 0, lat: 59.9139, lng: 10.7522 },
  { slug: 'kongsberg-jazzfestival', name: 'Kongsberg Jazzfestival', cat: 'FESTIVAL', desc: "One of the oldest and most prominent jazz festivals in Europe.", start: '2027-07-07', end: '2027-07-10', price: 1300, lat: 59.6644, lng: 9.6108 },
  { slug: 'notodden-blues', name: 'Notodden Blues Festival', cat: 'FESTIVAL', desc: "The largest blues festival in Europe.", start: '2027-08-05', end: '2027-08-08', price: 1500, lat: 59.5594, lng: 9.2585 },
  { slug: 'canal-street-arendal', name: 'Canal Street', cat: 'FESTIVAL', desc: "Arendal's jazz and blues festival with unique seaside venues.", start: '2027-07-28', end: '2027-07-31', price: 1200, lat: 58.4615, lng: 8.7725 },
  { slug: 'palmesus', name: 'Palmesus', cat: 'FESTIVAL', desc: "Scandinavia's biggest beach party in Kristiansand.", start: '2027-07-02', end: '2027-07-03', price: 2500, lat: 58.1467, lng: 7.9956 }
];

let sql = `-- Phase 12: Events Data Expansion

INSERT INTO public.events (id, name, category, description, start_date, end_date, ticket_price, currency, status, lat, lng)
SELECT
  gen_random_uuid(),
  new_event.name,
  new_event.cat::public.event_category,
  new_event.description,
  new_event.start_date::timestamp with time zone,
  new_event.end_date::timestamp with time zone,
  new_event.price,
  'NOK',
  'PUBLISHED'::public.content_status,
  new_event.lat,
  new_event.lng
FROM (
  VALUES
`;

sql += events.map(e => `    ('${e.name.replace(/'/g, "''")}', '${e.cat}', '${e.desc.replace(/'/g, "''")}', '${e.start} 10:00:00Z', '${e.end} 23:59:00Z', ${e.price}, ${e.lat}, ${e.lng})`).join(',\n');

sql += `
) AS new_event(name, cat, description, start_date, end_date, price, lat, lng)
WHERE NOT EXISTS (
  SELECT 1 FROM public.events e WHERE e.name = new_event.name
);
`;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000021_phase12_events_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Events migration generated at ' + outPath);
