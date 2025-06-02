import { Game } from './Game';
import { Player } from './Player';

export abstract class Action {
  abstract get Name(): string;
  abstract get Description(): string;
  abstract Act(game: Game, activePlayer: Player): void;
} 