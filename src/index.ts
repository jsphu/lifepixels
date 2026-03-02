import { EOLProvider } from './providers/eol';
import { pixelate } from './core/engine';
import { generateSVG } from './core/renderer';
import fs from 'fs';

async function run() {
    const query = process.argv[2] || ""; // Fallback
    const output = process.argv[3] || "./dist/organism.svg";
    const provider = new EOLProvider();

    if (!query) {
        console.error("Query should be a scientific name of animal.")
        console.error("usage: dev QUERY OUTPUT")
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

    let output_dir
    if (output) {
        output_dir = output.substring(output.lastIndexOf('/') + 1, output.length - 1)
    } else {
        console.error("An output file path required.")
        process.exit(1)
    }
    // Ensure the output directory exists
    if (!fs.existsSync(output_dir)) fs.mkdirSync(output_dir);

    fs.writeFileSync(output, svg);
    console.log(`Success! Saved to ${output}`);
}

run();
