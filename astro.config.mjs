import { defineConfig } from 'astro/config';
import { rehypeImages } from './src/lib/rehype-images.mjs';

export default defineConfig({
  site: 'https://ablebodied.org',
  // The WordPress site's addresses all end in a slash; keep them identical so
  // old links, search results and shared posts keep working.
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    rehypePlugins: [rehypeImages],
  },
});
