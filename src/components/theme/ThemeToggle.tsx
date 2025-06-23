
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';

const ThemeToggle: React.FC = () => {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <>
      {/* Theme Toggle Button */}
      <Button
        onClick={() => setShowThemeSelector(!showThemeSelector)}
        className={`fixed top-4 right-4 z-50 ${currentTheme.colors.surface} ${currentTheme.colors.border} border ${currentTheme.effects.shadow} ${currentTheme.effects.borderRadius} hover:scale-110 transition-all duration-200`}
        variant="outline"
        size="icon"
      >
        {showThemeSelector ? (
          <X className={`h-4 w-4 ${currentTheme.colors.primary}`} />
        ) : (
          <Palette className={`h-4 w-4 ${currentTheme.colors.primary}`} />
        )}
      </Button>

      {/* Theme Selector Overlay */}
      {showThemeSelector && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ThemeSelector />
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeToggle;
