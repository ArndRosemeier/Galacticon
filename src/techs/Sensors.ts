import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class Sensors extends Tech {
  public static Name = 'Sensors';
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string {
    return Sensors.Name;
  }
  public Clone(): Sensors {
    const clone = new Sensors(this.race);
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