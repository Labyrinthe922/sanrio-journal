import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const configuredBase = (process.env.VITE_BASE_PATH || '/sanrio-journal/')
  .replace(/^\/+|\/+$/g, '');
const repositoryBase = configuredBase ? `/${configuredBase}/` : '/';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? repositoryBase : '/',
});
