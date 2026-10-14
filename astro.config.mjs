// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://onscreentimer.com',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});