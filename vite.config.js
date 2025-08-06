// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/opinion-graph-demo/', // <-- update this to match your repo name
  plugins: [react()],
});
