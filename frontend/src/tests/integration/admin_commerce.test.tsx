import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminOrders } from '../../pages/admin/commerce/AdminOrders';
import { AdminProducts } from '../../pages/admin/commerce/AdminProducts';
import { supabase } from '../../lib/supabase';
import { shopService } from '../../services/shopService';

// Mock Auth Store
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'usr-admin-001', email: 'admin@norwaysmartlife.no' },
    profile: { id: 'usr-admin-001', fullName: 'Super Admin', role: 'ADMIN', permissions: ['admin', 'orders.manage', 'products.manage'] },
    loading: false,
    initialized: true,
    isAdmin: true,
    isProvider: false,
    isAnalyst: false,
    permissions: ['admin', 'orders.manage', 'products.manage'],
    mfaLevel: 'aal2' as const,
    hasPermission: () => true,
    signOut: vi.fn(),
  };
  const mockHook: any = (selector?: any) => {
    if (typeof selector === 'function') return selector(store);
    return store;
  };
  mockHook.getState = () => store;
  mockHook.setState = vi.fn();
  return { useAuthStore: mockHook };
});

// Mock Currency Store
vi.mock('../../store/useCurrencyStore', () => ({
  useCurrencyStore: () => ({
    currency: 'NOK',
    formatPrice: (amount: number = 0) => `NOK ${(amount || 0).toLocaleString()}`,
    setCurrency: vi.fn(),
  }),
}));

// Mock Sonner Toast
vi.mock('sonner', () => {
  const mockToast: any = vi.fn();
  mockToast.error = vi.fn();
  mockToast.success = vi.fn();
  mockToast.info = vi.fn();
  return { toast: mockToast, Toaster: () => null };
});

describe('Admin Commerce Integration Tests (Requirement 23)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AdminOrders Component', () => {
    it('renders admin orders overview, KPIs, and table columns', async () => {
      render(
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Order & Commerce Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Paid & Confirmed/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending Payment/i)).toBeInTheDocument();
      });

      // Search bar and filters
      expect(screen.getByPlaceholderText(/Search Order ID, user, or item/i)).toBeInTheDocument();
    });

    it('filters orders by search query', async () => {
      render(
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Smart Eco Thermostat/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search Order ID, user, or item/i);
      fireEvent.change(searchInput, { target: { value: 'Salmon' } });

      await waitFor(() => {
        expect(screen.queryByText(/Smart Eco Thermostat/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Fjord Salmon Platter/i)).toBeInTheDocument();
      });
    });

    it('opens order details modal when eye button is clicked', async () => {
      render(
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Smart Eco Thermostat/i)).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByTitle(/View Order Details/i);
      expect(viewButtons.length).toBeGreaterThan(0);
      fireEvent.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Order Inspection/i)).toBeInTheDocument();
        expect(screen.getByText(/Ordered Items/i)).toBeInTheDocument();
        expect(screen.getByText(/25% Norwegian MVA/i)).toBeInTheDocument();
        expect(screen.getByText(/Generate MVA Invoice/i)).toBeInTheDocument();
      });
    });
  });

  describe('AdminProducts Component', () => {
    beforeEach(() => {
      vi.spyOn(shopService, 'getProducts').mockResolvedValue({
        data: [
          {
            id: 'prod-1',
            name: 'Smart Eco Thermostat',
            category: 'Smart Home',
            price: 1890,
            rating: 4.9,
            stock: 24,
            co2: -15.4,
            img: '/images/product_thermostat.jpg',
            gallery: [],
            description: 'Precision Nordic climate thermostat.',
            specs: {},
            features: [],
            materials: 'Aluminium',
            origin: 'Norway',
            warranty: '5-Year'
          },
          {
            id: 'prod-2',
            name: 'Nordic Merino Wool Sweater',
            category: 'Apparel',
            price: 1200,
            rating: 4.8,
            stock: 3,
            co2: -5.0,
            img: '/images/product_sweater.jpg',
            gallery: [],
            description: 'Handcrafted wool sweater.',
            specs: {},
            features: [],
            materials: '100% Wool',
            origin: 'Norway',
            warranty: '2-Year'
          }
        ],
        error: null
      });
    });

    it('renders products inventory and stock level statistics', async () => {
      render(
        <MemoryRouter>
          <AdminProducts />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Marketplace & Stock Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Catalog SKUs/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Units in Stock/i)).toBeInTheDocument();
      });
    });

    it('filters products by stock warning categories', async () => {
      render(
        <MemoryRouter>
          <AdminProducts />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search products by name or category/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search products by name or category/i);
      fireEvent.change(searchInput, { target: { value: 'Wool' } });

      await waitFor(() => {
        expect(screen.getByText(/Nordic Merino Wool Sweater/i)).toBeInTheDocument();
      });
    });
  });
});
