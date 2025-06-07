import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class PointDefense extends Tech {
  public static Name = 'Point Defense';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return PointDefense.Name; }
} 