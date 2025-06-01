import { fractalValueNoise2D } from './Planet';

/**
 * Enum representing the spectral class of a star.
 * O, B, A, F, G, K, M are the main spectral types.
 */
export enum SpectralClass {
  O = 'O',
  B = 'B',
  A = 'A',
  F = 'F',
  G = 'G',
  K = 'K',
  M = 'M',
}

/**
 * Represents a natural star with high-level properties.
 */
export class Star {
  /** Spectral class of the star */
  public spectralClass: SpectralClass;
  /** Mass of the star in solar masses (M☉) */
  public mass: number;
  /** The parent star system of this star */
  public parentSystem?: import('./StarSystem').StarSystem;

  /**
   * Create a new Star.
   * @param spectralClass The spectral class of the star
   * @param mass The mass of the star in solar masses (M☉)
   * @param parentSystem (optional) The parent star system
   */
  constructor(spectralClass: SpectralClass, mass: number, parentSystem?: import('./StarSystem').StarSystem) {
    this.spectralClass = spectralClass;
    this.mass = mass;
    this.parentSystem = parentSystem;
  }

  /**
   * Map spectral class to an RGB color for rendering.
   * Values are approximate astronomical colors for each class.
   */
  public static spectralClassColor: Record<SpectralClass, string> = {
    [SpectralClass.O]: 'rgb(155, 176, 255)',   // Blue
    [SpectralClass.B]: 'rgb(170, 191, 255)',   // Blue-white
    [SpectralClass.A]: 'rgb(202, 215, 255)',   // White
    [SpectralClass.F]: 'rgb(248, 247, 255)',   // Yellow-white
    [SpectralClass.G]: 'rgb(255, 244, 234)',   // Yellow
    [SpectralClass.K]: 'rgb(255, 210, 161)',   // Orange
    [SpectralClass.M]: 'rgb(255, 204, 111)',   // Red-orange
  };

  /**
   * Render the star as a filled circle with smooth, low-amplitude color variation.
   * @param ctx CanvasRenderingContext2D
   * @param cx Center x
   * @param cy Center y
   * @param radius Star radius in pixels
   * @param seed Optional seed for deterministic rendering (default: hash of properties)
   */
  public render(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, seed?: number) {
    if (seed === undefined) {
      seed = Math.abs(
        this.spectralClass.length * 1000 +
        Math.floor(this.mass * 100)
      );
    }
    // Parse the RGB color for this spectral class
    const baseColor = Star.spectralClassColor[this.spectralClass];
    const rgbMatch = baseColor.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (!rgbMatch) throw new Error(`Invalid RGB color: ${baseColor}`);
    const [r0, g0, b0] = [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    // Noise parameters: low amplitude, smooth
    const r2 = radius * radius;
    // --- Pass 1: Find min/max noise value for normalization ---
    let minN = Infinity, maxN = -Infinity;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dist2 = dx * dx + dy * dy;
        if (dist2 > r2) continue;
        const nx = (cx + dx) / radius;
        const ny = (cy + dy) / radius;
        const n = fractalValueNoise2D(nx, ny, seed, 2.5, 5);
        if (n < minN) minN = n;
        if (n > maxN) maxN = n;
      }
    }
    if (maxN === minN) maxN = minN + 1e-6;
    // Draw hand-drawn glow before main star
    const glowSteps = 18;
    for (let i = 0; i < glowSteps; i++) {
      const t = i / (glowSteps - 1);
      const rGlow = radius * (1 + 0.15 * t);
      // Alpha fades out, modulate with a little noise for non-perfect radial
      let alpha = 0.18 * (1 - t) * (1 - t);
      // Optionally, add a little angular noise for non-radial effect
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, rGlow, 0, 2 * Math.PI);
      ctx.fillStyle = baseColor;
      ctx.fill();
      ctx.restore();
    }
    // --- Pass 2: Render pixels with normalized, low-amplitude variation ---
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dist2 = dx * dx + dy * dy;
        if (dist2 > r2) continue;
        const x = cx + dx;
        const y = cy + dy;
        const nx = (cx + dx) / radius;
        const ny = (cy + dy) / radius;
        let n = fractalValueNoise2D(nx, ny, seed, 2.5, 5);
        n = (n - minN) / (maxN - minN);
        // Increased amplitude: +/- 32 around base color
        const amp = 32;
        let r = Math.round(r0 + (n - 0.5) * 2 * amp);
        let g = Math.round(g0 + (n - 0.5) * 2 * amp);
        let b = Math.round(b0 + (n - 0.5) * 2 * amp);
        // Brighter radial gradient: 1.5 at center, 1.0 at edge
        const dist = Math.sqrt(dx * dx + dy * dy) / radius;
        const grad = 1.5 - 0.5 * dist; // 1.5 at center, 1.0 at edge
        r = Math.round(r * grad);
        g = Math.round(g * grad);
        b = Math.round(b * grad);
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // No outline; glow is now more concentrated and fades quickly
  }

  /**
   * Linear interpolation between two RGB colors
   */
  private static lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
    const rr = Math.round(a[0] + (b[0] - a[0]) * t);
    const gg = Math.round(a[1] + (b[1] - a[1]) * t);
    const bb = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${rr},${gg},${bb})`;
  }
} 