import { Ship } from './Ship';

/**
 * Displays detailed information about a Ship, including image, name, size, owner, colonists, troops, equipment, health bar, speed, and weight.
 */
export class ShipInfoPanel {
  private root: HTMLDivElement;
  private ship: Ship;

  constructor(ship: Ship) {
    this.ship = ship;
    this.root = document.createElement('div');
    this.root.className = 'ship-info-panel';
    this.root.style.display = 'flex';
    this.root.style.flexDirection = 'column';
    this.root.style.gap = '1em';
    this.root.style.background = '#181f2f';
    this.root.style.border = '2px solid #00fff7';
    this.root.style.borderRadius = '12px';
    this.root.style.padding = '1.2em';
    this.root.style.marginTop = '1em';
    this.root.style.width = '100%';
    this.root.style.boxSizing = 'border-box';
    this.root.style.color = '#fff';
    this.render();
  }

  private render() {
    this.root.innerHTML = '';
    // Ship image
    if (this.ship.Image instanceof HTMLCanvasElement) {
      const img = document.createElement('img');
      img.src = this.ship.Image.toDataURL();
      img.alt = this.ship.name;
      img.style.width = '5em';
      img.style.height = '5em';
      img.style.objectFit = 'contain';
      img.style.alignSelf = 'center';
      img.style.border = '1px solid #00fff7';
      img.style.borderRadius = '8px';
      this.root.appendChild(img);
    }
    // Ship name
    const name = document.createElement('div');
    name.textContent = `Name: ${this.ship.name}`;
    name.style.fontWeight = 'bold';
    name.style.fontSize = '1.2em';
    this.root.appendChild(name);
    // Owner
    const owner = document.createElement('div');
    owner.textContent = `Owner: ${this.ship.player?.name ?? 'Unknown'}`;
    this.root.appendChild(owner);
    // Size, Colonists, Troops row
    const stats = document.createElement('div');
    stats.style.display = 'flex';
    stats.style.gap = '2em';
    stats.innerHTML = `
      <span>Size: ${this.ship.Size}</span>
      <span>Colonists: ${this.ship.Colonists}</span>
      <span>Troops: ${this.ship.Troops}</span>
    `;
    this.root.appendChild(stats);
    // Speed and Weight row
    const speedWeight = document.createElement('div');
    speedWeight.style.display = 'flex';
    speedWeight.style.gap = '2em';
    speedWeight.innerHTML = `
      <span>Speed: ${this.ship.Accelleration().toFixed(2)}</span>
      <span>Weight: ${this.ship.Weight().toFixed(2)}</span>
    `;
    this.root.appendChild(speedWeight);
    // Health Bar (Damage Ratio)
    const damageRatio = this.ship.totalDamageRatio();
    const healthPercent = Math.round(damageRatio * 100);
    const healthBarRow = document.createElement('div');
    healthBarRow.style.display = 'flex';
    healthBarRow.style.alignItems = 'center';
    healthBarRow.style.width = '100%';
    healthBarRow.style.gap = '1em';
    // Bar container (relative, responsive)
    const barContainer = document.createElement('div');
    barContainer.style.position = 'relative';
    barContainer.style.flex = '1 1 0%';
    barContainer.style.height = '1.5em';
    barContainer.style.display = 'flex';
    barContainer.style.alignItems = 'center';
    // Gradient bar (red left, green right)
    const gradientBar = document.createElement('div');
    gradientBar.style.width = '100%';
    gradientBar.style.height = '0.7em';
    gradientBar.style.borderRadius = '0.5em';
    gradientBar.style.background = 'linear-gradient(90deg, #ff1a1a 0%, #1aff6a 100%)';
    gradientBar.style.position = 'absolute';
    gradientBar.style.left = '0';
    gradientBar.style.top = '50%';
    gradientBar.style.transform = 'translateY(-50%)';
    barContainer.appendChild(gradientBar);
    // Indicator (caret)
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    // For 0% health, indicator is at left (0%), for 100% at right (100%)
    indicator.style.left = `calc(${(damageRatio * 100).toFixed(1)}% - 0.7em)`;
    indicator.style.top = '50%';
    indicator.style.transform = 'translateY(-50%)';
    indicator.style.width = '0';
    indicator.style.height = '0';
    indicator.style.borderLeft = '0.7em solid transparent';
    indicator.style.borderRight = '0.7em solid transparent';
    indicator.style.borderTop = '0.9em solid #fff';
    indicator.style.borderBottom = 'none';
    indicator.style.zIndex = '2';
    barContainer.appendChild(indicator);
    healthBarRow.appendChild(barContainer);
    // Health label
    const healthLabel = document.createElement('span');
    healthLabel.textContent = `Health: ${healthPercent}%`;
    healthLabel.style.fontWeight = 'bold';
    healthLabel.style.fontSize = '1.1em';
    healthLabel.style.color = '#fff';
    healthBarRow.appendChild(healthLabel);
    this.root.appendChild(healthBarRow);
    // Equipment list
    const eqTitle = document.createElement('div');
    eqTitle.textContent = 'Equipment:';
    eqTitle.style.marginTop = '0.5em';
    eqTitle.style.fontWeight = 'bold';
    this.root.appendChild(eqTitle);
    const eqList = document.createElement('ul');
    eqList.style.listStyle = 'none';
    eqList.style.padding = '0';
    eqList.style.margin = '0';
    for (const eq of this.ship.equipment) {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.gap = '1em';
      li.style.fontSize = '0.98em';
      li.innerHTML = `<span>${eq.Name}</span><span>Total: ${eq.TotalStrength().toFixed(1)}</span>`;
      eqList.appendChild(li);
    }
    this.root.appendChild(eqList);
  }

  /**
   * Returns the root element for this info panel.
   */
  public getElement(): HTMLElement {
    return this.root;
  }
} 