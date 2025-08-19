import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light'; // Resolved theme (system -> dark/light)
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark', // App is primarily dark-themed
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || defaultTheme;
    }
    return defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('dark');

  // Update actual theme based on theme setting and system preference
  useEffect(() => {
    const updateActualTheme = () => {
      let resolved: 'dark' | 'light';
      
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      
      setActualTheme(resolved);
      
      // Apply theme to document
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };

    updateActualTheme();

    // Listen for system theme changes if using 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', updateActualTheme);
      };
    }
  }, [theme]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};