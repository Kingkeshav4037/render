import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { healthCheckService } from '../../services/healthCheckService';
import { uatPlaybook } from '../../utils/uatPlaybook';
import {
  generateDestinationSchema,
  generateStaySchema,
  generateActivitySchema,
  generateBreadcrumbSchema,
} from '../../components/shared/SEO';
import { analyticsService } from '../../services/analyticsService';
import { monitoringService } from '../../services/monitoringService';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [{ id: 'geirangerfjord' }], error: null }),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
}));

describe('Phase F: Production Launch & Continuous Improvement Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    analyticsService.clearLogs();
    monitoringService.clearLogs();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://mock-norway.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-anon-key');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 22: Deployment Health Checks
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 22: Production Health Check Diagnostics', () => {
    it('executes full system diagnostic and reports operational status', async () => {
      const report = await healthCheckService.runFullSystemHealthCheck();

      expect(report.timestamp).toBeDefined();
      expect(['HEALTHY', 'DEGRADED']).toContain(report.overallStatus);
      expect(report.checks.length).toBe(4);

      const dbCheck = report.checks.find((c) => c.name.includes('Database'));
      expect(dbCheck).toBeDefined();
      expect(dbCheck?.status).toBe('HEALTHY');

      const authCheck = report.checks.find((c) => c.name.includes('Authentication'));
      expect(authCheck).toBeDefined();
      expect(authCheck?.status).toBe('HEALTHY');

      const storageCheck = report.checks.find((c) => c.name.includes('LocalStorage'));
      expect(storageCheck).toBeDefined();
      expect(storageCheck?.status).toBe('HEALTHY');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 23: Real-User UAT Playbook
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 23: Real-User UAT Playbook & Usability Matrix', () => {
    it('contains all 12 core end-to-end task scenarios across user lifecycles', () => {
      const tasks = uatPlaybook.getTasks();
      expect(tasks.length).toBe(12);

      const categories = ['DISCOVERY', 'SEARCH', 'AUTH', 'FAVORITES', 'PLANNER', 'BOOKING', 'COMMERCE', 'CANCELLATION', 'EXPORT'];
      categories.forEach((cat) => {
        const matching = uatPlaybook.getTasksByCategory(cat as any);
        expect(matching.length).toBeGreaterThan(0);
      });

      // Verify essential task IDs
      expect(uatPlaybook.getTaskById('UAT-01')?.title).toContain('Geirangerfjord');
      expect(uatPlaybook.getTaskById('UAT-05')?.title).toContain('Itinerary');
      expect(uatPlaybook.getTaskById('UAT-07')?.title).toContain('Inventory Hold');
      expect(uatPlaybook.getTaskById('UAT-09')?.title).toContain('Invoice');
      expect(uatPlaybook.getTaskById('UAT-10')?.title).toContain('Cancellation');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 24: SEO & Schema.org JSON-LD Structured Data
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 24: SEO & Schema.org Structured Data Builders', () => {
    it('generates valid TouristDestination schema with geo-coordinates', () => {
      const schema = generateDestinationSchema({
        name: 'Geirangerfjord',
        description: 'Iconic Norwegian fjord surrounded by majestic waterfalls.',
        region: 'Møre og Romsdal',
        latitude: 62.1008,
        longitude: 7.2059,
        url: 'https://norway-smartlife.vercel.app/explore/geirangerfjord',
      });

      expect(schema['@type']).toBe('TouristDestination');
      expect(schema.name).toBe('Geirangerfjord');
      expect(schema.containedInPlace.name).toBe('Norway');
      expect(schema.geo?.latitude).toBe(62.1008);
      expect(schema.geo?.longitude).toBe(7.2059);
    });

    it('generates valid LodgingBusiness schema with price range and address', () => {
      const schema = generateStaySchema({
        name: 'Juvet Landscape Hotel',
        description: 'Architectural glass cabins immersed in Valldal nature.',
        priceRange: 'NOK 3,200 - 6,500',
        address: 'Alstad, 6210 Valldal, Norway',
        rating: 4.9,
        reviewCount: 142,
      });

      expect(schema['@type']).toBe('LodgingBusiness');
      expect(schema.name).toBe('Juvet Landscape Hotel');
      expect(schema.address.addressCountry).toBe('NO');
      expect(schema.aggregateRating?.ratingValue).toBe(4.9);
      expect(schema.aggregateRating?.reviewCount).toBe(142);
    });

    it('generates valid TouristAttraction schema with offer price in NOK', () => {
      const schema = generateActivitySchema({
        name: 'Midnight Sun Kayak Safari',
        description: 'Paddle through crystal calm waters under the 24-hour sun.',
        priceNok: 1200,
      });

      expect(schema['@type']).toBe('TouristAttraction');
      expect(schema.name).toBe('Midnight Sun Kayak Safari');
      expect(schema.offers?.price).toBe(1200);
      expect(schema.offers?.priceCurrency).toBe('NOK');
    });

    it('generates valid BreadcrumbList schema with sequential positions', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Destinations', url: '/explore' },
        { name: 'Lofoten', url: '/explore/lofoten' },
      ]);

      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement.length).toBe(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[2].name).toBe('Lofoten');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Module 25: Analytics & Business Intelligence Engine
  // ───────────────────────────────────────────────────────────────────────────
  describe('Module 25: Analytics & Funnel Conversion Intelligence', () => {
    it('tracks user journey events and computes business conversion funnels', () => {
      // Simulate traveler lifecycle events
      analyticsService.track('page_view', { path: '/home' });
      analyticsService.track('search', { query: 'Lofoten' });
      analyticsService.track('search', { query: 'Lofoten' });
      analyticsService.track('search', { query: 'Fjords' });
      analyticsService.track('destination_view', { destinationName: 'Lofoten Islands' });
      analyticsService.track('destination_view', { destinationName: 'Lofoten Islands' });
      analyticsService.track('destination_view', { destinationName: 'Geirangerfjord' });
      
      analyticsService.track('booking_started', { stayId: 'stay-reine' });
      analyticsService.track('booking_completed', { bookingId: 'book-001', amountNok: 4500 });
      
      analyticsService.track('order_started', { itemsCount: 1 });
      analyticsService.track('order_completed', { orderId: 'ord-001', totalNok: 1890 });
      
      analyticsService.track('cancellation_requested', { bookingId: 'book-001' });

      // 1. Most viewed destinations
      const topDestinations = analyticsService.getMostViewedDestinations();
      expect(topDestinations[0].destination).toBe('Lofoten Islands');
      expect(topDestinations[0].count).toBe(2);
      expect(topDestinations[1].destination).toBe('Geirangerfjord');

      // 2. Most searched terms
      const topSearches = analyticsService.getMostSearchedTerms();
      expect(topSearches[0].term).toBe('lofoten');
      expect(topSearches[0].count).toBe(2);

      // 3. Funnel conversions
      const funnel = analyticsService.getFunnelMetrics();
      expect(funnel.searches).toBe(3);
      expect(funnel.bookingsStarted).toBe(1);
      expect(funnel.bookingsCompleted).toBe(1);
      expect(funnel.bookingConversionRatePct).toBe(100);
      expect(funnel.ordersCompleted).toBe(1);
      expect(funnel.cancellations).toBe(1);
      expect(funnel.cancellationRatePct).toBe(100);
    });
  });
});
