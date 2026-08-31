import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Food } from '../../pages/Food';
import { Products } from '../../pages/marketplace/Products';
import { ProductDetails } from '../../pages/marketplace/ProductDetails';
import { ShopCart } from '../../pages/marketplace/ShopCart';
import { CartDrawer } from '../../components/commerce/CartDrawer';
import { Checkout } from '../../pages/checkout/Checkout';
import { PaymentSuccess } from '../../pages/checkout/PaymentSuccess';
import { PaymentFailure } from '../../pages/checkout/PaymentFailure';
import { useCartStore } from '../../store/useCartStore';
import { shopService } from '../../services/shopService';
import { foodService } from '../../services/foodService';
import { supabase } from '../../lib/supabase';

// Mock Auth Store
vi.mock('../../store/useAuthStore', () => {
  const store = {
    user: { id: 'usr-audit-001', email: 'auditor@norwaysmartlife.no' },
    profile: { id: 'usr-audit-001', fullName: 'Auditor Nord', role: 'USER', permissions: ['user:read'] },
    loading: false,
    initialized: true,
    isAdmin: false,
    isProvider: false,
    isAnalyst: false,
    permissions: ['user:read'],
    mfaLevel: 'aal1' as const,
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

describe('UI/UX, Image & Button Comprehensive Audit (Req 24, 25, 26)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    useCartStore.getState().clearCart();

    vi.spyOn(foodService, 'getFoods').mockResolvedValue({
      data: [
        {
          id: 'food-farikal-1',
          name: 'Fårikål',
          description: 'Traditional slow-simmered lamb and cabbage stew seasoned with whole black peppercorns.',
          price: 198,
          currency: 'NOK',
          category: 'stew',
          image_url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          featured: true
        } as any,
        {
          id: 'food-brunost-2',
          name: 'Brunost & Waffles',
          description: 'Heart-shaped waffles served with sweet caramelised goat milk brown cheese and sour cream.',
          price: 89,
          currency: 'NOK',
          category: 'dairy',
          image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1200',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          featured: false
        } as any
      ],
      count: 2
    });

    vi.spyOn(foodService, 'getRestaurants').mockResolvedValue({
      data: [
        {
          id: 'rest-maaemo-1',
          name: 'Maaemo',
          description: 'Three Michelin starred New Nordic restaurant in Oslo.',
          cuisine: ['NEW_NORDIC'],
          type: 'FINE_DINING',
          image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any
      ],
      count: 1
    });

    vi.spyOn(shopService, 'getProducts').mockResolvedValue({
      data: [
        {
          id: 'prod-thermostat-1',
          name: 'Smart Eco Thermostat',
          category: 'Smart Home',
          price: 1890,
          currency: 'NOK',
          rating: 4.9,
          stock: 24,
          co2: -15.4,
          img: '/images/product_thermostat.jpg',
          gallery: ['/images/product_thermostat.jpg'],
          description: 'Precision Nordic climate thermostat.',
          specs: {},
          features: [],
          materials: 'Aluminium',
          origin: 'Norway',
          warranty: '5-Year',
          tags: ['eco', 'smart-home']
        } as any,
        {
          id: 'prod-sweater-2',
          name: 'Nordic Merino Wool Sweater',
          category: 'Apparel',
          price: 1200,
          currency: 'NOK',
          rating: 4.8,
          stock: 3,
          co2: -5.0,
          img: '/images/product_sweater.jpg',
          gallery: ['/images/product_sweater.jpg'],
          description: 'Handcrafted wool sweater.',
          specs: {},
          features: [],
          materials: '100% Wool',
          origin: 'Norway',
          warranty: '2-Year',
          tags: ['wool', 'apparel']
        } as any
      ],
      error: null
    });

    vi.spyOn(shopService, 'getProductById').mockImplementation(async (id: string) => ({
      id: id || 'prod-thermostat-1',
      name: 'Smart Eco Thermostat',
      category: 'Smart Home',
      price: 1890,
      currency: 'NOK',
      rating: 4.9,
      stock: 24,
      co2: -15.4,
      img: '/images/product_thermostat.jpg',
      gallery: ['/images/product_thermostat.jpg'],
      description: 'Precision Nordic climate thermostat.',
      specs: { 'Connectivity': 'Zigbee 3.0', 'Power': '230V AC' },
      features: ['Nord Pool dynamic hourly price optimization'],
      materials: 'Aluminium',
      origin: 'Norway',
      warranty: '5-Year'
    } as any));
  });

  const renderWithProviders = (ui: React.ReactElement, initialEntries = ['/']) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  describe('Requirement 24: UI/UX & Visual States', () => {
    it('renders empty cart state with call to action navigation buttons', () => {
      renderWithProviders(<ShopCart />);
      expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Explore Shop & Gear/i })).toHaveAttribute('href', '/shop');
      expect(screen.getByRole('link', { name: /Browse Culinary & Dining/i })).toHaveAttribute('href', '/food');
    });

    it('renders empty CartDrawer state with culinary and shop exploration buttons', () => {
      useCartStore.setState({ isOpen: true, items: [] });
      renderWithProviders(<CartDrawer />);
      expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Taste Norway Cuisine/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Browse Eco Shop/i })).toBeInTheDocument();
    });
  });

  describe('Requirement 25: Image Audit & Uniqueness', () => {
    it('audits food images to ensure proper alt texts and non-empty image sources', async () => {
      renderWithProviders(<Food />);
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img.getAttribute('alt')).not.toBe('');
        });
      });
    });

    it('audits shop products to ensure every product has a valid image and alt tag', async () => {
      renderWithProviders(<Products />);
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img.getAttribute('alt')).not.toBe('');
        });
      });
    });
  });

  describe('Requirement 26: Button Action Audit across Flows', () => {
    it('validates Add to Cart, quantity increase, and quantity decrease in Food flow', async () => {
      renderWithProviders(<Food />);

      await waitFor(() => {
        expect(screen.getByText(/Fårikål/i)).toBeInTheDocument();
      });

      // Find "Order Dish" button
      const orderDishBtn = screen.getAllByRole('button', { name: /Order Dish/i })[0];
      expect(orderDishBtn).toBeInTheDocument();
      fireEvent.click(orderDishBtn);

      // Verify item was added into CartStore
      expect(useCartStore.getState().items.length).toBeGreaterThan(0);
    });

    it('validates Add to Cart and Buy Now buttons in Product Details flow', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shop/:id" element={<ProductDetails />} />
        </Routes>,
        ['/shop/prod-thermostat-1']
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Smart Eco Thermostat/i).length).toBeGreaterThan(0);
      });

      // Test Increase Quantity button
      const increaseBtn = screen.getByRole('button', { name: /Increase quantity/i });
      fireEvent.click(increaseBtn);

      // Test Add to Cart button
      const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
      fireEvent.click(addToCartBtn);

      expect(useCartStore.getState().items.length).toBe(1);
      expect(useCartStore.getState().items[0].quantity).toBe(2);

      // Test Buy Now button
      const buyNowBtn = screen.getByRole('button', { name: /Buy Now/i });
      expect(buyNowBtn).toBeInTheDocument();
      fireEvent.click(buyNowBtn);
    });

    it('validates Increase Quantity, Decrease Quantity, Remove Item, and Clear Cart in ShopCart', () => {
      useCartStore.getState().addItem({
        item_id: 'prod-audit-1',
        name: 'Smart Eco Thermostat',
        unit_price: 1890,
        quantity: 2,
        item_type: 'PRODUCT',
        image: '/images/product_thermostat.jpg'
      });

      renderWithProviders(<ShopCart />);

      expect(screen.getByText(/Smart Eco Thermostat/i)).toBeInTheDocument();

      // Test Increase Quantity
      const plusBtn = screen.getByRole('button', { name: /Increase item quantity/i });
      fireEvent.click(plusBtn);
      expect(useCartStore.getState().items[0].quantity).toBe(3);

      // Test Decrease Quantity
      const minusBtn = screen.getByRole('button', { name: /Decrease item quantity/i });
      fireEvent.click(minusBtn);
      expect(useCartStore.getState().items[0].quantity).toBe(2);

      // Test Clear Cart
      const clearBtn = screen.getByRole('button', { name: /Clear Cart/i });
      fireEvent.click(clearBtn);
      expect(useCartStore.getState().items.length).toBe(0);
    });

    it('validates Retry Payment, Return to Cart, and Contact Support buttons on PaymentFailure', () => {
      renderWithProviders(
        <Routes>
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>,
        ['/payment-failure?reason=DECLINED&order_id=ord-test-123']
      );

      expect(screen.getByText(/Payment Declined/i)).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /Retry Payment/i });
      expect(retryBtn).toBeInTheDocument();

      const returnCartBtn = screen.getByRole('button', { name: /View Saved Cart/i });
      expect(returnCartBtn).toBeInTheDocument();

      const contactBtn = screen.getByRole('link', { name: /Email Support/i });
      expect(contactBtn).toHaveAttribute('href', expect.stringContaining('mailto:support@norwaysmartlife.no'));
    });

    it('validates Continue Shopping and View Orders buttons on PaymentSuccess', async () => {
      vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
        if (table === 'orders') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    id: 'ord-success-123',
                    user_id: 'usr-audit-001',
                    total_amount: 1890,
                    currency: 'NOK',
                    status: 'PAID',
                    created_at: new Date().toISOString()
                  },
                  error: null
                })
              })
            })
          } as any;
        }
        if (table === 'order_items') {
          return {
            select: () => ({
              eq: async () => ({
                data: [
                  {
                    id: 'item-1',
                    order_id: 'ord-success-123',
                    description: 'Smart Eco Thermostat',
                    amount: 1890,
                    currency: 'NOK',
                    quantity: 1,
                    item_type: 'PRODUCT'
                  }
                ],
                error: null
              })
            })
          } as any;
        }
        if (table === 'payment_transactions') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    id: 'tx-1',
                    gateway: 'Razorpay',
                    gateway_order_id: 'rzp_ord_123',
                    amount: 1890,
                    currency: 'NOK',
                    status: 'SUCCESS'
                  },
                  error: null
                })
              })
            })
          } as any;
        }
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
            order: () => ({ data: [], error: null }),
            limit: () => ({ data: [], error: null })
          })
        } as any;
      });

      renderWithProviders(
        <Routes>
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>,
        ['/payment-success?order_id=ord-success-123&amount=1890']
      );

      await waitFor(() => {
        expect(screen.getByText(/Order & Payment Confirmed!/i)).toBeInTheDocument();
      });

      const continueBtn = screen.getByRole('link', { name: /Continue Shopping/i });
      expect(continueBtn).toHaveAttribute('href', '/shop');

      const viewBookingsBtn = screen.getByRole('link', { name: /View in Bookings & Orders Dashboard/i });
      expect(viewBookingsBtn).toHaveAttribute('href', '/user/bookings');
    });
  });
});
