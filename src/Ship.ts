import { Propulsion } from './equipment/Propulsion';
import { Armor } from './equipment/Armor';
import { EnergyShield } from './equipment/EnergyShield';
import { PointDefense } from './equipment/PointDefense';
import { EnergyWeapon } from './equipment/EnergyWeapon';
import { Rocket } from './equipment/Rocket';
import { ProjectileWeapon } from './equipment/ProjectileWeapon';
import { Sensors } from './equipment/Sensors';
import { EnergySystems } from './equipment/EnergySystems';
import { Stealth } from './equipment/Stealth';
import { Player } from './Player';

export class Ship {
  propulsion: Propulsion;
  armor: Armor;
  energyShield: EnergyShield;
  pointDefense: PointDefense;
  energyWeapon: EnergyWeapon;
  rocket: Rocket;
  projectileWeapon: ProjectileWeapon;
  sensors: Sensors;
  energySystems: EnergySystems;
  stealth: Stealth;
  player: Player;

  equipment: Array<import('./Equipment').Equipment>;

  static readonly TotalEquipmentStrength = 100;

  BaseStrength: number = 100;

  constructor(player: Player) {
    this.player = player;
    this.propulsion = new Propulsion();
    this.armor = new Armor();
    this.energyShield = new EnergyShield();
    this.pointDefense = new PointDefense();
    this.energyWeapon = new EnergyWeapon();
    this.rocket = new Rocket();
    this.projectileWeapon = new ProjectileWeapon();
    this.sensors = new Sensors();
    this.energySystems = new EnergySystems();
    this.stealth = new Stealth();
    this.equipment = [
      this.propulsion,
      this.armor,
      this.energyShield,
      this.pointDefense,
      this.energyWeapon,
      this.rocket,
      this.projectileWeapon,
      this.sensors,
      this.energySystems,
      this.stealth
    ];
    // Set all equipment strengths equal so their sum is TotalEquipmentStrength
    const equalStrength = Ship.TotalEquipmentStrength / this.equipment.length;
    this.equipment.forEach(e => e.Strength = equalStrength);
    // Set each equipment's Efficiency to the related tech's efficiency from the player
    this.propulsion.Efficiency = player.propulsion.getEfficiency();
    this.armor.Efficiency = player.armor.getEfficiency();
    this.energyShield.Efficiency = player.energyShields.getEfficiency();
    this.pointDefense.Efficiency = player.pointDefense.getEfficiency();
    this.energyWeapon.Efficiency = player.energyWeapons.getEfficiency();
    this.rocket.Efficiency = player.rocketWeapons.getEfficiency();
    this.projectileWeapon.Efficiency = player.projectileWeapons.getEfficiency();
    this.sensors.Efficiency = player.sensors.getEfficiency();
    this.energySystems.Efficiency = player.energySystems.getEfficiency();
    // Stealth does not have a direct tech, so leave Efficiency as default or set as needed
  }

  SetEquipmentStrength(name: string, value: number) {
    // Clamp value between 0 and TotalEquipmentStrength
    value = Math.max(0, Math.min(Ship.TotalEquipmentStrength, value));
    const eq = this.equipment.find(e => e.Name === name);
    if (!eq) return;
    const others = this.equipment.filter(e => e !== eq);
    const totalOther = others.reduce((sum, e) => sum + e.Strength, 0);
    eq.Strength = value;
    const remaining = Ship.TotalEquipmentStrength - value;
    if (others.length === 0) return;
    if (totalOther === 0) {
      // If all others are zero, distribute remaining equally
      const per = remaining / others.length;
      others.forEach(e => e.Strength = per);
    } else {
      // Scale others proportionally
      others.forEach(e => {
        e.Strength = totalOther === 0 ? 0 : (e.Strength / totalOther) * remaining;
      });
    }
    // Final adjustment for floating point errors
    const total = this.equipment.reduce((sum, e) => sum + e.Strength, 0);
    if (Math.abs(total - Ship.TotalEquipmentStrength) > 0.01) {
      // Adjust the first equipment to make the sum exactly TotalEquipmentStrength
      const diff = Ship.TotalEquipmentStrength - total;
      this.equipment[0].Strength += diff;
    }
  }
} 