/**
 * Abstract base class for all technologies in Galacticon.
 * Handles research progress and efficiency calculation.
 * All specific techs should extend this class and implement the Name getter.
 */
export abstract class Tech {
  /** Total research points invested in this tech */
  public researchPoints: number;
  /** Research points scaling constant (higher = slower progress) */
  public readonly scaling: number;

  /**
   * Create a new Tech instance.
   * @param scaling Controls how quickly efficiency approaches 5 (default: 200)
   */
  constructor(scaling: number = 200) {
    this.researchPoints = 0;
    this.scaling = scaling;
  }

  /**
   * Abstract getter for the technology name.
   * Must be implemented by all subclasses.
   */
  public abstract get Name(): string;

  /**
   * Invest research points into this technology.
   * Now always invests 1 point per call.
   */
  public invest() {
    this.researchPoints += 100;
    // Loudly log investment
    console.log(`[Tech] ${this.Name} invested 1 research point. Total: ${this.researchPoints}`);
  }

  /**
   * Get the current efficiency value for this tech.
   * Starts at 1, approaches 5 as researchPoints increases.
   * Formula: efficiency = 1 + 4 * (1 - exp(-researchPoints / scaling))
   */
  public getEfficiency(): number {
    return 1 + 4 * (1 - Math.exp(-this.researchPoints / this.scaling));
  }
} 