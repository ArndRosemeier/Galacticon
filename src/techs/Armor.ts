import { Tech } from '../Tech';
 
export class Armor extends Tech {
  public static Name = 'Armor';
  public get Name(): string {
    return Armor.Name;
  }
} 