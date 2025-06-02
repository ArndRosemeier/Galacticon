import { Equipment } from '../Equipment';
import { MissileSpecification } from './MissileSpecification';

export class Missiles extends Equipment {
  private _specification: MissileSpecification;
  constructor() {
    super();
    this._specification = new MissileSpecification();
    this._specification.initializeSpecificationValues();
  }
  get Name() { return 'Missiles'; }
  get Specification() { return this._specification; }
} 