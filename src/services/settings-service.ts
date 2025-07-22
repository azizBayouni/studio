
'use client';

const CURRENCY_STORAGE_KEY = 'expensewise-default-currency';

// We use localStorage to persist the setting across browser sessions.
export function getDefaultCurrency(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD';
  }
  // Fallback for server-side rendering
  return 'USD';
}

export function setDefaultCurrency(currency: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }
}
