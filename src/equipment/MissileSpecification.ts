import { EquipmentSpecification } from './EquipmentSpecification';

export class MissileSpecification extends EquipmentSpecification {
  Specifications(): string[] {
    return ['Speed', 'Armor', 'Payload'];
  }

  constructor() {
    super();
    this.initializeSpecificationValues();
  }

  get speed() {
    return this.SpecificationValues[0];
  }
  get armor() {
    return this.SpecificationValues[1];
  }
  get payload() {
    return this.SpecificationValues[2];
  }
} 