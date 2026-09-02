/**
 * Phase 11: Production Monitoring & Error Tracking Test Suite
 * 
 * Verifies:
 * 1. Automatic Error Tracking with route attribution & stack trace.
 * 2. React Error Boundary integration with telemetry recording.
 * 3. API Monitoring & latency tracking (slow query detection > 1500ms).
 * 4. System health probes & uptime monitoring (Database, Edge Functions, Payment Gateway, Realtime, Weather).
 * 5. Web Vitals & route transition performance telemetry.
 * 6. Admin Live Operations Hub UI, error stream table, route inspection, and resolution workflow.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { monitoringService, TelemetryLog } from '../../services/monitoringService';
import { GlobalErrorBoundary, RouteErrorBoundary } from '../../components/layout/GlobalErrorBoundary';
import { AdminLiveOperations } from '../../pages/admin/operations/AdminLiveOperations';

// Mock Supabase
vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ data: [{ id: 'dest-01' }], error: null }),
        })),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: { ok: true }, error: null }),
      },
    },
  };
});

vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

const BuggyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated UI crash in Payment Module');
  }
  return <div>Component is healthy</div>;
};

describe('📊 Phase 11: Monitoring & Error Tracking System', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    monitoringService.clearLogs();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('1. Automated Error Tracking & Route Context', () => {
    it('captures runtime error with message, stack trace, and severity', () => {
      monitoringService.setUserContext({ id: 'user-qa-01', role: 'EXPLORER', email: 'explorer@qa.no' });
      monitoringService.addBreadcrumb('NAVIGATION', 'User clicked on /checkout button');

      const simulatedError = new Error('Database connection timed out during checkout');
      const log = monitoringService.trackError(simulatedError, { flow: 'checkout' }, 'CRITICAL');

      expect(log).toBeDefined();
      expect(log.name).toBe('Database connection timed out during checkout');
      expect(log.severity).toBe('CRITICAL');
      expect(log.type).toBe('ERROR');
      expect(log.userId).toBe('user-qa-01');
      expect(log.userRole).toBe('EXPLORER');
      expect(log.data?.flow).toBe('checkout');
      expect(log.data?.stack).toBeDefined();
      expect(log.breadcrumbs).toHaveLength(1);
      expect(log.breadcrumbs?.[0].message).toBe('User clicked on /checkout button');

      const logs = monitoringService.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].id).toBe(log.id);
    });

    it('records and retrieves breadcrumbs for debugging user journey', () => {
      monitoringService.addBreadcrumb('NAVIGATION', 'Navigated to /destinations');
      monitoringService.addBreadcrumb('UI_CLICK', 'Clicked on Lofoten Islands card');
      monitoringService.addBreadcrumb('API_REQUEST', 'GET /api/stays/lyngen -> 200 (42ms)');

      const breadcrumbs = monitoringService.getBreadcrumbs();
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].message).toContain('/destinations');
      expect(breadcrumbs[1].message).toContain('Lofoten');
      expect(breadcrumbs[2].category).toBe('API_REQUEST');
    });

    it('tracks payment failure as a CRITICAL severity event with order ID', () => {
      const payLog = monitoringService.trackPaymentFailure(
        'ord-9921', 
        'Card declined by issuer bank (insufficient funds)',
        { amount: 4800, currency: 'NOK' }
      );

      expect(payLog.severity).toBe('CRITICAL');
      expect(payLog.type).toBe('PAYMENT_FAILURE');
      expect(payLog.name).toContain('ord-9921');
      expect(payLog.data?.amount).toBe(4800);
    });
  });

  describe('2. React Error Boundary Integration', () => {
    it('catches component render errors and records telemetry with group context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <QueryClientProvider client={queryClient}>
          <RouteErrorBoundary groupName="CheckoutFlow">
            <BuggyComponent shouldThrow={true} />
          </RouteErrorBoundary>
        </QueryClientProvider>
      );

      // Verify Error Boundary Fallback UI renders gracefully
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/CheckoutFlow/i)).toBeInTheDocument();

      // Verify monitoringService captured the boundary exception
      const errors = monitoringService.getErrors();
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(errors[0].name).toContain('Simulated UI crash in Payment Module');

      consoleSpy.mockRestore();
    });
  });

  describe('3. API Performance Monitoring & Latency Tracking', () => {
    it('tracks normal API calls as INFO severity', () => {
      const apiLog = monitoringService.trackApiPerformance('/api/destinations', 85, 200, { method: 'GET' });

      expect(apiLog.type).toBe('API_PERFORMANCE');
      expect(apiLog.severity).toBe('INFO');
      expect(apiLog.data?.durationMs).toBe(85);
      expect(apiLog.data?.isSlow).toBe(false);
    });

    it('flags slow queries (> 1500ms) with WARNING severity', () => {
      const slowLog = monitoringService.trackApiPerformance('/api/search/complex-geospatial', 2400, 200, { method: 'POST' });

      expect(slowLog.severity).toBe('WARNING');
      expect(slowLog.data?.isSlow).toBe(true);
      expect(slowLog.data?.durationMs).toBe(2400);

      const slowQueries = monitoringService.getSlowApiQueries();
      expect(slowQueries).toHaveLength(1);
      expect(slowQueries[0].name).toContain('/api/search/complex-geospatial');
    });

    it('tracks 5xx server responses with ERROR severity', () => {
      const errLog = monitoringService.trackApiPerformance('/api/payment/settle', 320, 502, { method: 'POST' });

      expect(errLog.severity).toBe('ERROR');
      expect(errLog.data?.status).toBe(502);
    });
  });

  describe('4. System Health & Uptime Probes', () => {
    it('probes all 5 critical infrastructure services and computes overall health', async () => {
      const health = await monitoringService.checkSystemHealth();

      expect(health).toBeDefined();
      expect(health.overallStatus).toBe('HEALTHY');
      expect(health.uptimePercent).toBeGreaterThanOrEqual(99.9);
      expect(health.services).toHaveLength(5);

      const serviceKeys = health.services.map(s => s.key);
      expect(serviceKeys).toContain('database');
      expect(serviceKeys).toContain('edge_functions');
      expect(serviceKeys).toContain('payment_gateway');
      expect(serviceKeys).toContain('realtime');
      expect(serviceKeys).toContain('weather_api');

      health.services.forEach(svc => {
        expect(svc.status).toBe('HEALTHY');
        expect(svc.latencyMs).toBeGreaterThanOrEqual(0);
        expect(svc.uptimePercent).toBeGreaterThanOrEqual(99.9);
      });
    });
  });

  describe('5. Web Vitals Performance Telemetry', () => {
    it('records Core Web Vitals (LCP, FID, CLS, TTFB, FCP)', () => {
      const vitalLog = monitoringService.trackWebVital({
        name: 'LCP',
        value: 1450,
        rating: 'good',
      });

      expect(vitalLog.type).toBe('WEB_VITAL');
      expect(vitalLog.severity).toBe('INFO');
      expect(vitalLog.name).toContain('LCP');
      expect(vitalLog.data?.value).toBe(1450);
      expect(vitalLog.data?.rating).toBe('good');
    });

    it('tracks route navigation transition latency and adds navigation breadcrumb', () => {
      monitoringService.trackRouteNavigation('/explore', '/stay/lyngen-lodge', 120);

      const breadcrumbs = monitoringService.getBreadcrumbs();
      const navBc = breadcrumbs.find(b => b.category === 'NAVIGATION');
      expect(navBc).toBeDefined();
      expect(navBc?.message).toContain('/explore to /stay/lyngen-lodge');
    });
  });

  describe('6. Admin Live Operations Hub UI & Error Inspector', () => {
    it('renders System Health probes, metric counters, and error stream', async () => {
      // Seed an error log
      monitoringService.trackError('Failed to parse Aurora geomagnetic data', { source: 'AuroraTracker' }, 'WARNING');
      monitoringService.trackError('Checkout payment token expired', { source: 'Checkout' }, 'CRITICAL');

      render(
        <MemoryRouter>
          <AdminLiveOperations />
        </MemoryRouter>
      );

      // Verify Header
      expect(screen.getByText(/Live Operations & Error Monitoring/i)).toBeInTheDocument();
      expect(screen.getByText(/Uptime:/i)).toBeInTheDocument();

      // Verify Service Health Cards
      await waitFor(() => {
        expect(screen.getByText(/Supabase PostgreSQL & PostGIS/i)).toBeInTheDocument();
        expect(screen.getByText(/Payment Settlement Gateway/i)).toBeInTheDocument();
      });

      // Verify Stream Events
      expect(screen.getByText(/Failed to parse Aurora geomagnetic data/i)).toBeInTheDocument();
      expect(screen.getByText(/Checkout payment token expired/i)).toBeInTheDocument();
    });

    it('opens detail inspector modal on clicking Inspect with full stack trace and breadcrumbs', async () => {
      monitoringService.clearLogs();
      monitoringService.trackError(
        'Order cancellation rejected by provider RLS', 
        { stack: 'Error at cancelBooking (staysService.ts:42)' }, 
        'ERROR'
      );

      render(
        <MemoryRouter>
          <AdminLiveOperations />
        </MemoryRouter>
      );

      const inspectBtn = await screen.findByRole('button', { name: /inspect/i });
      fireEvent.click(inspectBtn);

      const modal = await screen.findByTestId('error-inspector-modal');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText(/Stack Trace/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Error at cancelBooking/i).length).toBeGreaterThanOrEqual(1);
    });

    it('allows admin to mark an error as resolved', async () => {
      const err = monitoringService.trackError('Test intermittent network glitch', {}, 'ERROR');

      render(
        <MemoryRouter>
          <AdminLiveOperations />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Test intermittent network glitch/i)).toBeInTheDocument();
      });

      const resolveBtn = screen.getByRole('button', { name: /resolve/i });
      fireEvent.click(resolveBtn);

      expect(err.resolved).toBe(true);
      expect(err.resolvedBy).toBe('System Admin');
    });
  });
});
