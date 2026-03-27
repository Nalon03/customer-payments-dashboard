import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],

  server: {
    proxy: {
      // Dev-only proxy: `/api` → backend base (see `rewrite` for path mapping).
      '/api': {
        target: 'https://spes.pscgh.com:442',
        changeOrigin: true,
        secure: false, 
        rewrite: (path) => path.replace(/^\/api/, '/sales-api/api'),
      },
    },
  },
  
})
