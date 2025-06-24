
export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    container: string;
    section: string;
    card: string;
  };
  effects: {
    blur: string;
    shadow: string;
    borderRadius: string;
  };
}

export type ThemeId = 'epicure' | 'industrial';
