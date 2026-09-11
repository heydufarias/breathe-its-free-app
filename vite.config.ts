import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/breathe-it-is-free-app/',
  plugins: [react(), tailwindcss()],
})