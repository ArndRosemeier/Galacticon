import { Player } from './Player';
import { Ship } from './Ship';
import { Game } from './Game';

export class ShipConstructor {
  static async show(currentPlayer: Player, game: Game): Promise<Ship | null> {
    return new Promise<Ship | null>((resolve) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.left = '0';
      overlay.style.top = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(10,20,40,0.92)';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.backdropFilter = 'blur(4px)';

      // Dialog
      const dialog = document.createElement('div');
      dialog.style.width = '60vw';
      dialog.style.maxWidth = '90vw';
      dialog.style.minWidth = '40vw';
      dialog.style.height = '90vh';
      dialog.style.maxHeight = '90vh';
      dialog.style.padding = '2vh 3vw';
      dialog.style.fontSize = '2vh';
      dialog.style.borderRadius = '2vw';
      dialog.style.boxShadow = '0 0 4vw #00fff799, 0 0 0.7vw #0ff';
      dialog.style.background = 'linear-gradient(135deg, #0ff 0%, #0af 100%)';
      dialog.style.border = '0.2vw solid #00f6ff';
      dialog.style.color = '#fff';
      dialog.style.display = 'flex';
      dialog.style.flexDirection = 'column';
      dialog.style.alignItems = 'center';
      dialog.style.gap = '1.2vh';
      dialog.style.boxSizing = 'border-box';
      dialog.style.justifyContent = 'flex-start';
      dialog.style.position = 'relative';

      // Title
      // (Header removed as requested)
      // const title = document.createElement('h2');
      // title.textContent = 'Ship Constructor';
      // title.style.fontSize = '3vh';
      // title.style.marginBottom = '1.5vh';
      // title.style.letterSpacing = '0.1em';
      // title.style.textShadow = '0 0 16px #00fff7, 0 0 4px #0ff';
      // dialog.appendChild(title);

      // Create ship
      const ship = new Ship(currentPlayer);

      // Randomly select a ship image at the start
      if (game.ShipImages.canvases.length > 0) {
        const randomIdx = Math.floor(Math.random() * game.ShipImages.canvases.length);
        ship.Image = game.ShipImages.canvases[randomIdx];
      }

      // Sliders section
      const slidersSection = document.createElement('div');
      slidersSection.style.display = 'flex';
      slidersSection.style.flexDirection = 'column';
      slidersSection.style.gap = '0.6vh';
      slidersSection.style.width = '100%';
      slidersSection.style.flex = '0 0 39.2vh'; // 30% less than 56vh
      slidersSection.style.marginBottom = '1vh';

      const sliders: HTMLInputElement[] = [];
      const valueLabels: HTMLSpanElement[] = [];
      let sliderRowCount = 0;
      let unfoldedSpecIdx: number | null = null;
      const specRows: HTMLDivElement[] = [];
      ship.equipment.forEach((eq, eqIdx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '1vw';
        row.style.width = '100%';
        row.style.height = '3.5vh'; // 30% less than 5vh
        row.style.fontSize = '2vh';

        const label = document.createElement('span');
        label.textContent = eq.Name;
        label.style.flex = '0 0 10em';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '0 0 0.8vw #00fff7';
        label.style.fontSize = '2vh';
        row.appendChild(label);

        // Expand/collapse button for specification
        let specCascade: HTMLDivElement | null = null;
        const expandBtn = document.createElement('button');
        expandBtn.style.background = 'none';
        expandBtn.style.border = 'none';
        expandBtn.style.fontSize = '2vh';
        expandBtn.style.cursor = 'pointer';
        expandBtn.style.marginRight = '0.5vw';
        expandBtn.style.textShadow = '0 0 0.8vw #00fff7';
        expandBtn.style.width = '2.5vh';
        expandBtn.style.height = '2.5vh';
        expandBtn.style.display = 'flex';
        expandBtn.style.alignItems = 'center';
        expandBtn.style.justifyContent = 'center';
        if (eq.Specification) {
          expandBtn.textContent = '▼';
          expandBtn.style.color = '#00fff7';
          expandBtn.onclick = () => {
            // Hide any open cascade
            if (unfoldedSpecIdx !== null && specRows[unfoldedSpecIdx]?.parentElement) {
              specRows[unfoldedSpecIdx]!.style.display = 'none';
              specRows[unfoldedSpecIdx]!.parentElement!.removeChild(specRows[unfoldedSpecIdx]!);
              if (unfoldedSpecIdx === eqIdx) {
                unfoldedSpecIdx = null;
                return; // Toggle off if clicking the same row
              }
            }
            // Show this cascade
            if (specCascade != null) {
              specCascade!.style.display = 'flex';
              row.insertAdjacentElement('afterend', specCascade!);
              unfoldedSpecIdx = eqIdx;
            }
          };
        } else {
          expandBtn.textContent = '';
          expandBtn.style.color = 'transparent';
          expandBtn.disabled = true;
          expandBtn.tabIndex = -1;
        }
        row.appendChild(expandBtn);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = Ship.TotalEquipmentStrength.toString();
        slider.value = eq.Strength.toString();
        slider.step = '0.01';
        slider.style.flex = '1';
        slider.style.height = '1.75vh'; // 30% less than 2.5vh
        slider.style.accentColor = '#00fff7';
        slider.style.background = 'rgba(0,255,255,0.1)';
        slider.style.boxShadow = '0 0 0.8vw #00fff7';
        slider.style.margin = '0 1vw';
        row.appendChild(slider);
        sliders.push(slider);

        const valueLabel = document.createElement('span');
        valueLabel.textContent = Math.round(eq.Strength).toString();
        valueLabel.style.width = '4vw';
        valueLabel.style.fontSize = '2vh';
        valueLabel.style.textAlign = 'right';
        valueLabel.style.textShadow = '0 0 0.8vw #00fff7';
        row.appendChild(valueLabel);
        valueLabels.push(valueLabel);

        // --- FIX: Add slider event handler for redistribution ---
        slider.oninput = () => {
          const newValue = Number(slider.value);
          ship.SetEquipmentStrength(eq.Name, newValue);
          // Update all sliders and value labels to reflect new strengths
          ship.equipment.forEach((e, i) => {
            sliders[i].value = e.Strength.toString();
            valueLabels[i].textContent = Math.round(e.Strength).toString();
          });
        };
        // --- END FIX ---

        slidersSection.appendChild(row);
        sliderRowCount++;

        // Specification cascade (hidden by default)
        if (eq.Specification) {
          specCascade = document.createElement('div');
          specCascade.style.display = 'flex';
          specCascade.style.flexDirection = 'column';
          specCascade.style.gap = '0.3vh';
          specCascade.style.width = '95%';
          specCascade.style.margin = '0.5vh 0 0 2vw';
          specCascade.style.background = 'rgba(0,255,255,0.07)';
          specCascade.style.borderRadius = '1vw';
          specCascade.style.boxShadow = '0 0 1vw #00fff7aa';
          specCascade.style.padding = '0.5vh 1vw';
          specCascade.style.fontSize = '1.5vh';
          specCascade.style.position = 'relative';
          specCascade.style.zIndex = '1';
          // Add sliders for each specification
          (eq.Specification.Specifications() as string[]).forEach((specName: string, specIdx: number) => {
            const specRow = document.createElement('div');
            specRow.style.display = 'flex';
            specRow.style.alignItems = 'center';
            specRow.style.gap = '1vw';
            specRow.style.width = '100%';
            specRow.style.height = '2.2vh';
            specRow.style.fontSize = '1.5vh';

            const specLabel = document.createElement('span');
            specLabel.textContent = specName;
            specLabel.style.flex = '0 0 7em';
            specLabel.style.fontWeight = 'normal';
            specLabel.style.textShadow = '0 0 0.5vw #00fff7';
            specLabel.style.fontSize = '1.5vh';
            specRow.appendChild(specLabel);

            const specSlider = document.createElement('input');
            specSlider.type = 'range';
            specSlider.min = '0';
            specSlider.max = (eq.Specification!.constructor as any).TotalSpecificationValue?.toString() || '100';
            specSlider.value = eq.Specification!.SpecificationValues[specIdx].toString();
            specSlider.step = '0.01';
            specSlider.style.flex = '1';
            specSlider.style.height = '1.1vh';
            specSlider.style.accentColor = '#00fff7';
            specSlider.style.background = 'rgba(0,255,255,0.1)';
            specSlider.style.boxShadow = '0 0 0.5vw #00fff7';
            specSlider.style.margin = '0 1vw';
            specRow.appendChild(specSlider);

            const specValueLabel = document.createElement('span');
            specValueLabel.textContent = eq.Specification!.SpecificationValues[specIdx].toFixed(2);
            specValueLabel.style.width = '3vw';
            specValueLabel.style.fontSize = '1.5vh';
            specValueLabel.style.textAlign = 'right';
            specValueLabel.style.textShadow = '0 0 0.5vw #00fff7';
            specRow.appendChild(specValueLabel);

            specSlider.oninput = () => {
              eq.Specification!.SetSpecificationValue(specIdx, Number(specSlider.value));
              // Update all spec sliders and value labels for this equipment
              if (specCascade) {
                (eq.Specification!.Specifications() as string[]).forEach((_: string, j: number) => {
                  const val = eq.Specification!.SpecificationValues[j];
                  const child = specCascade.children[j];
                  if (child) {
                    const inputElem = child.querySelector('input') as HTMLInputElement | null;
                    const spanElem = child.querySelector('span:last-child') as HTMLSpanElement | null;
                    if (inputElem) inputElem.value = val.toString();
                    if (spanElem) spanElem.textContent = Math.round(val).toString();
                  }
                });
              }
            };

            if (specCascade) {
              specCascade.appendChild(specRow);
            }
          });
          specCascade.style.display = 'none'; // Hidden by default
          specRows[eqIdx] = specCascade;
        } else {
          specRows[eqIdx] = document.createElement('div');
        }
      });
      dialog.appendChild(slidersSection);

      // --- Add Size, Troops, Colonists sliders row ---
      const stcRow = document.createElement('div');
      stcRow.style.display = 'flex';
      stcRow.style.alignItems = 'center';
      stcRow.style.gap = '1vw';
      stcRow.style.width = '100%';
      stcRow.style.height = '4vh';
      stcRow.style.fontSize = '2vh';
      stcRow.style.margin = '1vh 0 2vh 0';
      stcRow.style.justifyContent = 'space-between';

      // Helper for label+slider+value
      function makeSlider(labelText: string, min: number, max: number, value: number, onInput: (v: number) => void) {
        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.alignItems = 'center';
        group.style.gap = '0.4vw';
        group.style.minWidth = '8vw';
        group.style.flex = '1 1 0';
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.fontWeight = 'bold';
        label.style.textShadow = '0 0 0.8vw #00fff7';
        label.style.fontSize = '2vh';
        group.appendChild(label);
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = value.toString();
        slider.step = '1';
        slider.style.flex = '1';
        slider.style.height = '1.75vh';
        slider.style.accentColor = '#00fff7';
        slider.style.background = 'rgba(0,255,255,0.1)';
        slider.style.boxShadow = '0 0 0.8vw #00fff7';
        slider.style.margin = '0 1vw';
        group.appendChild(slider);
        const valueLabel = document.createElement('span');
        valueLabel.textContent = value.toString();
        valueLabel.style.width = '4vw';
        valueLabel.style.fontSize = '2vh';
        valueLabel.style.textAlign = 'right';
        valueLabel.style.textShadow = '0 0 0.8vw #00fff7';
        group.appendChild(valueLabel);
        slider.oninput = () => {
          const v = Math.round(Number(slider.value));
          valueLabel.textContent = v.toString();
          onInput(v);
        };
        return { group, slider, valueLabel };
      }

      // Initial values
      let stcSize = Math.max(2, Math.min(100, ship.Size || 2));
      let stcTroops = Math.max(0, Math.min(1000, ship.Troops || 0));
      let stcColonists = Math.max(0, Math.min(1000, ship.Colonists || 0));

      const sizeSlider = makeSlider('Size', 2, 100, stcSize, v => {
        stcSize = v;
        ship.Size = v;
      });
      const troopsSlider = makeSlider('Troops', 0, 1000, stcTroops, v => {
        stcTroops = v;
        ship.Troops = stcTroops;
      });
      const colonistsSlider = makeSlider('Colonists', 0, 1000, stcColonists, v => {
        stcColonists = v;
        ship.Colonists = stcColonists;
      });

      stcRow.appendChild(sizeSlider.group);
      stcRow.appendChild(troopsSlider.group);
      stcRow.appendChild(colonistsSlider.group);
      dialog.appendChild(stcRow);

      // Info box for speed and price (directly below sliders)
      const infoBox = document.createElement('div');
      infoBox.style.fontSize = '1.5vh';
      infoBox.style.color = '#bff';
      infoBox.style.background = 'rgba(0,255,255,0.07)';
      infoBox.style.borderRadius = '0.7vw';
      infoBox.style.boxShadow = '0 0 0.5vw #00fff7aa';
      infoBox.style.padding = '0.5vh 1vw';
      infoBox.style.textAlign = 'left';
      infoBox.style.margin = '0.5vh 0 1vh 0';
      function updateInfoBox() {
        infoBox.innerHTML = `Speed: <b>${ship.Speed().toFixed(2)}</b> &nbsp; | &nbsp; Price: <b>${(ship.Weight() * 1000).toLocaleString()}</b>`;
      }
      updateInfoBox();
      dialog.appendChild(infoBox);

      // Ship image selection
      const imgRow = document.createElement('div');
      imgRow.style.display = 'flex';
      imgRow.style.gap = '1vw';
      imgRow.style.flexWrap = 'wrap';
      imgRow.style.justifyContent = 'center';
      imgRow.style.marginBottom = '1.5vh';
      imgRow.style.height = '4.8vh';
      imgRow.style.alignItems = 'center';
      game.ShipImages.canvases.forEach((canvas, idx) => {
        const thumb = document.createElement('canvas');
        thumb.width = thumb.height = Math.max(4 * window.innerHeight / 100, 13); // 4vh, min 13px
        thumb.style.width = '4vh';
        thumb.style.height = '4vh';
        thumb.style.minWidth = '13px';
        thumb.style.minHeight = '13px';
        thumb.style.maxWidth = '4.8vh';
        thumb.style.maxHeight = '4.8vh';
        const tctx = thumb.getContext('2d')!;
        tctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
        thumb.style.border = '0.2vw solid #00fff7';
        thumb.style.borderRadius = '1vw';
        thumb.style.cursor = 'pointer';
        thumb.style.boxShadow = '0 0 0.8vw #00fff7';
        thumb.onclick = () => {
          ship.Image = canvas;
          // Highlight selected
          Array.from(imgRow.children).forEach(child => (child as HTMLElement).style.outline = 'none');
          thumb.style.outline = '0.4vw solid #00fff7';
          // Update the large preview
          updateLargePreview();
        };
        // Highlight the initially selected image
        if (ship.Image === canvas) {
          thumb.style.outline = '0.4vw solid #00fff7';
        }
        imgRow.appendChild(thumb);
      });
      dialog.appendChild(imgRow);

      // Large ship image preview in bottom left
      const largePreview = document.createElement('canvas');
      largePreview.style.position = 'absolute';
      largePreview.style.left = '2vw';
      largePreview.style.bottom = '2vh';
      largePreview.style.height = '8vh'; // Same as button row height
      largePreview.style.width = 'auto';
      largePreview.style.maxWidth = '12vw';
      largePreview.style.border = '0.3vw solid #00fff7';
      largePreview.style.borderRadius = '1vw';
      largePreview.style.boxShadow = '0 0 1vw #00fff7';
      largePreview.style.background = '#021a2a';
      largePreview.style.zIndex = '10';
      function updateLargePreview() {
        if (!ship.Image) return;
        const aspect = ship.Image.width / ship.Image.height;
        largePreview.height = Math.round(window.innerHeight * 0.08); // 8vh
        largePreview.width = Math.round(largePreview.height * aspect);
        const ctx = largePreview.getContext('2d')!;
        ctx.clearRect(0, 0, largePreview.width, largePreview.height);
        ctx.drawImage(ship.Image, 0, 0, largePreview.width, largePreview.height);
      }
      updateLargePreview();
      dialog.appendChild(largePreview);

      // Buttons
      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '3vw';
      btnRow.style.justifyContent = 'flex-end';
      btnRow.style.marginTop = 'auto';
      btnRow.style.height = '8vh';
      btnRow.style.alignItems = 'flex-end';
      btnRow.style.position = 'absolute';
      btnRow.style.bottom = '2vh';
      btnRow.style.right = '3vw';
      btnRow.style.width = '';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.background = 'linear-gradient(90deg, #222 0%, #00fff7 100%)';
      cancelBtn.style.color = '#fff';
      cancelBtn.style.fontWeight = 'bold';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '1vw';
      cancelBtn.style.padding = '1em 2em';
      cancelBtn.style.fontSize = '2vh';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
      cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve(null);
      };
      btnRow.appendChild(cancelBtn);

      const okBtn = document.createElement('button');
      okBtn.textContent = 'Create Ship';
      okBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0af 100%)';
      okBtn.style.color = '#181818';
      okBtn.style.fontWeight = 'bold';
      okBtn.style.border = 'none';
      okBtn.style.borderRadius = '1vw';
      okBtn.style.padding = '1em 2em';
      okBtn.style.fontSize = '2vh';
      okBtn.style.cursor = 'pointer';
      okBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
      okBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve(ship);
      };
      btnRow.appendChild(okBtn);

      dialog.appendChild(btnRow);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      // Update info box when size, troops, or colonists change
      const updateAll = () => {
        updateInfoBox();
      };
      sizeSlider.slider.oninput = () => {
        stcSize = Math.round(Number(sizeSlider.slider.value));
        sizeSlider.valueLabel.textContent = stcSize.toString();
        ship.Size = stcSize;
        updateAll();
      };
      troopsSlider.slider.oninput = () => {
        stcTroops = Math.round(Number(troopsSlider.slider.value));
        troopsSlider.valueLabel.textContent = stcTroops.toString();
        ship.Troops = stcTroops;
        updateAll();
      };
      colonistsSlider.slider.oninput = () => {
        stcColonists = Math.round(Number(colonistsSlider.slider.value));
        colonistsSlider.valueLabel.textContent = stcColonists.toString();
        ship.Colonists = stcColonists;
        updateAll();
      };
    });
  }
} 