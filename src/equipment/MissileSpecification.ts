import { EquipmentSpecification } from './EquipmentSpecification';

export class MissileSpecification extends EquipmentSpecification {
  static readonly SPEED = 'Speed';
  static readonly ARMOR = 'Armor';
  static readonly PAYLOAD = 'Payload';
  static readonly SPEC_NAMES = [MissileSpecification.SPEED, MissileSpecification.ARMOR, MissileSpecification.PAYLOAD];
  Specifications(): string[] {
    return MissileSpecification.SPEC_NAMES;
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