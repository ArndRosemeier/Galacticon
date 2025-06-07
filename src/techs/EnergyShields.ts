import { Tech } from '../Tech';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class EnergyShields extends Tech {
  public static Name = 'Energy Shields';
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return null; }
  public get Name(): string { return EnergyShields.Name; }
} 