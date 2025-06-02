import { Star, SpectralClass } from './Star';
import { Planet, PlanetType } from './Planet';
import { StarSystem } from './StarSystem';
import { Universe } from './Universe';

/**
 * Factory for generating realistic star systems using real-life probabilities.
 */
export class StarSystemFactory {
  /**
   * Realistic probabilities for star spectral classes (approximate, from astronomical surveys).
   * O, B, A, F, G, K, M (percentages add up to 100)
   */
  private static spectralClassProbabilities: [SpectralClass, number][] = [
    [SpectralClass.O, 0.00003],
    [SpectralClass.B, 0.13],
    [SpectralClass.A, 0.6],
    [SpectralClass.F, 3],
    [SpectralClass.G, 7.6],
    [SpectralClass.K, 12.1],
    [SpectralClass.M, 76.2],
  ];

  /**
   * Probabilities for planet types (rough, based on exoplanet and solar system data)
   */
  private static planetTypeProbabilities: [PlanetType, number][] = [
    [PlanetType.Terrestrial, 30],
    [PlanetType.SuperEarth, 20],
    [PlanetType.GasGiant, 10],
    [PlanetType.IceGiant, 10],
    [PlanetType.Ocean, 8],
    [PlanetType.Desert, 7],
    [PlanetType.Lava, 5],
    [PlanetType.Ice, 5],
    [PlanetType.Dwarf, 3],
    [PlanetType.SubEarth, 1],
    [PlanetType.Exotic, 1],
  ];

  /**
   * Create a random star system.
   * @param universe The parent universe (required, used for naming)
   * @param parentQuadrant (optional) The parent quadrant for the new star system
   */
  public static createRandomSystem(universe: Universe, parentQuadrant?: import('./Quadrant').Quadrant): StarSystem {
    // Pick spectral class
    const spectralClass = this.weightedRandom(this.spectralClassProbabilities);
    // Assign mass based on spectral class (approximate solar masses)
    const mass = this.randomStarMass(spectralClass);
    // Create star (parentSystem will be set after StarSystem is constructed)
    const star = new Star(spectralClass, mass);

    // Number of planets (0-20, weighted toward fewer)
    const numPlanets = StarSystemFactory.weightedRandom([
      [0, 8], [1, 16], [2, 20], [3, 18], [4, 12], [5, 8], [6, 5], [7, 3], [8, 2], [9, 1.5], [10, 1],
      [11, 0.8], [12, 0.6], [13, 0.5], [14, 0.4], [15, 0.3], [16, 0.2], [17, 0.15], [18, 0.1], [19, 0.08], [20, 0.05]
    ]);
    const planets: Planet[] = [];
    for (let i = 0; i < numPlanets; i++) {
      // Orbital position: 0 = innermost, 1 = outermost
      const pos = numPlanets === 1 ? 0.5 : i / (numPlanets - 1);
      // Adjusted probabilities by position
      const probs: [PlanetType, number][] = [
        [PlanetType.Lava,  pos < 0.18 ? 18 : pos < 0.3 ? 8 : 1],
        [PlanetType.Desert, pos < 0.25 ? 10 : pos < 0.5 ? 7 : 3],
        [PlanetType.Ocean,  pos < 0.2 ? 2 : pos < 0.5 ? 8 : 5],
        [PlanetType.Terrestrial, pos < 0.15 ? 2 : pos < 0.7 ? 30 : 10],
        [PlanetType.SuperEarth, pos < 0.2 ? 2 : pos < 0.7 ? 20 : 8],
        [PlanetType.GasGiant, pos < 0.25 ? 0.5 : pos < 0.5 ? 8 : 18],
        [PlanetType.IceGiant, pos < 0.3 ? 0.5 : pos < 0.6 ? 6 : 14],
        [PlanetType.Ice, pos < 0.5 ? 1 : 7],
        [PlanetType.Dwarf, pos < 0.5 ? 1 : 5],
        [PlanetType.SubEarth, pos < 0.5 ? 1 : 2],
        [PlanetType.Exotic, pos < 0.5 ? 0.5 : 2],
      ];
      const type = this.weightedRandom(probs);
      const radius = this.randomPlanetRadius(type);
      const mass = this.randomPlanetMass(type, radius);
      const rotationPeriod = Math.round(6 + Math.random() * 1000) / 10; // 6-106 hours
      // Create planet (parentSystem will be set after StarSystem is constructed)
      planets.push(new Planet(type, radius, mass, rotationPeriod));
    }
    // Create the star system, which will set parentSystem and parentQuadrant
    const system = new StarSystem(star, planets, parentQuadrant);
    universe.assertSystemName(system);
    return system;
  }

