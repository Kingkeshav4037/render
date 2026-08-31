import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tripService, TripDay, Trip } from '../../services/tripService';
import { recentlyViewedService } from '../../services/recentlyViewedService';
import { recommendationEngine } from '../../services/recommendationEngine';
import { tripExportService } from '../../services/tripExportService';
import { SharedTripView } from '../../pages/trips/SharedTripView';
import { RecentlyViewedSection } from '../../components/common/RecentlyViewedSection';
import { ShareTripModal } from '../../components/trips/ShareTripModal';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: vi.fn().mockResolvedValue({ data: 1, error: null }),
  },
}));

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-777', email: 'viking@norway.no' },
    isAuthenticated: true,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Phase D: Smart Tourism Features Comprehensive Integration Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 14: Recently Viewed Tracking & Sync
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 14: Recently Viewed System', () => {
    it('tracks viewed items in LocalStorage for guests and updates order', async () => {
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'dest-101',
        title: 'Geirangerfjord',
        route: '/explore/geirangerfjord',
      });

      await recentlyViewedService.trackView({
        item_type: 'STAY',
        item_id: 'stay-202',
        title: 'Juvet Landscape Hotel',
        route: '/stay/stay-202',
      });

      const items = recentlyViewedService.getLocalItems();
      expect(items.length).toBe(2);
      expect(items[0].title).toBe('Juvet Landscape Hotel'); // most recent first
      expect(items[1].title).toBe('Geirangerfjord');
    });

    it('prevents duplicate entries and moves repeated item to top', async () => {
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'dest-101',
        title: 'Geirangerfjord',
        route: '/explore/geirangerfjord',
      });

      await recentlyViewedService.trackView({
        item_type: 'FOOD',
        item_id: 'food-303',
        title: 'Norwegian Smoked Salmon',
        route: '/food/food-303',
      });

      // View Geirangerfjord again
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'dest-101',
        title: 'Geirangerfjord',
        route: '/explore/geirangerfjord',
      });

      const items = recentlyViewedService.getLocalItems();
      expect(items.length).toBe(2);
      expect(items[0].title).toBe('Geirangerfjord'); // moved to top
      expect(items[1].title).toBe('Norwegian Smoked Salmon');
    });

    it('allows removing an individual item and clearing all items', async () => {
      await recentlyViewedService.trackView({
        item_type: 'PRODUCT',
        item_id: 'prod-1',
        title: 'Merino Wool Sweater',
        route: '/shop/prod-1',
      });

      await recentlyViewedService.removeItem('PRODUCT', 'prod-1');
      expect(recentlyViewedService.getLocalItems().length).toBe(0);

      await recentlyViewedService.trackView({
        item_type: 'TRAIL',
        item_id: 'trail-1',
        title: 'Trolltunga',
        route: '/trails/trail-1',
      });
      await recentlyViewedService.clearAll();
      expect(recentlyViewedService.getLocalItems().length).toBe(0);
    });

    it('renders RecentlyViewedSection with items and category badges', async () => {
      recentlyViewedService.setLocalItems([
        {
          item_type: 'DESTINATION',
          item_id: 'dest-lofoten',
          title: 'Lofoten Islands',
          route: '/destinations',
          viewed_at: new Date().toISOString(),
        },
      ]);

      render(
        <MemoryRouter>
          <RecentlyViewedSection />
        </MemoryRouter>
      );

      expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
      expect(screen.getByText('Lofoten Islands')).toBeInTheDocument();
      expect(screen.getByText('Destination')).toBeInTheDocument();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 15: Personalized Recommendations Engine
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 15: Personalized Recommendations Engine', () => {
    it('extracts signals and generates ranked recommendations', async () => {
      // Simulate viewing Lofoten and Fjords
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'dest-lofoten',
        title: 'Lofoten Islands',
        route: '/destinations',
        metadata: { region: 'Nordland', tags: ['hiking', 'photography', 'fjords'] },
      });

      const recs = await recommendationEngine.getPersonalizedRecommendations('user-777');

      expect(recs.recommendedForYou.length).toBeGreaterThan(0);
      expect(recs.youMayAlsoLike.length).toBeGreaterThan(0);
      expect(recs.perfectForTrip.length).toBeGreaterThan(0);
      expect(recs.exploreMore.length).toBeGreaterThan(0);

      // Top recommendation should have high relevance score
      const topRec = recs.recommendedForYou[0];
      expect(topRec.relevanceScore).toBeGreaterThanOrEqual(50);
      expect(topRec.matchReason).toBeDefined();
    });

    it('finds similar items based on entity affinity', async () => {
      const similar = await recommendationEngine.getSimilarItems('DESTINATION', 'dest-lofoten', 3);
      expect(similar.length).toBeLessThanOrEqual(3);
      expect(similar.every(s => s.id !== 'dest-lofoten')).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 13: Travel Planner Upgrades & Smart Warnings
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 13: Travel Planner Upgrades & Smart Conflict Warnings', () => {
    it('detects overlapping activity time conflicts on the same day', () => {
      const mockDays: TripDay[] = [
        {
          id: 'day-1',
          trip_id: 'trip-1',
          day_number: 1,
          date: '2026-08-10',
          activities: [
            {
              id: 'act-1',
              activity_title: 'Fjord Kayaking Safari',
              activity_type: 'Water',
              start_time: '2026-08-10T10:00:00Z',
              end_time: '2026-08-10T13:00:00Z',
            },
            {
              id: 'act-2',
              activity_title: 'Mountain Bike Rental',
              activity_type: 'Biking',
              start_time: '2026-08-10T12:00:00Z', // overlaps with 10:00 - 13:00
              end_time: '2026-08-10T15:00:00Z',
            },
          ],
        },
      ];

      const warnings = tripService.analyzeTripSchedule(mockDays);
      const overlapWarning = warnings.find(w => w.type === 'OVERLAP');
      expect(overlapWarning).toBeDefined();
      expect(overlapWarning?.severity).toBe('HIGH');
      expect(overlapWarning?.title).toContain('Time Conflict');
    });

    it('detects overly packed days (> 9 hours of activities)', () => {
      const mockDays: TripDay[] = [
        {
          id: 'day-1',
          trip_id: 'trip-1',
          day_number: 1,
          date: '2026-08-10',
          activities: [
            {
              id: 'act-1',
              activity_title: 'Full Day Glacier Traverse',
              activity_type: 'Hiking',
              start_time: '2026-08-10T06:00:00Z',
              end_time: '2026-08-10T18:00:00Z', // 12 hours
            },
          ],
        },
      ];

      const warnings = tripService.analyzeTripSchedule(mockDays);
      const packedWarning = warnings.find(w => w.type === 'PACKED_DAY');
      expect(packedWarning).toBeDefined();
      expect(packedWarning?.severity).toBe('MEDIUM');
    });

    it('detects impossible travel times between distant hubs', () => {
      const mockDays: TripDay[] = [
        {
          id: 'day-1',
          trip_id: 'trip-1',
          day_number: 1,
          date: '2026-08-10',
          segments: [
            {
              id: 'seg-1',
              sequence_order: 1,
              transport_mode: 'CAR',
              start_location: { name: 'Oslo' },
              end_location: { name: 'Bergen' }, // 460km / ~7 hrs
              start_time: '2026-08-10T09:00:00Z',
              end_time: '2026-08-10T10:00:00Z', // Only 1 hour allocated!
              distance_km: 460,
            },
          ],
        },
      ];

      const warnings = tripService.analyzeTripSchedule(mockDays);
      const travelWarning = warnings.find(w => w.type === 'IMPOSSIBLE_TRAVEL');
      expect(travelWarning).toBeDefined();
      expect(travelWarning?.severity).toBe('HIGH');
    });

    it('detects multi-day trips with missing accommodations', () => {
      const mockDays: TripDay[] = [
        { id: 'day-1', trip_id: 'trip-1', day_number: 1, date: '2026-08-10', stays: [] },
        { id: 'day-2', trip_id: 'trip-1', day_number: 2, date: '2026-08-11', stays: [] },
      ];

      const warnings = tripService.analyzeTripSchedule(mockDays);
      const missingStay = warnings.find(w => w.type === 'MISSING_STAY');
      expect(missingStay).toBeDefined();
    });

    it('calculates estimated trip cost and checks budget feasibility', () => {
      const mockDays: TripDay[] = [
        {
          id: 'day-1',
          trip_id: 'trip-1',
          day_number: 1,
          date: '2026-08-10',
          stays: [{ id: 's1', accommodation_name: 'Cabins', check_in: '', check_out: '', price_nok: 3000 }],
          activities: [{ id: 'a1', activity_title: 'Cruise', activity_type: '', start_time: '', end_time: '', price_nok: 1000 }],
          segments: [{ id: 'seg1', sequence_order: 1, transport_mode: 'FERRY', distance_km: 50 }],
        },
      ];

      const cost = tripService.calculateEstimatedTripCost(mockDays, 10000);
      expect(cost.accommodation_total_nok).toBe(3000);
      expect(cost.activities_total_nok).toBe(1000);
      expect(cost.transport_total_nok).toBe(450); // ferry
      expect(cost.food_estimate_nok).toBe(600);
      expect(cost.grand_total_nok).toBe(5050);
      expect(cost.is_within_budget).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 16: Trip Sharing & Export
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 16: Trip Sharing & Export System', () => {
    const sampleTrip: Trip = {
      id: 'trip-999',
      title: 'Majestic West Cape Odyssey',
      start_date: '2026-07-01',
      end_date: '2026-07-05',
      budget_nok: 25000,
      status: 'PLANNED',
      visibility: 'SHARED_WITH_LINK',
      share_token: 'trip_share_token_abc123',
      notes: 'Remember waterproof boots and drone permits',
    };

    const sampleDays: TripDay[] = [
      {
        id: 'd-1',
        trip_id: 'trip-999',
        day_number: 1,
        date: '2026-07-01',
        description: 'Arrival at Geiranger',
        activities: [
          {
            id: 'act-1',
            activity_title: 'Geirangerfjord Electric Catamaran Cruise',
            activity_type: 'Fjord Cruise',
            start_time: '2026-07-01T11:00:00Z',
            end_time: '2026-07-01T13:00:00Z',
            price_nok: 750,
          },
        ],
        stays: [
          {
            id: 'stay-1',
            accommodation_name: 'Grande Fjord Hotel',
            check_in: '2026-07-01',
            check_out: '2026-07-03',
            price_nok: 3200,
          },
        ],
      },
    ];

    it('generates clean, print-ready HTML itinerary for PDF export', () => {
      const html = tripExportService.generateItineraryHTML({
        trip: sampleTrip,
        days: sampleDays,
        userName: 'Astrid Explorer',
      });

      expect(html).toContain('Majestic West Cape Odyssey');
      expect(html).toContain('Geirangerfjord Electric Catamaran Cruise');
      expect(html).toContain('Grande Fjord Hotel');
      expect(html).toContain('Estimated Trip Budget Breakdown');
      expect(html).toContain('Astrid Explorer');
    });

    it('generates standard iCalendar (.ics) format with valid VEVENT blocks', () => {
      const ics = tripExportService.generateICalendar({
        trip: sampleTrip,
        days: sampleDays,
      });

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('SUMMARY:Geirangerfjord Electric Catamaran Cruise');
      expect(ics).toContain('SUMMARY:Stay at Grande Fjord Hotel');
      expect(ics).toContain('END:VCALENDAR');
    });

    it('renders ShareTripModal and toggles privacy settings', () => {
      const onTripUpdated = vi.fn();
      render(
        <ShareTripModal
          isOpen={true}
          onClose={vi.fn()}
          trip={sampleTrip}
          onTripUpdated={onTripUpdated}
        />
      );

      expect(screen.getByText('Share Your Itinerary')).toBeInTheDocument();
      expect(screen.getByText('With Link')).toBeInTheDocument();
      expect(screen.getByText('Public')).toBeInTheDocument();
      expect(screen.getByText('Private')).toBeInTheDocument();
    });

    it('renders SharedTripView with public read-only content and export triggers', async () => {
      vi.spyOn(tripService, 'fetchTrip').mockResolvedValue({
        trip: sampleTrip,
        days: sampleDays,
        segments: [],
        stays: sampleDays[0].stays || [],
        activities: sampleDays[0].activities || [],
      });

      render(
        <MemoryRouter initialEntries={['/trips/share/trip_share_token_abc123']}>
          <Routes>
            <Route path="/trips/share/:token" element={<SharedTripView />} />
          </Routes>
        </MemoryRouter>,
        { wrapper }
      );

      await waitFor(() => {
        expect(screen.getByText('Majestic West Cape Odyssey')).toBeInTheDocument();
        expect(screen.getByText('Print / PDF')).toBeInTheDocument();
        expect(screen.getByText('Calendar (.ics)')).toBeInTheDocument();
        expect(screen.getByText(/Geirangerfjord Electric Catamaran Cruise/i)).toBeInTheDocument();
      });
    });
  });
});
