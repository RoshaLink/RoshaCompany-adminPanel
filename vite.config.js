import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['i18next', 'react-i18next', 'lucide-react', 'clsx', 'tailwind-merge', 'framer-motion'],
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.warn(`[Vite Proxy] Warning: Could not proxy ${req.method} ${req.url} to backend (${err.code || err.message}). Backend may be offline.`);
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  success: false,
                  message: 'Backend server is unreachable. Please ensure the backend is running on port 5000.',
                  code: 'BACKEND_OFFLINE',
                })
              );
            }
          });
        },
      },
    },
  },
});
