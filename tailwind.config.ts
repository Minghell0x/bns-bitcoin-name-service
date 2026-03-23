import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#111317',
        surface: {
          DEFAULT: '#111317',
          dim: '#111317',
          bright: '#37393d',
          variant: '#333538',
          tint: '#ffb867',
          container: {
            lowest: '#0c0e11',
            low: '#1a1c1f',
            DEFAULT: '#1e2023',
            high: '#282a2d',
            highest: '#333538',
          },
        },
        primary: {
          DEFAULT: '#ffb867',
          container: '#e8910c',
          fixed: { DEFAULT: '#ffddbb', dim: '#ffb867' },
        },
        secondary: {
          DEFAULT: '#9ccaff',
          container: '#065f9c',
          fixed: { DEFAULT: '#d0e4ff', dim: '#9ccaff' },
        },
        tertiary: {
          DEFAULT: '#89ceff',
          container: '#17aff7',
          fixed: { DEFAULT: '#c9e6ff', dim: '#89ceff' },
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        outline: {
          DEFAULT: '#a18d7a',
          variant: '#534434',
        },
        'on-surface': {
          DEFAULT: '#e2e2e6',
          variant: '#d9c3ae',
        },
        'on-primary': {
          DEFAULT: '#482900',
          container: '#563200',
          fixed: { DEFAULT: '#2b1700', variant: '#673d00' },
        },
        'on-secondary': {
          DEFAULT: '#003257',
          container: '#b8d8ff',
          fixed: { DEFAULT: '#001d35', variant: '#00497b' },
        },
        'on-tertiary': {
          DEFAULT: '#00344d',
          container: '#003f5d',
          fixed: { DEFAULT: '#001e2f', variant: '#004c6e' },
        },
        'on-error': { DEFAULT: '#690005', container: '#ffdad6' },
        'on-background': '#e2e2e6',
        'inverse-surface': '#e2e2e6',
        'inverse-on-surface': '#2f3034',
        'inverse-primary': '#885200',
      },
      fontFamily: {
        headline: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
  },
  plugins: [],
} satisfies Config
