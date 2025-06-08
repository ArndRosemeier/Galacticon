import { Propulsion } from './techs/Propulsion';
import { Armor } from './techs/Armor';
import { EnergyShields } from './techs/EnergyShields';
import { PointDefense } from './techs/PointDefense';
import { EnergyWeapons } from './techs/EnergyWeapons';
import { Missiles } from './techs/Missiles';
import { ProjectileWeapons } from './techs/ProjectileWeapons';
import { Sensors } from './techs/Sensors';
import { EnergySystems } from './techs/EnergySystems';
import { Player } from './Player';
import { Utils } from './Utils';
import { Stealth } from './techs/Stealth';

export class Ship {
  propulsion: Propulsion;
  armor: Armor;
  energyShields: EnergyShields;
  pointDefense: PointDefense;
  energyWeapons: EnergyWeapons;
  rocketWeapons: Missiles;
  projectileWeapons: ProjectileWeapons;
  sensors: Sensors;
  energySystems: EnergySystems;
  player: Player;
  stealth: Stealth;

  equipment: Array<import('./Tech').Tech>;

  static readonly TotalEquipmentStrength = 100;

  BaseStrength: number = 100;

  Image: HTMLCanvasElement | null = null;

  Size: number = 50; // Range 1 to 100

  Colonists: number = 0;
  Troops: number = 0;

  /** The ship's position in combat (for tactical combat UI, etc.) */
  CombatPosition: { x: number, y: number } = { x: 0, y: 0 };

  public EnergyLevel: number;

  constructor(player: Player) {
    this.player = player;
    if (!player.race) throw new Error('Ship: player.race must be set');
    this.propulsion = player.propulsion.Clone();
    this.armor = player.armor.Clone();
    this.energyShields = player.energyShields.Clone();
    this.pointDefense = player.pointDefense.Clone();
    this.energyWeapons = player.energyWeapons.Clone();
    this.rocketWeapons = player.rocketWeapons.Clone();
    this.projectileWeapons = player.projectileWeapons.Clone();
    this.sensors = player.sensors.Clone();
    this.energySystems = player.energySystems.Clone();
    this.stealth = player.stealth?.Clone() ?? new Stealth(player.race);
    this.equipment = [
      this.propulsion,
      this.armor,
      this.energyShields,
      this.pointDefense,
      this.energyWeapons,
      this.rocketWeapons,
      this.projectileWeapons,
      this.sensors,
      this.energySystems,
      this.stealth
    ];
    // Set all equipment strengths equal so their sum is TotalEquipmentStrength
    const equalStrength = Ship.TotalEquipmentStrength / this.equipment.length;
    this.equipment.forEach(e => e.Strength = equalStrength);
    // Set each equipment's Efficiency to the related tech's efficiency from the player
    this.propulsion.StartEfficiency = player.propulsion.getEfficiency();
    this.armor.StartEfficiency = player.armor.getEfficiency();
    this.energyShields.StartEfficiency = player.energyShields.getEfficiency();
    this.pointDefense.StartEfficiency = player.pointDefense.getEfficiency();
    this.energyWeapons.StartEfficiency = player.energyWeapons.getEfficiency();
    this.rocketWeapons.StartEfficiency = player.rocketWeapons.getEfficiency();
    this.projectileWeapons.StartEfficiency = player.projectileWeapons.getEfficiency();
    this.sensors.StartEfficiency = player.sensors.getEfficiency();
    this.energySystems.StartEfficiency = player.energySystems.getEfficiency();
    // Set Owner for all techs
    this.equipment.forEach(e => e.Owner = this);
    this.EnergyLevel = 5 * this.energySystems.TotalStrength();
  }

  SetEquipmentStrength(name: string, value: number) {
    // Clamp value between 0 and TotalEquipmentStrength
    value = Math.max(0, Math.min(Ship.TotalEquipmentStrength, value));
    const idx = this.equipment.findIndex(e => e.Name === name);
    if (idx === -1) return;
    const strengths = this.equipment.map(e => Math.round(e.Strength));
    const newStrengths = Utils.distribute(strengths, idx, Math.round(value), Ship.TotalEquipmentStrength);
    this.equipment.forEach((e, i) => e.Strength = newStrengths[i]);
  }

  /**
   * Returns the total damage ratio: sum of all equipment Efficiency divided by sum of all StartEfficiency.
   */
  totalDamageRatio(): number {
    const totalEff = this.equipment.reduce((sum, eq) => sum + eq.Efficiency, 0);
    const totalStart = this.equipment.reduce((sum, eq) => sum + eq.StartEfficiency, 0);
    if (totalStart === 0) return 0;
    return totalEff / totalStart;
  }

  /**
   * Applies damage to the ship. Returns true if destroyed, false if just damaged.
   */
  takeDamage(damage: number): boolean {
    damage = damage / this.Size;
    let remaining = damage;
    // Get all equipment with Efficiency > 0
    const valid = this.equipment.filter(eq => eq.Efficiency > 0);
    if (valid.length === 0) return true; // Already dead
    // Shuffle for random selection
    let pool = [...valid];
    while (remaining > 0 && pool.length > 0) {
      // Pick a random equipment from pool
      const idx = Math.floor(Math.random() * pool.length);
      const eq = pool[idx];
      if (eq.Efficiency >= remaining) {
        eq.Efficiency -= remaining;
        remaining = 0;
      } else {
        remaining -= eq.Efficiency;
        eq.Efficiency = 0;
        // Remove from pool
        pool.splice(idx, 1);
      }
    }
    // Compute total damage ratio
    const ratio = this.totalDamageRatio();
    if (ratio < 0.5) {
      // Chance to be destroyed: 1 at 0, 0 at 0.5, linear
      const chance = 1 - ratio / 0.5;
      if (Math.random() < chance) return true; // Destroyed
    }
    return false; // Just damaged
  }

  /**
   * Returns the ship's weight: size + colonists * 0.1 + troops * 0.1
   */
  Weight(): number {
    return this.Size + this.Colonists * 0.1 + this.Troops * 0.1;
  }

  /**
   * Returns the ship's speed factor: Size / Weight()
   */
  SpeedFactor(): number {
    const denom = this.Weight();
    return denom > 0 ? this.Size / denom : 0;
  }

  /**
   * Returns the ship's speed: propulsion.TotalStrength() * SpeedFactor()
   */
  Speed(): number {
    return this.propulsion.TotalStrength() * this.SpeedFactor();
  }
} 