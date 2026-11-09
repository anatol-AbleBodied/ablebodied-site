// Turns an uploaded photo's address into the attributes for a fast <img>:
// a WebP copy, a smaller one for phones, and its size so the page doesn't
// jump while it loads. Anything not in the manifest is left as it is.
import fs from 'node:fs';
import path from 'node:path';

let manifest;
function load() {
  if (!manifest) {
    const file = path.resolve(process.cwd(), 'src/data/images.json');
    manifest = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  }
  return manifest;
}

/**
 * @param {string} src e.g. /wp-content/uploads/2024/06/Wojtek.jpeg
 * @returns {{ src: string, srcset?: string, width?: number, height?: number }}
 */
export function picture(src) {
  let key = src;
  try {
    key = decodeURI(src);
  } catch {
    // keep as is
  }
  const found = load()[key];
  if (!found) return { src };
  const largest = Math.max(...found.sizes);
  return {
    src: `${found.stem}-${largest}.webp`,
    srcset: found.sizes.map((s) => `${found.stem}-${s}.webp ${s}w`).join(', '),
    width: found.width,
    height: found.height,
  };
}
