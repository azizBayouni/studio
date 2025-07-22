
'use client';

// For now, we'll store the setting in memory.
// In a real app, you might use localStorage or a server-side solution.
let defaultCurrency = 'USD'; 

export function getDefaultCurrency(): string {
  // In a real app, you might read from localStorage here.
  return defaultCurrency;
}

export function setDefaultCurrency(currency: string): void {
  // In a real app, you might write to localStorage here.
  defaultCurrency = currency;
}
