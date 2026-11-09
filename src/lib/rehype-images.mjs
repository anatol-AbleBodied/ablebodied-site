// Blog posts: point each uploaded photo at its fast WebP copies, give it a
// size, and let the browser load it only when it is about to be seen.
// Also opens other websites' links in a new tab is NOT done — links behave
// normally, which is what screen-reader users expect.
import { picture } from './picture.mjs';

function walk(node, visit) {
  visit(node);
  if (node.children) for (const child of node.children) walk(child, visit);
}

export function rehypeImages() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element') return;
      if (node.tagName === 'img') {
        const p = node.properties ?? {};
        const src = String(p.src ?? '');
        if (src.startsWith('/wp-content/uploads/')) {
          const pic = picture(src);
          p.src = pic.src;
          if (pic.srcset) {
            p.srcSet = pic.srcset;
            p.sizes = '(min-width: 760px) 720px, 100vw';
            p.width = pic.width;
            p.height = pic.height;
          }
        }
        p.loading = 'lazy';
        p.decoding = 'async';
        p.alt = p.alt ?? '';
        node.properties = p;
      }
    });
  };
}
