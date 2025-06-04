import { Tech } from '../Tech';
 
export class Construction extends Tech {
  public static Name = 'Construction';
  public get Name(): string {
    return Construction.Name;
  }
} 