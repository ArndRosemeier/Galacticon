import { Tech } from '../Tech';
 
export class Terraforming extends Tech {
  public static Name = 'Terraforming';
  public get Name(): string {
    return Terraforming.Name;
  }
} 