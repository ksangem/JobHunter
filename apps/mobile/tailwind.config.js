/** @type {import('tailwindcss').Config} */
// NativeWind v4 — Tailwind utilities compiled to RN StyleSheet (native) + CSS (web).
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand — deep navy + signal accent (BRD "enterprise" tone).
        navy: {
          50: '#EEF2F9',
          100: '#D3DEEF',
          500: '#1E3A8A',
          700: '#14276B',
          900: '#0A1F44',
        },
        brand: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        success: { DEFAULT: '#16A34A', 50: '#F0FDF4', 100: '#DCFCE7' },
        warning: { DEFAULT: '#D97706', 50: '#FFFBEB', 100: '#FEF3C7' },
        danger: { DEFAULT: '#DC2626', 50: '#FEF2F2', 100: '#FEE2E2' },
        info: { DEFAULT: '#0891B2', 50: '#ECFEFF', 100: '#CFFAFE' },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
