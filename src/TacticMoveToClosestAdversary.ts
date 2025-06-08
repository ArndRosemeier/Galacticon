import type { Ship } from './Ship';
import type { BattleMap } from './BattleMap';
import { Tactic } from './Tactic';

export class TacticMoveToClosestAdversary extends Tactic {
  Description = 'Moves the ship toward the closest adversary, up to its speed. Confidence is not used. This tactic always works as long as there are still adversaries.';
  Act(ship: Ship, map: BattleMap): boolean {
    const adversary = map.GetClosestAdversary(ship);
    if (!adversary) return false;
    const oldPos = map.getPosition(ship);
    const targetPos = map.getPosition(adversary);
    const dx = targetPos.x - oldPos.x;
    const dy = targetPos.y - oldPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveDist = ship.Speed();
    let newX, newY;
    if (dist <= moveDist) {
      newX = targetPos.x;
      newY = targetPos.y;
    } else {
      const ratio = moveDist / dist;
      newX = oldPos.x + dx * ratio;
      newY = oldPos.y + dy * ratio;
    }
    map.Move(ship, { x: newX, y: newY });
    const newPos = map.getPosition(ship);
    return !(newPos.x === oldPos.x && newPos.y === oldPos.y);
  }
} 