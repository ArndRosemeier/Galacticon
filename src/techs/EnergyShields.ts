import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';
import type { Race } from '../Race';

export class EnergyShields extends Tech {
  public static Name = 'Energy Shields';
  public Degradation: number = 0;
  constructor(race: Race) { super(race); }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return EnergyShields.Name; }
  public Clone(): EnergyShields {
    const clone = new EnergyShields(this.race);
    clone.researchPoints = this.researchPoints;
    clone.Strength = this.Strength;
    clone.Efficiency = this.Efficiency;
    clone.StartEfficiency = this.StartEfficiency;
    clone.Degradation = this.Degradation;
    return clone;
  }

  /**
   * Apply incoming damage to the shields sequentially: energy (full), projectile (half), missile (half).
   * Returns the damage that went through (not absorbed).
   * @param EnergyDamage Full value
   * @param ProjectileDamage Half value
   * @param MissileDamage Half value
   */
  public takeHit(EnergyDamage: number, ProjectileDamage: number, MissileDamage: number): number {
    let remainingCapacity = this.Strength - this.Degradation;
    let damageThrough = 0;

    // 1. Energy damage (full)
    if (remainingCapacity > 0 && EnergyDamage > 0) {
      const absorbed = Math.min(EnergyDamage, remainingCapacity);
      this.Degradation += absorbed;
      remainingCapacity -= absorbed;
      EnergyDamage -= absorbed;
      damageThrough += EnergyDamage; // Any leftover energy damage goes through
    } else {
      damageThrough += EnergyDamage;
    }

    // 2. Projectile damage (half)
    if (remainingCapacity > 0 && ProjectileDamage > 0) {
      const absorbable = Math.min(ProjectileDamage * 0.5, remainingCapacity);
      const absorbedProjectiles = absorbable / 0.5;
      this.Degradation += absorbable;
      remainingCapacity -= absorbable;
      ProjectileDamage -= absorbedProjectiles;
      if (ProjectileDamage > 0) damageThrough += ProjectileDamage;
    } else {
      damageThrough += ProjectileDamage;
    }

    // 3. Missile damage (half)
    if (remainingCapacity > 0 && MissileDamage > 0) {
      const absorbable = Math.min(MissileDamage * 0.5, remainingCapacity);
      const absorbedMissiles = absorbable / 0.5;
      this.Degradation += absorbable;
      remainingCapacity -= absorbable;
      MissileDamage -= absorbedMissiles;
      if (MissileDamage > 0) damageThrough += MissileDamage;
    } else {
      damageThrough += MissileDamage;
    }

    // Cap degradation
    if (this.Degradation > this.Strength) this.Degradation = this.Strength;
    return damageThrough;
  }
} 