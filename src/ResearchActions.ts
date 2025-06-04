import { Action } from './Action';
import { Game } from './Game';
import { Player } from './Player';
import { Armor } from './techs/Armor';
import { Espionage } from './techs/Espionage';
import { Terraforming } from './techs/Terraforming';
import { PopulationGrowth } from './techs/PopulationGrowth';
import { EnergySystems } from './techs/EnergySystems';
import { Automation } from './techs/Automation';
import { Sensors } from './techs/Sensors';
import { Construction } from './techs/Construction';
import { ProjectileWeapons } from './techs/ProjectileWeapons';
import { RocketWeapons } from './techs/RocketWeapons';
import { EnergyWeapons } from './techs/EnergyWeapons';
import { PointDefense } from './techs/PointDefense';
import { EnergyShields } from './techs/EnergyShields';
import { Propulsion } from './techs/Propulsion';

export class ResearchArmorAction extends Action {
  get Name() { return 'Research Armor'; }
  get Description() { return 'Increase efficiency of Armor'; }
  Act(game: Game, activePlayer: Player) { activePlayer.armor.invest(); }
}

export class ResearchEspionageAction extends Action {
  get Name() { return 'Research Espionage'; }
  get Description() { return 'Increase efficiency of Espionage'; }
  Act(game: Game, activePlayer: Player) { activePlayer.espionage.invest(); }
}

export class ResearchTerraformingAction extends Action {
  get Name() { return 'Research Terraforming'; }
  get Description() { return 'Increase efficiency of Terraforming'; }
  Act(game: Game, activePlayer: Player) { activePlayer.terraforming.invest(); }
}

export class ResearchPopulationGrowthAction extends Action {
  get Name() { return 'Research Population Growth'; }
  get Description() { return 'Increase efficiency of Population Growth'; }
  Act(game: Game, activePlayer: Player) { activePlayer.populationGrowth.invest(); }
}

export class ResearchEnergySystemsAction extends Action {
  get Name() { return 'Research Energy Systems'; }
  get Description() { return 'Increase efficiency of Energy Systems'; }
  Act(game: Game, activePlayer: Player) { activePlayer.energySystems.invest(); }
}

export class ResearchAutomationAction extends Action {
  get Name() { return 'Research Automation'; }
  get Description() { return 'Increase efficiency of Automation'; }
  Act(game: Game, activePlayer: Player) { activePlayer.automation.invest(); }
}

export class ResearchSensorsAction extends Action {
  get Name() { return 'Research Sensors'; }
  get Description() { return 'Increase efficiency of Sensors'; }
  Act(game: Game, activePlayer: Player) { activePlayer.sensors.invest(); }
}

export class ResearchConstructionAction extends Action {
  get Name() { return 'Research Construction'; }
  get Description() { return 'Increase efficiency of Construction'; }
  Act(game: Game, activePlayer: Player) { activePlayer.construction.invest(); }
}

export class ResearchProjectileWeaponsAction extends Action {
  get Name() { return 'Research Projectile Weapons'; }
  get Description() { return 'Increase efficiency of Projectile Weapons'; }
  Act(game: Game, activePlayer: Player) { activePlayer.projectileWeapons.invest(); }
}

export class ResearchRocketWeaponsAction extends Action {
  get Name() { return 'Research Rocket Weapons'; }
  get Description() { return 'Increase efficiency of Rocket Weapons'; }
  Act(game: Game, activePlayer: Player) { activePlayer.rocketWeapons.invest(); }
}

export class ResearchEnergyWeaponsAction extends Action {
  get Name() { return 'Research Energy Weapons'; }
  get Description() { return 'Increase efficiency of Energy Weapons'; }
  Act(game: Game, activePlayer: Player) { activePlayer.energyWeapons.invest(); }
}

export class ResearchPointDefenseAction extends Action {
  get Name() { return 'Research Point Defense'; }
  get Description() { return 'Increase efficiency of Point Defense'; }
  Act(game: Game, activePlayer: Player) { activePlayer.pointDefense.invest(); }
}

export class ResearchEnergyShieldsAction extends Action {
  get Name() { return 'Research Energy Shields'; }
  get Description() { return 'Increase efficiency of Energy Shields'; }
  Act(game: Game, activePlayer: Player) { activePlayer.energyShields.invest(); }
}

export class ResearchPropulsionAction extends Action {
  get Name() { return 'Research Propulsion'; }
  get Description() { return 'Increase efficiency of Propulsion'; }
  Act(game: Game, activePlayer: Player) { activePlayer.propulsion.invest(); }
} 