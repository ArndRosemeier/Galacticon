import { StarSystemFactory } from './StarSystemFactory';
import { Star } from './Star';
import { Planet } from './Planet';

/**
 * Utility class to render a test canvas showing a generated star system.
 */
export class StarSystemRenderTest {
  /**
   * Create a canvas rendering a random star system with the star in the center and planets in orbits.
   * @param width Canvas width
   * @param height Canvas height
   * @returns HTMLCanvasElement
   */
  static renderRandomSystem(width: number, height: number): HTMLCanvasElement {
    const system = StarSystemFactory.createRandomSystem();
    const nPlanets = system.planets.length;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, width, height);
    // Center
    const cx = width / 2;
    const cy = height / 2;
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
    system.star.render(ctx, cx, cy, starRadius);
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
      const planet = system.planets[i];
      const r = minOrbit + (maxOrbit - minOrbit) * (i / Math.max(1, nPlanets - 1));
      const angle = Math.random() * 2 * Math.PI;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      planet.render(ctx, px, py, planetRadius);
    }
    return canvas;
  }
} 