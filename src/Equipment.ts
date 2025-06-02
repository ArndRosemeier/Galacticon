import type { EquipmentSpecification } from './equipment/EquipmentSpecification';

export abstract class Equipment {
  Strength: number = 0;
  Efficiency: number = 1;
  abstract get Name(): string;
  abstract get Specification(): EquipmentSpecification | null;
  TotalStrength(): number {
    return this.Strength * this.Efficiency;
  }
} 