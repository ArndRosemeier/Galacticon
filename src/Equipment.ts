export abstract class Equipment {
  Strength: number = 0;
  Efficiency: number = 1;
  abstract get Name(): string;
  TotalStrength(): number {
    return this.Strength * this.Efficiency;
  }
} 