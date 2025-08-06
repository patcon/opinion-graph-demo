// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // This is set in the deploy.yml workflow. Otherwise, no subpath.
    base: env.VITE_GITHUB_REPO_NAME ? `/${env.VITE_GITHUB_REPO_NAME}/` : '',
    plugins: [react()],
  }
});
