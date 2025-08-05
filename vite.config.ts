import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],  // Ensure lucide-react is pre-bundled
  },
  server: {
    port: 5173,                 // Optional: Define custom port if needed
  },
});