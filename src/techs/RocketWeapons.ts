import { Tech } from '../Tech';
 
export class RocketWeapons extends Tech {
  public static Name = 'Missiles';
  public get Name(): string {
    return RocketWeapons.Name;
  }
} 