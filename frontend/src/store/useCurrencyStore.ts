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
  formatPrice: (amountNOK: number = 0) => {
    const { currency } = get();
    const validCurrency = rates[currency] ? currency : 'NOK';
    const rate = rates[validCurrency] ?? 1;
    const safeAmount = typeof amountNOK === 'number' && !isNaN(amountNOK) ? amountNOK : 0;
    const converted = safeAmount * rate;
    const symbol = symbols[validCurrency] ?? 'kr ';
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
}));
