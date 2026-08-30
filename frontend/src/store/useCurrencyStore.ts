import { create } from 'zustand';

export type Currency = 'NOK' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'SEK' | 'DKK' | 'CAD' | 'AUD' | 'JPY';

export interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

export const CURRENCIES: Record<Currency, CurrencyOption> = {
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr ', flag: '🇳🇴', rate: 1 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 0.093 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.086 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.074 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 7.74 },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr ', flag: '🇸🇪', rate: 0.98 },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr ', flag: '🇩🇰', rate: 0.64 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 0.126 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 0.141 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 14.15 },
};

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountNOK: number) => string;
}

const getInitialCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('norway_preferred_currency') as Currency;
    if (saved && CURRENCIES[saved]) return saved;
  }
  return 'NOK';
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: getInitialCurrency(),
  setCurrency: (currency) => {
    if (CURRENCIES[currency]) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('norway_preferred_currency', currency);
      }
      set({ currency });
    }
  },
  formatPrice: (amountNOK: number = 0) => {
    const { currency } = get();
    const currConfig = CURRENCIES[currency] || CURRENCIES.NOK;
    const rate = currConfig.rate ?? 1;
    const safeAmount = typeof amountNOK === 'number' && !isNaN(amountNOK) ? amountNOK : 0;
    const converted = safeAmount * rate;
    const symbol = currConfig.symbol;
    
    // For currencies like JPY, round to whole numbers; for others 2 decimals if fraction exists
    const isWhole = ['JPY', 'INR', 'NOK', 'SEK', 'DKK'].includes(currConfig.code);
    const formattedNum = converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: isWhole && converted >= 100 ? 0 : 2
    });

    return `${symbol}${formattedNum}`;
  }
}));
