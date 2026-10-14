import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // './' makes every asset link relative, so the built site works from any
  // address, including a GitHub Pages project page like user.github.io/repo/
  base: './',
  plugins: [react(), tailwindcss()],
})
