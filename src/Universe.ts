import { Quadrant } from './Quadrant';
import { QuadrantFactory } from './QuadrantFactory';
import { fractalValueNoise2D } from './Planet';
import { NameGenerator } from './NameGenerator';
import { StarSystem } from './StarSystem';

/**
 * Represents the entire universe as an endless grid of quadrants.
 * Quadrants are stored in a map keyed by their grid coordinates as 'x,y'.
 */
export class Universe {
  /** Map from 'x,y' string to Quadrant */
  private quadrants: Map<string, Quadrant> = new Map();
  /** Pre-rendered fog texture (400x400) */
  private fogTexture: HTMLCanvasElement;
  /** Map from star system names to StarSystem instances */
  private systemNameMap: Map<string, StarSystem> = new Map();

  constructor() {
    // Generate fog texture once
    this.fogTexture = document.createElement('canvas');
    this.fogTexture.width = 400;
    this.fogTexture.height = 400;
    const ctx = this.fogTexture.getContext('2d')!;
    const fogSeed = 12345;
    // First pass: find min/max noise for normalization
    let minN = Infinity, maxN = -Infinity;
    for (let x = 0; x < 400; x += 4) {
      for (let y = 0; y < 400; y += 4) {
        const nx = x / 400;
        const ny = y / 400;
        const n = fractalValueNoise2D(nx, ny, fogSeed, 2.5, 4);
        if (n < minN) minN = n;
        if (n > maxN) maxN = n;
      }
    }
    if (maxN === minN) maxN = minN + 1e-6;
    for (let x = 0; x < 400; x++) {
      for (let y = 0; y < 400; y++) {
        const nx = x / 400;
        const ny = y / 400;
        let n = fractalValueNoise2D(nx, ny, fogSeed, 2.5, 4);
        n = (n - minN) / (maxN - minN);
        const gray = Math.floor(16 + n * 40); // 16-56 (dark)
        ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  /**
   * Get the quadrant at grid coordinates (x, y), or undefined if not present.
   */
  public getQuadrant(x: number, y: number): Quadrant | undefined {
    return this.quadrants.get(`${x},${y}`);
  }

  /**
   * Add a quadrant at grid coordinates (x, y).
   */
  public setQuadrant(x: number, y: number, quadrant: Quadrant): void {
    this.quadrants.set(`${x},${y}`, quadrant);
  }

  /**
   * Get the quadrant at (x, y), creating it if it does not exist.
   * Uses QuadrantFactory to generate a new quadrant if needed.
   */
  public getOrCreateQuadrant(x: number, y: number): Quadrant {
    const key = `${x},${y}`;
    let quad = this.quadrants.get(key);
    if (!quad) {
      quad = QuadrantFactory.createRandomQuadrant(this);
      this.quadrants.set(key, quad);
    }
    return quad;
  }

  /**
   * Get all loaded quadrants and their coordinates as an array of { x, y, quadrant }.
   */
  public getAllQuadrants(): { x: number, y: number, quadrant: Quadrant }[] {
    const result: { x: number, y: number, quadrant: Quadrant }[] = [];
    for (const [key, quadrant] of this.quadrants.entries()) {
      const [x, y] = key.split(',').map(Number);
      result.push({ x, y, quadrant });
    }
    return result;
  }

  /**
   * Render the universe to a canvas context.
   * Renders all loaded quadrants above a pre-rendered fog texture.
   * The render area is one quadrant larger in every direction than the loaded bounds.
   * @param ctx CanvasRenderingContext2D
   * @param width Render area width in pixels
   * @param height Render area height in pixels
   */
  public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const all = this.getAllQuadrants();
    if (all.length === 0) return;
    // Draw fog texture stretched to cover the whole view
    ctx.save();
    ctx.drawImage(this.fogTexture, 0, 0, width, height);
    ctx.restore();
    // Find bounds
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (const { x, y } of all) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    // Expand bounds by 1 in every direction
    minX -= 1; maxX += 1; minY -= 1; maxY += 1;
    const quadCols = maxX - minX + 1;
    const quadRows = maxY - minY + 1;
    const quadW = Math.floor(width / quadCols);
    const quadH = Math.floor(height / quadRows);
    // Render only loaded quadrants above the fog
    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        const px = (gx - minX) * quadW;
        const py = (gy - minY) * quadH;
        const quadrant = this.getQuadrant(gx, gy);
        if (quadrant) {
          // Clear the quadrant area to black before rendering
          ctx.save();
          ctx.fillStyle = '#000';
          ctx.fillRect(px, py, quadW, quadH);
          ctx.restore();
          ctx.save();
          ctx.translate(px, py);
          quadrant.render(ctx, quadW, quadH);
          ctx.restore();
        }
      }
    }
  }

  /**
   * Ensures the given star system has a unique name. If not, generates one and stores it in the map.
   */
  public assertSystemName(starSystem: StarSystem): void {
    if (starSystem.name && this.systemNameMap.get(starSystem.name) === starSystem) {
      return;
    }
    let name = '';
    do {
      name = NameGenerator.createStarName();
    } while (this.systemNameMap.has(name));
    starSystem.name = name;
    this.systemNameMap.set(name, starSystem);
  }
} 