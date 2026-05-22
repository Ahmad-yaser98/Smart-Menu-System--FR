import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404',
      apply: 'build',
      closeBundle() {
        const src = path.resolve(__dirname, 'public/404.html')
        const dest = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
          console.log('✓ Copied 404.html to dist/')
        }
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
  }
})