import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class Propulsion extends Tech {
  public static Name = 'Propulsion';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  get Name(): string { return Propulsion.Name; }
  public Clone(): Propulsion {
    const clone = new Propulsion(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
} 