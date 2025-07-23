
'use client';

const THEME_STORAGE_KEY = 'expensewise-theme';
export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'dark';
  }
  return 'dark';
}

export function setTheme(theme: Theme): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }
}
