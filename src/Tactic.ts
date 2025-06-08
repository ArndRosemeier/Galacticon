import type { BattleMap } from './BattleMap';
import type { Ship } from './Ship';

export abstract class Tactic {
  public Confidence: number = 1;
  abstract Description: string;
  abstract Act(ship: Ship, map: BattleMap): boolean;
} 