export class EnergyWeaponsSpecification extends (await import('./EquipmentSpecification')).EquipmentSpecification {
  static readonly FOCUS = 'Focus';
  static readonly FORCE = 'Force';
  static readonly SPEC_NAMES = [EnergyWeaponsSpecification.FOCUS, EnergyWeaponsSpecification.FORCE];
  Specifications(): string[] {
    return EnergyWeaponsSpecification.SPEC_NAMES;
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