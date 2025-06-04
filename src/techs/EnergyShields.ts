import { Tech } from '../Tech';
 
export class EnergyShields extends Tech {
  public static Name = 'Energy Shields';
  public get Name(): string {
    return EnergyShields.Name;
  }
} 