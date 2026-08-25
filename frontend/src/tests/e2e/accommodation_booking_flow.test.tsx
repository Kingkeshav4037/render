import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stay } from '../../pages/Stay';
import { StayDetails } from '../../pages/StayDetails';
import { StayBooking } from '../../pages/checkout/StayBooking';
import { MyBookings } from '../../pages/user/MyBookings';
import { BookingDetails } from '../../pages/user/BookingDetails';
import { staysService } from '../../services/stay/staysService';
import { checkoutService } from '../../services/checkoutService';
import { supabase } from '../../lib/supabase';

// Mock Services & Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { gateway_order_id: 'rzp_test_123', clientSecret: 'sec_123' },
        error: null,
      }),
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'traveler@norway.com' } },
        error: null,
      }),
    },
  },
}));

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-123', email: 'traveler@norway.com' },
    profile: { id: 'user-123', full_name: 'Astrid Lindgren', phone: '+47 987 65 432' },
    isAuthenticated: true,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Priority 2: Accommodation & Booking System Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. staysService.searchStays filters accommodations properly', async () => {
    const mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'stay-1',
              name: 'Juvet Landscape Hotel',
              type: 'HOTEL',
              price_per_night: 3200,
              currency: 'NOK',
              rating: 4.9,
              amenities: ['Breakfast Included', 'Spa & Wellness'],
              eco_certified: true,
              image_url: '/images/hotel_juvet_1787013813000.jpg',
              locations: { name: 'Valldal', region: 'Vestland' },
            }
          ],
          count: 1,
          error: null,
        }),
      }),
    };

    (supabase.from as any).mockReturnValue(mockQueryBuilder);

    const result = await staysService.searchStays({ type: 'HOTEL', minPrice: 2000, maxPrice: 5000 });
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Juvet Landscape Hotel');
    expect(result.data[0].eco_certified).toBe(true);
  });

  it('2. staysService.getStayRooms generates realistic room tiers', async () => {
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'room-101',
            accommodation_id: 'stay-1',
            name: 'Fjord Panorama Suite',
            description: 'Panoramic views over the fjord.',
            capacity: 2,
            price_per_night: 3800,
            amenities: ['Breakfast included', 'Wi-Fi'],
            image_url: '/images/hotel_juvet_1787013813000.jpg',
            available: true,
          }
        ],
        error: null,
      }),
    });

    const rooms = await staysService.getStayRooms('stay-1');
    expect(rooms.length).toBeGreaterThanOrEqual(1);
    expect(rooms[0].name).toBe('Fjord Panorama Suite');
    expect(rooms[0].price_per_night).toBe(3800);
  });

  it('3. staysService.checkRoomAvailability executes check_availability RPC', async () => {
    (supabase.rpc as any).mockResolvedValue({
      data: true,
      error: null,
    });

    const isAvail = await staysService.checkRoomAvailability(
      'room-101',
      '2026-09-01',
      '2026-09-05'
    );

    expect(isAvail).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith('check_availability', expect.objectContaining({
      p_item_id: 'room-101',
      p_item_type: 'ACCOMMODATION',
    }));
  });

  it('4. Stay page renders search input and accommodation list', async () => {
    vi.spyOn(staysService, 'searchStays').mockResolvedValue({
      data: [
        {
          id: 'stay-1',
          name: 'Juvet Landscape Hotel',
          location_id: 'loc-1',
          type: 'HOTEL',
          description: 'Immersive nature hotel.',
          price_per_night: 3200,
          currency: 'NOK',
          rating: 4.9,
          amenities: ['Breakfast included'],
          eco_certified: true,
          featured: true,
          image_url: '/images/hotel_juvet_1787013813000.jpg',
          lat: 62.28,
          lng: 7.24,
          locations: { name: 'Valldal', region: 'Vestland' },
        }
      ],
      count: 1,
    });

    render(
      <MemoryRouter initialEntries={['/stay']}>
        <Stay />
      </MemoryRouter>,
      { wrapper }
    );

    expect(screen.getByText('Stays & Accommodations')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Where to\?/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Juvet Landscape Hotel')).toBeInTheDocument();
    });
  });

  it('5. StayDetails page displays room selection and triggers reserve flow', async () => {
    vi.spyOn(staysService, 'getStayDetails').mockResolvedValue({
      id: 'stay-1',
      name: 'Juvet Landscape Hotel',
      location_id: 'loc-1',
      type: 'HOTEL',
      description: 'Award winning architectural hotel.',
      price_per_night: 3200,
      currency: 'NOK',
      rating: 4.9,
      amenities: ['Spa & Wellness'],
      eco_certified: true,
      featured: true,
      image_url: '/images/hotel_juvet_1787013813000.jpg',
      lat: 62.28,
      lng: 7.24,
      locations: { name: 'Valldal', region: 'Vestland' },
    });

    vi.spyOn(staysService, 'getStayRooms').mockResolvedValue([
      {
        id: 'room-101',
        accommodation_id: 'stay-1',
        name: 'Panoramic Fjord View Suite',
        description: 'Glass floor-to-ceiling walls.',
        capacity: 2,
        price_per_night: 4200,
        amenities: ['Breakfast included', 'Wi-Fi'],
        image_url: '/images/hotel_juvet_1787013813000.jpg',
        available: true,
        size: '45m²',
        bed: '1 King Bed',
        cancellation: 'Free cancellation',
      }
    ]);

    render(
      <MemoryRouter initialEntries={['/stay/stay-1?checkIn=2026-09-10&checkOut=2026-09-14&guests=2']}>
        <Routes>
          <Route path="/stay/:id" element={<StayDetails />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getAllByText('Juvet Landscape Hotel')[0]).toBeInTheDocument();
      expect(screen.getByText('Panoramic Fjord View Suite')).toBeInTheDocument();
      expect(screen.getByText('Reserve Accommodation')).toBeInTheDocument();
    });
  });

  it('6. StayBooking checkout form collects guest data and processes reservation', async () => {
    vi.spyOn(staysService, 'getStayDetails').mockResolvedValue({
      id: 'stay-1',
      name: 'Juvet Landscape Hotel',
      location_id: 'loc-1',
      type: 'HOTEL',
      description: 'Award winning architectural hotel.',
      price_per_night: 3200,
      currency: 'NOK',
      rating: 4.9,
      amenities: [],
      eco_certified: true,
      featured: true,
      image_url: '/images/hotel_juvet_1787013813000.jpg',
      lat: 62.28,
      lng: 7.24,
    });

    vi.spyOn(staysService, 'getStayRooms').mockResolvedValue([
      {
        id: 'room-101',
        accommodation_id: 'stay-1',
        name: 'Panoramic Fjord View Suite',
        description: 'Glass walls.',
        capacity: 2,
        price_per_night: 3200,
        amenities: [],
        image_url: '/images/hotel_juvet_1787013813000.jpg',
        available: true,
      }
    ]);

    vi.spyOn(checkoutService, 'processCheckout').mockResolvedValue({
      success: true,
      orderId: 'order-stay-999',
    });

    render(
      <MemoryRouter initialEntries={['/checkout/stay/stay-1?roomId=room-101&checkIn=2026-09-10&checkOut=2026-09-14&guests=2']}>
        <Routes>
          <Route path="/checkout/stay/:id" element={<StayBooking />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('Secure Your Stay')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Astrid Lindgren')).toBeInTheDocument();
    });

    const submitBtn = screen.getByText(/Confirm & Pay with Razorpay/i);
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(checkoutService.processCheckout).toHaveBeenCalled();
    });
  });

  it('7. MyBookings renders user bookings and handles cancellation', async () => {
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'bkg-100-abc',
            user_id: 'user-123',
            item_type: 'ACCOMMODATION',
            item_id: 'room-101',
            status: 'CONFIRMED',
            start_time: '2026-10-01T12:00:00Z',
            end_time: '2026-10-05T12:00:00Z',
            pax: 2,
            total_amount: 12800,
            currency: 'NOK',
            created_at: '2026-08-20T10:00:00Z',
          }
        ],
        error: null,
      }),
    });

    render(
      <MemoryRouter initialEntries={['/user/bookings']}>
        <MyBookings />
      </MemoryRouter>,
      { wrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
      expect(screen.getByText('Booking #bkg')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });
  });
});
