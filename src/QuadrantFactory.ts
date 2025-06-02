import { Quadrant, StarSystemLocation } from './Quadrant';
import { StarSystemFactory } from './StarSystemFactory';

/**
 * Factory for generating quadrants with non-overlapping star systems.
 */
export class QuadrantFactory {
  /**
   * Create a random quadrant with 5-20 star systems, each at least 2 LY apart and at least 1 LY from the edge.
   * @param parentUniverse The parent universe to set on the quadrant (required)
   */
  public static createRandomQuadrant(parentUniverse: import('./Universe').Universe): Quadrant {
    const minSystems = 5;
    const maxSystems = 20;
    const nSystems = minSystems + Math.floor(Math.random() * (maxSystems - minSystems + 1));
    const locations: StarSystemLocation[] = [];
    const minDist = 2; // Minimum distance between systems (LY)
    const border = 1; // Minimum distance from edge (LY)
    const side = Quadrant.SIDE_LENGTH_LY;
    let attempts = 0;
    while (locations.length < nSystems && attempts < nSystems * 100) {
      attempts++;
      // Random position within allowed area
      const x = border + Math.random() * (side - 2 * border);
      const y = border + Math.random() * (side - 2 * border);
      // Check distance to all existing systems
      let tooClose = false;
      for (const loc of locations) {
        const dx = loc.x - x;
        const dy = loc.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;
      // Create the star system and location
      const system = StarSystemFactory.createRandomSystem(parentUniverse);
      locations.push({ system, x, y });
    }
    // Create the quadrant and set parent references
    const quadrant = new Quadrant(locations, parentUniverse);
    return quadrant;
  }
} 