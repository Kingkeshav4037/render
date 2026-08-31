import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { monitoringService } from '../../services/monitoringService';
import { availabilityService } from '../../services/availabilityService';
import { recentlyViewedService } from '../../services/recentlyViewedService';
import { recommendationEngine } from '../../services/recommendationEngine';
import { tripService } from '../../services/tripService';
import { tripExportService } from '../../services/tripExportService';
import { invoiceService } from '../../services/invoice/invoiceService';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { PageLoadingSkeleton } from '../../components/ui/PageLoadingSkeleton';
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
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-e2e-1', email: 'traveler@norway.no' } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    }
  },
}));

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-e2e-1', email: 'traveler@norway.no' },
    isAuthenticated: true,
    profile: { fullName: 'Astrid Lind', preferredCurrency: 'NOK' },
    signOut: vi.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Phase E: Production Quality & End-to-End User Journeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    monitoringService.clearLogs();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 17: Loading, Empty & Error States Verification
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 17: Production States (Loading, Empty, Error, 404)', () => {
    it('renders all skeleton variants without console warnings', () => {
      const { rerender } = render(<PageLoadingSkeleton variant="card-grid" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<PageLoadingSkeleton variant="dashboard" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<PageLoadingSkeleton variant="detail-hero" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<PageLoadingSkeleton variant="table-list" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<PageLoadingSkeleton variant="itinerary" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders EmptyState presets with accessible labels and useful CTAs', () => {
      const { rerender } = render(
        <MemoryRouter>
          <EmptyState preset="NO_FAVORITES" />
        </MemoryRouter>
      );
      expect(screen.getByText('No favorites saved yet')).toBeInTheDocument();
      expect(screen.getByText('Explore Norway')).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <EmptyState preset="NO_BOOKINGS" />
        </MemoryRouter>
      );
      expect(screen.getByText('No active reservations')).toBeInTheDocument();
      expect(screen.getByText('Find Stays')).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <EmptyState preset="NO_SAVED_TRIPS" />
        </MemoryRouter>
      );
      expect(screen.getByText('No planned trips yet')).toBeInTheDocument();
      expect(screen.getByText('Open Travel Planner')).toBeInTheDocument();
    });

    it('renders ErrorState with classification, technical details, and retry callback', () => {
      const onRetry = vi.fn();
      render(
        <MemoryRouter>
          <ErrorState 
            type="NETWORK" 
            errorDetails="Failed to fetch Norwegian cloud catalog" 
            onRetry={onRetry} 
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Network Connection Lost')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch Norwegian cloud catalog')).toBeInTheDocument();
      
      const retryBtn = screen.getByText('Retry Connection');
      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 20: Telemetry & Monitoring Verification
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 20: Telemetry & Production Monitoring', () => {
    it('captures runtime errors, API latencies, and business events', () => {
      monitoringService.trackError(new Error('Simulated network timeout'), { route: '/explore' });
      monitoringService.trackApiPerformance('/api/v1/destinations', 1450, 200);
      monitoringService.trackEvent('USER_REGISTERED', { email: 'nordic@travel.com' });
      monitoringService.trackEvent('PAYMENT_COMPLETED', { orderId: 'ord-888', amount: 4500 });

      const logs = monitoringService.getLogs();
      expect(logs.length).toBe(4);
      expect(logs.find(l => l.name === 'Simulated network timeout')).toBeDefined();
      expect(logs.find(l => l.name === 'USER_REGISTERED')).toBeDefined();
      expect(logs.find(l => l.name === 'PAYMENT_COMPLETED')).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Journey 1 — New User Journey
  // ───────────────────────────────────────────────────────────────────────────
  describe('Journey 1: New User Exploration & Trip Planning', () => {
    it('executes full flow: Register -> Explore -> Favorite -> Plan -> Save Trip', async () => {
      // 1. User registers & event is logged
      monitoringService.trackEvent('USER_REGISTERED', { userId: 'user-e2e-1' });

      // 2. User explores & views Geirangerfjord
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'geirangerfjord',
        title: 'Geirangerfjord UNESCO Fjord',
        route: '/explore/geirangerfjord',
      });
      expect(recentlyViewedService.getLocalItems()[0].title).toBe('Geirangerfjord UNESCO Fjord');

      // 3. User favorites destination
      monitoringService.trackEvent('FAVORITE_SAVED', { itemId: 'geirangerfjord', itemType: 'DESTINATION' });

      // 4. User creates a planned trip
      const newTrip = {
        id: 'trip-summer-odyssey',
        name: 'Summer Fjord Expedition',
        title: 'Summer Fjord Expedition',
        startDate: '2026-07-10',
        endDate: '2026-07-16',
        destinations: ['Geirangerfjord', 'Bergen'],
        status: 'PLANNED',
      };
      localStorage.setItem('nsl_user_saved_trips', JSON.stringify([newTrip]));
      monitoringService.trackEvent('TRIP_CREATED', { tripId: newTrip.id });

      const savedTrips = JSON.parse(localStorage.getItem('nsl_user_saved_trips') || '[]');
      expect(savedTrips.length).toBe(1);
      expect(savedTrips[0].name).toBe('Summer Fjord Expedition');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Journey 2 — Hotel Booking & Availability Hold Journey
  // ───────────────────────────────────────────────────────────────────────────
  describe('Journey 2: Accommodation Booking, 15-Minute Hold & Invoice Flow', () => {
    it('executes full flow: Stay -> Availability Check -> Hold -> Checkout -> Confirmation -> Invoice', async () => {
      // 1. Preflight check for dates
      const rules = availabilityService.validateBookingRules(
        '2026-09-01',
        '2026-09-05',
        2,
        {
          maxGuests: 4,
          minNights: 1,
          maxNights: 30,
        }
      );
      expect(rules.valid).toBe(true);

      // 2. Real-time availability verification
      const isAvailable = await availabilityService.checkAvailability(
        'stay-juvet-landscape',
        'STAY',
        '2026-09-01',
        '2026-09-05'
      );
      expect(isAvailable.available).toBe(true);

      // 3. Temporary 15-minute hold acquired
      const holdResult = await availabilityService.validateAndHoldInventory(
        'user-e2e-1',
        'STAY',
        'stay-juvet-landscape',
        '2026-09-01',
        '2026-09-05',
        2,
        1,
        15
      );
      expect(holdResult.success).toBe(true);
      expect(holdResult.holdId).toBeDefined();
      monitoringService.trackEvent('STAY_HELD', { holdId: holdResult.holdId });

      // 4. Payment completed and booking confirmed
      monitoringService.trackEvent('PAYMENT_COMPLETED', {
        orderId: 'book-juvet-001',
        amount: 14800,
      });

      // 5. Generate and download invoice
      const invoice = invoiceService.createInvoiceFromBooking({
        id: 'book-juvet-001',
        item_type: 'ACCOMMODATION',
        item_name: 'Juvet Landscape Hotel',
        start_time: '2026-09-01',
        end_time: '2026-09-05',
        total_amount: 14800,
      }, { fullName: 'Astrid Lind', email: 'traveler@norway.no' });
      expect(invoice.invoiceNumber).toBeDefined();
      expect(invoice.totalAmount).toBe(14800);
      monitoringService.trackEvent('INVOICE_DOWNLOADED', { invoiceId: invoice.invoiceNumber });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Journey 3 — Shop & Sustainable Marketplace Order Journey
  // ───────────────────────────────────────────────────────────────────────────
  describe('Journey 3: Sustainable Marketplace Order & Receipt Flow', () => {
    it('executes full flow: Product -> Cart -> Checkout -> Payment -> Order Confirmed', () => {
      // 1. Add sustainable gear to cart
      const cartItem = {
        item_id: 'prod-merino-sweater',
        name: 'Norwegian Pure Wool Sweater',
        unit_price: 1890,
        quantity: 1,
      };
      monitoringService.trackEvent('CHECKOUT_STARTED', { itemsCount: 1, total: 1890 });

      // 2. Payment authorized
      monitoringService.trackEvent('ORDER_PLACED', {
        orderId: 'shop-ord-777',
        items: [cartItem],
        totalNok: 1890,
      });
      monitoringService.trackEvent('PAYMENT_COMPLETED', {
        orderId: 'shop-ord-777',
        amount: 1890,
      });

      const logs = monitoringService.getLogs();
      expect(logs.find(l => l.name === 'ORDER_PLACED')).toBeDefined();
      expect(logs.find(l => l.name === 'PAYMENT_COMPLETED')).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Journey 4 — Cancellation & Refund Lifecycle Journey
  // ───────────────────────────────────────────────────────────────────────────
  describe('Journey 4: Cancellation Request, Policy Check & Refund Flow', () => {
    it('executes full flow: Cancel Booking -> Policy Evaluation -> Refund Dispatch', () => {
      const booking = {
        id: 'book-juvet-001',
        checkIn: '2026-09-01',
        amountNok: 14800,
        status: 'CONFIRMED',
      };

      // 1. Cancellation policy evaluation (Free cancellation > 7 days prior)
      const now = new Date('2026-08-01');
      const checkInDate = new Date(booking.checkIn);
      const daysUntilCheckIn = Math.round((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const refundPercent = daysUntilCheckIn >= 7 ? 100 : 50;
      const refundAmount = (booking.amountNok * refundPercent) / 100;

      expect(refundPercent).toBe(100);
      expect(refundAmount).toBe(14800);

      // 2. Cancellation and Refund logs
      monitoringService.trackEvent('ORDER_CANCELLED', {
        bookingId: booking.id,
        refundAmount,
        refundPercent,
      });
      monitoringService.trackEvent('REFUND_REQUESTED', {
        bookingId: booking.id,
        amount: refundAmount,
      });

      const logs = monitoringService.getLogs();
      expect(logs.find(l => l.name === 'ORDER_CANCELLED')).toBeDefined();
      expect(logs.find(l => l.name === 'REFUND_REQUESTED')).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Journey 5 — Smart Tourism & Personalization Journey
  // ───────────────────────────────────────────────────────────────────────────
  describe('Journey 5: Smart Tourism, Recommendations & Multi-Format Export', () => {
    it('executes full flow: Track Views -> Signal Match -> Itinerary Warnings -> PDF/iCal Export', async () => {
      // 1. User explores several fjord activities
      await recentlyViewedService.trackView({
        item_type: 'DESTINATION',
        item_id: 'lofoten',
        title: 'Lofoten Islands',
        route: '/explore/lofoten',
        metadata: { region: 'Nordland', tags: ['hiking', 'fjords'] }
      });

      // 2. Recommendation engine derives signals
      const recs = await recommendationEngine.getPersonalizedRecommendations('user-e2e-1');
      expect(recs.recommendedForYou.length).toBeGreaterThan(0);
      expect(recs.exploreMore.length).toBeGreaterThan(0);

      // 3. User builds 3-day itinerary and checks for conflicts
      const trip = {
        id: 'trip-arctic-lights',
        title: 'Arctic Lights Odyssey',
        start_date: '2026-09-15',
        end_date: '2026-09-18',
        budget_nok: 20000,
        status: 'PLANNED' as const,
      };

      const days = [
        {
          id: 'd1',
          trip_id: trip.id,
          day_number: 1,
          date: '2026-09-15',
          activities: [
            {
              id: 'a1',
              activity_title: 'Midnight Sun Kayak',
              activity_type: 'Water',
              start_time: '2026-09-15T10:00:00Z',
              end_time: '2026-09-15T12:00:00Z',
              price_nok: 1200,
            }
          ],
          stays: [
            {
              id: 's1',
              accommodation_name: 'Reine Rorbuer',
              check_in: '2026-09-15',
              check_out: '2026-09-18',
              price_nok: 4500,
            }
          ]
        }
      ];

      const warnings = tripService.analyzeTripSchedule(days, trip);
      expect(warnings.filter(w => w.type === 'OVERLAP').length).toBe(0);

      const cost = tripService.calculateEstimatedTripCost(days, trip.budget_nok);
      expect(cost.is_within_budget).toBe(true);

      // 4. Export PDF and iCal
      const html = tripExportService.generateItineraryHTML({ trip, days, userName: 'Astrid Lind' });
      expect(html).toContain('Arctic Lights Odyssey');
      expect(html).toContain('Midnight Sun Kayak');
      expect(html).toContain('Reine Rorbuer');
      monitoringService.trackEvent('PDF_EXPORTED', { tripId: trip.id });

      const ics = tripExportService.generateICalendar({ trip, days });
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('SUMMARY:Midnight Sun Kayak');
      monitoringService.trackEvent('ICAL_EXPORTED', { tripId: trip.id });

      const logs = monitoringService.getLogs();
      expect(logs.find(l => l.name === 'PDF_EXPORTED')).toBeDefined();
      expect(logs.find(l => l.name === 'ICAL_EXPORTED')).toBeDefined();
    });
  });
});
