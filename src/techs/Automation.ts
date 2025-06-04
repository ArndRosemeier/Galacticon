import { Tech } from '../Tech';
 
export class Automation extends Tech {
  public static Name = 'Automation';
  public get Name(): string {
    return Automation.Name;
  }
} 