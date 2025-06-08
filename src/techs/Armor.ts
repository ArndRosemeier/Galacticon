import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class Armor extends Tech {
  public static Name = 'Armor';
  public Degradation: number = 0;
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return Armor.Name; }
  public Clone(): Armor {
    const clone = new Armor(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    clone.Degradation = this.Degradation;
    return clone;
  }

  /**
   * Apply incoming damage to the armor sequentially: energy (half), projectile (full), missile (full).
   * Returns the damage that went through (not absorbed).
   * @param EnergyDamage Half value
   * @param ProjectileDamage Full value
   * @param MissileDamage Full value
   */
  public takeHit(EnergyDamage: number, ProjectileDamage: number, MissileDamage: number): number {
    let remainingCapacity = this.Strength - this.Degradation;
    let damageThrough = 0;

    // 1. Energy damage (half)
    if (remainingCapacity > 0 && EnergyDamage > 0) {
      const absorbable = Math.min(EnergyDamage * 0.5, remainingCapacity);
      const absorbedEnergy = absorbable / 0.5;
      this.Degradation += absorbable;
      remainingCapacity -= absorbable;
      EnergyDamage -= absorbedEnergy;
      if (EnergyDamage > 0) damageThrough += EnergyDamage;
    } else {
      damageThrough += EnergyDamage;
    }

    // 2. Projectile damage (full)
    if (remainingCapacity > 0 && ProjectileDamage > 0) {
      const absorbed = Math.min(ProjectileDamage, remainingCapacity);
      this.Degradation += absorbed;
      remainingCapacity -= absorbed;
      ProjectileDamage -= absorbed;
      damageThrough += ProjectileDamage;
    } else {
      damageThrough += ProjectileDamage;
    }

    // 3. Missile damage (full)
    if (remainingCapacity > 0 && MissileDamage > 0) {
      const absorbed = Math.min(MissileDamage, remainingCapacity);
      this.Degradation += absorbed;
      remainingCapacity -= absorbed;
      MissileDamage -= absorbed;
      damageThrough += MissileDamage;
    } else {
      damageThrough += MissileDamage;
    }

    // Cap degradation
    if (this.Degradation > this.Strength) this.Degradation = this.Strength;
    return damageThrough;
  }

  public TotalStrength(): number {
    if (this.Owner) {
      return this.Strength * this.race.Efficiency(this) * this.Owner.Size;
    }
    return this.Strength * this.race.Efficiency(this);
  }
} 