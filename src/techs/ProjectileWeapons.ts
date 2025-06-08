import { Tech } from '../Tech';
import { ProjectileSpecifications } from '../equipment/ProjectileSpecifications';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class ProjectileWeapons extends Tech {
  public static Name = 'Projectile Weapons';
  private _specification: ProjectileSpecifications;
  constructor(race: Race) {
    super(race);
    this._specification = new ProjectileSpecifications();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return ProjectileWeapons.Name; }
  public Clone(): ProjectileWeapons {
    const clone = new ProjectileWeapons(this.race);
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
   * Hit a ship with this projectile weapon.
   * @param ship The target ship
   * @returns true if the ship is destroyed, false otherwise
   */
  public Hit(ship: any): boolean {
    const impact = this._specification.impact;
    const piercing = this._specification.piercing;
    const armorMultiplier = 1 + piercing / 25;
    // First, apply to shields as projectile damage
    let remaining = ship.energyShields.takeHit(0, impact, 0);
    // Apply to armor with multiplier
    let armorDamage = remaining * armorMultiplier;
    let throughArmor = ship.armor.takeHit(0, armorDamage, 0);
    // Divide back the damage that goes through
    remaining = throughArmor / armorMultiplier;
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