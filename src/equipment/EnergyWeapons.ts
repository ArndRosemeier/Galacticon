import { Equipment } from '../Equipment';
import { EnergyWeaponsSpecification } from './EnergyWeaponsSpecification';

export class EnergyWeapons extends Equipment {
  private _specification: EnergyWeaponsSpecification;
  constructor() {
    super();
    this._specification = new EnergyWeaponsSpecification();
    this._specification.initializeSpecificationValues();
  }
  get Name() { return 'Energy Weapons'; }
  get Specification() { return this._specification; }
} 