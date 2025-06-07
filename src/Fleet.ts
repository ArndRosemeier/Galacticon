// Fleet.ts
// Represents a fleet of ships belonging to a player, located at a position in the universe.

import { Player } from './Player';
import { Ship } from './Ship';
import { Position } from './Position';

export class Fleet {
  /** The owner of this fleet */
  public player: Player;
  /** The ships in this fleet */
  public ships: Ship[];
  /** The current position of this fleet */
  public position: Position;

  constructor(player: Player, ships: Ship[], position: Position) {
    this.player = player;
    this.ships = ships;
    this.position = position;
  }

  /**
   * Returns the speed of the slowest ship in the fleet, or 0 if empty.
   */
  Speed(): number {
    if (this.ships.length === 0) return 0;
    return Math.min(...this.ships.map(s => s.Speed()));
  }
} 