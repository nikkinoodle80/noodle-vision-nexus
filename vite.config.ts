import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': 'C:/NV_Assets/Unity_Files',
      '@logic': path.resolve(__dirname, './src/hardware_logic'),
    },
  },
  server: {
    port: 3000,
    fs: {
      // Allow Vite to serve files from outside the root (The Sovereign Asset Rule)
      allow: ['..', 'C:/NV_Assets/Unity_Files']
    }
  }
});
