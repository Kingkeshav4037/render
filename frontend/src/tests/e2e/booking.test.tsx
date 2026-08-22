import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StayBooking } from '../../pages/checkout/StayBooking';
import { staysService } from '../../services/stay/staysService';
import { useCartStore } from '../../store/useCartStore';

// Mock staysService
vi.mock('../../services/stay/staysService', () => ({
  staysService: {
    getRoomDetails: vi.fn(),
  },
}));

// Mock react-router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('E2E Journey 3: Booking & Payment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().clearCart();
  });

  it('allows a user to book a stay and initiates payment', async () => {
    // Mock room data
    (staysService.getRoomDetails as any).mockResolvedValue({
      id: 'room-123',
      name: 'Deluxe Fjord View',
      description: 'A beautiful room',
      price_per_night: 1500,
      capacity: 2,
      image_url: 'https://example.com/image.jpg'
    });

    render(
      <MemoryRouter initialEntries={['/checkout/booking/room-123']}>
        <Routes>
          <Route path="/checkout/booking/:roomId" element={<StayBooking />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial state is loading, wait for room data to load
    await waitFor(() => {
      expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    });

    // Fill dates
    const checkin = screen.getByLabelText(/Check-in/i);
    const checkout = screen.getByLabelText(/Check-out/i);
    
    // Simulate setting dates by using default or changing values
    // In actual implementation date inputs are type=date
    fireEvent.change(checkin, { target: { value: '2026-09-01' } });
    fireEvent.change(checkout, { target: { value: '2026-09-05' } });

    // Proceed to add to cart
    const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(addToCartBtn);

    // Verify item added to cart
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].item_id).toBe('room-123');
    expect(items[0].quantity).toBe(4); // 4 nights

    // Verify navigation to checkout
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
