import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // This will make sure "global" refers to globalThis (works across browser and Node.js)
  },
  resolve: {
    alias: {
      // Provide a minified version of simple-peer for compatibility
      'simple-peer': 'simple-peer/simplepeer.min.js',
    },
  },
  server: {
    host: '0.0.0.0', // Ensure this allows external access
    port: 5173,
  },
});
