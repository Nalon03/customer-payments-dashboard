import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // Local dev: `/api` → backend target; rewrite maps to the remote API root.
      '/api': {
        target: 'https://spes.pscgh.com:442',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/sales-api/api'),
      },
    },
  },
})
