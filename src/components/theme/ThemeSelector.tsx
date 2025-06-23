
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();

  return (
    <Card className={`w-full max-w-4xl mx-auto ${currentTheme.colors.surface} ${currentTheme.effects.shadow} ${currentTheme.effects.borderRadius}`}>
      <CardHeader>
        <CardTitle className={`${currentTheme.colors.primary} ${currentTheme.fonts.primary} responsive-heading-lg text-center`}>
          Choose Your Theme
        </CardTitle>
        <p className={`${currentTheme.colors.textSecondary} ${currentTheme.fonts.secondary} text-center responsive-text`}>
          Select a visual theme that matches your style
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {availableThemes.map((theme) => (
            <div
              key={theme.id}
              className={`relative group cursor-pointer transition-all duration-300 ${currentTheme.effects.borderRadius} overflow-hidden ${currentTheme.effects.shadow} hover:scale-105`}
              onClick={() => setTheme(theme.id as any)}
            >
              {/* Theme Preview */}
              <div className={`h-32 ${theme.preview} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
                {themeId === theme.id && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>
              
              {/* Theme Info */}
              <div className={`p-4 ${theme.colors.surface} ${theme.colors.border} border-t`}>
                <h3 className={`${theme.colors.primary} ${theme.fonts.primary} font-semibold text-lg mb-1`}>
                  {theme.name}
                </h3>
                <p className={`${theme.colors.textSecondary} ${theme.fonts.secondary} text-sm`}>
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Apply Button */}
        <div className="mt-6 text-center">
          <Button
            className={`${currentTheme.colors.accent} ${currentTheme.fonts.primary} px-8 py-3 ${currentTheme.effects.borderRadius} transition-all duration-200 hover:scale-105`}
            variant="outline"
          >
            Current Theme: {currentTheme.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
