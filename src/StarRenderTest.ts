import { Star, SpectralClass } from './Star';

/**
 * Utility class to render a test canvas showing all star spectral classes with labels.
 */
export class StarRenderTest {
  /**
   * Create a canvas rendering all spectral classes with typical parameters and labels.
   * @param width Canvas width
   * @param height Canvas height
   * @returns HTMLCanvasElement
   */
  static renderAllClasses(width: number, height: number): HTMLCanvasElement {
    const classes = Object.values(SpectralClass);
    const n = classes.length;
    // Arrange in a single row or as square as possible
    const cols = Math.ceil(Math.sqrt(n * width / height));
    const rows = Math.ceil(n / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    const starRadius = Math.min(cellW, cellH) * 0.28;

    // Typical mass values for each spectral class (approximate)
    const typicalMass: Record<SpectralClass, number> = {
      [SpectralClass.O]: 40,
      [SpectralClass.B]: 10,
      [SpectralClass.A]: 3,
      [SpectralClass.F]: 1.7,
      [SpectralClass.G]: 1.0,
      [SpectralClass.K]: 0.7,
      [SpectralClass.M]: 0.2,
    };

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

    classes.forEach((cls, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH * 0.55;
      // Render star
      const star = new Star(cls, typicalMass[cls]);
      star.render(ctx, cx, cy, starRadius);
      // Draw label
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(cls, cx, row * cellH + cellH * 0.08);
      ctx.shadowBlur = 0;
    });
    return canvas;
  }
} 