import { PlanetType } from './Planet';

export interface ResearchBonusEntry {
  TechName: string;
  Bonus: number;
}

export class Race {
  name: string;
  image: string; // URL or path to image
  animationUrl: string; // URL or path to MP4 animation
  homeWorldTypes: PlanetType[];
  researchBonus: ResearchBonusEntry[];

  constructor(name: string, image: string, animationUrl: string, homeWorldTypes: PlanetType[], researchBonus: ResearchBonusEntry[] = []) {
    this.name = name;
    this.image = image;
    this.animationUrl = animationUrl;
    this.homeWorldTypes = homeWorldTypes;
    this.researchBonus = researchBonus;
  }

  /**
   * Calculate the effective habitability of a planet for this race.
   * @param planet The planet to evaluate
   * @returns The effective habitability value
   */
  public PlanetHabitability(planet: { type: PlanetType; habitability: number }): number {
    if (!this.homeWorldTypes.includes(planet.type)) {
      return planet.habitability;
    }
    const temp = planet.habitability + 0.4;
    return temp < 1.0 ? 1.0 : temp;
  }

  /**
   * Calculate the efficiency for a given tech for this race.
   * @param tech The tech instance
   * @returns The efficiency value
   */
  public Efficiency(tech: { Name: string; getEfficiency: () => number }): number {
    const bonusEntry = this.researchBonus.find(b => b.TechName === tech.Name);
    if (bonusEntry) {
      return tech.getEfficiency() * (1 + bonusEntry.Bonus);
    }
    return tech.getEfficiency();
  }
} 