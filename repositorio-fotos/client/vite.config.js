import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto del cliente
    proxy: {
      '/images': {
        target: 'http://localhost:4000', // Dirección del servidor
        changeOrigin: true
      },
    },
  },
});
