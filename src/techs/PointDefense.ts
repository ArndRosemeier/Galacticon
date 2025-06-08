import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class PointDefense extends Tech {
  public static Name = 'Point Defense';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return PointDefense.Name; }
  public Clone(): PointDefense {
    const clone = new PointDefense(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    return clone;
  }
  public TotalStrength(): number {
    if (this.Owner) {
      return this.Strength * this.race.Efficiency(this) * this.Owner.Size;
    }
    return this.Strength * this.race.Efficiency(this);
  }
} 