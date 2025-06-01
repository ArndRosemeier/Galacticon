import { Propulsion } from './techs/Propulsion';
import { Armor } from './techs/Armor';
import { EnergyShields } from './techs/EnergyShields';
import { PointDefense } from './techs/PointDefense';
import { EnergyWeapons } from './techs/EnergyWeapons';
import { RocketWeapons } from './techs/RocketWeapons';
import { ProjectileWeapons } from './techs/ProjectileWeapons';
import { Construction } from './techs/Construction';
import { Sensors } from './techs/Sensors';
import { Automation } from './techs/Automation';
import { EnergySystems } from './techs/EnergySystems';
import { LifeSupport } from './techs/LifeSupport';
import { Terraforming } from './techs/Terraforming';
import { Espionage } from './techs/Espionage';
import { Tech } from './Tech';

/**
 * Represents a player in Galacticon.
 */
export class Player {
  /** The player's money (credits) */
  public money: number;
  /** Array of known quadrants as {x, y} grid coordinates */
  public knownQuadrants: { x: number, y: number }[];

  // --- Technology instances ---
  public propulsion: Propulsion;
  public armor: Armor;
  public energyShields: EnergyShields;
  public pointDefense: PointDefense;
  public energyWeapons: EnergyWeapons;
  public rocketWeapons: RocketWeapons;
  public projectileWeapons: ProjectileWeapons;
  public construction: Construction;
  public sensors: Sensors;
  public automation: Automation;
  public energySystems: EnergySystems;
  public lifeSupport: LifeSupport;
  public terraforming: Terraforming;
  public espionage: Espionage;
  public allTechs: Tech[];

  /**
   * Create a new player.
   * @param money Initial money (default: 0)
   */
  constructor(money: number = 0) {
    this.money = money;
    this.knownQuadrants = [];
    this.propulsion = new Propulsion();
    this.armor = new Armor();
    this.energyShields = new EnergyShields();
    this.pointDefense = new PointDefense();
    this.energyWeapons = new EnergyWeapons();
    this.rocketWeapons = new RocketWeapons();
    this.projectileWeapons = new ProjectileWeapons();
    this.construction = new Construction();
    this.sensors = new Sensors();
    this.automation = new Automation();
    this.energySystems = new EnergySystems();
    this.lifeSupport = new LifeSupport();
    this.terraforming = new Terraforming();
    this.espionage = new Espionage();
    this.allTechs = [
      this.propulsion,
      this.armor,
      this.energyShields,
      this.pointDefense,
      this.energyWeapons,
      this.rocketWeapons,
      this.projectileWeapons,
      this.construction,
      this.sensors,
      this.automation,
      this.energySystems,
      this.lifeSupport,
      this.terraforming,
      this.espionage
    ];
  }
} 