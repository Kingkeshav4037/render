import { create } from 'zustand';

export type Currency = 'NOK' | 'EUR' | 'USD' | 'GBP' | 'INR';

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountNOK: number) => string;
}

const rates: Record<Currency, number> = {
  NOK: 1,
  EUR: 0.086,
  USD: 0.093,
  GBP: 0.074,
  INR: 7.74,
};

const symbols: Record<Currency, string> = {
  NOK: 'kr ',
  EUR: '€',
  USD: '$',
  GBP: '£',
  INR: '₹',
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'NOK',
  setCurrency: (currency) => set({ currency }),
  formatPrice: (amountNOK: number) => {
    const { currency } = get();
    const rate = rates[currency];
    const converted = amountNOK * rate;
    return `${symbols[currency]}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
}));
