import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        sm: { max: '820px' },
        md: { min: '1000px' },
        lg: { min: '1310px' },
      },
      fontFamily: {
        sans: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        cabinetGrotesk: ['"Cabinet Grotesk"', 'sans-serif'],
        spaceGrotesk: ['"Space Grotesk"', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Dark mode colors (default) - Solana themed
        background: '#0F172A', 
        foreground: '#ffffff',
        
        // Solana brand colors
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          dark: '#0F172A',
          light: '#F8FAFC',
        },
        
        // Brand namespace for components
        brand: {
          // Dark mode colors with Solana purple
          background: '#0F172A',
          foreground: '#ffffff',
          primary: '#9945FF',
          'primary-foreground': '#ffffff',
          secondary: '#1E293B',
          'secondary-foreground': '#ffffff',
          accent: '#14F195',
          'accent-foreground': '#0F172A',
          muted: '#1E293B',
          'muted-foreground': '#94A3B8',
          border: '#1E293B',
          surface: '#0F172A',
          
          // Light mode colors - Solana themed
          light: {
            background: '#F8FAFC',
            foreground: '#334155',
            primary: '#9945FF',
            'primary-foreground': '#ffffff',
            secondary: '#F1F5F9',
            'secondary-foreground': '#0F172A',
            accent: '#14F195',
            'accent-foreground': '#0F172A',
            muted: '#F1F5F9',
            'muted-foreground': '#64748B',
            border: '#E2E8F0',
            surface: '#ffffff',
          }
        },
        
        // Direct color access without "brand" namespace
        primary: {
          DEFAULT: '#9945FF',
          foreground: '#ffffff',
          light: '#9945FF',
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#ffffff',
          light: '#F1F5F9',
        },
        accent: {
          DEFAULT: '#14F195',
          foreground: '#0F172A',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
          light: '#F1F5F9',
        },
        border: {
          DEFAULT: '#1E293B',
          light: '#E2E8F0',
        },
        surface: {
          DEFAULT: '#0F172A',
          light: '#ffffff',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(to right bottom, rgba(124, 58, 237, 0.05), rgba(14, 165, 233, 0.05))',
        'gradient-mesh-dark': 'linear-gradient(to right bottom, rgba(124, 58, 237, 0.1), rgba(14, 165, 233, 0.1))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(153, 69, 255, 0.15)',
        'glow-md': '0 0 0 1px rgba(153, 69, 255, 0.1), 0 4px 6px -1px rgba(153, 69, 255, 0.15), 0 2px 4px -2px rgba(153, 69, 255, 0.1)',
        'glow-lg': '0 0 0 1px rgba(153, 69, 255, 0.1), 0 10px 15px -3px rgba(153, 69, 255, 0.2), 0 4px 6px -4px rgba(153, 69, 255, 0.1)',
        'glow-green': '0 0 20px rgba(20, 241, 149, 0.15)',
        'glass': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px -1px rgba(255, 255, 255, 0.1)',
        'glass-md': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -4px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config