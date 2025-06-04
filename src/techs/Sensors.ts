import { Tech } from '../Tech';
 
export class Sensors extends Tech {
  public static Name = 'Sensors';
  public get Name(): string {
    return Sensors.Name;
  }
} 