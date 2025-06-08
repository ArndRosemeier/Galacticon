import { Tech } from '../Tech';
import type { Race } from '../Race';

export class Terraforming extends Tech {
  public static Name = 'Terraforming';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return false; }
  public get Name(): string {
    return Terraforming.Name;
  }
  public Clone(): Terraforming {
    const clone = new Terraforming(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 