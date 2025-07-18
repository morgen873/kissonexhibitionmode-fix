
export const globalTheme = {
  // Background variants
  backgrounds: {
    default: 'bg-gradient-to-br from-gray-50 to-gray-100',
    dark: 'bg-gradient-to-br from-black to-gray-900',
    creation: 'bg-gradient-to-br from-black to-gray-900',
  },
  
  // Text colors
  text: {
    primary: 'text-gray-900',
    primaryDark: 'text-white',
    secondary: 'text-gray-600',
    secondaryDark: 'text-gray-300',
    muted: 'text-gray-500',
    mutedDark: 'text-gray-400',
  },
  
  // Card styles
  cards: {
    default: 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg',
    dark: 'bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl',
    creation: 'bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl',
  },
  
  // Responsive spacing
  spacing: {
    container: 'px-3 sm:px-4 lg:px-8',
    section: 'py-6 sm:py-8 lg:py-12',
    card: 'p-4 sm:p-6 lg:p-8',
  },
  
  // Typography
  typography: {
    heading: {
      xl: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
      lg: 'text-xl sm:text-2xl lg:text-3xl font-bold',
      md: 'text-lg sm:text-xl lg:text-2xl font-semibold',
      sm: 'text-base sm:text-lg font-medium',
    },
    body: {
      lg: 'text-base sm:text-lg',
      md: 'text-sm sm:text-base',
      sm: 'text-xs sm:text-sm',
    }
  }
};

// Theme helper functions
export const getThemeClasses = (variant: 'default' | 'dark' | 'creation') => ({
  background: globalTheme.backgrounds[variant],
  text: variant === 'default' ? globalTheme.text.primary : globalTheme.text.primaryDark,
  textSecondary: variant === 'default' ? globalTheme.text.secondary : globalTheme.text.secondaryDark,
  textMuted: variant === 'default' ? globalTheme.text.muted : globalTheme.text.mutedDark,
  card: globalTheme.cards[variant],
});
