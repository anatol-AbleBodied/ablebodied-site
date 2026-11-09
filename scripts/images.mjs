// Make small, fast copies of every photo in public/wp-content/uploads:
// WebP at up to 1600px and 640px wide, under public/img/ with the same path.
// Writes src/data/images.json (each original's size) for the pages to read.
// Runs before every build and dev start; copies already made are skipped.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'public/wp-content/uploads');
const OUT = path.join(ROOT, 'public/img');
const MANIFEST = path.join(ROOT, 'src/data/images.json');
const WIDTHS = [640, 1600];
const PHOTO = /\.(jpe?g|png|webp)$/i;

const manifest = {};
let made = 0;
for (const entry of fs.readdirSync(SOURCE, { recursive: true })) {
  const rel = entry.split(path.sep).join('/');
  if (!PHOTO.test(rel)) continue;
  const file = path.join(SOURCE, entry);
  let meta;
  try {
    meta = await sharp(file, { failOn: 'none' }).metadata();
  } catch {
    console.warn(`images: not a photo, served as is: ${rel}`);
    continue;
  }
  const { width = 0, height = 0, orientation } = meta;
  // EXIF orientations 5–8 swap width and height.
  const [w, h] = orientation && orientation >= 5 ? [height, width] : [width, height];
  const stem = rel.replace(PHOTO, '');
  const sizes = [];
  for (const target of WIDTHS) {
    const size = Math.min(target, w);
    if (sizes.includes(size)) continue;
    sizes.push(size);
    const out = path.join(OUT, `${stem}-${size}.webp`);
    if (fs.existsSync(out)) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(file, { failOn: 'none' }).rotate().resize({ width: size }).webp({ quality: 78 }).toFile(out);
    made++;
  }
  manifest[`/wp-content/uploads/${rel}`] = { width: w, height: h, stem: `/img/${stem}`, sizes };
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
console.log(`images: ${Object.keys(manifest).length} photos, ${made} new copies`);
