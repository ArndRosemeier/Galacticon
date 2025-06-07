/**
 * Unified base class for all technologies and equipment in Galacticon.
 * Handles research progress, efficiency calculation, and equipment properties.
 * All specific techs and equipment should extend this class and implement the Name getter.
 */
import type { EquipmentSpecification } from './equipment/EquipmentSpecification';

export abstract class Tech {
  /** Total research points invested in this tech */
  public researchPoints: number;
  /** Research points scaling constant (higher = slower progress) */
  public readonly scaling: number;

  /** Equipment-related fields */
  public Strength: number = 0;
  private _startEfficiency: number = 1;
  public Efficiency: number = 1;
  /** Whether this tech is also equipment */
  public abstract get isEquipment(): boolean;

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
   * Equipment specification (if any). Override in subclasses that are equipment.
   */
  public get Specification(): EquipmentSpecification | null {
    return null;
  }

  get StartEfficiency(): number {
    return this._startEfficiency;
  }
  set StartEfficiency(val: number) {
    this._startEfficiency = val;
    this.Efficiency = val;
  }

  /**
   * Invest research points into this technology.
   * Now always invests 1 point per call.
   */
  public invest() {
    this.researchPoints += 10;
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

  /**
   * Returns the total strength of this equipment (if applicable).
   */
  public TotalStrength(): number {
    return this.Strength * this.getEfficiency();
  }
} 