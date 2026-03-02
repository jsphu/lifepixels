import { EOLProvider } from './providers/eol';
import { pixelate } from './core/engine';
import { generateSVG } from './core/renderer';
import fs from 'fs';

async function run() {
  const query = process.argv[2] || ""; // Fallback
  const provider = new EOLProvider();

  if (!query) {
      console.error("Query should be a scientific name of animal.")
      process.exit(1);
  }

    console.log(`Searching for: ${query}...`);
  const organism = await provider.fetchOrganismImage(query);

  if (!organism) {
    console.error("No image found for that organism.");
    process.exit(1);
  }

  // Generate a 30x30 grid for a compact profile look
  const gridSize = 30;
  const pixels = await pixelate(organism.buffer, gridSize);
  const svg = generateSVG(pixels, gridSize, gridSize);

  // Ensure the output directory exists
  if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');

  fs.writeFileSync('./dist/organism.svg', svg);
  console.log(`Success! Saved to ./dist/organism.svg`);
}

run();
