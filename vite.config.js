import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

import pwaConfigs from './pwaconfigs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(pwaConfigs)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
