import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Food } from '../../pages/Food';
import { FoodDetails } from '../../pages/FoodDetails';
import { foodService, FALLBACK_RESTAURANTS } from '../../services/foodService';
import { useAuthStore } from '../../store/useAuthStore';

// Mock scrollTo
window.scrollTo = vi.fn();

describe('Restaurant Table Reservation System', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    localStorage.clear();
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'user-keshav-123', email: 'keshav@norwaysmartlife.no' } as any,
      profile: { id: 'user-keshav-123', fullName: 'Keshav Sharma', phone: '+47 987 65 432' } as any,
      loading: false,
      initialized: true,
    });
    vi.spyOn(foodService, 'getRestaurants').mockResolvedValue({
      data: [
        {
          id: '70000000-0000-4000-8000-000000000004',
          name: 'Einer',
          type: 'FINE_DINING',
          rating: 4.8,
          location: { name: 'Oslo' } as any,
          price_range: '$$$',
          image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
        } as any,
      ],
      count: 1,
    });
    vi.spyOn(foodService, 'getFoods').mockResolvedValue({
      data: [],
      count: 0,
    });
  });

  it('creates a guaranteed table reservation via foodService and caches locally', async () => {
    const result = await foodService.createTableReservation({
      restaurantId: '70000000-0000-4000-8000-000000000004',
      restaurantName: 'Einer',
      date: '2026-10-15',
      time: '19:00',
      guests: 4,
      tablePreference: 'Window View',
      guestName: 'Keshav Sharma',
      guestEmail: 'keshav@norwaysmartlife.no',
      guestPhone: '+47 987 65 432',
      specialRequests: 'Celebrating anniversary',
    });

    expect(result.success).toBe(true);
    expect(result.bookingReference).toMatch(/^TB-[A-Z0-9]{6}$/);
    expect(result.restaurantName).toBe('Einer');
    expect(result.guests).toBe(4);

    // Verify localStorage has cached the reservation
    const stored = JSON.parse(localStorage.getItem('norway_restaurant_reservations') || '{}');
    expect(Object.keys(stored).length).toBeGreaterThan(0);
    const saved = Object.values(stored)[0] as any;
    expect(saved.restaurantName).toBe('Einer');
    expect(saved.guests).toBe(4);
    expect(saved.bookingReference).toBe(result.bookingReference);
  });

  it('opens RestaurantReservationModal when clicking Reserve on the Food catalog page', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Food />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Wait for restaurant cards to appear after query resolves
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Reserve table at/i }).length).toBeGreaterThan(0);
    });

    const reserveButtons = screen.getAllByRole('button', { name: /Reserve table at/i });

    // Click the first Reserve button
    fireEvent.click(reserveButtons[0]);

    // Modal dialog should open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Instant Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Number of Guests')).toBeInTheDocument();
      expect(screen.getByText('Choose Dining Time')).toBeInTheDocument();
      expect(screen.getByText('Table Seating Preference')).toBeInTheDocument();
    });

    // Verify user info is prefilled from auth store
    const nameInput = screen.getByPlaceholderText('e.g. Keshav Sharma') as HTMLInputElement;
    expect(nameInput.value).toBe('Keshav Sharma');
    const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
    expect(emailInput.value).toBe('keshav@norwaysmartlife.no');

    // Confirm reservation
    const submitBtn = screen.getByRole('button', { name: /Confirm Table \(Free\)/i });
    fireEvent.click(submitBtn);

    // Verification screen appears
    await waitFor(() => {
      expect(screen.getByText('Your Table is Reserved!')).toBeInTheDocument();
      expect(screen.getByText('Booking Reference')).toBeInTheDocument();
      expect(screen.getByText('View in My Bookings')).toBeInTheDocument();
    });
  });
});
