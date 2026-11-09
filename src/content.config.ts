import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts. One Markdown file each in src/content/posts; the file name is
 * only for sorting. A post's address is /YYYY/MM/DD/<slug>/, the same as on
 * the WordPress site, so links people shared still work.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Shown as "By …" under the title. */
    author: z.string().optional(),
    slug: z.string(),
    /** events, handcycle-conversions; anything else just shows on the blog. */
    categories: z.array(z.string()).default([]),
    cover: z.string().optional(),
    description: z.string().optional(),
    /** Set to true to keep a post off the site without deleting it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
