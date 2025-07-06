import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensures consistency with GitHub workflow
    assetsDir: 'assets', // Optional: organizes static assets
    sourcemap: false, // Optional: disables source maps in prod
  }
})
