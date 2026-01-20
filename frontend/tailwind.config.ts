import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        panel: '#121212',
        accent: '#9f7aea',
      },
    },
  },
  plugins: [],
}

export default config
