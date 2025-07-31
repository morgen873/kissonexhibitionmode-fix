import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeId } from '@/types/theme';
import { themes } from '@/data/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  themes: Record<string, Theme>;
  availableThemes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeId;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'blackwhite' 
}) => {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[defaultTheme as keyof typeof themes]);

  useEffect(() => {
    setCurrentTheme(themes[themeId]);
  }, [themeId]);

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeId,
      setTheme,
      themes,
      availableThemes: themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};