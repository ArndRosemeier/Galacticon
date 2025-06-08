import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class Stealth extends Tech {
  public static Name = 'Stealth';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return Stealth.Name; }
  public Clone(): Stealth {
    const clone = new Stealth(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 