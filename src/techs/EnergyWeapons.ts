import { Tech } from '../Tech';
import { EnergyWeaponsSpecification } from '../equipment/EnergyWeaponsSpecification';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class EnergyWeapons extends Tech {
  public static Name = 'Energy Weapons';
  private _specification: EnergyWeaponsSpecification;
  constructor() {
    super();
    this._specification = new EnergyWeaponsSpecification();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return EnergyWeapons.Name; }
} 