export abstract class EquipmentSpecification {
  static readonly TotalSpecificationValue = 100;
  SpecificationValues: number[] = [];
  abstract Specifications(): string[];

  SetSpecificationValue(index: number, value: number) {
    if (index < 0 || index >= this.SpecificationValues.length) return;
    value = Math.max(0, Math.min(EquipmentSpecification.TotalSpecificationValue, value));
    const others = this.SpecificationValues.map((v, i) => i).filter(i => i !== index);
    const totalOther = others.reduce((sum, i) => sum + this.SpecificationValues[i], 0);
    this.SpecificationValues[index] = value;
    const remaining = EquipmentSpecification.TotalSpecificationValue - value;
    if (others.length === 0) return;
    if (totalOther === 0) {
      // If all others are zero, distribute remaining equally
      const per = remaining / others.length;
      others.forEach(i => this.SpecificationValues[i] = per);
    } else {
      // Scale others proportionally
      others.forEach(i => {
        this.SpecificationValues[i] = totalOther === 0 ? 0 : (this.SpecificationValues[i] / totalOther) * remaining;
      });
    }
    // Final adjustment for floating point errors
    const total = this.SpecificationValues.reduce((sum, v) => sum + v, 0);
    if (Math.abs(total - EquipmentSpecification.TotalSpecificationValue) > 0.01) {
      // Adjust the first value to make the sum exactly 100
      this.SpecificationValues[0] += EquipmentSpecification.TotalSpecificationValue - total;
    }
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