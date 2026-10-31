// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Troque pelo seu domínio definitivo quando publicar (e em src/data/comum.ts).
  site: 'https://danielgranato.vercel.app',
  // O site inteiro é estático; só /api/contato roda no servidor (formulário).
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } },
    }),
  ],
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Nunca embute scripts no HTML: a CSP só permite scripts do próprio domínio.
      assetsInlineLimit: 0,
    },
  },
});
