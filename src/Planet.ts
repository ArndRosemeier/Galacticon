/**
 * Enum representing custom planet types for Galacticon.
 * Classification covers a range of plausible exoplanet and solar system types.
 */
export enum PlanetType {
  Terrestrial = 'Terrestrial',        // Rocky, Earth-like
  SuperEarth = 'SuperEarth',          // Large rocky planet
  GasGiant = 'GasGiant',              // Jupiter/Saturn-like
  IceGiant = 'IceGiant',              // Uranus/Neptune-like
  Ocean = 'Ocean',                    // Water world
  Desert = 'Desert',                  // Dry, arid planet
  Lava = 'Lava',                      // Volcanically active, molten surface
  Ice = 'Ice',                        // Frozen surface
  Dwarf = 'Dwarf',                    // Small, Pluto-like
  SubEarth = 'SubEarth',              // Small rocky planet
  Exotic = 'Exotic',                  // Unusual/rare (e.g., carbon, diamond, etc.)
}

/**
 * Simple seeded pseudo-random number generator (Mulberry32)
 */
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Bilinear-interpolated value noise using planet seed and pixel coordinates
 */
export function valueNoise2D_bilinear(x: number, y: number, seed: number, freq = 1): number {
  // Integer lattice points
  const xf = x * freq;
  const yf = y * freq;
  const x0 = Math.floor(xf);
  const y0 = Math.floor(yf);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  // Fractional part
  const tx = xf - x0;
  const ty = yf - y0;
  // Hash function for lattice points
  function hash(ix: number, iy: number) {
    let h = ix * 374761393 + iy * 668265263 + seed * 982451653;
    h = (h ^ (h >> 13)) * 1274126177;
    h = (h ^ (h >> 16));
    return (h >>> 0) / 4294967295;
  }
  // Noise at four corners
  const v00 = hash(x0, y0);
  const v10 = hash(x1, y0);
  const v01 = hash(x0, y1);
  const v11 = hash(x1, y1);
  // Bilinear interpolation
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const vx0 = lerp(v00, v10, tx);
  const vx1 = lerp(v01, v11, tx);
  return lerp(vx0, vx1, ty);
}

/**
 * Fractal Brownian Motion (FBM) noise: sum of several octaves of value noise
 */
export function fractalValueNoise2D(x: number, y: number, seed: number, baseFreq = 1, octaves = 4): number {
  let value = 0;
  let amplitude = 1;
  let maxAmp = 0;
  let freq = baseFreq;
  for (let i = 0; i < octaves; i++) {
    value += valueNoise2D_bilinear(x, y, seed, freq) * amplitude;
    maxAmp += amplitude;
    amplitude *= 0.5;
    freq *= 2;
  }
  return value / maxAmp;
}

// Main colors for each planet type
const PLANET_TYPE_COLORS: Record<PlanetType, [string, string, string]> = {
  [PlanetType.Terrestrial]: ['#2a6fbe', '#4ca64c', '#a67c52'],
  [PlanetType.SuperEarth]: ['#b5c7d3', '#7a8a99', '#e6eaf0'],
  [PlanetType.GasGiant]: ['#e3c97b', '#bfa14a', '#f7e7b3'],
  [PlanetType.IceGiant]: ['#b3e0f7', '#6bb7d6', '#e6f7fb'],
  [PlanetType.Ocean]: ['#3a6ea5', '#5db0e6', '#b3e0f7'],
  [PlanetType.Desert]: ['#e6c07b', '#bfa14a', '#f7e7b3'],
  [PlanetType.Lava]: ['#ff6f3c', '#b23c1a', '#ffd6a5'],
  [PlanetType.Ice]: ['#e6f7fb', '#b3e0f7', '#a3c9e2'],
  [PlanetType.Dwarf]: ['#b2b2b2', '#7a7a7a', '#e0e0e0'],
  [PlanetType.SubEarth]: ['#b2a98f', '#6e665a', '#e0d8c3'],
  [PlanetType.Exotic]: ['#a259f7', '#f75990', '#59f7c4'],
};

/**
 * Represents a planet with physical and classification properties.
 */
export class Planet {
  /** Type of the planet */
  public type: PlanetType;
  /** Radius in Earth radii (R⊕) */
  public radius: number;
  /** Mass in Earth masses (M⊕) */
  public mass: number;
  /** Rotation period in hours */
  public rotationPeriod: number;
  /** The parent star system of this planet */
  public parentSystem?: import('./StarSystem').StarSystem;
  /** The owner of the planet (player) */
  public owner: import('./Player').Player | null;
  /** Habitability score (0-100 or similar) */
  public habitability: number;
  /** Minerals score (0-100 or similar) */
  public minerals: number;

