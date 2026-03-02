import { EOLProvider } from './providers/eol';
import { pixelate } from './core/engine';
import { generateSVG } from './core/renderer';
import fs from 'fs';

async function main() {
  const provider = new EOLProvider();
  const organism = await provider.fetchOrganismImage('Mus musculus');

  if (organism) {
    // 50x50 is a great size for GitHub profile pixel art
    const pixels = await pixelate(organism.buffer, 50);
    const svg = generateSVG(pixels, 50, 50);

    fs.writeFileSync('organism.svg', svg);
    console.log(`✅ Generated SVG for: ${organism.scientificName}`);
  }
}

main();
