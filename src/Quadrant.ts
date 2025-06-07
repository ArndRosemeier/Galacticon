import { StarSystem } from './StarSystem';

/**
 * Represents the position of a star system within a quadrant (in light years).
 */
export interface StarSystemLocation {
  system: StarSystem;
  x: number; // x coordinate in light years (0 <= x < SIDE_LENGTH_LY)
  y: number; // y coordinate in light years (0 <= y < SIDE_LENGTH_LY)
  parentQuadrant?: Quadrant;
}

/**
 * Represents a quadrant of space, 10x10 light years, containing multiple star systems with coordinates.
 */
export class Quadrant {
  /** Side length of the quadrant in light years (always 10) */
  public static readonly SIDE_LENGTH_LY = 10;
  /** Star systems contained in this quadrant, each with coordinates */
  public starSystems: StarSystemLocation[];
  /** The parent universe of this quadrant */
  public parentUniverse: import('./Universe').Universe;
  /** The grid position of this quadrant in the universe */
  public position: { x: number, y: number } | null = null;

  /**
   * Create a new Quadrant.
   * @param starSystems The star systems (with coordinates) in this quadrant
   * @param parentUniverse The parent universe
   */
  constructor(starSystems: StarSystemLocation[] = [], parentUniverse: import('./Universe').Universe) {
    this.starSystems = starSystems;
    this.parentUniverse = parentUniverse;
    // Set parentQuadrant for each star system and location
    for (const loc of this.starSystems) {
      loc.parentQuadrant = this;
      loc.system.parentQuadrant = this;
    }
  }

  /**
   * Render all star systems' stars at their positions in the quadrant.
   * @param ctx CanvasRenderingContext2D
   * @param width Render area width in pixels
   * @param height Render area height in pixels
   */
  public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const scaleX = width / Quadrant.SIDE_LENGTH_LY;
    const scaleY = height / Quadrant.SIDE_LENGTH_LY;
    const baselineRadius = Math.min(width, height) / 40;
    // Spectral class size multipliers
    const spectralSize: Record<string, number> = {
      O: 2.0,
      B: 1.7,
      A: 1.4,
      F: 1.2,
      G: 1.0,
      K: 0.8,
      M: 0.5,
    };
    for (const loc of this.starSystems) {
      const px = loc.x * scaleX;
      const py = loc.y * scaleY;
      const spec = loc.system.star.spectralClass;
      const mult = spectralSize[spec] ?? 1.0;
      loc.system.star.render(ctx, px, py, baselineRadius * mult);
      // Draw system name below the star
      ctx.save();
      ctx.font = `bold ${Math.round(baselineRadius * 1.1)}px 'Orbitron', 'Share Tech Mono', 'monospace'`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 6;
      ctx.globalAlpha = 0.85;
      ctx.fillText(loc.system.name, px, py + baselineRadius * mult + 2);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }
} 