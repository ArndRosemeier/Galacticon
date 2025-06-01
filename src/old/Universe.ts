import { Quadrant } from './Quadrant';
import { QuadrantFactory } from './QuadrantFactory';

/**
 * Represents the entire universe as an endless grid of quadrants.
 * Quadrants are stored in a map keyed by their grid coordinates as 'x,y'.
 */
export class Universe {
  /** Map from 'x,y' string to Quadrant */
  private quadrants: Map<string, Quadrant> = new Map();

  /**
   * Get the quadrant at grid coordinates (x, y), or undefined if not present.
   */
  public getQuadrant(x: number, y: number): Quadrant | undefined {
    return this.quadrants.get(`${x},${y}`);
  }

  /**
   * Add a quadrant at grid coordinates (x, y).
   */
  public setQuadrant(x: number, y: number, quadrant: Quadrant): void {
    this.quadrants.set(`${x},${y}`, quadrant);
  }

  /**
   * Get the quadrant at (x, y), creating it if it does not exist.
   * Uses QuadrantFactory to generate a new quadrant if needed.
   */
  public getOrCreateQuadrant(x: number, y: number): Quadrant {
    const key = `${x},${y}`;
    let quad = this.quadrants.get(key);
    if (!quad) {
      quad = QuadrantFactory.createRandomQuadrant();
      this.quadrants.set(key, quad);
    }
    return quad;
  }

  /**
   * Get all loaded quadrants and their coordinates as an array of { x, y, quadrant }.
   */
  public getAllQuadrants(): { x: number, y: number, quadrant: Quadrant }[] {
    const result: { x: number, y: number, quadrant: Quadrant }[] = [];
    for (const [key, quadrant] of this.quadrants.entries()) {
      const [x, y] = key.split(',').map(Number);
      result.push({ x, y, quadrant });
    }
    return result;
  }
} 