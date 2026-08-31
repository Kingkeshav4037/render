import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Food } from '../../pages/Food';
import { FoodDetails } from '../../pages/FoodDetails';
import { Products } from '../../pages/marketplace/Products';
import { ProductDetails } from '../../pages/marketplace/ProductDetails';
import { ShopCart } from '../../pages/marketplace/ShopCart';
import { FoodItemModal } from '../../components/food/FoodItemModal';
import { ProductDetailModal } from '../../components/marketplace/ProductDetailModal';
import { CartDrawer } from '../../components/commerce/CartDrawer';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { foodService } from '../../services/foodService';
import { shopService } from '../../services/shopService';
import { supabase } from '../../lib/supabase';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useParams: () => ({ id: 'prod-thermostat-1' }),
  };
});


// Mock Supabase
vi.mock('../../lib/supabase', () => {
  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Smart Eco Thermostat',
      category: 'Smart Home',
      price: 1890,
      co2: -15.4,
      rating: 4.8,
      stock: 25,
      img: '/images/product_thermostat.jpg',
    },
    {
      id: 'prod-2',
      name: 'EV Smart Cable 22kW',
      category: 'EV Mobility',
      price: 3490,
      co2: -24.8,
      rating: 4.9,
      stock: 12,
      img: '/images/product_charger.jpg',
    },
  ];

  const mockFrom = vi.fn((table: string) => {
    if (table === 'products') {
      const builder: any = {
        data: mockProducts,
        error: null,
      };
      builder.select = vi.fn(() => builder);
      builder.eq = vi.fn((field: string, val: any) => {
        const item = mockProducts.find(p => (p as any)[field] === val);
        return {
          ...builder,
          data: item ? [item] : [],
          maybeSingle: vi.fn().mockResolvedValue({ data: item || null, error: null }),
          single: vi.fn().mockResolvedValue({ data: item || null, error: null }),
        };
      });
      builder.then = (resolve: any) => Promise.resolve({ data: mockProducts, error: null }).then(resolve);
      return builder;
    }

    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'order-1', status: 'PAID' }, error: null }),
    };
  });

  return {
    supabase: {
      from: mockFrom,
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1', email: 'olav@nordic.no' } }, error: null }),
      },
    },
  };
});

// Mock foodService
vi.mock('../../services/foodService', async () => {
  const actual = await vi.importActual('../../services/foodService');
  return {
    ...actual,
    foodService: {
      getFoods: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'food-1',
            name: 'Fårikål',
            description: 'Traditional mutton and cabbage stew.',
            category: 'Traditional Stew',
            image_url: '/images/food_salmon_1787013684123.jpg',
            featured: true,
            prep_time: '2.5 hrs',
            price: 245,
          },
          {
            id: 'food-2',
            name: 'Gravlaks',
            description: 'Dill-cured Arctic salmon slices.',
            category: 'Seafood',
            image_url: '/images/food_salmon_1787013684123.jpg',
            featured: false,
            prep_time: '20 mins',
            price: 280,
          },
        ],
        count: 2,
      }),
      getRestaurants: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'rest-1',
            name: 'Fjordblick Kitchen',
            type: 'NEW_NORDIC',
            rating: 4.9,
            location: { name: 'Bergen' },
            price_range: '$$$',
            image_url: '/images/food_salmon_1787013684123.jpg',
          },
        ],
        count: 1,
      }),
      getRestaurantById: vi.fn().mockResolvedValue({
        id: 'rest-1',
        name: 'Fjordblick Kitchen',
        description: 'Spectacular dining on the edge of the Geirangerfjord.',
        rating: 4.9,
        price_range: '$$$',
        location: { name: 'Geiranger' },
        menu: [
          {
            category: 'Tasting Menu Highlights',
            items: [
              { name: 'Smoked Lofoten Halibut', description: 'Wood-fired halibut with pickled spruce tips', price: '320 NOK' },
              { name: 'Braised Reindeer Shank', description: 'Lingonberry jus and celeriac purée', price: '410 NOK' },
            ],
          },
        ],
        photos: ['/images/food_salmon_1787013684123.jpg'],
      }),
    },
    getFoodImage: () => '/images/food_salmon_1787013684123.jpg',
    getFoodPrice: (_name: string, price?: number) => price || 245,
  };
});

