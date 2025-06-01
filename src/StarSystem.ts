import { Star } from './Star';
import { Planet } from './Planet';

/**
 * Represents a star system, containing a central star and its planets.
 */
export class StarSystem {
  /** The central star of the system */
  public star: Star;
  /** The planets orbiting the star */
  public planets: Planet[];
  /** The parent quadrant of this star system */
  public parentQuadrant?: import('./Quadrant').Quadrant;

  /**
   * Create a new StarSystem.
   * @param star The central star
   * @param planets The planets orbiting the star
   * @param parentQuadrant (optional) The parent quadrant
   */
  constructor(star: Star, planets: Planet[], parentQuadrant?: import('./Quadrant').Quadrant) {
    this.star = star;
    this.planets = planets;
    this.parentQuadrant = parentQuadrant;
    // Set parent references
    this.star.parentSystem = this;
    for (const planet of this.planets) {
      planet.parentSystem = this;
    }
  }

  /**
   * Render the star system with the star in the center and planets in orbits.
   * @param ctx CanvasRenderingContext2D
   * @param cx Center x
   * @param cy Center y
   * @param width Render area width
   * @param height Render area height
   */
  public render(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, height: number) {
    const nPlanets = this.planets.length;
    // Sizing
    const planetRadius = Math.min(width, height) * 0.03;
    const starRadius = planetRadius * 3;
    // Orbits
    const minOrbit = starRadius * 1.7;
    const maxOrbit = Math.min(width, height) * 0.45;
    // Draw orbits
    for (let i = 0; i < nPlanets; i++) {
      const r = minOrbit + (maxOrbit - minOrbit) * (i / Math.max(1, nPlanets - 1));
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
    // Draw star in center
    this.star.render(ctx, cx, cy, starRadius);
    // Draw label for star
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.round(starRadius * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 6;
    ctx.fillText('Star', cx, cy - starRadius * 1.1);
    ctx.shadowBlur = 0;
    ctx.restore();
    // Draw planets at random spots in their orbits
    for (let i = 0; i < nPlanets; i++) {
      const planet = this.planets[i];
      const r = minOrbit + (maxOrbit - minOrbit) * (i / Math.max(1, nPlanets - 1));
      const angle = Math.random() * 2 * Math.PI;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      planet.render(ctx, px, py, planetRadius);
    }
  }
} 