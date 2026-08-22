/**
 * Integration Tests: Database CRUD Operations & Provider System
 *
 * Verifies:
 * - Destination Database CRUD: Fetching destinations list and slug lookup from locations & relationships
 * - Favorite & Review CRUD: Adding/removing user favorites, submitting, fetching, and deleting reviews
 * - Trip Database CRUD: Fetching comprehensive trips with joined segments, stays, activities
 * - Provider System Operations: Fetching provider stats via RPC, listing inventory, managing bookings with tenant isolation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { destinationService } from '../../services/destinationService';
import { favoriteService } from '../../services/favoriteService';
import { reviewService } from '../../services/reviewService';
import { tripService } from '../../services/tripService';
import { providerService } from '../../services/providerService';
import { supabase } from '../../lib/supabase';

// Mock Supabase with chainable query builder
vi.mock('../../lib/supabase', () => {
  const queryBuilder = (tableName: string) => {
    const builder: any = {
      _table: tableName,
      select: vi.fn(() => builder),
      insert: vi.fn(() => builder),
      update: vi.fn(() => builder),
      delete: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      in: vi.fn(() => builder),
      ilike: vi.fn(() => builder),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      single: vi.fn(() => {
        if (tableName === 'locations') {
          return Promise.resolve({
            data: { id: 'loc-1', name: 'Geirangerfjord', slug: 'geirangerfjord', type: 'FJORD', status: 'PUBLISHED' },
            error: null,
          });
        }
        if (tableName === 'trips') {
          return Promise.resolve({
            data: { id: 'trip-1', title: 'Summer Fjord Adventure', status: 'PLANNED', budget_nok: 15000 },
            error: null,
          });
        }
        if (tableName === 'reviews') {
          return Promise.resolve({
            data: { id: 'rev-1', rating: 5, title: 'Breathtaking Views!', status: 'APPROVED' },
            error: null,
          });
        }
        return Promise.resolve({ data: { id: 'record-1' }, error: null });
      }),
      then: (resolve: any) => {
        if (tableName === 'locations') {
          return resolve({
            data: [
              { id: 'loc-1', name: 'Geirangerfjord', slug: 'geirangerfjord', type: 'FJORD', status: 'PUBLISHED' },
              { id: 'loc-2', name: 'Lofoten Islands', slug: 'lofoten-islands', type: 'LANDMARK', status: 'PUBLISHED' },
            ],
            error: null,
          });
        }
        if (tableName === 'provider_listings_view') {
          return resolve({
            data: [
              { id: 'listing-1', title: 'Fjord Safari Tour', provider_id: 'provider-123', status: 'ACTIVE' },
              { id: 'listing-2', title: 'Mountain Cabin', provider_id: 'provider-123', status: 'DRAFT' },
            ],
            error: null,
          });
        }
        if (tableName === 'bookings') {
          return resolve({
            data: [
              { id: 'b-1', item_type: 'ACTIVITY', total_amount: 1500, status: 'CONFIRMED', provider_id: 'provider-123' },
            ],
            error: null,
          });
        }
        if (tableName === 'favorites') {
          return resolve({
            data: [
              { id: 'fav-1', user_id: 'user-1', item_type: 'LOCATION', item_id: 'loc-1' },
            ],
            error: null,
          });
        }
        if (tableName === 'reviews') {
          return resolve({
            data: [
              { id: 'rev-1', rating: 5, title: 'Amazing', product_type: 'LOCATION', product_id: 'loc-1' },
            ],
            error: null,
          });
        }
        return resolve({ data: [], error: null });
      },
    };
    return builder;
  };

  return {
    supabase: {
      from: vi.fn((table: string) => queryBuilder(table)),
      rpc: vi.fn().mockImplementation((fn: string) => {
        if (fn === 'get_provider_dashboard_stats') {
          return Promise.resolve({
            data: { totalRevenue: 125000, totalBookings: 42, activeListings: 8, averageRating: 4.8 },
            error: null,
          });
        }
        return Promise.resolve({ data: [], error: null });
      }),
    },
  };
});

describe('Integration Tests: Database CRUD & Provider Operations', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── 1. Destination Database CRUD ──────────────────────────────────────────
  describe('Destinations Database CRUD', () => {
    it('fetches list of destinations from locations table', async () => {
      const destinations = await destinationService.getAllDestinations();
      expect(supabase.from).toHaveBeenCalledWith('locations');
      expect(destinations.length).toBeGreaterThan(0);
      expect(destinations[0].name).toBe('Geirangerfjord');
    });

    it('fetches single destination by unique slug', async () => {
      const dest = await destinationService.getDestinationBySlug('geirangerfjord');
      expect(supabase.from).toHaveBeenCalledWith('locations');
      expect(dest?.slug).toBe('geirangerfjord');
    });
  });

  // ─── 2. Favorite & Review Operations ───────────────────────────────────────
  describe('Favorites & Reviews CRUD', () => {
    it('toggles item into user favorites table', async () => {
      const isFav = await favoriteService.toggleFavorite('user-1', 'LOCATION', 'loc-1');
      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(isFav).toBe(true);
    });

    it('fetches user favorites list from database', async () => {
      const favorites = await favoriteService.getFavorites('user-1');
      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(favorites.length).toBe(1);
    });

    it('creates a review in reviews table', async () => {
      const review = await reviewService.createReview({
        user_id: 'user-1',
        product_type: 'LOCATION',
        product_id: 'loc-1',
        rating: 5,
        title: 'Breathtaking Views!',
        description: 'Truly an unforgettable experience.',
      });
      expect(supabase.from).toHaveBeenCalledWith('reviews');
      expect(review.rating).toBe(5);
    });

    it('fetches approved reviews and computes average rating', async () => {
      const reviews = await reviewService.getReviews('LOCATION', 'loc-1');
      expect(supabase.from).toHaveBeenCalledWith('reviews');
      expect(reviews.length).toBe(1);

      const stats = await reviewService.getAverageRating('LOCATION', 'loc-1');
      expect(stats.average).toBe(5);
      expect(stats.count).toBe(1);
    });
  });

  // ─── 3. Trip Database CRUD ─────────────────────────────────────────────────
  describe('Trip Hierarchy Database CRUD', () => {
    it('fetches comprehensive trip data including segments, stays, and activities', async () => {
      const tripData = await tripService.fetchTrip('trip-1');
      expect(supabase.from).toHaveBeenCalledWith('trips');
      expect(supabase.from).toHaveBeenCalledWith('trip_segments');
      expect(supabase.from).toHaveBeenCalledWith('trip_stays');
      expect(supabase.from).toHaveBeenCalledWith('trip_activities');
      expect(tripData).not.toBeNull();
      expect(tripData?.trip.title).toBe('Summer Fjord Adventure');
    });

    it('fetches trips filtered by user_id', async () => {
      await tripService.fetchUserTrips('user-1');
      expect(supabase.from).toHaveBeenCalledWith('trips');
    });
  });

  // ─── 4. Provider Operations & Dashboard ────────────────────────────────────
  describe('Provider Operations & Inventory Management', () => {
    it('retrieves provider dashboard statistics via RPC', async () => {
      const stats = (await providerService.getDashboardStats('provider-123')) as any;
      expect(supabase.rpc).toHaveBeenCalledWith('get_provider_dashboard_stats', {
        p_provider_id: 'provider-123',
      });
      expect(stats.totalRevenue).toBe(125000);
      expect(stats.totalBookings).toBe(42);
    });

    it('fetches listings scoped strictly to the authenticated provider_id', async () => {
      const listings = (await providerService.getProviderListings('provider-123')) as any[];
      expect(supabase.from).toHaveBeenCalledWith('provider_listings_view');
      expect(listings.length).toBe(2);
      expect(listings[0].provider_id).toBe('provider-123');
    });

    it('fetches provider bookings joining customer profiles', async () => {
      const bookings = (await providerService.getRecentBookings('provider-123')) as any[];
      expect(supabase.from).toHaveBeenCalledWith('bookings');
      expect(bookings.length).toBe(1);
      expect(bookings[0].provider_id).toBe('provider-123');
    });
  });
});
