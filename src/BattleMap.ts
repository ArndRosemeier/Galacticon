import type { Ship } from './Ship';

export class BattleMap {
  static readonly SIZE = 1000;
  static readonly MIN_DISTANCE = 20;

  public aggressors: Ship[];
  public defenders: Ship[];
  public positions: Map<Ship, { x: number, y: number }>;

  constructor(aggressors: Ship[], defenders: Ship[]) {
    this.aggressors = aggressors;
    this.defenders = defenders;
    this.positions = new Map();
    this.placeShips(defenders, BattleMap.SIZE * 0.25, 'defender');
    this.placeShips(aggressors, BattleMap.SIZE * 0.75, 'aggressor');
  }

  private placeShips(ships: Ship[], x: number, side: 'aggressor' | 'defender') {
    const n = ships.length;
    if (n === 0) return;
    // Calculate how many ships fit in one column
    const maxPerCol = Math.floor(BattleMap.SIZE / BattleMap.MIN_DISTANCE);
    const numCols = Math.ceil(n / maxPerCol);
    const colSpacing = BattleMap.MIN_DISTANCE;
    const rowSpacing = BattleMap.MIN_DISTANCE;
    const colStart = x - ((numCols - 1) * colSpacing) / 2;
    let shipIdx = 0;
    for (let col = 0; col < numCols; ++col) {
      const shipsInCol = Math.min(maxPerCol, n - shipIdx);
      const totalHeight = (shipsInCol - 1) * rowSpacing;
      const yStart = (BattleMap.SIZE / 2) - (totalHeight / 2);
      for (let row = 0; row < shipsInCol; ++row) {
        const y = yStart + row * rowSpacing;
        this.positions.set(ships[shipIdx], { x: colStart + col * colSpacing, y });
        shipIdx++;
      }
    }
  }

  getPosition(ship: Ship): { x: number, y: number } {
    const pos = this.positions.get(ship);
    if (!pos) throw new Error('Ship position not found');
    return pos;
  }

  getAllPositions(): { ship: Ship, x: number, y: number }[] {
    return Array.from(this.positions.entries()).map(([ship, pos]) => ({ ship, x: pos.x, y: pos.y }));
  }

  /**
   * Finds the closest adversary (non-friendly) ship to the given ship.
   * @param ship The ship to check from
   * @returns The closest adversary ship, or undefined if none found
   */
  public GetClosestAdversary(ship: Ship): Ship | undefined {
    const myPos = this.getPosition(ship);
    const myPlayer = (ship as any).player;
    let minDist = Infinity;
    let closest: Ship | undefined = undefined;
    for (const [other, pos] of this.positions.entries()) {
      if (other === ship) continue;
      if ((other as any).player === myPlayer) continue;
      const dx = pos.x - myPos.x;
      const dy = pos.y - myPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = other;
      }
    }
    return closest;
  }

  /**
   * Move a ship to a target location, ensuring min distance from all other ships.
   * If the target is too close to another ship, tries up to 10 random nearby locations.
   * If none are valid, the ship stays in its current position.
   */
  public Move(ship: Ship, target: { x: number, y: number }): void {
    const isValid = (loc: { x: number, y: number }) => {
      for (const [other, pos] of this.positions.entries()) {
        if (other === ship) continue;
        const dx = pos.x - loc.x;
        const dy = pos.y - loc.y;
        if (Math.sqrt(dx * dx + dy * dy) < BattleMap.MIN_DISTANCE) {
          return false;
        }
      }
      return true;
    };
    // Try the target location first
    if (isValid(target)) {
      this.positions.set(ship, { x: target.x, y: target.y });
      return;
    }
    // Try up to 10 random locations around the target
    for (let i = 0; i < 10; ++i) {
      const angle = Math.random() * 2 * Math.PI;
      const dist = BattleMap.MIN_DISTANCE + Math.random() * BattleMap.MIN_DISTANCE;
      const x = target.x + Math.cos(angle) * dist;
      const y = target.y + Math.sin(angle) * dist;
      // Clamp to map bounds
      const clamped = {
        x: Math.max(0, Math.min(BattleMap.SIZE, x)),
        y: Math.max(0, Math.min(BattleMap.SIZE, y)),
      };
      if (isValid(clamped)) {
        this.positions.set(ship, clamped);
        return;
      }
    }
    // No valid location found, stay in place
  }
} 