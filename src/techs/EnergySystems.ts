import { Tech } from '../Tech';
 
export class EnergySystems extends Tech {
  public static Name = 'Energy Systems';
  public get Name(): string {
    return EnergySystems.Name;
  }
} 