import { Tech } from '../Tech';
import { MissileSpecification } from '../equipment/MissileSpecification';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class Missiles extends Tech {
  public static Name = 'Missiles';
  private _specification: MissileSpecification;
  constructor(race: Race) {
    super(race);
    this._specification = new MissileSpecification();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return Missiles.Name; }
  public Clone(): Missiles {
    const clone = new Missiles(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    // Deep clone specification if needed
    if (this._specification && clone._specification) {
      clone._specification.SpecificationValues = [...this._specification.SpecificationValues];
    }
    return clone;
  }
  public TotalStrength(): number {
    if (this.Owner) {
      return this.Strength * this.race.Efficiency(this) * this.Owner.Size;
    }
    return this.Strength * this.race.Efficiency(this);
  }
} 