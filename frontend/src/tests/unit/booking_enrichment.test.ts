import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bookingService } from '../../services/bookingService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { name: 'Fjordview Nordic Chalet', price_per_night: 2400 },
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  },
}));

describe('Booking Service Amount Resolution & Enrichment', () => {
  it('calculates accommodation total for bookings with 0 or missing amount based on nights', async () => {
    const rawBooking = {
      id: '8bdccd05-1234-5678-9abc-def012345678',
      item_id: 'lodge-001',
      item_type: 'ACCOMMODATION',
      pax: 2,
      start_time: '2026-09-16T15:00:00Z',
      end_time: '2026-09-20T11:00:00Z', // 4 nights
      total_amount: 0,
      currency: 'NOK',
      status: 'CONFIRMED',
    };

    const enriched = await bookingService.enrichBooking(rawBooking);

    expect(enriched.nights).toBe(4);
    expect(enriched.total_amount).toBe(9600); // 4 * 2400
    expect(enriched.stay_name).toBe('Fjordview Nordic Chalet');
  });

  it('preserves restaurant table reservations with 0 deposit', async () => {
    const restaurantBooking = {
      id: 'res-rest-001',
      item_id: 'rest-nordic',
      item_type: 'RESTAURANT',
      pax: 2,
      start_time: '2026-09-10T19:00:00Z',
      end_time: '2026-09-10T21:00:00Z',
      total_amount: 0,
      currency: 'NOK',
      status: 'CONFIRMED',
    };

    const enriched = await bookingService.enrichBooking(restaurantBooking);

    expect(enriched.total_amount).toBe(0);
    expect(enriched.item_type).toBe('RESTAURANT');
  });

  it('enriches an array of bookings concurrently', async () => {
    const bookings = [
      {
        id: 'book-acc-1',
        item_id: 'lodge-001',
        item_type: 'ACCOMMODATION',
        pax: 2,
        start_time: '2026-09-16T15:00:00Z',
        end_time: '2026-09-18T11:00:00Z', // 2 nights
        total_amount: 0,
      },
      {
        id: 'book-rest-2',
        item_type: 'RESTAURANT',
        pax: 4,
        start_time: '2026-09-10T18:00:00Z',
        total_amount: 0,
      },
    ];

    const enrichedList = await bookingService.enrichBookings(bookings);

    expect(enrichedList.length).toBe(2);
    expect(enrichedList[0].total_amount).toBe(4800); // 2 * 2400
    expect(enrichedList[0].nights).toBe(2);
    expect(enrichedList[1].total_amount).toBe(0);
  });
});
