/**
 * Error Boundary Coverage Audit
 *
 * Verifies that every required route group has a functioning error boundary
 * that:
 *   1. Catches render errors thrown by child components.
 *   2. Shows "Something went wrong." (not a white screen).
 *   3. Shows a "Retry" button.
 *   4. Shows a "Return Home" button/link.
 *   5. Logs the error to console.error.
 *
 * Route groups covered:
 *   - Main routes (wrapped via MainLayout)
 *   - Dashboard
 *   - Admin
 *   - Provider
 *   - Maps
 *   - Checkout
 *   - AI functionality (Assistant)
 *   - GlobalErrorBoundary (root)
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─── Component under test ─────────────────────────────────────────────────────
import {
  GlobalErrorBoundary,
  RouteErrorBoundary,
} from '../../components/layout/GlobalErrorBoundary';

// ─── QueryClient ──────────────────────────────────────────────────────────────
const makeClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

// ─── Helper: A child that unconditionally throws ──────────────────────────────
const ThrowingChild: React.FC<{ message?: string }> = ({
  message = 'Simulated render crash',
}) => {
  throw new Error(message);
  return null; // unreachable — satisfies type-checker
};

// ─── Renderer helpers ─────────────────────────────────────────────────────────
const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <QueryClientProvider client={makeClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );

// ─── Typed helper: flatten console.error mock calls into strings ──────────────
// Avoids the implicit `any` TS error that arises from mock.calls being unknown[][].
const flattenCalls = (spy: ReturnType<typeof vi.spyOn>): string[] =>
  (spy.mock.calls as unknown[][]).map((c) => c.map(String).join(' '));


// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Error Boundary Coverage Audit', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress expected "Error: Simulated render crash" noise in test output
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  // ─── GlobalErrorBoundary ────────────────────────────────────────────────────
  describe('GlobalErrorBoundary (root)', () => {
    it('renders children normally when there is no error', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <span data-testid="child">ok</span>
        </GlobalErrorBoundary>
      );
      expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('shows fallback UI on render error — not a white screen', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <ThrowingChild />
        </GlobalErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    });

    it('shows "Something went wrong." heading', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <ThrowingChild />
        </GlobalErrorBoundary>
      );
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
    });

    it('shows "Retry" button', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <ThrowingChild />
        </GlobalErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-retry-btn')).toBeTruthy();
      expect(screen.getByTestId('error-boundary-retry-btn').textContent).toMatch(/retry/i);
    });

    it('shows "Return Home" link', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <ThrowingChild />
        </GlobalErrorBoundary>
      );
      const homeBtn = screen.getByTestId('error-boundary-home-btn');
      expect(homeBtn).toBeTruthy();
      expect(homeBtn.textContent).toMatch(/return home/i);
      expect((homeBtn as HTMLAnchorElement).href).toContain('/home');
    });

    it('logs the error to console.error', () => {
      renderWithProviders(
        <GlobalErrorBoundary>
          <ThrowingChild message="GlobalBoundary test crash" />
        </GlobalErrorBoundary>
      );
      // The ErrorBoundary onError handler + the effect in ErrorFallback both call console.error
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('GlobalBoundary test crash'))).toBe(true);
    });
  });

  // ─── RouteErrorBoundary — generic behaviour ─────────────────────────────────
  describe('RouteErrorBoundary — generic behaviour', () => {
    it('renders children normally when there is no error', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Test">
          <span data-testid="child">ok</span>
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('shows fallback UI on render error — not a white screen', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Test">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    });

    it('shows "Something went wrong." heading', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Test">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
    });

    it('shows "Retry" button', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Test">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-retry-btn').textContent).toMatch(/retry/i);
    });

    it('shows "Return Home" link pointing to /home', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Test">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      const homeBtn = screen.getByTestId('error-boundary-home-btn') as HTMLAnchorElement;
      expect(homeBtn.textContent).toMatch(/return home/i);
      expect(homeBtn.href).toContain('/home');
    });

    it('logs error with groupName context', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="MyGroup">
          <ThrowingChild message="RouteGroup crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('MyGroup'))).toBe(true);
      expect(calls.some((c) => c.includes('RouteGroup crash'))).toBe(true);
    });

    it('uses role="alert" on the fallback so screen readers announce it', () => {
      const { container } = renderWithProviders(
        <RouteErrorBoundary groupName="A11y">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).not.toBeNull();
    });
  });

  // ─── Per-Group: Main routes ─────────────────────────────────────────────────
  describe('Main routes boundary', () => {
    it('isolates Main route crashes from the rest of the app', () => {
      renderWithProviders(
        <>
          <RouteErrorBoundary groupName="Main">
            <ThrowingChild />
          </RouteErrorBoundary>
          <span data-testid="sibling-ok">sibling</span>
        </>
      );
      // Fallback shown inside the boundary
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
      // Component outside boundary is unaffected
      expect(screen.getByTestId('sibling-ok')).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:Main] prefix', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Main">
          <ThrowingChild message="main crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Main'))).toBe(true);
    });
  });

  // ─── Per-Group: Dashboard ───────────────────────────────────────────────────
  describe('Dashboard boundary', () => {
    it('shows fallback on Dashboard crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Dashboard">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
    });

    it('includes "Dashboard" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Dashboard">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/dashboard/i)).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:Dashboard]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Dashboard">
          <ThrowingChild message="dashboard crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Dashboard'))).toBe(true);
    });
  });

  // ─── Per-Group: Admin ───────────────────────────────────────────────────────
  describe('Admin boundary', () => {
    it('shows fallback on Admin crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Admin">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    });

    it('includes "Admin" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Admin">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/admin/i)).toBeTruthy();
    });

    it('Retry and Return Home buttons are both present', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Admin">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-retry-btn')).toBeTruthy();
      expect(screen.getByTestId('error-boundary-home-btn')).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:Admin]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Admin">
          <ThrowingChild message="admin crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Admin'))).toBe(true);
    });
  });

  // ─── Per-Group: Provider ────────────────────────────────────────────────────
  describe('Provider boundary', () => {
    it('shows fallback on Provider crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Provider">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
    });

    it('includes "Provider" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Provider">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/provider/i)).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:Provider]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Provider">
          <ThrowingChild message="provider crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Provider'))).toBe(true);
    });
  });

  // ─── Per-Group: Maps ────────────────────────────────────────────────────────
  describe('Maps boundary', () => {
    it('shows fallback on Map crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Maps">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    });

    it('includes "Maps" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Maps">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/maps/i)).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:Maps]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Maps">
          <ThrowingChild message="map crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Maps'))).toBe(true);
    });
  });

  // ─── Per-Group: Checkout ────────────────────────────────────────────────────
  describe('Checkout boundary', () => {
    it('shows fallback on Checkout crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Checkout">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
    });

    it('includes "Checkout" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Checkout">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/checkout/i)).toBeTruthy();
    });

    it('does not propagate the crash beyond the boundary', () => {
      expect(() => {
        renderWithProviders(
          <RouteErrorBoundary groupName="Checkout">
            <ThrowingChild />
          </RouteErrorBoundary>
        );
      }).not.toThrow();
    });

    it('logs [RouteErrorBoundary:Checkout]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="Checkout">
          <ThrowingChild message="checkout crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('Checkout'))).toBe(true);
    });
  });

  // ─── Per-Group: AI Assistant ────────────────────────────────────────────────
  describe('AI Assistant boundary', () => {
    it('shows fallback on AI crash', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="AI Assistant">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    });

    it('includes "AI Assistant" in the description text', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="AI Assistant">
          <ThrowingChild />
        </RouteErrorBoundary>
      );
      expect(screen.getByText(/ai assistant/i)).toBeTruthy();
    });

    it('logs [RouteErrorBoundary:AI Assistant]', () => {
      renderWithProviders(
        <RouteErrorBoundary groupName="AI Assistant">
          <ThrowingChild message="ai crash" />
        </RouteErrorBoundary>
      );
      const calls = flattenCalls(consoleError);
      expect(calls.some((c) => c.includes('AI Assistant'))).toBe(true);
    });
  });

  // ─── Cross-boundary isolation ───────────────────────────────────────────────
  describe('Cross-boundary isolation', () => {
    it('a crash in one group does not affect another group', () => {
      renderWithProviders(
        <>
          <RouteErrorBoundary groupName="Admin">
            <ThrowingChild message="admin crash" />
          </RouteErrorBoundary>
          <RouteErrorBoundary groupName="Dashboard">
            <span data-testid="dashboard-ok">Dashboard OK</span>
          </RouteErrorBoundary>
        </>
      );
      // Admin boundary shows error
      expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
      // Dashboard boundary renders its children normally
      expect(screen.getByTestId('dashboard-ok')).toBeTruthy();
    });

    it('multiple simultaneous crashes each show their own fallback', () => {
      renderWithProviders(
        <>
          <RouteErrorBoundary groupName="Checkout">
            <ThrowingChild message="checkout crash" />
          </RouteErrorBoundary>
          <RouteErrorBoundary groupName="Maps">
            <ThrowingChild message="map crash" />
          </RouteErrorBoundary>
        </>
      );
      const fallbacks = screen.getAllByTestId('error-boundary-fallback');
      expect(fallbacks.length).toBe(2);
    });
  });

  // ─── TypeScript / contract enforcement ─────────────────────────────────────
  describe('Contract — fallback UI elements always present', () => {
    const groups = ['Main', 'Dashboard', 'Admin', 'Provider', 'Maps', 'Checkout', 'AI Assistant'];

    groups.forEach((group) => {
      it(`[${group}] fallback always has: heading, Retry btn, Return Home link`, () => {
        renderWithProviders(
          <RouteErrorBoundary groupName={group}>
            <ThrowingChild />
          </RouteErrorBoundary>
        );
        expect(screen.getByText(/something went wrong\./i)).toBeTruthy();
        expect(screen.getByTestId('error-boundary-retry-btn')).toBeTruthy();
        expect(screen.getByTestId('error-boundary-home-btn')).toBeTruthy();
      });
    });
  });
});
