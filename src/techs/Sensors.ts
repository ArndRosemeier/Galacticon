import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class Sensors extends Tech {
  public static Name = 'Sensors';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string {
    return Sensors.Name;
  }
} 