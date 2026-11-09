import type { APIRoute } from 'astro';
import { allPosts, postUrl } from '../lib/posts';
import { SITE } from '../lib/site';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** News feed, replacing WordPress's /feed/. */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://ablebodied.org');
  const items = (await allPosts())
    .map((p) => {
      const link = new URL(postUrl(p), base).href;
      return `<item><title>${esc(p.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${p.data.date.toUTCString()}</pubDate>${
        p.data.description ? `<description>${esc(p.data.description)}</description>` : ''
      }</item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)}</title><link>${base.href}</link><description>${esc(SITE.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
