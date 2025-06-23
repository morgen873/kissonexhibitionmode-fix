
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface GlobalLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'creation' | 'recipe';
  showHeader?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ 
  children, 
  variant = 'default',
  showHeader = true 
}) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.colors.background} ${currentTheme.colors.text} ${currentTheme.fonts.primary}`}>
      <div className={`w-full max-w-7xl mx-auto ${currentTheme.spacing.container}`}>
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
