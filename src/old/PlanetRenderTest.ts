import { Planet, PlanetType } from './Planet';

/**
 * Utility class to render a test canvas showing all planet types with labels.
 */
export class PlanetRenderTest {
  /**
   * Create a canvas rendering all planet types with typical parameters and labels.
   * @param width Canvas width
   * @param height Canvas height
   * @returns HTMLCanvasElement
   */
  static renderAllTypes(width: number, height: number): HTMLCanvasElement {
    const types = Object.values(PlanetType);
    const n = types.length;
    // Determine grid (try to be as square as possible)
    const cols = Math.ceil(Math.sqrt(n * width / height));
    const rows = Math.ceil(n / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    const planetRadius = Math.min(cellW, cellH) * 0.28;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${Math.round(cellH * 0.18)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;

    types.forEach((type, i) => {
      // Typical parameters for each type
      let radius = 1, mass = 1, rotation = 24;
      switch (type) {
        case PlanetType.Terrestrial: radius = 1; mass = 1; rotation = 24; break;
        case PlanetType.SuperEarth: radius = 2.2; mass = 6; rotation = 30; break;
        case PlanetType.GasGiant: radius = 10; mass = 150; rotation = 10; break;
        case PlanetType.IceGiant: radius = 4; mass = 15; rotation = 16; break;
        case PlanetType.Ocean: radius = 1.5; mass = 2; rotation = 20; break;
        case PlanetType.Desert: radius = 1.1; mass = 1.2; rotation = 22; break;
        case PlanetType.Lava: radius = 1.2; mass = 1.3; rotation = 18; break;
        case PlanetType.Ice: radius = 1.0; mass = 1.1; rotation = 30; break;
        case PlanetType.Dwarf: radius = 0.2; mass = 0.01; rotation = 8; break;
        case PlanetType.SubEarth: radius = 0.5; mass = 0.2; rotation = 40; break;
        case PlanetType.Exotic: radius = 1.3; mass = 2.5; rotation = 12; break;
      }
      // Center of this cell
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH * 0.55;
      // Render planet
      const planet = new Planet(type, radius, mass, rotation);
      planet.render(ctx, cx, cy, planetRadius);
      // Draw label
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(type, cx, row * cellH + cellH * 0.08);
      ctx.shadowBlur = 0;
    });
    return canvas;
  }
} 