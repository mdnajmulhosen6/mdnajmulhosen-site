// Scans every sub-folder of /images and writes images/manifest.json
// Netlify runs this on every deploy, so any new picture is picked up automatically.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, 'images');
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const manifest = {};

if (fs.existsSync(IMG_DIR)) {
  for (const entry of fs.readdirSync(IMG_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(IMG_DIR, entry.name);
    const key = 'images/' + entry.name;
    manifest[key] = fs
      .readdirSync(dir)
      .filter(f => IMAGE_RE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }
}

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.writeFileSync(path.join(IMG_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Image manifest written:', Object.fromEntries(Object.entries(manifest).map(([k, v]) => [k, v.length])));