  /**
   * Weighted random selection from an array of [value, weight] pairs.
   */
  private static weightedRandom<T>(arr: [T, number][]): T {
    const total = arr.reduce((sum, [, w]) => sum + w, 0);
    let r = Math.random() * total;
    for (const [val, w] of arr) {
      if (r < w) return val;
      r -= w;
    }
    return arr[arr.length - 1][0]; // fallback
  }

  /**
   * Approximate mass ranges for spectral classes (in solar masses)
   */
  private static randomStarMass(spectralClass: SpectralClass): number {
    switch (spectralClass) {
      case SpectralClass.O: return 16 + Math.random() * 84; // 16-100
      case SpectralClass.B: return 2.1 + Math.random() * 15.9; // 2.1-18
      case SpectralClass.A: return 1.4 + Math.random() * 0.6; // 1.4-2.0
      case SpectralClass.F: return 1.04 + Math.random() * 0.36; // 1.04-1.4
      case SpectralClass.G: return 0.8 + Math.random() * 0.24; // 0.8-1.04
      case SpectralClass.K: return 0.45 + Math.random() * 0.35; // 0.45-0.8
      case SpectralClass.M: return 0.08 + Math.random() * 0.37; // 0.08-0.45
    }
  }

  /**
   * Approximate radius ranges for planet types (in Earth radii)
   */
  private static randomPlanetRadius(type: PlanetType): number {
    switch (type) {
      case PlanetType.Terrestrial: return 0.5 + Math.random() * 1.5; // 0.5-2.0
      case PlanetType.SuperEarth: return 1.5 + Math.random() * 1.5; // 1.5-3.0
      case PlanetType.GasGiant: return 7 + Math.random() * 5; // 7-12
      case PlanetType.IceGiant: return 3 + Math.random() * 2; // 3-5
      case PlanetType.Ocean: return 0.8 + Math.random() * 2.2; // 0.8-3.0
      case PlanetType.Desert: return 0.5 + Math.random() * 2.5; // 0.5-3.0
      case PlanetType.Lava: return 0.5 + Math.random() * 2.0; // 0.5-2.5
      case PlanetType.Ice: return 0.5 + Math.random() * 2.0; // 0.5-2.5
      case PlanetType.Dwarf: return 0.1 + Math.random() * 0.4; // 0.1-0.5
      case PlanetType.SubEarth: return 0.2 + Math.random() * 0.8; // 0.2-1.0
      case PlanetType.Exotic: return 0.5 + Math.random() * 3.5; // 0.5-4.0
    }
  }

  /**
   * Approximate mass for planet types (in Earth masses), loosely based on radius and type
   */
  private static randomPlanetMass(type: PlanetType, radius: number): number {
    switch (type) {
      case PlanetType.Terrestrial:
      case PlanetType.Ocean:
      case PlanetType.Desert:
      case PlanetType.Lava:
      case PlanetType.Ice:
      case PlanetType.SubEarth:
        return Math.pow(radius, 3) * (0.8 + Math.random() * 0.4); // rocky scaling
      case PlanetType.SuperEarth:
        return Math.pow(radius, 3) * (1.5 + Math.random() * 0.5);
      case PlanetType.GasGiant:
        return 50 + Math.random() * 250; // 50-300
      case PlanetType.IceGiant:
        return 10 + Math.random() * 10; // 10-20
      case PlanetType.Dwarf:
        return 0.01 + Math.random() * 0.09; // 0.01-0.1
      case PlanetType.Exotic:
        return Math.pow(radius, 3) * (0.5 + Math.random() * 2.5);
    }
  }
} 