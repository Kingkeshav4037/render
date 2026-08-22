import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Mocks
import { mockTrending, mockFjords, mockMountains } from '../frontend/src/data/home/places';
import { mockWildlife } from '../frontend/src/data/home/wildlife';
import { mockFood } from '../frontend/src/data/home/food';
import { mockHotels, mockRestaurants, mockActivities, mockInfrastructure, mockProducts, mockDeals, mockEvents } from '../frontend/src/data/home/other_mocks';

// Load env
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function upsertLocations() {
  console.log('Seeding locations...');
  const allPlaces = [...mockTrending, ...mockFjords, ...mockMountains];
  
  for (const place of allPlaces) {
    const { error } = await supabase.from('locations').upsert({
      slug: place.slug,
      name: place.name,
      type: place.category.toUpperCase().replace(' ', '_'),
      short_description: place.description,
      description: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
      featured: true,
      status: 'PUBLISHED',
      gallery: [place.image]
    }, { onConflict: 'slug' });
    
    if (error) console.error(`Error inserting location ${place.slug}:`, error.message);
  }
}

async function upsertWildlife() {
  console.log('Seeding wildlife...');
  for (const animal of mockWildlife) {
    const { error } = await supabase.from('wildlife').upsert({
      slug: animal.slug,
      name: animal.name,
      scientific_name: animal.scientific_name,
      category: animal.category.toLowerCase(),
      description: animal.description,
      habitat: animal.habitat,
      best_viewing_season: animal.best_season,
      image: animal.image,
      featured: true,
      status: 'PUBLISHED'
    }, { onConflict: 'slug' });
    
    if (error) console.error(`Error inserting wildlife ${animal.slug}:`, error.message);
  }
}

async function upsertFoods() {
  console.log('Seeding foods...');
  for (const food of mockFood) {
    const { error } = await supabase.from('foods').upsert({
      slug: food.slug,
      name: food.name,
      category: food.category.toLowerCase().replace(' ', '_'),
      description: food.description,
      origin: food.origin_region,
      region: food.origin_region,
      image: food.image,
      featured: true,
      status: 'PUBLISHED'
    }, { onConflict: 'slug' });
    
    if (error) console.error(`Error inserting food ${food.slug}:`, error.message);
  }
}

async function upsertHotels() {
  console.log('Seeding hotels...');
  for (const hotel of mockHotels) {
    const { error } = await supabase.from('accommodations').upsert({
      slug: hotel.slug,
      name: hotel.name,
      type: 'HOTEL',
      city: hotel.city,
      region: hotel.region,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      price_range: hotel.price_indicator,
      images: [hotel.image],
      featured: true,
      published: true
    }, { onConflict: 'slug' }); // Requires slug to be UNIQUE. Which we added.
    
    if (error) console.error(`Error inserting hotel ${hotel.slug}:`, error.message);
  }
}

async function main() {
  console.log('Starting V5 database seed...');
  await upsertLocations();
  await upsertWildlife();
  await upsertFoods();
  await upsertHotels();
  console.log('V5 seed complete.');
}

main().catch(console.error);
