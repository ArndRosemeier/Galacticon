import { Tech } from '../Tech';
import { MissileSpecification } from '../equipment/MissileSpecification';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class RocketWeapons extends Tech {
  public static Name = 'Missiles';
  private _specification: MissileSpecification;
  constructor() {
    super();
    this._specification = new MissileSpecification();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return RocketWeapons.Name; }
} 