  /**
   * Create a new Planet.
   * @param type The planet type
   * @param radius The radius in Earth radii (R⊕)
   * @param mass The mass in Earth masses (M⊕)
   * @param rotationPeriod The rotation period in hours
   * @param parentSystem (optional) The parent star system
   */
  constructor(type: PlanetType, radius: number, mass: number, rotationPeriod: number, parentSystem?: import('./StarSystem').StarSystem) {
    this.type = type;
    this.radius = radius;
    this.mass = mass;
    this.rotationPeriod = rotationPeriod;
    this.parentSystem = parentSystem;
    this.owner = null;
    this.habitability = 0;
    this.minerals = 0;
  }

  /**
   * Render the planet on a given canvas context at (cx, cy) with given radius.
   * Uses seeded noise for deterministic surface patterns.
   * @param ctx CanvasRenderingContext2D
   * @param cx Center x
   * @param cy Center y
   * @param radius Planet radius in pixels
   * @param seed Optional seed for deterministic rendering (default: hash of properties)
   */
  public render(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, seed?: number) {
    // Use a hash of properties as default seed
    if (seed === undefined) {
      seed = Math.abs(
        this.type.length * 1000 +
        Math.floor(this.radius * 100) +
        Math.floor(this.mass * 10) +
        Math.floor(this.rotationPeriod * 10)
      );
    }
    const [c1, c2, c3] = PLANET_TYPE_COLORS[this.type];
    // Noise parameters
    let freq = 64, amp = 0.25; // Even higher frequency for all planet types
    // Fill planet with 2D noise pattern
    const r2 = radius * radius;
    let debugLogged = false;
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
    if (maxN === minN) maxN = minN + 1e-6; // avoid division by zero
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const dist2 = dx * dx + dy * dy;
        if (dist2 > r2) continue;
        const x = cx + dx;
        const y = cy + dy;
        // Use noise to interpolate color
        const nx = (cx + dx) / radius;
        const ny = (cy + dy) / radius;
        let n = fractalValueNoise2D(nx, ny, seed, 2.5, 5);
        // Normalize n to [0,1] based on minN/maxN
        n = (n - minN) / (maxN - minN);
        // Increase color gradient contrast
        let contrast = 2.5;
        let n2 = (n - 0.5) * contrast + 0.5;
        n2 = Math.max(0, Math.min(1, n2));
        if (!debugLogged && dx === 0 && dy === 0) {
          console.log(`[Planet Debug] type=${this.type}, seed=${seed}, freq=${freq}, amp=${amp}`);
          console.log(`[Planet Debug] Center: nx=${nx}, ny=${ny}, noise=${n}`);
        }
        if (!debugLogged && dx === Math.floor(radius/2) && dy === Math.floor(radius/2)) {
          console.log(`[Planet Debug] Sample: nx=${nx}, ny=${ny}, noise=${n}`);
          debugLogged = true;
        }
        // Smoothstep for color blending
        let color: string;
        if (n2 < 0.5) {
          // Blend c1 to c2
          color = Planet.lerpColor(c1, c2, n2 / 0.5);
        } else {
          // Blend c2 to c3
          color = Planet.lerpColor(c2, c3, (n2 - 0.5) / 0.5);
        }
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Draw outline
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Linear interpolation between two hex colors
   */
  private static lerpColor(a: string, bHex: string, t: number): string {
    function hexToRgb(hex: string) {
      let c = hex;
      if (c.startsWith('#')) c = c.slice(1);
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(c)) {
        throw new Error(`Invalid hex color: ${hex}`);
      }
      const num = parseInt(c, 16);
      return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
    }
    const [r1, g1, b1] = hexToRgb(a);
    const [r2, g2, b2] = hexToRgb(bHex);
    const rr = Math.round(r1 + (r2 - r1) * t);
    const gg = Math.round(g1 + (g2 - g1) * t);
    const bb = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${rr},${gg},${bb})`;
  }

  /**
   * Slightly vary a hex color by a factor (-1 to 1)
   */
  private static varyColor(hex: string, factor: number): string {
    if (!hex.startsWith('#')) {
      throw new Error(`varyColor expects a hex string starting with '#', got: ${hex}`);
    }
    // Convert hex to RGB
    let c = hex;
    if (c.startsWith('#')) c = c.slice(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.min(255, Math.max(0, Math.round(r + factor * 32)));
    g = Math.min(255, Math.max(0, Math.round(g + factor * 32)));
    b = Math.min(255, Math.max(0, Math.round(b + factor * 32)));
    return `rgb(${r},${g},${b})`;
  }
} 