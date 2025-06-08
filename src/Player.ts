import { Propulsion } from './techs/Propulsion';
import { Armor } from './techs/Armor';
import { EnergyShields } from './techs/EnergyShields';
import { PointDefense } from './techs/PointDefense';
import { EnergyWeapons } from './techs/EnergyWeapons';
import { Missiles } from './techs/Missiles';
import { ProjectileWeapons } from './techs/ProjectileWeapons';
import { Construction } from './techs/Construction';
import { Sensors } from './techs/Sensors';
import { Automation } from './techs/Automation';
import { EnergySystems } from './techs/EnergySystems';
import { PopulationGrowth } from './techs/PopulationGrowth';
import { Terraforming } from './techs/Terraforming';
import { Espionage } from './techs/Espionage';
import { Stealth }  from './techs/Stealth';
import { Tech } from './Tech';
import { Game } from './Game';

/**
 * Represents a player in Galacticon.
 */
export class Player {
  /** The player's money (credits) */
  public money: number;
  /** Array of known quadrants as {x, y} grid coordinates */
  public knownQuadrants: { x: number, y: number }[];
  /** Indicates if this player is controlled by AI */
  public isAI: boolean;
  /** The player's name */
  public name: string;
  /** The player's chosen race */
  public race: import('./Race').Race | null;

  // --- Technology instances ---
  public propulsion: Propulsion;
  public armor: Armor;
  public energyShields: EnergyShields;
  public pointDefense: PointDefense;
  public energyWeapons: EnergyWeapons;
  public rocketWeapons: Missiles;
  public projectileWeapons: ProjectileWeapons;
  public construction: Construction;
  public sensors: Sensors;
  public automation: Automation;
  public energySystems: EnergySystems;
  public populationGrowth: PopulationGrowth;
  public terraforming: Terraforming;
  public espionage: Espionage;
  public stealth: Stealth;
  public allTechs: Tech[];

  /**
   * Create a new player.
   * @param money Initial money (default: 0)
   * @param isAI Whether this player is an AI (default: false)
   * @param name The player's name (default: '')
   * @param race The player's chosen race
   */
  constructor(money: number = 0, isAI: boolean = false, name: string = '', race: import('./Race').Race) {
    if (!race) throw new Error('Player: race must be provided and not null/undefined');
    this.money = money;
    this.isAI = isAI;
    this.name = name;
    this.knownQuadrants = [];
    this.race = race;
    this.propulsion = new Propulsion(this.race);
    this.armor = new Armor(this.race);
    this.energyShields = new EnergyShields(this.race);
    this.pointDefense = new PointDefense(this.race);
    this.energyWeapons = new EnergyWeapons(this.race);
    this.rocketWeapons = new Missiles(this.race);
    this.projectileWeapons = new ProjectileWeapons(this.race);
    this.construction = new Construction(this.race);
    this.sensors = new Sensors(this.race);
    this.automation = new Automation(this.race);
    this.energySystems = new EnergySystems(this.race);
    this.populationGrowth = new PopulationGrowth(this.race);
    this.terraforming = new Terraforming(this.race);
    this.espionage = new Espionage(this.race);
    this.stealth = new Stealth(this.race);
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
      this.populationGrowth,
      this.terraforming,
      this.espionage,
      this.stealth
    ];
  }

  /**
   * Called when this player's turn starts. (No-op for now)
   */
  public startTurn() {
    // Player turn start logic will go here
  }
} 