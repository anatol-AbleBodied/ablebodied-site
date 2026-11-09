import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const CATEGORIES: Record<string, string> = {
  events: 'Events',
  'handcycle-conversions': 'Handcycle conversions',
};

/** Published posts, newest first. */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const pad = (n: number) => String(n).padStart(2, '0');

/** /YYYY/MM/DD/slug/ — the WordPress address. Dates are calendar dates (UTC). */
export function postParts(post: Post) {
  const d = post.data.date;
  return {
    year: String(d.getUTCFullYear()),
    month: pad(d.getUTCMonth() + 1),
    day: pad(d.getUTCDate()),
    slug: post.data.slug,
  };
}

export function postUrl(post: Post): string {
  const p = postParts(post);
  return `/${p.year}/${p.month}/${p.day}/${p.slug}/`;
}

export function longDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
