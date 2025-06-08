import { Tech } from '../Tech';
import type { Race } from '../Race';

export class Construction extends Tech {
  public static Name = 'Construction';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return false; }
  public get Name(): string {
    return Construction.Name;
  }
  public Clone(): Construction {
    const clone = new Construction(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 