import { Tech } from '../Tech';
import { ProjectileSpecifications } from '../equipment/ProjectileSpecifications';
import type { EquipmentSpecification } from '../equipment/EquipmentSpecification';

export class ProjectileWeapons extends Tech {
  public static Name = 'Projectile Weapons';
  private _specification: ProjectileSpecifications;
  constructor() {
    super();
    this._specification = new ProjectileSpecifications();
    this._specification.initializeSpecificationValues();
  }
  public get isEquipment() { return true; }
  public get Specification(): EquipmentSpecification | null { return this._specification; }
  public get Name(): string { return ProjectileWeapons.Name; }
} 