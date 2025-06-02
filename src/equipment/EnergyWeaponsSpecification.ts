export class EnergyWeaponsSpecification extends (await import('./EquipmentSpecification')).EquipmentSpecification {
  Specifications(): string[] {
    return ['Focus', 'Force'];
  }

  constructor() {
    super();
    this.initializeSpecificationValues();
  }

  get focus() {
    return this.SpecificationValues[0];
  }
  get force() {
    return this.SpecificationValues[1];
  }
} 