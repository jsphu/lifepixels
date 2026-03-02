import sharp from 'sharp';
import { getNearestGithubColor } from './palette';
import { Pixel } from '../types';

export async function pixelate(imageBuffer: Buffer, size: number = 50): Promise<Pixel[]> {
  const { data, info } = await sharp(imageBuffer)
    .resize(size, size, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels: Pixel[] = [];

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3] || 1;

      // Skip transparent pixels or map to BG
      const color = a < 50 ? '#161b22' : getNearestGithubColor(<number>r, <number>g, <number>b);
      pixels.push({ x, y, color });
    }
  }

  return pixels;
}
