import { Utils } from '../Utils';

export abstract class EquipmentSpecification {
  static readonly TotalSpecificationValue = 100;
  SpecificationValues: number[] = [];
  abstract Specifications(): string[];

  SetSpecificationValue(index: number, value: number) {
    if (index < 0 || index >= this.SpecificationValues.length) return;
    value = Math.max(0, Math.min(EquipmentSpecification.TotalSpecificationValue, value));
    const arr = this.SpecificationValues.map(v => Math.round(v));
    const newArr = Utils.distribute(arr, index, Math.round(value), EquipmentSpecification.TotalSpecificationValue);
    for (let i = 0; i < arr.length; ++i) this.SpecificationValues[i] = newArr[i];
  }

  initializeSpecificationValues() {
    const specs = this.Specifications();
    const n = specs.length;
    if (n === 0) {
      this.SpecificationValues = [];
      return;
    }
    const equalValue = EquipmentSpecification.TotalSpecificationValue / n;
    this.SpecificationValues = Array(n).fill(equalValue);
  }
} 