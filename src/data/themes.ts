
import { Theme } from '@/types/theme';

export const themes: Record<string, Theme> = {
  blackwhite: {
    id: 'blackwhite',
    name: 'Black & White',
    description: 'Pure monochrome design with stark contrast',
    preview: 'bg-gradient-to-br from-black to-white',
    colors: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      accent: 'text-foreground',
      background: 'bg-background',
      surface: 'bg-card border-border',
      text: 'text-foreground',
      textSecondary: 'text-muted-foreground',
      border: 'border-border',
    },
    fonts: {
      primary: 'font-sans',
      secondary: 'font-sans',
    },
    spacing: {
      container: 'px-4 sm:px-6 lg:px-8',
      section: 'py-8 sm:py-12 lg:py-16',
      card: 'p-6 sm:p-8 lg:p-10',
    },
    effects: {
      blur: 'backdrop-blur-xl',
      shadow: 'shadow-xl',
      borderRadius: 'rounded-2xl',
    },
  },
  epicure: {
    id: 'epicure',
    name: 'Epicure',
    description: 'Sleek black and white design with subtle accents',
    preview: 'bg-gradient-to-br from-black via-gray-900 to-black',
    colors: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      background: 'bg-background',
      surface: 'bg-card border-border',
      text: 'text-foreground',
      textSecondary: 'text-muted-foreground',
      border: 'border-border',
    },
    fonts: {
      primary: 'font-sans',
      secondary: 'font-sans',
    },
    spacing: {
      container: 'px-4 sm:px-6 lg:px-8',
      section: 'py-8 sm:py-12 lg:py-16',
      card: 'p-6 sm:p-8 lg:p-10',
    },
    effects: {
      blur: 'backdrop-blur-xl',
      shadow: 'shadow-xl',
      borderRadius: 'rounded-2xl',
    },
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    description: 'Raw monochrome with high contrast',
    preview: 'bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-800',
    colors: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      background: 'bg-background',
      surface: 'bg-card border-border',
      text: 'text-foreground',
      textSecondary: 'text-muted-foreground',
      border: 'border-border',
    },
    fonts: {
      primary: 'font-sans',
      secondary: 'font-sans',
    },
    spacing: {
      container: 'px-2 sm:px-4 lg:px-6',
      section: 'py-4 sm:py-6 lg:py-8',
      card: 'p-3 sm:p-4 lg:p-6',
    },
    effects: {
      blur: 'backdrop-blur-3xl',
      shadow: 'shadow-2xl',
      borderRadius: 'rounded-3xl',
    },
  },
};
