import { Equipment } from '../Equipment';
import { ProjectileSpecifications } from './ProjectileSpecifications';

export class ProjectileWeapons extends Equipment {
  private _specification: ProjectileSpecifications;
  constructor() {
    super();
    this._specification = new ProjectileSpecifications();
    this._specification.initializeSpecificationValues();
  }
  get Name() { return 'Projectile Weapons'; }
  get Specification() { return this._specification; }
} 