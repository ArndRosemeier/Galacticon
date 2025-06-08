import { Player } from './Player';
import { Tech } from './Tech';
import { Race } from './Race';

export class ResearchDialog {
  static async show(player: Player): Promise<void> {
    return new Promise<void>((resolve) => {
      // Overlay
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
      dialog.style.width = '80vw';
      dialog.style.height = '80vh';
      dialog.style.maxWidth = '96vw';
      dialog.style.maxHeight = '96vh';
      dialog.style.display = 'flex';
      dialog.style.flexDirection = 'column';
      dialog.style.alignItems = 'flex-start';
      dialog.style.background = 'linear-gradient(135deg, #0ff 0%, #0af 100%)';
      dialog.style.border = '0.2vw solid #00f6ff';
      dialog.style.borderRadius = '2vw';
      dialog.style.boxShadow = '0 0 4vw #00fff799, 0 0 0.7vw #0ff';
      dialog.style.overflow = 'auto';
      dialog.style.color = '#fff';
      dialog.style.fontSize = '2vh';
      dialog.style.padding = '1vw 0.2vw 1vw 1vw';
      dialog.style.gap = '0.5vw';

      // Tech list
      const techList = document.createElement('div');
      techList.style.display = 'grid';
      techList.style.gridTemplateColumns = '1fr 1fr';
      techList.style.gap = '0.35vh 4vw';
      techList.style.overflowY = 'auto';
      techList.style.flex = '1 1 0';
      techList.style.justifyItems = 'end';
      dialog.appendChild(techList);

      // Helper to draw a curve for a tech
      function drawCurve(canvas: HTMLCanvasElement, tech: Tech, bonus: number) {
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Axes
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, canvas.height - 30);
        ctx.stroke();
        // Curve
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const rp = i * 5; // up to 500 research points
          let eff = 1 + 4 * (1 - Math.exp(-rp / tech.scaling)); // true efficiency formula
          if (bonus) eff *= (1 + bonus);
          // Y axis: 0 (bottom) to 10 (top)
          const y = canvas.height - 30 - eff * ((canvas.height - 50) / 10);
          const x = 40 + (canvas.width - 60) * (rp / 500);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Vertical line at current research points (yellow)
        const x = 40 + (canvas.width - 60) * (tech.researchPoints / 500);
        ctx.save();
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 30);
        ctx.lineTo(x, 20);
        ctx.stroke();
        ctx.restore();
        // Draw horizontal grid lines at 2, 4, 6, 8 (thin, dashed, light)
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        [2, 4, 6, 8].forEach(val => {
          ctx.beginPath();
          const y = canvas.height - 30 - val * ((canvas.height - 50) / 10);
          ctx.moveTo(40, y);
          ctx.lineTo(canvas.width - 20, y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();
        // Responsive font size based on canvas height (e.g., 0.13 * height)
        const fontSize = Math.max(canvas.height * 0.13, 8); // minimum 8px for legibility
        // Efficiency label
        let eff = tech.getEfficiency();
        if (bonus) eff *= (1 + bonus);
        ctx.fillStyle = '#fff';
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('Eff: ' + eff.toFixed(2), x + 8, 40);
        // Axis labels
        ctx.font = `${fontSize * 0.85}px sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('0', 30, canvas.height - 10);
        ctx.font = `${fontSize * 0.85}px sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('500', canvas.width - 50, canvas.height - 10);
        ctx.font = `${fontSize * 0.85}px sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('1', 10, canvas.height - 30 - 1 * ((canvas.height - 50) / 10));
        ctx.font = `${fontSize * 0.85}px sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('5', 10, canvas.height - 30 - 5 * ((canvas.height - 50) / 10));
      }

      // For each tech
      for (const tech of player.allTechs) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '2vw';
        // Label
        const label = document.createElement('div');
        label.textContent = tech.Name;
        label.style.width = '8vw';
        label.style.fontWeight = 'bold';
        label.style.margin = '0';
        label.style.padding = '0';
        row.appendChild(label);
        // Canvas
        const canvas = document.createElement('canvas');
        // Make the graph taller and use more vertical space
        canvas.style.width = '14.3vw';
        canvas.style.height = '5.6vw';
        canvas.style.margin = '0';
        canvas.style.padding = '0';
        row.appendChild(canvas);
        // Wait until canvas is in the DOM and has a computed size
        requestAnimationFrame(() => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          drawCurve(canvas, tech, player.race?.researchBonus.find(b => b.TechName === tech.Name)?.Bonus ?? 0);
        });
        // Invest button
        const investBtn = document.createElement('button');
        investBtn.textContent = 'Invest';
        investBtn.style.marginLeft = '1vw';
        investBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0af 100%)';
        investBtn.style.color = '#181818';
        investBtn.style.fontWeight = 'bold';
        investBtn.style.border = 'none';
        investBtn.style.borderRadius = '1vw';
        investBtn.style.padding = '0.7em 1.4em';
        investBtn.style.fontSize = '1.1em';
        investBtn.style.cursor = 'pointer';
        investBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
        investBtn.style.width = '8vw';
        investBtn.style.justifySelf = 'end';
        investBtn.onclick = () => {
          tech.invest();
          drawCurve(canvas, tech, player.race?.researchBonus.find(b => b.TechName === tech.Name)?.Bonus ?? 0);
          // No efficiency value in label
        };
        row.appendChild(investBtn);
        techList.appendChild(row);
        // On window resize, redraw the curve responsively
        window.addEventListener('resize', () => {
          if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return;
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          drawCurve(canvas, tech, player.race?.researchBonus.find(b => b.TechName === tech.Name)?.Bonus ?? 0);
        });
      }

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.gridColumn = '2';
      closeBtn.style.width = '8vw';
      closeBtn.style.display = 'block';
      closeBtn.style.justifySelf = 'end';
      closeBtn.style.background = 'linear-gradient(90deg, #222 0%, #00fff7 100%)';
      closeBtn.style.color = '#fff';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '1vw';
      closeBtn.style.padding = '0.7em 1.4em';
      closeBtn.style.fontSize = '1.1em';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
      closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve();
      };
      techList.appendChild(closeBtn);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    });
  }
} 