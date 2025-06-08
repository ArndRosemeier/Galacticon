import { EquipmentSpecification } from './EquipmentSpecification'; 

export class ProjectileSpecifications extends (await import('./EquipmentSpecification')).EquipmentSpecification {
  static readonly PIERCING = 'Piercing';
  static readonly IMPACT = 'Impact';
  static readonly SPEC_NAMES = [ProjectileSpecifications.PIERCING, ProjectileSpecifications.IMPACT];
  Specifications(): string[] {
    return ProjectileSpecifications.SPEC_NAMES;
  }

  constructor() {
    super();
    this.initializeSpecificationValues();
  }

  get piercing() {
    return this.SpecificationValues[0];
  }
  get impact() {
    return this.SpecificationValues[1];
  }
} 