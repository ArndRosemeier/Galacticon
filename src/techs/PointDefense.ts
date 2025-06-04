import { Tech } from '../Tech';
 
export class PointDefense extends Tech {
  public static Name = 'Point Defense';
  public get Name(): string {
    return PointDefense.Name;
  }
} 