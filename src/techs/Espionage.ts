import { Tech } from '../Tech';
 
export class Espionage extends Tech {
  public static Name = 'Espionage';
  public get Name(): string {
    return Espionage.Name;
  }
} 