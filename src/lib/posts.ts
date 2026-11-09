import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Category names as WordPress showed them. */
export const CATEGORIES: Record<string, string> = {
  events: 'Events',
  'handcycle-conversions': 'Handcycle Conversions',
  uncategorized: 'Uncategorized',
};

/** Categories with their own page (/category/<slug>/). */
export const CATEGORY_PAGES = ['events', 'handcycle-conversions'];

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

/** The first ~55 words of a post, like WordPress's excerpt. */
export function excerpt(post: Post, words = 55): string {
  const plain = (post.body ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const list = plain.split(' ');
  return list.length > words ? `${list.slice(0, words).join(' ')} …` : plain;
}
