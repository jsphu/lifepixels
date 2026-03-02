import { Pixel } from "../types";

const CELL_SIZE = 20; // The size of the square
const GAP = 8;        // The space between squares
const CORNER_RADIUS = 4; // GitHub squares have slightly rounded corners

export function generateSVG(pixels: Pixel[], gridWidth: number, gridHeight: number): string {
  // Calculate the total SVG dimensions based on the grid and spacing
  const totalWidth = gridWidth * (CELL_SIZE + GAP);
  const totalHeight = gridHeight * (CELL_SIZE + GAP);

  const rects = pixels
    .map(p => {
      // Calculate actual position in the SVG coordinate system
      const posX = p.x * (CELL_SIZE + GAP);
      const posY = p.y * (CELL_SIZE + GAP);

      return `<rect
        x="${posX}"
        y="${posY}"
        width="${CELL_SIZE}"
        height="${CELL_SIZE}"
        rx="${CORNER_RADIUS}"
        fill="${p.color}"
      />`;
    })
    .join('\n      ');

  return `
<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" />
  <g>
    ${rects}
  </g>
</svg>
  `.trim();
}
