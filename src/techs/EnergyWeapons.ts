import { Tech } from '../Tech';
 
export class EnergyWeapons extends Tech {
  public static Name = 'Energy Weapons';
  public get Name(): string {
    return EnergyWeapons.Name;
  }
} 