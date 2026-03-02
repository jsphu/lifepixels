// GitHub Dark contribution colors
export const GITHUB_DARK_PALETTE = [
  "#0d1117", // Background
  "#0e4429", // Lvl 1
  "#006d32", // Lvl 2
  "#26a641", // Lvl 3
  "#39d353", // Lvl 4
];

export function getNearestGithubColor(r: number, g: number, b: number): string {
  let minDistance = Infinity;
  let closestColor = GITHUB_DARK_PALETTE[0];

  for (const hex of GITHUB_DARK_PALETTE) {
    // Convert hex to RGB
    const hr = parseInt(hex.slice(1, 3), 16);
    const hg = parseInt(hex.slice(3, 5), 16);
    const hb = parseInt(hex.slice(5, 7), 16);

    // Euclidean distance formula
    const distance = Math.sqrt(
      Math.pow(r - hr, 2) + Math.pow(g - hg, 2) + Math.pow(b - hb, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = hex;
    }
  }
  return closestColor || GITHUB_DARK_PALETTE[0] || "#0d1117";
}
