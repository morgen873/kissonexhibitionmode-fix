
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
		screens: {
			'2xl': '1400px',
			'touch': '1920px',  // 32-inch horizontal touchscreen
			'touch-xl': '2560px' // Ultra-wide touchscreen support
		}
		},
		extend: {
			fontFamily: {
				'sans': ['Secular One', 'system-ui', 'sans-serif'],
				'serif': ['Secular One', 'system-ui', 'sans-serif'],
				'mono': ['Secular One', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Epicure color palette
				amber: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				orange: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
				red: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'touch-xs': '0.75rem',    // 12px
				'touch-sm': '1rem',       // 16px
				'touch-md': '1.5rem',     // 24px
				'touch-lg': '2rem',       // 32px
				'touch-xl': '2.5rem',     // 40px
				'touch-2xl': '3rem',      // 48px
				'touch-3xl': '4rem',      // 64px
				'touch-4xl': '5rem',      // 80px
				'touch-5xl': '6rem',      // 96px
			},
			fontSize: {
				'touch-xs': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
				'touch-sm': ['1rem', { lineHeight: '1.5rem' }],        // 16px
				'touch-base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
				'touch-lg': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
				'touch-xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
				'touch-2xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
				'touch-3xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
				'touch-4xl': ['3rem', { lineHeight: '3rem' }],         // 48px
				'touch-5xl': ['3.75rem', { lineHeight: '3.75rem' }],   // 60px
				'touch-6xl': ['4.5rem', { lineHeight: '4.5rem' }],     // 72px
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)',
					},
					'50%': {
						transform: 'translateY(-10px) rotate(2deg)',
					}
				},
				'warm-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
					},
					'50%': {
						boxShadow: '0 0 40px rgba(251, 191, 36, 0.5), 0 0 60px rgba(239, 68, 68, 0.2)',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-float': 'gentle-float 4s ease-in-out infinite',
				'warm-glow': 'warm-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
