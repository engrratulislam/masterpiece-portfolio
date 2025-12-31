'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize theme after hydration
  useEffect(() => {
    // Check what theme was set by the script or default to light
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeState(currentTheme);
    setIsHydrated(true);
  }, []);

  // Apply theme changes (only when user actively changes theme)
  useEffect(() => {
    if (isHydrated) {
      const root = document.documentElement;
      
      // Only update if the theme actually changed from user interaction
      const currentDOMTheme = root.classList.contains('dark') ? 'dark' : 'light';
      if (currentDOMTheme !== theme) {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        root.style.colorScheme = theme;
        
        // Only update localStorage after hydration to avoid SSR issues
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {
          // Handle cases where localStorage is not available
          console.warn('Could not save theme to localStorage:', e);
        }
      }
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    isHydrated,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}