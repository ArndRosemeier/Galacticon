import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class Propulsion extends Tech {
  public static Name = 'Propulsion';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  get Name(): string { return Propulsion.Name; }
} 