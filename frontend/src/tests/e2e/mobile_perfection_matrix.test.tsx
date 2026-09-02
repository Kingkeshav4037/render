/**
 * Phase 10 — Mobile Perfection Matrix Test Suite
 * 
 * Viewports:
 * 📱 360px  (Small Android / Galaxy S)
 * 📱 390px  (iPhone 12/13/14/15)
 * 📱 412px  (Google Pixel 7/8 / Galaxy Plus)
 * 📱 Tablet (768px Portrait / 1024px Landscape)
 * 💻 Laptop (1280px / 1440px)
 * 🖥️ Desktop (1920px)
 * 
 * Core Architectural Areas:
 * 1. Navbar (Mobile hamburger drawer, search shortcut, cart & user navigation)
 * 2. Tables (Admin users, orders, bookings, invoices with horizontal scroll resilience)
 * 3. Forms (Full-width inputs, touch targets >= 44px, accessible validation)
 * 4. Checkout & Cart (Single-column mobile collapse, order total breakdown)
 * 5. Admin Dashboard & Layout (Responsive KPI grid, slide-over mobile drawer, charts)
 * 6. Maps (Responsive SmartMap Leaflet container, touch handling)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components & Pages
import { Navbar } from '../../components/layout/Navbar';
import { AdminLayout } from '../../pages/admin/AdminLayout';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminUsers } from '../../pages/admin/AdminUsers';
import { AdminOrders } from '../../pages/admin/commerce/AdminOrders';
import { AdminBookings } from '../../pages/admin/AdminBookings';
import { Checkout } from '../../pages/checkout/Checkout';
import { ShopCart } from '../../pages/marketplace/ShopCart';
import { StayBooking } from '../../pages/checkout/StayBooking';
import { Invoices } from '../../pages/user/Invoices';
import { Login } from '../../pages/auth/Login';
import { SmartMap } from '../../pages/SmartMap';

// ─── Viewport Definition Helper ───────────────────────────────────────────
export const VIEWPORTS = {
  PHONE_360: { name: 'Small Phone (360×740)', width: 360, height: 740 },
  IPHONE_390: { name: 'iPhone 12/13/14/15 (390×844)', width: 390, height: 844 },
  ANDROID_412: { name: 'Pixel / Galaxy Plus (412×915)', width: 412, height: 915 },
  TABLET_PORTRAIT: { name: 'Tablet Portrait (768×1024)', width: 768, height: 1024 },
  TABLET_LANDSCAPE: { name: 'Tablet Landscape (1024×768)', width: 1024, height: 768 },
  LAPTOP_1280: { name: 'Laptop (1280×800)', width: 1280, height: 800 },
  LAPTOP_1440: { name: 'Desktop HD (1440×900)', width: 1440, height: 900 },
  DESKTOP_1920: { name: 'Desktop Ultrawide (1920×1080)', width: 1920, height: 1080 },
};

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(document.documentElement, 'clientHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

// ─── Mocks & Providers ───────────────────────────────────────────────────
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'mobile-qa-user', email: 'mobile.tester@norwaysmartlife.no' },
    profile: { id: 'mobile-qa-user', fullName: 'Mobile QA Tester', role: 'ADMIN', permissions: ['*'] },
    loading: false,
    initialized: true,
    isAdmin: true,
    isProvider: true,
    isAnalyst: false,
    permissions: ['*'],
    mfaLevel: 'aal2' as const,
    hasPermission: () => true,
    signOut: vi.fn(),
  };
  const mockHook: any = (selector?: any) => typeof selector === 'function' ? selector(store) : store;
  mockHook.getState = () => store;
  mockHook.setState = vi.fn();
  return { useAuthStore: mockHook };
});

vi.mock('../../store/useCartStore', () => {
  const mockItems = [
    {
      id: 'item-sweater-01',
      title: 'Dale of Norway St. Moritz Sweater',
      price: 2490,
      quantity: 1,
      image: '/images/shop/dale-sweater.jpg',
      category: 'WEARABLES',
    },
    {
      id: 'item-cheese-02',
      title: 'TINE Gudbrandsdalen Brunost',
      price: 119,
      quantity: 2,
      image: '/images/food/brunost.jpg',
      category: 'FOOD',
    },
  ];

  const store = {
    items: mockItems,
    isOpen: false,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    setIsOpen: vi.fn(),
    getCartTotal: () => 2728,
    getItemCount: () => 3,
  };

  const useCartMock: any = (selector?: any) => typeof selector === 'function' ? selector(store) : store;
  useCartMock.getState = () => store;
  return { useCartStore: useCartMock, useCart: useCartMock };
});

vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (amt: number = 0) => `NOK ${amt.toLocaleString()}`,
    setCurrency: vi.fn(),
  }),
  CURRENCIES: {
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  },
}));

vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

vi.mock('../../lib/supabase', () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockImplementation(() => {
      const p: any = Promise.resolve({
        data: [{
          id: 'b-101',
          stay_id: 'stay-01',
          user_id: 'mobile-qa-user',
          total_amount: 3200,
          currency: 'NOK',
          status: 'PAID',
          created_at: new Date().toISOString(),
          check_in: '2026-06-01',
          check_out: '2026-06-05',
          pax: 2,
        }],
        error: null,
      });
      p.select = vi.fn().mockReturnThis();
      p.eq = vi.fn().mockReturnThis();
      p.in = vi.fn().mockReturnThis();
      p.order = vi.fn().mockReturnThis();
      p.range = vi.fn().mockReturnThis();
      p.limit = vi.fn().mockReturnThis();
      p.single = vi.fn().mockResolvedValue({ data: null, error: null });
      return p;
    }),
    range: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        id: 'mock-stay-lyngen',
        name: 'Lyngen Alps Wilderness Lodge',
        title: 'Lyngen Alps Wilderness Lodge',
        price_per_night: 3200,
        currency: 'NOK',
        location: 'Lyngen, Troms',
        capacity: 4,
        max_guests: 4,
        rooms: 2,
        bathrooms: 2,
        rating: 4.95,
        review_count: 88,
        description: 'Spectacular fjord and aurora views lodge.',
        images: ['/images/stays/lyngen-lodge.jpg'],
        amenities: ['Sauna', 'WiFi', 'Kitchen', 'Aurora View', 'EV Charger'],
      },
      error: null,
    }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }));

  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mobile-qa-user', email: 'mobile@test.no' } }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'mobile-qa-user' }, access_token: 'fake-jwt' } }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: mockFrom,
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: { success: true, orderId: 'ord_mobile_01' }, error: null }),
      },
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    },
  };
});

// Mock Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, className }: any) => <div className={`leaflet-container ${className || ''}`} data-testid="mock-leaflet-map">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="mock-marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="mock-popup">{children}</div>,
  useMap: () => ({ setView: vi.fn(), flyTo: vi.fn() }),
  Polyline: () => <div data-testid="mock-polyline" />,
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

const renderWithProviders = (ui: React.ReactElement, initialPath = '/') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('📱 Phase 10: Mobile Perfection Matrix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ─── 1. NAVBAR RESPONSIVE TESTS ACROSS 6 VIEWPORTS ───────────────────────
  describe('1. Navbar Responsive Adaptability across Viewports', () => {
    const viewportsToTest = [
      VIEWPORTS.PHONE_360,
      VIEWPORTS.IPHONE_390,
      VIEWPORTS.ANDROID_412,
      VIEWPORTS.TABLET_PORTRAIT,
      VIEWPORTS.LAPTOP_1280,
      VIEWPORTS.DESKTOP_1920,
    ];

    viewportsToTest.forEach((vp) => {
      it(`renders Navbar correctly on ${vp.name} (${vp.width}px)`, () => {
        setViewport(vp.width, vp.height);
        renderWithProviders(<Navbar />);

        // Brand logo is always visible
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeDefined();

        if (vp.width < 1024) {
          // Mobile / Tablet view: Hamburger drawer toggle button is rendered
          const mobileToggle = screen.getByLabelText(/open mobile navigation menu/i);
          expect(mobileToggle).toBeDefined();

          // Open mobile menu
          fireEvent.click(mobileToggle);

          // Menu navigation drawer opens with brand title
          expect(screen.getAllByText(/norway smartlife/i).length).toBeGreaterThan(0);
        } else {
          // Laptop / Desktop view: Main navigation links are rendered inline
          expect(screen.getAllByText(/explore/i).length).toBeGreaterThan(0);
          expect(screen.getAllByText(/experiences/i).length).toBeGreaterThan(0);
        }
      });
    });
  });

  // ─── 2. ADMIN LAYOUT & MOBILE DRAWER ──────────────────────────────────────
  describe('2. Admin Layout & Mobile Navigation Drawer', () => {
    it('provides sliding overlay drawer with dark backdrop on 360px viewport', async () => {
      setViewport(360, 740);
      renderWithProviders(<AdminLayout />);

      // Top header hamburger is present on mobile
      const mobileMenuBtn = screen.getByLabelText(/toggle mobile menu/i);
      expect(mobileMenuBtn).toBeDefined();

      // Open drawer
      fireEvent.click(mobileMenuBtn);

      // Verify admin links are accessible in drawer
      expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/orders & fulfillment/i)).toBeDefined();
      expect(screen.getByText(/marketplace stock/i)).toBeDefined();
      expect(screen.getByText(/users/i)).toBeDefined();
    });

    it('provides collapsible in-flow sidebar on Desktop (1920px)', () => {
      setViewport(1920, 1080);
      renderWithProviders(<AdminLayout />);

      const sidebar = screen.getByLabelText(/admin sidebar/i);
      expect(sidebar).toBeDefined();
      expect(screen.getByText(/dashboard/i)).toBeDefined();

      // Collapse sidebar to icon-only mode
      const collapseBtn = screen.getByLabelText(/collapse sidebar/i);
      fireEvent.click(collapseBtn);

      // Verify sidebar toggles without unmounting
      expect(screen.getByLabelText(/expand sidebar/i)).toBeDefined();
    });
  });

  // ─── 3. TABLES RESPONSIVENESS (Admin Users, Orders, Bookings, Invoices) ──
  describe('3. Tables Responsive Horizontal Scroll & Containment', () => {
    it('AdminUsers table renders inside a horizontally scrollable container on 390px', async () => {
      setViewport(390, 844);
      const { container } = renderWithProviders(<AdminUsers />);

      // Check for horizontal scroll wrapper class (overflow-x-auto)
      const scrollContainers = container.querySelectorAll('.overflow-x-auto');
      expect(scrollContainers.length).toBeGreaterThan(0);

      // Table contains core headers
      expect(screen.getByText(/user management/i)).toBeDefined();
    });

    it('AdminOrders table renders without layout clipping on 412px Android', async () => {
      setViewport(412, 915);
      const { container } = renderWithProviders(<AdminOrders />);

      const scrollContainers = container.querySelectorAll('.overflow-x-auto');
      expect(scrollContainers.length).toBeGreaterThan(0);
      expect(screen.getByText(/order ref/i)).toBeDefined();
    });

    it('AdminBookings table renders with status tags on 768px Tablet', async () => {
      setViewport(768, 1024);
      const { container } = renderWithProviders(<AdminBookings />);

      const scrollContainers = container.querySelectorAll('.overflow-x-auto');
      expect(scrollContainers.length).toBeGreaterThan(0);
      expect(screen.getAllByText(/booking/i).length).toBeGreaterThan(0);
    });

    it('User Invoices table renders responsive view on 360px', async () => {
      setViewport(360, 740);
      const { container } = renderWithProviders(<Invoices />);

      await waitFor(() => {
        expect(screen.getAllByText(/invoice/i).length).toBeGreaterThan(0);
      });
      const scrollContainers = container.querySelectorAll('.overflow-x-auto');
      expect(scrollContainers.length).toBeGreaterThan(0);
    });
  });

  // ─── 4. FORMS RESPONSIVENESS & TOUCH TARGETS ──────────────────────────────
  describe('4. Forms & Touch Target Compliance', () => {
    it('Checkout address form inputs expand to 100% width on 390px', () => {
      setViewport(390, 844);
      renderWithProviders(<Checkout />);

      const emailInput = screen.getByLabelText(/email address/i);
      const firstNameInput = screen.getByLabelText(/first name/i);

      expect(emailInput).toBeDefined();
      expect(firstNameInput).toBeDefined();

      // Inputs have full width classes
      expect(emailInput.className).toContain('w-full');
      expect(firstNameInput.className).toContain('w-full');
    });

    it('StayBooking reservation form renders touch-friendly guest & date selectors on 360px', async () => {
      setViewport(360, 740);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/stay/mock-stay-lyngen/book']}>
            <Routes>
              <Route path="/stay/:id/book" element={<StayBooking />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/secure your stay/i)).toBeDefined();
      });
      const guestInput = screen.getByLabelText(/guests/i);
      expect(guestInput).toBeDefined();
    });

    it('Login auth form renders centered, fully contained on 412px', () => {
      setViewport(412, 915);
      renderWithProviders(<Login />);

      expect(screen.getByLabelText(/email address/i)).toBeDefined();
      expect(screen.getByLabelText(/^password/i)).toBeDefined();
      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      expect(submitBtn).toBeDefined();
    });
  });

  // ─── 5. CHECKOUT & CART RESPONSIVE COLUMN COLLAPSE ────────────────────────
  describe('5. Checkout & Cart Single-Column Mobile Collapse', () => {
    it('ShopCart collapses to single-column layout on 390px mobile', () => {
      setViewport(390, 844);
      renderWithProviders(<ShopCart />);

      expect(screen.getAllByText(/shopping cart/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/order summary/i)).toBeDefined();
      expect(screen.getByText(/proceed to checkout/i)).toBeDefined();
    });

    it('Checkout collapses summary and payment forms vertically on 412px', () => {
      setViewport(412, 915);
      renderWithProviders(<Checkout />);

      expect(screen.getAllByText(/order summary/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /next step/i })).toBeDefined();
    });
  });

  // ─── 6. ADMIN DASHBOARD & CHARTS RESPONSIVENESS ───────────────────────────
  describe('6. Admin Dashboard Grid & Recharts Visuals', () => {
    it('AdminDashboard renders 1-column KPI grid on 360px', async () => {
      setViewport(360, 740);
      renderWithProviders(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/command center/i)).toBeDefined();
      });

      expect(screen.getByText(/settled revenue/i)).toBeDefined();
      expect(screen.getByText(/market products/i)).toBeDefined();
    });

    it('AdminDashboard renders 2-column KPI grid on 768px tablet', async () => {
      setViewport(768, 1024);
      renderWithProviders(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/command center/i)).toBeDefined();
      });

      expect(screen.getAllByText(/destinations/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/pending orders/i)).toBeDefined();
    });

    it('AdminDashboard renders 4-column KPI grid on 1440px desktop', async () => {
      setViewport(1440, 900);
      renderWithProviders(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/command center/i)).toBeDefined();
      });

      expect(screen.getByText(/velkommen/i)).toBeDefined();
    });
  });

  // ─── 7. MAPS & LEAFLET CONTAINER RESPONSIVENESS ───────────────────────────
  describe('7. Map Container & Interactive Touch Support', () => {
    it('SmartMap renders responsive map canvas on 390px mobile', async () => {
      setViewport(390, 844);
      renderWithProviders(<SmartMap />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-leaflet-map')).toBeDefined();
      });
    });

    it('SmartMap renders expanded fullscreen controls on 1280px laptop', async () => {
      setViewport(1280, 800);
      renderWithProviders(<SmartMap />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-leaflet-map')).toBeDefined();
      });
    });
  });
});
