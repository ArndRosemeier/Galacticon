import { Tech } from '../Tech';
import { EnergyWeaponsSpecification } from '../equipment/EnergyWeaponsSpecification';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class EnergyWeapons extends Tech {
  public static Name = 'Energy Weapons';
  private _specification: EnergyWeaponsSpecification;
  static readonly ZERO_DAMAGE_RANGE = 100;
  static readonly MAX_FOCUS_ZERO_DAMAGE_RANGE = 500;

  constructor(race: Race) {
    super(race);
    this._specification = new EnergyWeaponsSpecification();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return EnergyWeapons.Name; }
  public Clone(): EnergyWeapons {
    const clone = new EnergyWeapons(this.race);
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

  /**
   * Hit a ship with this energy weapon at a given range.
   * @param ship The target ship
   * @param range The distance to the target
   * @returns true if the ship is destroyed, false otherwise
   */
  public Hit(ship: any, range: number): boolean {
    // Get force and focus from specification
    const force = this._specification.force;
    const focus = this._specification.focus;
    // Calculate zero-damage range
    const zeroRange = EnergyWeapons.ZERO_DAMAGE_RANGE + (EnergyWeapons.MAX_FOCUS_ZERO_DAMAGE_RANGE - EnergyWeapons.ZERO_DAMAGE_RANGE) * (focus / 100);
    // Linear dissipation
    let damage = force * Math.max(0, 1 - range / zeroRange);
    if (damage <= 0) return false;
    // Apply to shields
    let remaining = ship.energyShields.takeHit(damage, 0, 0);
    // Apply to armor
    if (remaining > 0) {
      remaining = ship.armor.takeHit(remaining, 0, 0);
    }
    // Apply to ship
    if (remaining > 0) {
      return ship.takeDamage(remaining) === true;
    }
    return false;
  }

  public TotalStrength(): number {
    if (this.Owner) {
      return this.Strength * this.race.Efficiency(this) * this.Owner.Size;
    }
    return this.Strength * this.race.Efficiency(this);
  }
} 