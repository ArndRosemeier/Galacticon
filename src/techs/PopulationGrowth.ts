import { Tech } from '../Tech';
 
export class PopulationGrowth extends Tech {
  public static Name = 'Population Growth';
  public get Name(): string {
    return PopulationGrowth.Name;
  }
} 