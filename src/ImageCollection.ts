export class ImageCollection {
  canvases: HTMLCanvasElement[];

  constructor() {
    this.canvases = [];
  }

  /**
   * Analyzes the given compound image (canvas), finds all connected non-transparent regions,
   * and adds each as a new canvas to the canvases array.
   */
  AddCompoundImage(compound: HTMLCanvasElement) {
    const ctx = compound.getContext('2d');
    if (!ctx) return;
    const { width, height } = compound;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const visited = new Uint8Array(width * height);
    const regions: { minX: number, minY: number, maxX: number, maxY: number, pixels: [number, number][] }[] = [];
    const ALPHA_THRESHOLD = 32;
    const MIN_REGION_PIXELS = 100;

    function getAlpha(x: number, y: number) {
      return data[(y * width + x) * 4 + 3];
    }

    // BFS to find all connected non-transparent regions
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (visited[idx] || getAlpha(x, y) < ALPHA_THRESHOLD) continue;
        // New region
        const queue: [number, number][] = [[x, y]];
        visited[idx] = 1;
        let minX = x, maxX = x, minY = y, maxY = y;
        const pixels: [number, number][] = [];
        while (queue.length) {
          const [cx, cy] = queue.shift()!;
          pixels.push([cx, cy]);
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          // 4-connected neighbors
          for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            const nidx = ny * width + nx;
            if (!visited[nidx] && getAlpha(nx, ny) >= ALPHA_THRESHOLD) {
              visited[nidx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
        if (pixels.length < MIN_REGION_PIXELS) continue; // Ignore tiny regions
        regions.push({ minX, minY, maxX, maxY, pixels });
      }
    }

    // For each region, extract as a new canvas
    let added = 0;
    for (const region of regions) {
      const w = region.maxX - region.minX + 1;
      const h = region.maxY - region.minY + 1;
      const newCanvas = document.createElement('canvas');
      newCanvas.width = w;
      newCanvas.height = h;
      const newCtx = newCanvas.getContext('2d')!;
      // Copy pixels
      const newImageData = newCtx.createImageData(w, h);
      for (const [px, py] of region.pixels) {
        const srcIdx = (py * width + px) * 4;
        const dstIdx = ((py - region.minY) * w + (px - region.minX)) * 4;
        for (let i = 0; i < 4; i++) {
          newImageData.data[dstIdx + i] = data[srcIdx + i];
        }
      }
      newCtx.putImageData(newImageData, 0, 0);
      this.canvases.push(newCanvas);
      added++;
    }
  }
} 