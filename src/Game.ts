import { Universe } from './Universe';
import { QuadrantFactory } from './QuadrantFactory';
import { Player } from './Player';
import { ImageCollection } from './ImageCollection';

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