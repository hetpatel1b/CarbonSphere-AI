import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'sm': '640px',
  			'md': '768px',
  			'lg': '1024px',
  			'xl': '1280px',
  			'2xl': '1536px'
  		}
  	},
  	extend: {
  		spacing: {
  			base: 'var(--spacing-base)'
  		},
  		height: {
  			header: 'var(--layout-header-height)',
  			'component-sm': 'var(--component-height-sm)',
  			'component-base': 'var(--component-height-base)',
  			'component-lg': 'var(--component-height-lg)',
  			'component-xl': 'var(--component-height-xl)'
  		},
  		width: {
  			sidebar: 'var(--layout-sidebar-width)',
  			'sidebar-collapsed': 'var(--layout-sidebar-collapsed)',
  			'right-panel': 'var(--layout-right-panel)'
  		},
  		maxWidth: {
  			content: 'var(--layout-content-max-width)',
  			reading: '65ch'
  		},
  		colors: {
  			border: 'var(--color-border)',
  			input: 'var(--color-input)',
  			ring: 'var(--color-ring)',
  			background: 'var(--color-background)',
  			foreground: 'var(--color-foreground)',
  			primary: {
  				DEFAULT: 'var(--color-primary)',
  				foreground: 'var(--color-primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--color-secondary)',
  				foreground: 'var(--color-secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--color-destructive)',
  				foreground: 'var(--color-destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--color-muted)',
  				foreground: 'var(--color-muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--color-accent)',
  				foreground: 'var(--color-accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--color-popover)',
  				foreground: 'var(--color-popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--color-card)',
  				foreground: 'var(--color-card-foreground)'
  			},
  			success: {
  				DEFAULT: 'var(--color-success)',
  				bg: 'var(--color-success-bg)'
  			},
  			warning: {
  				DEFAULT: 'var(--color-warning)',
  				bg: 'var(--color-warning-bg)'
  			},
  			info: {
  				DEFAULT: 'var(--color-info)',
  				bg: 'var(--color-info-bg)'
  			},
  			carbon: {
  				emerald: '#00E599',
  				ocean: '#0B132B',
  				biablue: '#00B8FF',
  				canopy: '#10B981',
  				solar: '#FBBF24',
  				atmosphere: '#3B82F6',
  				terracotta: '#F97316'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xs: '0.125rem',
  			xl: '0.75rem',
  			'2xl': '1rem',
  			'3xl': '1.5rem',
  			full: '9999px'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
                    ...fontFamily.sans
                ],
  			display: [
  				'var(--font-geist)',
                    ...fontFamily.sans
                ],
  			mono: [
  				'var(--font-jetbrains)',
                    ...fontFamily.mono
                ]
  		},
  		fontSize: {
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'body-base': [
  				'1rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'body-lg': [
  				'1.125rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			h4: [
  				'1.25rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			h3: [
  				'1.5rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01em'
  				}
  			],
  			h2: [
  				'1.875rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01em'
  				}
  			],
  			h1: [
  				'2.25rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em'
  				}
  			],
  			'display-lg': [
  				'3rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em'
  				}
  			],
  			'display-xl': [
  				'3.75rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.03em'
  				}
  			],
  			'display-2xl': [
  				'4.5rem',
  				{
  					lineHeight: '1',
  					letterSpacing: '-0.03em'
  				}
  			]
  		},
  		boxShadow: {
  			xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  			glass: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
  			'glass-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.5)'
  		},
  		transitionDuration: {
  			fast: '150ms',
  			base: '250ms',
  			slow: '400ms'
  		},
  		transitionTimingFunction: {
  			spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  			standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
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
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			pulseGlow: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'shimmer': 'shimmer 1.5s linear infinite',
  			'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		zIndex: {
  			hide: '-1',
  			base: '0',
  			elevated: '10',
  			dropdown: '20',
  			sticky: '30',
  			overlay: '40',
  			modal: '50',
  			toast: '100'
  		},
  		backgroundImage: {
  			'aurora': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
  			'dawn': 'linear-gradient(135deg, #FBBF24 0%, #F97316 100%)'
  		},
  		screens: {
  			'max-sm': {
  				max: '639px'
  			},
  			'max-md': {
  				max: '767px'
  			},
  			'max-lg': {
  				max: '1023px'
  			},
  			'max-xl': {
  				max: '1279px'
  			}
  		},
  		ringWidth: {
  			focus: 'var(--focus-ring-width)'
  		},
  		ringOffsetWidth: {
  			focus: 'var(--focus-ring-offset)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
