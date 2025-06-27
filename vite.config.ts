// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from external devices
    port: 8786, // Set frontend port
    proxy: {
      '/api': {
        target: 'http://your-server-ip:8785', // Backend running on 8785
        changeOrigin: true,
        rewrite: (path) => (typeof path === 'string' ? path.replace(/^\/api/, '') : path),
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
