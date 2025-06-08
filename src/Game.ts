import { Universe } from './Universe';
import { QuadrantFactory } from './QuadrantFactory';
import { Player } from './Player';
import { ImageCollection } from './ImageCollection';
import { Race } from './Race';
import { PlanetType } from './Planet';
import { Propulsion } from './techs/Propulsion';
import { EnergyShields } from './techs/EnergyShields';
import { Espionage } from './techs/Espionage';
import { Sensors } from './techs/Sensors';
import { Construction } from './techs/Construction';
import { EnergyWeapons } from './techs/EnergyWeapons';
import { ProjectileWeapons } from './techs/ProjectileWeapons';
import { Missiles } from './techs/Missiles';
import { PopulationGrowth } from './techs/PopulationGrowth';
import { Terraforming } from './techs/Terraforming';
import { Automation } from './techs/Automation';
import { Armor } from './techs/Armor';  
/**
 * Main game class for Galacticon. Holds the universe and manages game state.
 */
export class Game {
  /** The universe instance */
  public universe: Universe;
  /** The array of players in the game */
  public players: Player[];
  /** The current game turn (starts at 1) */
  public gameTurn: number;
  /** The index of the active player (starts at 0) */
  public activePlayer: number;
  /** Unique ID for this game instance */
  public readonly id: number;
  private static nextId = 1;

  private listeners: (() => void)[] = [];

  public ShipImages: ImageCollection;
  public races: Race[];

  /**
   * Create a new game and seed the universe with a starting quadrant at (0,0).
   */
  constructor() {
    this.ShipImages = new ImageCollection();
    const shipImages = this.ShipImages;
    this.id = Game.nextId++;
    console.log(`[Game] Created instance with id=${this.id}`);
    this.universe = new Universe();
    this.players = [];
    this.gameTurn = 1;
    this.activePlayer = 0;
    const startQuadrant = QuadrantFactory.createRandomQuadrant(this.universe);
    this.universe.setQuadrant(0, 0, startQuadrant);
    // Initialize ShipImages with Ships.png
    (async () => {
      const img = new window.Image();
      img.src = '/Ships.png';
      await new Promise(resolve => { img.onload = resolve; });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      shipImages.AddCompoundImage(canvas);
    })();
    // Initialize races array with all races found in public folder
    this.races = [
      new Race('Alkari', '/Alkari.png', '/Alkari.mp4', [PlanetType.Terrestrial], [
        { TechName: Propulsion.Name, Bonus: 0.6 },
        { TechName: EnergyShields.Name, Bonus: 0.4 }
      ]),
      new Race('Darlok', '/Darlok.png', '/Darlok.mp4', [PlanetType.Terrestrial], [
        { TechName: Espionage.Name, Bonus: 1.0 }
      ]),
      new Race('Elerian', '/Elerian.png', '/Elerian.mp4', [PlanetType.Terrestrial], [
        { TechName: EnergyShields.Name, Bonus: 0.5 }, { TechName: Sensors.Name, Bonus: 0.5 }
      ]),
      new Race('Klackon', '/Klackon.png', '/Klackon.mp4', [PlanetType.Terrestrial], [
        { TechName: Construction.Name, Bonus: 1.0 }
      ]),
      new Race('Meklar', '/Meklar.png', '/Meklar.mp4', [PlanetType.Terrestrial], [
        { TechName: Automation.Name, Bonus: 0.5 }, { TechName: Construction.Name, Bonus: 0.5 }
      ]),
      new Race('Mrrshan', '/Mrrshan.png', '/Mrrshan.mp4', [PlanetType.Terrestrial], [
        { TechName: EnergyWeapons.Name, Bonus: 0.4 },
        { TechName: ProjectileWeapons.Name, Bonus: 0.4 },
        { TechName: Missiles.Name, Bonus: 0.4 }
      ]),
      new Race('Psilon', '/Psilon.png', '/Psilon.mp4', [], [
        { TechName: Automation.Name, Bonus: 0.2 },
        { TechName: EnergyShields.Name, Bonus: 0.2 },
        { TechName: Terraforming.Name, Bonus: 0.2 },
        { TechName: Propulsion.Name, Bonus: 0.2 },
        { TechName: Construction.Name, Bonus: 0.2 },
        { TechName: PopulationGrowth.Name, Bonus: 0.2 },
        { TechName: EnergyWeapons.Name, Bonus: 0.2 },
        { TechName: ProjectileWeapons.Name, Bonus: 0.2 },
        { TechName: Missiles.Name, Bonus: 0.2 },
        { TechName: Sensors.Name, Bonus: 0.2 },
        { TechName: Espionage.Name, Bonus: 0.2 }
      ]),
      new Race('Sakkra', '/Sakkra.png', '/Sakkra.mp4', [PlanetType.Terrestrial, PlanetType.Ocean], [
        { TechName: PopulationGrowth.Name, Bonus: 1.0 }
      ]),
      new Race('Silicoid', '/Silicoid.png', '/Silicoid.mp4', [
        PlanetType.SubEarth,
        PlanetType.SuperEarth,
        PlanetType.Terrestrial,
        PlanetType.Exotic,
        PlanetType.Lava,
        PlanetType.Desert,
        PlanetType.Ice
      ], []),
      new Race('Terran', '/Terran.png', '/Terran.mp4', [PlanetType.Terrestrial], [
        { TechName: Espionage.Name, Bonus: 0.4 },
        { TechName: Terraforming.Name, Bonus: 0.4 },
        { TechName: Construction.Name, Bonus: 0.2 }
      ]),
      new Race('Trilarian', '/Trilarian.png', '/Trilarian.mp4', [PlanetType.Ocean], [
        { TechName: Propulsion.Name, Bonus: 0.5 }, { TechName: EnergyWeapons.Name, Bonus: 0.5 }
      ]),
    ];
  }

  /**
   * Add a player to the game. Returns true if added, false if player limit reached.
   */
  public addPlayer(player: Player): boolean {
    if (this.players.length >= 8) {
      return false;
    }
    this.players.push(player);
    console.log(`[Game ${this.id}] addPlayer: now ${this.players.length} players`);
    return true;
  }

  /**
   * Register a listener to be called when the game state changes.
   */
  public onChange(listener: () => void) {
    this.listeners.push(listener);
  }

  /**
   * Trigger all registered listeners (internal use).
   */
  private triggerChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * End the current player's turn. Advances to the next player, increments turn if needed.
   */
  public endTurn() {
    if (this.players.length === 0) return;
    this.activePlayer = (this.activePlayer + 1) % this.players.length;
    if (this.activePlayer === 0) {
      this.gameTurn++;
    }
    this.players[this.activePlayer].startTurn();
    this.triggerChange();
  }

  /**
   * Start the game. (No-op for now)
   */
  public start() {
    // Game start logic will go here
    if (this.players.length > 0) {
      this.players[this.activePlayer].startTurn();
    }
    this.triggerChange();
  }

  /**
   * Log the player list for debugging, including the game id.
   */
  public logPlayerList() {
    const names = this.players.map(p => p.name).join(', ');
    console.log(`[Game ${this.id}] Player list: [${names}]`);
  }
} 