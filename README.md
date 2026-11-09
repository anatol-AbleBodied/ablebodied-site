# ablebodied.org

The website of Able Bodied Inc., built with [Astro](https://astro.build) as
plain pages and published on Netlify. It replaces the WordPress site; every
old address (pages, posts, images under `/wp-content/uploads/`) still works.

## Add a news post

1. Copy a file in `src/content/posts/`, e.g. to
   `src/content/posts/2026-12-01-winter-ride.md`.
2. Change the front matter at the top:

   ```yaml
   ---
   title: "Winter ride in Los Gatos"
   date: 2026-12-01
   slug: "winter-ride"            # the post's address: /2026/12/01/winter-ride/
   categories: ["events"]         # or "handcycle-conversions", or []
   cover: "/wp-content/uploads/2026/12/ride.jpg"   # optional
   description: "One or two sentences for the news list and link previews."
   ---
   ```

3. Write the post below it in Markdown. Put photos in
   `public/wp-content/uploads/YYYY/MM/` and use them like
   `![What the photo shows](/wp-content/uploads/2026/12/ride.jpg)`.
   They are shrunk and converted to WebP automatically when the site builds.

Set `draft: true` in the front matter to keep a post off the site.

## Change the pages

Pages are in `src/pages/` (`index.astro` is the home page). Contact details,
donation links and scheduling links are in `src/lib/site.ts`.

## Run it on your computer

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # makes dist/, what Netlify publishes
```
