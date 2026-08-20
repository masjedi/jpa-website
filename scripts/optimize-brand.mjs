import { join } from 'node:path';
import sharp from 'sharp';

const brandDir = join(process.cwd(), 'public', 'brand');

await sharp(join(brandDir, 'logo-white-h.png'))
    .resize({ width: 640, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(brandDir, 'logo-white-h.tmp.png'));

await sharp(join(brandDir, 'logo-color-h.png'))
    .resize({ width: 640, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(brandDir, 'logo-color-h.tmp.png'));

await sharp(join(brandDir, 'logo-color-h.png'))
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(process.cwd(), 'public', 'favicon-32.png'));

await sharp(join(brandDir, 'logo-color-h.png'))
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(process.cwd(), 'public', 'apple-touch-icon.png'));

const { renameSync, unlinkSync } = await import('node:fs');

for (const name of ['logo-white-h', 'logo-color-h']) {
    const tmp = join(brandDir, `${name}.tmp.png`);
    const dest = join(brandDir, `${name}.png`);
    try {
        unlinkSync(dest);
    } catch {
        // Original may be locked; keep tmp as the served file instead.
    }
    try {
        renameSync(tmp, dest);
    } catch {
        console.log(`Kept temporary file for ${name}`);
    }
}

console.log('Brand assets optimized.');
