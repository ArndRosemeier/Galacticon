import { Tech } from '../Tech';
import type { Race } from '../Race';

export class Espionage extends Tech {
  public static Name = 'Espionage';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return false; }
  public get Name(): string {
    return Espionage.Name;
  }
  public Clone(): Espionage {
    const clone = new Espionage(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 