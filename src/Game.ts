import { Universe } from './Universe';
import { QuadrantFactory } from './QuadrantFactory';

/**
 * Main game class for Galacticon. Holds the universe and manages game state.
 */
export class Game {
  /** The universe instance */
  public universe: Universe;

  /**
   * Create a new game and seed the universe with a starting quadrant at (0,0).
   */
  constructor() {
    this.universe = new Universe();
    const startQuadrant = QuadrantFactory.createRandomQuadrant();
    this.universe.setQuadrant(0, 0, startQuadrant);
  }
} 