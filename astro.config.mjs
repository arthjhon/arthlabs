// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arthlabs.dev',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    // links.astro is canonical at links.arthlabs.dev, not under this site.
    sitemap({ filter: (page) => !/\/links\/?$/.test(page) }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
