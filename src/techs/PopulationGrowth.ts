import { Tech } from '../Tech';
import type { Race } from '../Race';

export class PopulationGrowth extends Tech {
  public static Name = 'Population Growth';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return false; }
  public get Name(): string {
    return PopulationGrowth.Name;
  }
  public Clone(): PopulationGrowth {
    const clone = new PopulationGrowth(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 