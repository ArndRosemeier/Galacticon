import { Tech } from '../Tech';
 
export class ProjectileWeapons extends Tech {
  public static Name = 'Projectile Weapons';
  public get Name(): string {
    return ProjectileWeapons.Name;
  }
} 