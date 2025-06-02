import { EquipmentSpecification } from './EquipmentSpecification'; 

export class ProjectileSpecifications extends (await import('./EquipmentSpecification')).EquipmentSpecification {
  Specifications(): string[] {
    return ['Piercing', 'Impact'];
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