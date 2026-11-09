import { defineConfig } from 'astro/config';
import { rehypeImages } from './src/lib/rehype-images.mjs';

export default defineConfig({
  site: 'https://ablebodied.org',
  // The WordPress site's addresses all end in a slash; keep them identical so
  // old links, search results and shared posts keep working.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // GitHub Pages has no server redirects, so each of these becomes a tiny page
  // that forwards the visitor (and tells Google where the page moved).
  redirects: {
    '/main-page/': '/',
    '/feed/': '/rss.xml',
    '/category/uncategorized/': '/blog/',
    '/2022/10/13/china-bike/': '/2022/10/13/bafang-front-wheel-handcycle/',
    '/meetwithwojtek/': 'https://calendar.app.google/H19MGHhiRnZwkM5J7',
  },
  markdown: {
    rehypePlugins: [rehypeImages],
  },
});
