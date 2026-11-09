import type { APIRoute } from 'astro';
import { allPosts, postUrl, CATEGORY_PAGES } from '../lib/posts';

/** Every page, for search engines. Replaces WordPress's /wp-sitemap.xml. */
const PAGES = [
  '/',
  '/blog/',
  '/board-of-directors/',
  '/donate/',
  '/borp/',
  '/reserve/',
  '/fundraiser/',
  '/virtual/',
  '/order-now/',
  '/go49ers/',
  '/privacy-policy/',
];

export const GET: APIRoute = async ({ site }) => {
  const posts = await allPosts();
  const entries = [
    ...PAGES.map((path) => ({ path, lastmod: undefined as Date | undefined })),
    ...CATEGORY_PAGES.map((c) => ({ path: `/category/${c}/`, lastmod: undefined })),
    ...posts.map((p) => ({ path: postUrl(p), lastmod: p.data.date })),
  ];
  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(path, site).href;
      const mod = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${mod}</url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
