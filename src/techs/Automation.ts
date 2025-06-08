import { Tech } from '../Tech';
import type { Race } from '../Race';

export class Automation extends Tech {
  public static Name = 'Automation';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return false; }
  public get Name(): string {
    return Automation.Name;
  }
  public Clone(): Automation {
    const clone = new Automation(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 