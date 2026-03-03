import { EOLProvider } from './providers/eol';
import { pixelate } from './core/engine';
import { generateSVG } from './core/renderer';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';

async function run() {
    const usage: string = "usage: [[--gridSize | -g] GRIDSIZE] [--query | -q] QUERY [--output | -o] OUTPUT";
    const config = {
        options: {
            query: { short: 'q', type: 'string', },
            output: { short: 'o', type: 'string' },
            gridSize: { short: 'g', type: 'string', default: '30' },
        },
        allowPositionals: true,
    } as const;
    const { values, positionals } = parseArgs(config);
    const query: string | undefined = values.query ?? positionals[0];
    const output: string | undefined = values.output ?? positionals[1];
    const gridSize: number = parseInt(values.gridSize) ?? 30; // Generate a 30x30 grid for a compact profile look
    const provider: EOLProvider = new EOLProvider();

    if (!query) {
        console.error("Query should be a scientific name of animal.")
        console.error(usage)
        process.exit(2);
    } else if (!output) {
        console.error("Output path required.")
        console.error(usage)
        process.exit(2);
    }
    console.log(`Searching for: ${query}...`);
    const organism = await provider.fetchOrganismImage(query);

    if (!organism) {
        console.error(`No image found for ${query}.`);
        console.error("Either organism not found or api could not found an image.")
        process.exit(1);
    }

    const pixels = await pixelate(organism.buffer, gridSize);
    const svg = generateSVG(pixels, gridSize, gridSize);

    const absPath = path.resolve(output); // Get the absolute path
    const outputDir = path.dirname(absPath); // Get the directory of path
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive: true});

    fs.writeFileSync(absPath, svg);
    console.log(`Success! Saved to ${absPath}`);
}

run();
