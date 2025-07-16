
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
			'touch': '1920px'  // 32-inch horizontal touchscreen
		}
		},
		extend: {
			fontFamily: {
				'geometric': ['Orbitron', 'monospace'],
				'organic': ['Inter', 'sans-serif'],
				'sans': ['Inter', 'sans-serif'],
				'serif': ['Inter', 'serif'],
				'mono': ['Orbitron', 'monospace'],
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
				// Futuristic color palette inspired by Syd Mead & Luigi Colani
				'electric-cyan': {
					50: '#ecfeff',
					100: '#cffafe',
					200: '#a5f3fc',
					300: '#67e8f9',
					400: '#22d3ee',
					500: '#06b6d4',
					600: '#0891b2',
					700: '#0e7490',
					800: '#155e75',
					900: '#164e63',
				},
				'holographic-purple': {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87',
				},
				'organic-amber': {
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
				'deep-space': {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				}
			},
			borderRadius: {
				'organic': '2rem',
				'biomorphic': '3rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'holographic-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(195 100% 60% / 0.5)',
						transform: 'scale(1)',
					},
					'50%': {
						boxShadow: '0 0 40px hsl(195 100% 60% / 0.8), 0 0 60px hsl(280 85% 70% / 0.4)',
						transform: 'scale(1.02)',
					}
				},
				'organic-flow': {
					'0%': {
						borderRadius: '2rem 3rem 2rem 3rem',
						transform: 'rotate(0deg)',
					},
					'25%': {
						borderRadius: '3rem 2rem 3rem 2rem',
						transform: 'rotate(0.5deg)',
					},
					'50%': {
						borderRadius: '2.5rem 3.5rem 2.5rem 3.5rem',
						transform: 'rotate(-0.5deg)',
					},
					'75%': {
						borderRadius: '3.5rem 2.5rem 3.5rem 2.5rem',
						transform: 'rotate(0.5deg)',
					},
					'100%': {
						borderRadius: '2rem 3rem 2rem 3rem',
						transform: 'rotate(0deg)',
					}
				},
				'geometric-slide': {
					'0%': {
						transform: 'translateX(-100%) skewX(-15deg)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0) skewX(0deg)',
						opacity: '1',
					}
				},
				'energy-wave': {
					'0%': {
						backgroundPosition: '0% 50%',
					},
					'50%': {
						backgroundPosition: '100% 50%',
					},
					'100%': {
						backgroundPosition: '0% 50%',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'holographic-pulse': 'holographic-pulse 3s ease-in-out infinite',
				'organic-flow': 'organic-flow 8s ease-in-out infinite',
				'geometric-slide': 'geometric-slide 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'energy-wave': 'energy-wave 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
