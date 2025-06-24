
import { Theme } from '@/types/theme';

export const themes: Record<string, Theme> = {
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    description: 'Raw concrete and steel with ultra-transparent glass optics',
    preview: 'bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-800',
    colors: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-300/95',
      accent: 'text-orange-400',
      background: 'bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-800',
      surface: 'bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05]',
      text: 'text-zinc-100',
      textSecondary: 'text-zinc-300/95',
      border: 'border-white/[0.05]',
    },
    fonts: {
      primary: 'font-mono',
      secondary: 'font-bold',
    },
    spacing: {
      container: 'px-2 sm:px-4 lg:px-6',
      section: 'py-4 sm:py-6 lg:py-8',
      card: 'p-3 sm:p-4 lg:p-6',
    },
    effects: {
      blur: 'backdrop-blur-3xl',
      shadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.9)] drop-shadow-2xl',
      borderRadius: 'rounded-3xl',
    },
  },
};
