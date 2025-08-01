import { useState, useEffect } from 'react';

interface ResponsiveLayoutState {
  isMobile: boolean;
  isTablet: boolean;
  isLargeScreen: boolean;
  isTouch: boolean;
  screenWidth: number;
}

export function useResponsiveLayout(): ResponsiveLayoutState {
  const [layout, setLayout] = useState<ResponsiveLayoutState>({
    isMobile: false,
    isTablet: false,
    isLargeScreen: false,
    isTouch: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      
      setLayout({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLargeScreen: width >= 1920,
        isTouch: width >= 1920, // Touch optimized for large screens
        screenWidth: width,
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return layout;
}

type ButtonSize = "default" | "sm" | "lg" | "icon" | "mobile" | "mobile-lg" | "mobile-icon" | "touch" | "touch-lg" | "touch-icon" | "touch-32";
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "touch" | "touch-outline";

export function getResponsiveButtonSize(isMobile: boolean, isTouch: boolean): ButtonSize {
  if (isMobile) return 'mobile';
  if (isTouch) return 'touch';
  return 'default';
}

export function getResponsiveButtonVariant(isMobile: boolean, isTouch: boolean, variant: string = 'default'): ButtonVariant {
  if (isTouch && variant.includes('outline')) return 'touch-outline';
  if (isTouch) return 'touch';
  return variant as ButtonVariant;
}

export function getResponsiveIconButtonSize(isMobile: boolean, isTouch: boolean): ButtonSize {
  if (isMobile) return 'mobile-icon';
  if (isTouch) return 'touch-icon';
  return 'icon';
}

export function getResponsiveContainer(isMobile: boolean, isTouch: boolean): string {
  if (isMobile) return 'mobile-container';
  if (isTouch) return 'touch-container';
  return 'responsive-container';
}