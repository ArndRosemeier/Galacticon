import { Tech } from '../Tech';
 
export class Propulsion extends Tech {
  public static Name = 'Propulsion';
  public get Name(): string {
    return Propulsion.Name;
  }
} 