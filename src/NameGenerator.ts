// NameGenerator.ts
// Utility for generating names for stars, planets, etc. in Galacticon

export class NameGenerator {
  /**
   * Generates a nice-sounding star name using a mix of real conventions, mythological roots, and creative patterns.
   */
  static createStarName(): string {
    // Some real and mythological roots
    const roots = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
      'Astra', 'Vega', 'Sirius', 'Altair', 'Rigel', 'Deneb', 'Arcturus', 'Lyra', 'Orion',
      'Nova', 'Stella', 'Sol', 'Luna', 'Aurora', 'Celest', 'Nebula', 'Pulsar', 'Quasar',
      'Draco', 'Hydra', 'Phoenix', 'Perseus', 'Andromeda', 'Cassiopeia', 'Cygnus', 'Taurus',
      'Aquila', 'Corvus', 'Lupus', 'Ursa', 'Vulpecula', 'Sagitta', 'Serpens', 'Scorpius',
      'Pegasus', 'Hercules', 'Gemini', 'Leo', 'Virgo', 'Libra', 'Capella', 'Pollux', 'Castor',
      'Atlas', 'Electra', 'Maia', 'Taygeta', 'Celaeno', 'Alcyone', 'Merope', 'Sterope', 'Pleione',
      'Helios', 'Selene', 'Eos', 'Nyx', 'Gaia', 'Rhea', 'Theia', 'Hyperion', 'Phoebe', 'Tethys',
    ];
    // Suffixes and endings for star names
    const suffixes = [
      '', '', '', '', '', '', '', '', '', '', // More likely to have no suffix
      ' Major', ' Minor', ' Prime', ' Secundus', ' Tertius', ' IV', ' V', ' VI', ' VII', ' VIII',
      '-A', '-B', '-C', ' I', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII',
      'is', 'os', 'ar', 'on', 'ion', 'eus', 'ara', 'arae', 'ium', 'ara', 'arae', 'ae', 'us', 'um',
    ];
    // Optionally combine two roots for more variety
    const combineChance = Math.random();
    let name = '';
    if (combineChance < 0.15) {
      // e.g. "Vega-Lyra", "Orion-Draco"
      const root1 = roots[Math.floor(Math.random() * roots.length)];
      let root2 = roots[Math.floor(Math.random() * roots.length)];
      while (root2 === root1) root2 = roots[Math.floor(Math.random() * roots.length)];
      name = `${root1}-${root2}`;
    } else if (combineChance < 0.35) {
      // e.g. "Alpha Centauri", "Delta Orionis"
      const greek = roots.filter(r => /Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa/.test(r));
      const greekRoot = greek[Math.floor(Math.random() * greek.length)];
      let otherRoot = roots[Math.floor(Math.random() * roots.length)];
      while (greek.includes(otherRoot)) otherRoot = roots[Math.floor(Math.random() * roots.length)];
      name = `${greekRoot} ${otherRoot}`;
    } else {
      // Single root with optional suffix
      const root = roots[Math.floor(Math.random() * roots.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      name = root + suffix;
    }
    // Capitalize and clean up
    return name.replace(/\s+/g, ' ').trim();
  }
} 