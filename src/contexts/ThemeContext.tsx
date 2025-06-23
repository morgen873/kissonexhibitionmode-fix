
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeId } from '@/types/theme';
import { themes } from '@/data/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>('minimalist');

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') as ThemeId;
    if (savedTheme && themes[savedTheme]) {
      setThemeId(savedTheme);
    }
  }, []);

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem('selectedTheme', newThemeId);
  };

  const currentTheme = themes[themeId];
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeId,
      setTheme,
      availableThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
