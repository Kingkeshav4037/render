import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runFixes() {
  console.log('Starting data cleanup and seeding...');

  // 1. Fetch locations to map slug -> id
  const { data: locations, error: locError } = await supabase.from('locations').select('id, slug');
  if (locError) {
    console.error('Error fetching locations:', locError);
    return;
  }
  
  const locMap: Record<string, string> = {};
  locations.forEach(l => { locMap[l.slug] = l.id; });

  // 2. Insert Activities
  const activities = [
    { slug: 'tromso', name: 'Fjord & Wildlife Cruise', type: 'WILDLIFE', description: 'Experience the stunning fjords and arctic wildlife from a hybrid-electric catamaran.', duration_minutes: 300, difficulty_level: 'EASY', price: 1400, currency: 'NOK', equipment_needed: ['Warm layers'], featured: true, status: 'PUBLISHED', tags: ['Wildlife', 'Fjords', 'Boat'] },
    { slug: 'tromso', name: 'Northern Lights Dog Sledding', type: 'ADVENTURE', description: 'Drive your own team of huskies under the Aurora Borealis in the Arctic wilderness.', duration_minutes: 240, difficulty_level: 'MODERATE', price: 2100, currency: 'NOK', equipment_needed: ['Thermal suit provided'], featured: true, status: 'PUBLISHED', tags: ['Aurora', 'Dogs', 'Winter'] },
    { slug: 'tromso', name: 'Arctic Snowmobile Safari', type: 'ADVENTURE', description: 'High-speed adventure across the Lyngen Alps snowscapes.', duration_minutes: 270, difficulty_level: 'MODERATE', price: 1950, currency: 'NOK', equipment_needed: ['Driver License'], featured: false, status: 'PUBLISHED', tags: ['Snow', 'Action'] },
    { slug: 'tromso', name: 'Sami Culture & Reindeer Experience', type: 'CULTURE', description: 'Feed the reindeer and listen to ancient Sami storytelling in a traditional lavvu.', duration_minutes: 240, difficulty_level: 'EASY', price: 1500, currency: 'NOK', equipment_needed: ['Warm clothing'], featured: false, status: 'PUBLISHED', tags: ['Culture', 'Animals'] },
    { slug: 'bergen', name: 'Fjord Safari to Mostraumen', type: 'SIGHTSEEING', description: 'A high-speed RIB boat tour through narrow, steep-sided fjords near Bergen.', duration_minutes: 180, difficulty_level: 'EASY', price: 1100, currency: 'NOK', equipment_needed: ['Warm layers'], featured: true, status: 'PUBLISHED', tags: ['Fjords', 'Boat', 'Nature'] },
    { slug: 'bergen', name: 'Mt. Ulriken Zipline', type: 'ADVENTURE', description: 'Soar through the air high above Bergen on Norway fastest zipline.', duration_minutes: 60, difficulty_level: 'MODERATE', price: 450, currency: 'NOK', equipment_needed: ['Comfortable clothes'], featured: false, status: 'PUBLISHED', tags: ['Action', 'Views'] },
    { slug: 'bergen', name: 'Bryggen Historical Walk', type: 'CULTURE', description: 'Guided walking tour through the UNESCO World Heritage Hanseatic wharf.', duration_minutes: 90, difficulty_level: 'EASY', price: 350, currency: 'NOK', equipment_needed: ['Walking shoes'], featured: false, status: 'PUBLISHED', tags: ['History', 'City'] },
    { slug: 'geirangerfjord', name: 'Geirangerfjord Kayak Tour', type: 'WATER_SPORTS', description: 'Paddle close to the famous Seven Sisters waterfall in a sea kayak.', duration_minutes: 180, difficulty_level: 'MODERATE', price: 1200, currency: 'NOK', equipment_needed: ['Waterproof gear'], featured: true, status: 'PUBLISHED', tags: ['Fjords', 'Kayak', 'Nature'] },
    { slug: 'geirangerfjord', name: 'Rib Boat Safari', type: 'ADVENTURE', description: 'Fast-paced nature safari on the Geirangerfjord.', duration_minutes: 90, difficulty_level: 'EASY', price: 950, currency: 'NOK', equipment_needed: ['Warm clothes'], featured: false, status: 'PUBLISHED', tags: ['Action', 'Fjords'] },
    { slug: 'lofoten', name: 'Midnight Sun Surfing', type: 'WATER_SPORTS', description: 'Surfing lessons in the Arctic Ocean under the midnight sun at Unstad beach.', duration_minutes: 240, difficulty_level: 'HARD', price: 1500, currency: 'NOK', equipment_needed: ['Swimwear'], featured: true, status: 'PUBLISHED', tags: ['Surf', 'Arctic', 'Summer'] },
    { slug: 'lofoten', name: 'Sea Eagle Safari', type: 'WILDLIFE', description: 'RIB boat tour to Trollfjord to witness giant sea eagles diving for fish.', duration_minutes: 120, difficulty_level: 'EASY', price: 1050, currency: 'NOK', equipment_needed: ['Warm clothing'], featured: true, status: 'PUBLISHED', tags: ['Wildlife', 'Boat'] },
    { slug: 'lofoten', name: 'Reinebringen Guided Hike', type: 'HIKING', description: 'Guided hike up the famous Reinebringen steps for the iconic Lofoten view.', duration_minutes: 180, difficulty_level: 'HARD', price: 800, currency: 'NOK', equipment_needed: ['Hiking boots', 'Water'], featured: false, status: 'PUBLISHED', tags: ['Hiking', 'Views'] },
    { slug: 'lofoten', name: 'Arctic Cod Fishing', type: 'CULTURE', description: 'Traditional Lofoten fishing experience on a historic vessel.', duration_minutes: 240, difficulty_level: 'MODERATE', price: 1200, currency: 'NOK', equipment_needed: ['Warm layers'], featured: false, status: 'PUBLISHED', tags: ['Fishing', 'Culture'] },
    { slug: 'oslo', name: 'Oslo Fjord Sauna', type: 'CULTURE', description: 'Floating sauna session followed by a refreshing dip in the Oslo Fjord.', duration_minutes: 120, difficulty_level: 'EASY', price: 250, currency: 'NOK', equipment_needed: ['Swimwear', 'Towel'], featured: true, status: 'PUBLISHED', tags: ['Sauna', 'City', 'Wellness'] },
    { slug: 'oslo', name: 'Vigeland Park Segway Tour', type: 'SIGHTSEEING', description: 'Glide through the world largest sculpture park by a single artist.', duration_minutes: 120, difficulty_level: 'EASY', price: 600, currency: 'NOK', equipment_needed: ['Comfortable shoes'], featured: false, status: 'PUBLISHED', tags: ['City', 'Art'] },
    { slug: 'oslo', name: 'Nordmarka Cross-Country Skiing', type: 'SKIING', description: 'Guided cross-country skiing in the forests surrounding Oslo.', duration_minutes: 180, difficulty_level: 'MODERATE', price: 850, currency: 'NOK', equipment_needed: ['Winter sports gear'], featured: false, status: 'PUBLISHED', tags: ['Skiing', 'Winter'] },
    { slug: 'oslo', name: 'Munch Museum Art Tour', type: 'CULTURE', description: 'In-depth guided tour focusing on Edvard Munch life and work.', duration_minutes: 90, difficulty_level: 'EASY', price: 450, currency: 'NOK', equipment_needed: ['None'], featured: false, status: 'PUBLISHED', tags: ['Art', 'Museum'] },
    { slug: 'stavanger', name: 'Pulpit Rock Sunrise Hike', type: 'HIKING', description: 'Beat the crowds with an early morning guided hike to Preikestolen.', duration_minutes: 360, difficulty_level: 'MODERATE', price: 1300, currency: 'NOK', equipment_needed: ['Hiking boots', 'Headlamp', 'Water'], featured: true, status: 'PUBLISHED', tags: ['Hiking', 'Views', 'Sunrise'] },
    { slug: 'stavanger', name: 'Lysefjord Cruise', type: 'SIGHTSEEING', description: 'Electric boat cruise deep into the Lysefjord, passing under Pulpit Rock.', duration_minutes: 180, difficulty_level: 'EASY', price: 850, currency: 'NOK', equipment_needed: ['Windproof jacket'], featured: false, status: 'PUBLISHED', tags: ['Fjords', 'Boat'] },
    { slug: 'stavanger', name: 'NuArt Street Art Walk', type: 'CULTURE', description: 'Guided walking tour of Stavanger famous international street art.', duration_minutes: 90, difficulty_level: 'EASY', price: 300, currency: 'NOK', equipment_needed: ['Walking shoes'], featured: false, status: 'PUBLISHED', tags: ['Art', 'City'] },
    { slug: 'flam', name: 'Flåm Railway & Cycling', type: 'ADVENTURE', description: 'Take the train up the mountain and cycle back down the spectacular Rallarvegen.', duration_minutes: 300, difficulty_level: 'MODERATE', price: 1600, currency: 'NOK', equipment_needed: ['Activewear', 'Windproof jacket'], featured: true, status: 'PUBLISHED', tags: ['Train', 'Cycling', 'Nature'] },
    { slug: 'flam', name: 'Nærøyfjord RIB Safari', type: 'SIGHTSEEING', description: 'Explore the narrowest and most spectacular branch of the Sognefjord.', duration_minutes: 120, difficulty_level: 'EASY', price: 950, currency: 'NOK', equipment_needed: ['Warm layers'], featured: false, status: 'PUBLISHED', tags: ['Fjords', 'UNESCO', 'Boat'] },
    { slug: 'flam', name: 'Stegastein Viewpoint Tour', type: 'SIGHTSEEING', description: 'Bus tour to the spectacular platform jutting 30 meters out over the Aurlandsfjord.', duration_minutes: 90, difficulty_level: 'EASY', price: 400, currency: 'NOK', equipment_needed: ['Camera'], featured: false, status: 'PUBLISHED', tags: ['Views', 'Nature'] },
    { slug: 'trondheim', name: 'Nidaros Cathedral Tower Climb', type: 'CULTURE', description: 'Climb the dark, narrow stairs to the top of the cathedral for city views.', duration_minutes: 60, difficulty_level: 'MODERATE', price: 250, currency: 'NOK', equipment_needed: ['Comfortable shoes'], featured: true, status: 'PUBLISHED', tags: ['History', 'Views'] },
    { slug: 'trondheim', name: 'Nidelva Urban Kayaking', type: 'WATER_SPORTS', description: 'Paddle through the heart of Trondheim along the historic colorful wharves.', duration_minutes: 120, difficulty_level: 'EASY', price: 750, currency: 'NOK', equipment_needed: ['Change of clothes'], featured: false, status: 'PUBLISHED', tags: ['Kayak', 'City'] },
    { slug: 'trondheim', name: 'Bymarka Foraging Walk', type: 'NATURE', description: 'Learn to find and identify edible wild plants, berries, and mushrooms.', duration_minutes: 180, difficulty_level: 'EASY', price: 600, currency: 'NOK', equipment_needed: ['Hiking shoes', 'Basket'], featured: false, status: 'PUBLISHED', tags: ['Nature', 'Food'] },
    { slug: 'svalbard', name: 'Glacier Ice Cave Exploration', type: 'ADVENTURE', description: 'Hike into a meltwater channel inside an ancient glacier.', duration_minutes: 240, difficulty_level: 'HARD', price: 1400, currency: 'NOK', equipment_needed: ['Winter gear', 'Sturdy boots'], featured: true, status: 'PUBLISHED', tags: ['Arctic', 'Ice', 'Winter'] },
    { slug: 'svalbard', name: 'Walrus Boat Safari', type: 'WILDLIFE', description: 'Boat trip to Borebukta to observe walruses lounging on the ice.', duration_minutes: 300, difficulty_level: 'EASY', price: 2100, currency: 'NOK', equipment_needed: ['Warm clothing'], featured: false, status: 'PUBLISHED', tags: ['Wildlife', 'Boat', 'Arctic'] },
    { slug: 'svalbard', name: 'Arctic Wilderness Expedition', type: 'NATURE', description: 'Multi-day guided snowmobile and cabin expedition.', duration_minutes: 2880, difficulty_level: 'HARD', price: 12500, currency: 'NOK', equipment_needed: ['Extreme winter gear'], featured: false, status: 'PUBLISHED', tags: ['Expedition', 'Action'] },
    { slug: 'alesund', name: 'Art Nouveau City Walk', type: 'CULTURE', description: 'Guided tour of the town rebuilt in Jugendstil architecture after the 1904 fire.', duration_minutes: 90, difficulty_level: 'EASY', price: 350, currency: 'NOK', equipment_needed: ['Walking shoes'], featured: true, status: 'PUBLISHED', tags: ['History', 'Architecture'] }
  ];

  const mappedActivities = activities.map(a => {
    const { slug, ...rest } = a;
    return { ...rest, location_id: locMap[slug] };
  }).filter(a => a.location_id); // only insert if location exists

  // Fetch existing to avoid duplicates
  const { data: existingActivities } = await supabase.from('activities').select('name');
  const existingNames = new Set(existingActivities?.map(a => a.name) || []);
  const toInsert = mappedActivities.filter(a => !existingNames.has(a.name));

  if (toInsert.length > 0) {
    const { error: actError } = await supabase.from('activities').insert(toInsert);
    if (actError) console.error('Error inserting activities:', actError);
    else console.log(`✅ Inserted ${toInsert.length} activities`);
  } else {
    console.log(`✅ Activities already up to date`);
  }

  // 3. Fix missing images - Restaurants
  const restaurantFixes = [
    { type: 'FINE_DINING', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600' },
    { type: 'CASUAL', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600' },
    { type: 'CAFE', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1600' }
  ];

  for (const fix of restaurantFixes) {
    const { data: missingRes } = await supabase.from('restaurants').select('id').eq('type', fix.type).is('image_url', null);
    if (missingRes && missingRes.length > 0) {
      const { error } = await supabase.from('restaurants').update({ image_url: fix.image }).in('id', missingRes.map(r => r.id));
      if (!error) console.log(`✅ Fixed ${missingRes.length} ${fix.type} restaurants`);
    }
  }
  // Generic fallback for rest of restaurants
  const { data: missingResOthers } = await supabase.from('restaurants').select('id').is('image_url', null);
  if (missingResOthers && missingResOthers.length > 0) {
    await supabase.from('restaurants').update({ image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600' }).in('id', missingResOthers.map(r => r.id));
    console.log(`✅ Fixed ${missingResOthers.length} other restaurants`);
  }

  // 4. Fix missing images - Accommodations
  const accFixes = [
    { type: 'HOTEL', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600' },
    { type: 'CABIN', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600' }
  ];

  for (const fix of accFixes) {
    const { data: missingAcc } = await supabase.from('accommodations').select('id').eq('type', fix.type).is('image_url', null);
    if (missingAcc && missingAcc.length > 0) {
      const { error } = await supabase.from('accommodations').update({ image_url: fix.image }).in('id', missingAcc.map(r => r.id));
      if (!error) console.log(`✅ Fixed ${missingAcc.length} ${fix.type} accommodations`);
    }
  }
  // Generic fallback for rest of accommodations
  const { data: missingAccOthers } = await supabase.from('accommodations').select('id').is('image_url', null);
  if (missingAccOthers && missingAccOthers.length > 0) {
    await supabase.from('accommodations').update({ image_url: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1600' }).in('id', missingAccOthers.map(r => r.id));
    console.log(`✅ Fixed ${missingAccOthers.length} other accommodations`);
  }

  // 5. Fix Events (Images and Location IDs)
  const { data: allLocations } = await supabase.from('locations').select('id').eq('status', 'PUBLISHED');
  const validLocIds = allLocations?.map(l => l.id) || [];

  const { data: missingEvents } = await supabase.from('events').select('id, category, location_id');
  if (missingEvents && missingEvents.length > 0 && validLocIds.length > 0) {
    let updateCount = 0;
    for (const evt of missingEvents) {
      let updates: any = {};
      
      // Fix missing image
      let newImage = null;
      if (evt.category === 'FESTIVAL') newImage = 'https://images.unsplash.com/photo-1533174000273-e18fa440a340?q=80&w=1600';
      else if (evt.category === 'CONCERT') newImage = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600';
      else newImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600';
      updates.image_url = newImage;

      // Fix missing location_id
      if (!evt.location_id) {
        updates.location_id = validLocIds[Math.floor(Math.random() * validLocIds.length)];
      }

      await supabase.from('events').update(updates).eq('id', evt.id);
      updateCount++;
    }
    console.log(`✅ Fixed ${updateCount} events (images and locations)`);
  }

  console.log('Cleanup and seeding complete!');
}

runFixes();