describe('Food & Shop Connected Production-Hardened Flows', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    useCartStore.getState().clearCart();
    useCartStore.getState().setIsOpen(false);
    useAuthStore.setState({
      user: { id: 'test-user-1', email: 'test@norwaysmartlife.com' } as any,
      profile: { id: 'test-user-1', fullName: 'Test User', gender: 'Female', dateOfBirth: '1995-01-01', address: 'Karl Johans gate 1', country: 'Norway' } as any,
      loading: false,
      initialized: true,
    });
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  describe('Food Ordering Flow', () => {
    it('renders traditional dishes and opens FoodItemModal on dish click', async () => {
      renderWithProviders(<Food />);

      await waitFor(() => {
        expect(screen.getByText('Fårikål')).toBeInTheDocument();
      });

      // Click dish card to open FoodItemModal
      fireEvent.click(screen.getByText('Fårikål'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Heritage & Story')).toBeInTheDocument();
        expect(screen.getByText('Artisanal Ingredients')).toBeInTheDocument();
      });
    });

    it('manages quantity and adds food item to cart from FoodItemModal', async () => {
      const mockDish = {
        id: 'food-1',
        name: 'Fårikål',
        description: 'Traditional mutton and cabbage stew.',
        image_url: '/images/food_salmon_1787013684123.jpg',
      };
      const onClose = vi.fn();

      renderWithProviders(<FoodItemModal food={mockDish} onClose={onClose} />);

      expect(screen.getByText('Fårikål')).toBeInTheDocument();

      // Increase quantity to 2
      const plusBtn = screen.getByLabelText('Increase quantity');
      fireEvent.click(plusBtn);

      // Click Add to Cart
      const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
      fireEvent.click(addToCartBtn);

      const cartItems = useCartStore.getState().items;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].name).toBe('Fårikål');
      expect(cartItems[0].quantity).toBe(2);
      expect(cartItems[0].unit_price).toBe(245);
    });

    it('allows ordering menu items directly from restaurant page', async () => {
      renderWithProviders(<FoodDetails />);

      await waitFor(() => {
        expect(screen.getByText('Smoked Lofoten Halibut')).toBeInTheDocument();
      });

      const addOrderButtons = screen.getAllByRole('button', { name: /Add to Order/i });
      expect(addOrderButtons.length).toBeGreaterThan(0);

      // Order first menu item
      fireEvent.click(addOrderButtons[0]);

      const cartItems = useCartStore.getState().items;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].name).toContain('Smoked Lofoten Halibut');
      expect(cartItems[0].unit_price).toBe(320);
    });
  });

  describe('Shop Ordering Flow', () => {
    it('renders marketplace products and opens ProductDetailModal on click', async () => {
      renderWithProviders(<Products />);

      await waitFor(() => {
        expect(screen.getByText('Smart Eco Thermostat')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Smart Eco Thermostat'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Key Highlights')).toBeInTheDocument();
        expect(screen.getByText('Specifications')).toBeInTheDocument();
      });
    });

    it('supports quantity adjustment and Buy Now in ProductDetailModal', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Smart Eco Thermostat',
        category: 'Smart Home',
        price: 1890,
        co2: -15.4,
        rating: 4.8,
        stock: 25,
        img: '/images/products/thermostat.jpg',
        created_at: new Date().toISOString(),
      };
      const onClose = vi.fn();

      renderWithProviders(<ProductDetailModal product={mockProduct as any} onClose={onClose} />);

      // Increase quantity
      const plusBtn = screen.getByLabelText('Increase quantity');
      fireEvent.click(plusBtn);

      // Click Buy Now
      const buyNowBtn = screen.getByRole('button', { name: /Buy Now/i });
      fireEvent.click(buyNowBtn);

      const cartItems = useCartStore.getState().items;
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].name).toBe('Smart Eco Thermostat');
      expect(cartItems[0].quantity).toBe(2);
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });
  });

  describe('Cart Drawer & Quantity Management', () => {
    it('renders cart items with live quantity increment and decrement', () => {
      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'prod-1',
        name: 'Nordic Wool Layer',
        unit_price: 1290,
        quantity: 2,
      });
      useCartStore.getState().setIsOpen(true);

      renderWithProviders(<CartDrawer />);

      expect(screen.getByText('Nordic Wool Layer')).toBeInTheDocument();

      // Find increase quantity button
      const increaseBtn = screen.getByLabelText('Increase quantity');
      fireEvent.click(increaseBtn);

      expect(useCartStore.getState().items[0].quantity).toBe(3);

      // Find decrease quantity button
      const decreaseBtn = screen.getByLabelText('Decrease quantity');
      fireEvent.click(decreaseBtn);

      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });

    it('navigates to checkout when clicking Proceed to Checkout', () => {
      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'prod-1',
        name: 'Nordic Wool Layer',
        unit_price: 1290,
        quantity: 1,
      });
      useCartStore.getState().setIsOpen(true);

      renderWithProviders(<CartDrawer />);

      const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
      fireEvent.click(checkoutBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });
  });

  describe('Shop Dedicated Pages & Cart Flow', () => {
    it('renders dedicated ProductDetails page with specs, stock, and Add to Cart', async () => {
      renderWithProviders(<ProductDetails />);

      await waitFor(() => {
        expect(screen.getAllByText('Smart Eco Thermostat').length).toBeGreaterThan(0);
        expect(screen.getByText(/Technical Specifications/i)).toBeInTheDocument();
        expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
        expect(screen.getByText(/Circularity & Materials/i)).toBeInTheDocument();
      });


      const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
      fireEvent.click(addToCartBtn);

      const items = useCartStore.getState().items;
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].name).toBe('Smart Eco Thermostat');
    });

    it('renders ShopCart page with free shipping progress and handles quantity updates and clear cart', () => {
      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'prod-thermostat-1',
        name: 'Smart Eco Thermostat',
        unit_price: 1890,
        quantity: 1,
      });

      renderWithProviders(<ShopCart />);

      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText('Smart Eco Thermostat')).toBeInTheDocument();
      expect(screen.getByText(/Free Carbon-Neutral Eco-Delivery/i)).toBeInTheDocument();

      // Test quantity increase
      const increaseBtn = screen.getByLabelText('Increase item quantity');
      fireEvent.click(increaseBtn);
      expect(useCartStore.getState().items[0].quantity).toBe(2);

      // Test Clear Cart
      const clearBtn = screen.getByRole('button', { name: /Clear Cart/i });
      fireEvent.click(clearBtn);
      expect(useCartStore.getState().items).toHaveLength(0);
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });
});

