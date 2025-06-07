import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class EnergySystems extends Tech {
  public static Name = 'Energy Systems';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string {
    return EnergySystems.Name;
  }
} 