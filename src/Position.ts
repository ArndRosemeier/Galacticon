// Position.ts
// Represents the position of a fleet in the game universe.

import { Planet } from './Planet';
import { StarSystem } from './StarSystem';

export type PositionKind = 'Orbit' | 'System' | 'Transit';

export class Position {
  kind: PositionKind;
  // For 'Orbit': the planet the fleet is orbiting
  planet?: Planet;
  // For 'System': the star system the fleet is in (but not orbiting any planet)
  system?: StarSystem;
  // For 'Transit':
  from?: Position; // Start position (Orbit or System)
  to?: Position;   // End position (Orbit or System)
  distance?: number; // Total distance of the transit
  percentDone?: number; // 0..1, percent of transit completed

  private constructor(kind: PositionKind) {
    this.kind = kind;
  }

  static Orbit(planet: Planet): Position {
    const pos = new Position('Orbit');
    pos.planet = planet;
    return pos;
  }

  static System(system: StarSystem): Position {
    const pos = new Position('System');
    pos.system = system;
    return pos;
  }

  static Transit(from: Position, to: Position, distance: number, percentDone: number): Position {
    const pos = new Position('Transit');
    pos.from = from;
    pos.to = to;
    pos.distance = distance;
    pos.percentDone = percentDone;
    return pos;
  }

  // Utility: is this position in orbit?
  isOrbit(): boolean { return this.kind === 'Orbit'; }
  // Utility: is this position in a system (not orbiting)?
  isSystem(): boolean { return this.kind === 'System'; }
  // Utility: is this position in transit?
  isTransit(): boolean { return this.kind === 'Transit'; }

  /**
   * Returns the universe coordinates (in light years) for this position.
   * For Orbit: uses the parent star system's coordinates.
   * For System: uses the star system's coordinates.
   * For Transit: interpolates between from and to using percentDone.
   * Returns [x, y] in universe coordinates.
   */
  static Coordinates(pos: Position): [number, number] {
    if (pos.isOrbit()) {
      // Orbit: use the parent system's coordinates
      const planet = pos.planet;
      if (!planet || !planet.parentSystem) throw new Error('Orbit position missing planet or parentSystem');
      return Position.Coordinates(Position.System(planet.parentSystem));
    }
    if (pos.isSystem()) {
      const system = pos.system;
      if (!system || !system.parentQuadrant) throw new Error('System position missing system or parentQuadrant');
      // Find the StarSystemLocation for this system in the quadrant
      const quad = system.parentQuadrant;
      if (!quad.position) throw new Error('Quadrant missing position');
      const loc = quad.starSystems.find(loc => loc.system === system);
      if (!loc) throw new Error('System not found in parentQuadrant');
      // Universe coordinates: quadrant + local
      const x = quad.position.x * (require('./Quadrant').Quadrant.SIDE_LENGTH_LY) + loc.x;
      const y = quad.position.y * (require('./Quadrant').Quadrant.SIDE_LENGTH_LY) + loc.y;
      return [x, y];
    }
    if (pos.isTransit()) {
      if (!pos.from || !pos.to || typeof pos.percentDone !== 'number') throw new Error('Transit position missing from/to/percentDone');
      const [x1, y1] = Position.Coordinates(pos.from);
      const [x2, y2] = Position.Coordinates(pos.to);
      const t = pos.percentDone;
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
    throw new Error('Unknown position kind');
  }

  /**
   * Returns the distance (in light years) between two positions.
   */
  static distance(a: Position, b: Position): number {
    const [x1, y1] = Position.Coordinates(a);
    const [x2, y2] = Position.Coordinates(b);
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
} 