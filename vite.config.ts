import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        taskpane: path.resolve(__dirname, 'Documents/taskpane.html'),
        settings: path.resolve(__dirname, 'Documents/settings.html'),
        benchmark: path.resolve(__dirname, 'Documents/benchmark.html'),
      },
    },
  },
  server: {
    port: 3000,
    https: {
      key: fs.existsSync('./.certs/localhost-key.pem') ? fs.readFileSync('./.certs/localhost-key.pem') : undefined,
      cert: fs.existsSync('./.certs/localhost.pem') ? fs.readFileSync('./.certs/localhost.pem') : undefined,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
  },
});