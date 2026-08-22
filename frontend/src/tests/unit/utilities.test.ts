/**
 * Unit Tests: Utilities, Price Calculations, Date Calculations
 *
 * Verifies:
 * - Utility functions: clsx and tailwind-merge (cn)
 * - Price calculations: Currency conversions (NOK, EUR, USD, GBP, INR), symbol rendering, formatting
 * - Cart calculations: Item additions, quantity updates, unit price multiplication, cart total accumulation
 * - Date calculations: Date differences, day counts, ISO parsing, date validation and comparison
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { cn } from '../../lib/utils';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useCartStore, CartItem } from '../../store/useCartStore';

// ─── Date Calculation Helpers Under Test ─────────────────────────────────────
export const calculateDurationDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(start) || isNaN(end)) return 0;
  const diffTime = end - start;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

export const isFutureDate = (dateStr: string): boolean => {
  const target = new Date(dateStr).getTime();
  if (isNaN(target)) return false;
  return target > Date.now();
};

export const formatISODateToStandard = (isoString: string): string => {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toISOString().split('T')[0];
};

describe('Unit Tests: Utilities, Price Calculations, Date Calculations', () => {

  // ─── 1. Utility Functions (cn) ─────────────────────────────────────────────
  describe('Utility Functions: cn (clsx + tailwind-merge)', () => {
    it('merges multiple static class strings correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-600');
      expect(result).toBe('px-4 py-2 bg-blue-600');
    });

    it('handles conditional class objects correctly', () => {
      const isPrimary = true;
      const isDisabled = false;
      const result = cn('btn', { 'btn-primary': isPrimary, 'btn-disabled': isDisabled });
      expect(result).toBe('btn btn-primary');
    });

    it('resolves and overrides conflicting Tailwind utilities properly', () => {
      const result = cn('px-4 py-2 bg-red-500', 'px-8 bg-blue-600');
      expect(result).toBe('py-2 px-8 bg-blue-600');
    });

    it('filters out falsy values (null, undefined, false, empty string)', () => {
      const result = cn('base-class', null, undefined, false, '', 'active');
      expect(result).toBe('base-class active');
    });

    it('handles nested arrays of class names', () => {
      const result = cn(['text-sm', ['font-bold', ['text-gray-700']]]);
      expect(result).toBe('text-sm font-bold text-gray-700');
    });
  });

  // ─── 2. Price Calculations (useCurrencyStore) ──────────────────────────────
  describe('Price Calculations: useCurrencyStore', () => {
    beforeEach(() => {
      useCurrencyStore.setState({ currency: 'NOK' });
    });

    it('formats price in NOK correctly with default currency', () => {
      const store = useCurrencyStore.getState();
      const formatted = store.formatPrice(1000);
      expect(formatted).toContain('kr');
      expect(formatted).toContain('1,000');
    });

    it('converts and formats price in EUR (rate: 0.086)', () => {
      useCurrencyStore.getState().setCurrency('EUR');
      const store = useCurrencyStore.getState();
      // 1000 NOK * 0.086 = 86 EUR
      const formatted = store.formatPrice(1000);
      expect(formatted).toContain('€');
      expect(formatted).toContain('86');
    });

    it('converts and formats price in USD (rate: 0.093)', () => {
      useCurrencyStore.getState().setCurrency('USD');
      const store = useCurrencyStore.getState();
      // 1000 NOK * 0.093 = 93 USD
      const formatted = store.formatPrice(1000);
      expect(formatted).toContain('$');
      expect(formatted).toContain('93');
    });

    it('converts and formats price in GBP (rate: 0.074)', () => {
      useCurrencyStore.getState().setCurrency('GBP');
      const store = useCurrencyStore.getState();
      // 1000 NOK * 0.074 = 74 GBP
      const formatted = store.formatPrice(1000);
      expect(formatted).toContain('£');
      expect(formatted).toContain('74');
    });

    it('converts and formats price in INR (rate: 7.74)', () => {
      useCurrencyStore.getState().setCurrency('INR');
      const store = useCurrencyStore.getState();
      // 1000 NOK * 7.74 = 7740 INR
      const formatted = store.formatPrice(1000);
      expect(formatted).toContain('₹');
      expect(formatted).toContain('7,740');
    });

    it('handles zero price amount across currencies gracefully', () => {
      const store = useCurrencyStore.getState();
      expect(store.formatPrice(0)).toBe('kr 0');
      useCurrencyStore.getState().setCurrency('USD');
      expect(useCurrencyStore.getState().formatPrice(0)).toBe('$0');
    });

    it('handles large and fractional price amounts correctly', () => {
      useCurrencyStore.getState().setCurrency('NOK');
      const formatted = useCurrencyStore.getState().formatPrice(1250000.5);
      expect(formatted).toContain('kr');
      expect(formatted.replace(/,/g, '')).toContain('1250000.5');
    });
  });

  // ─── 3. Cart Calculations (useCartStore) ───────────────────────────────────
  describe('Cart Calculations: useCartStore', () => {
    beforeEach(() => {
      useCartStore.getState().clearCart();
    });

    it('initializes with empty cart items and total 0', () => {
      const store = useCartStore.getState();
      expect(store.items).toEqual([]);
      expect(store.getCartTotal()).toBe(0);
    });

    it('adds item to cart and accurately calculates total price', () => {
      useCartStore.getState().addItem({
        item_type: 'ACCOMMODATION',
        item_id: 'hotel-001',
        name: 'Fjord View Cabin',
        unit_price: 1500,
        quantity: 2,
      });

      const store = useCartStore.getState();
      expect(store.items.length).toBe(1);
      expect(store.items[0].name).toBe('Fjord View Cabin');
      // 1500 * 2 = 3000
      expect(store.getCartTotal()).toBe(3000);
    });

    it('accumulates multiple distinct items in total price calculation', () => {
      useCartStore.getState().addItem({
        item_type: 'ACCOMMODATION',
        item_id: 'stay-01',
        name: 'Geiranger Lodge',
        unit_price: 2000,
        quantity: 3, // 6000
      });

      useCartStore.getState().addItem({
        item_type: 'ACTIVITY',
        item_id: 'act-01',
        name: 'Kayak Guided Tour',
        unit_price: 750,
        quantity: 2, // 1500
      });

      useCartStore.getState().addItem({
        item_type: 'TRANSPORT',
        item_id: 'trans-01',
        name: 'Scenic Train Ticket',
        unit_price: 450,
        quantity: 4, // 1800
      });

      // Total: 6000 + 1500 + 1800 = 9300
      expect(useCartStore.getState().getCartTotal()).toBe(9300);
    });

    it('increments quantity when duplicate PRODUCT item is added', () => {
      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'prod-wool-sweater',
        name: 'Norwegian Wool Sweater',
        unit_price: 1200,
        quantity: 1,
      });

      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'prod-wool-sweater',
        name: 'Norwegian Wool Sweater',
        unit_price: 1200,
        quantity: 2,
      });

      const store = useCartStore.getState();
      expect(store.items.length).toBe(1);
      expect(store.items[0].quantity).toBe(3);
      expect(store.getCartTotal()).toBe(3600);
    });

    it('updates quantity of existing item and recalculates total', () => {
      useCartStore.getState().addItem({
        item_type: 'ACTIVITY',
        item_id: 'act-ski',
        name: 'Ski Pass',
        unit_price: 600,
        quantity: 1,
      });

      const itemId = useCartStore.getState().items[0].id;
      useCartStore.getState().updateQuantity(itemId, 5);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
      expect(useCartStore.getState().getCartTotal()).toBe(3000);
    });

    it('removes item when quantity is updated to 0 or negative', () => {
      useCartStore.getState().addItem({
        item_type: 'ACTIVITY',
        item_id: 'act-glacier',
        name: 'Glacier Hike',
        unit_price: 900,
        quantity: 1,
      });

      const itemId = useCartStore.getState().items[0].id;
      useCartStore.getState().updateQuantity(itemId, 0);

      expect(useCartStore.getState().items.length).toBe(0);
      expect(useCartStore.getState().getCartTotal()).toBe(0);
    });

    it('removes item by specific ID and recalculates total', () => {
      useCartStore.getState().addItem({
        item_type: 'ACTIVITY',
        item_id: 'act-1',
        name: 'Tour A',
        unit_price: 500,
        quantity: 1,
      });

      useCartStore.getState().addItem({
        item_type: 'ACTIVITY',
        item_id: 'act-2',
        name: 'Tour B',
        unit_price: 800,
        quantity: 2,
      });

      const firstId = useCartStore.getState().items[0].id;
      useCartStore.getState().removeItem(firstId);

      expect(useCartStore.getState().items.length).toBe(1);
      expect(useCartStore.getState().items[0].name).toBe('Tour B');
      expect(useCartStore.getState().getCartTotal()).toBe(1600);
    });

    it('clears all items when clearCart is called', () => {
      useCartStore.getState().addItem({
        item_type: 'PRODUCT',
        item_id: 'p1',
        name: 'Hiking Boots',
        unit_price: 2500,
        quantity: 1,
      });

      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toEqual([]);
      expect(useCartStore.getState().getCartTotal()).toBe(0);
    });
  });

  // ─── 4. Date Calculations ──────────────────────────────────────────────────
  describe('Date Calculations: Duration, Validation, Formatting', () => {
    it('calculates trip duration days correctly for valid date ranges', () => {
      const days = calculateDurationDays('2026-08-01', '2026-08-08');
      expect(days).toBe(7);
    });

    it('returns 0 when start date is after end date', () => {
      const days = calculateDurationDays('2026-08-10', '2026-08-05');
      expect(days).toBe(0);
    });

    it('returns 0 for same-day trips or same start/end timestamps', () => {
      const days = calculateDurationDays('2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z');
      expect(days).toBe(0);
    });

    it('returns 0 when dates are invalid strings', () => {
      expect(calculateDurationDays('invalid-date', '2026-08-08')).toBe(0);
      expect(calculateDurationDays('2026-08-01', 'invalid-date')).toBe(0);
    });

    it('detects whether a date string is in the future accurately', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
      const past = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();

      expect(isFutureDate(future)).toBe(true);
      expect(isFutureDate(past)).toBe(false);
      expect(isFutureDate('invalid-date-string')).toBe(false);
    });

    it('formats ISO timestamps to standard YYYY-MM-DD format correctly', () => {
      expect(formatISODateToStandard('2026-12-25T14:30:00.000Z')).toBe('2026-12-25');
      expect(formatISODateToStandard('2026-01-01T00:00:00Z')).toBe('2026-01-01');
      expect(formatISODateToStandard('invalid')).toBe('Invalid Date');
    });
  });
});
