import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class Stealth extends Tech {
  public static Name = 'Stealth';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return Stealth.Name; }
} 