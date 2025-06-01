import { Universe } from './Universe';
import { Quadrant } from './Quadrant';

/**
 * Utility class to render a test UI for the Universe, allowing quadrant extension.
 */
export class UniverseRenderTest {
  /**
   * Create a scrollable div containing a canvas and extension buttons for the universe.
   * @param viewWidth Total view width in pixels
   * @param viewHeight Total view height in pixels
   * @returns HTMLDivElement
   */
  static create(viewWidth: number, viewHeight: number): HTMLDivElement {
    const universe = new Universe();
    universe.getOrCreateQuadrant(0, 0);
    // State for rerendering
    const container = document.createElement('div');
    container.style.overflow = 'auto';
    container.style.width = viewWidth + 'px';
    container.style.height = viewHeight + 'px';
    container.style.position = 'relative';
    container.style.background = '#111';

    function rerender() {
      container.innerHTML = '';
      // Find bounds of loaded quadrants
      const all = universe.getAllQuadrants();
      if (all.length === 0) return;
      let minX = 0, maxX = 0, minY = 0, maxY = 0;
      for (const { x, y } of all) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      // Each quadrant is half the view area
      const quadW = Math.floor(viewWidth / 2);
      const quadH = Math.floor(viewHeight / 2);
      const gridW = (maxX - minX + 1) * quadW;
      const gridH = (maxY - minY + 1) * quadH;
      // Center the (0,0) quadrant in the scroll area
      // Calculate offset so that (0,0) is in the center
      const offsetX = Math.max(0, Math.floor((viewWidth - gridW) / 2) - minX * quadW);
      const offsetY = Math.max(0, Math.floor((viewHeight - gridH) / 2) - minY * quadH);
      // Create a canvas for all quadrants
      const canvas = document.createElement('canvas');
      canvas.width = gridW + offsetX * 2;
      canvas.height = gridH + offsetY * 2;
      canvas.style.display = 'block';
      canvas.style.background = '#222';
      container.appendChild(canvas);
      const ctx = canvas.getContext('2d')!;
      // Render each quadrant
      for (const { x, y, quadrant } of all) {
        const px = offsetX + (x - minX) * quadW;
        const py = offsetY + (y - minY) * quadH;
        ctx.save();
        ctx.translate(px, py);
        quadrant.render(ctx, quadW, quadH);
        ctx.restore();
      }
      // For each border, check for missing neighbors and add 'Extend' buttons
      const directions = [
        { dx: 0, dy: -1, label: 'N' },
        { dx: 0, dy: 1, label: 'S' },
        { dx: -1, dy: 0, label: 'W' },
        { dx: 1, dy: 0, label: 'E' },
      ];
      // Track which positions already have buttons
      const buttonKeys = new Set<string>();
      for (const { x, y } of all) {
        for (const dir of directions) {
          const nx = x + dir.dx;
          const ny = y + dir.dy;
          const key = `${nx},${ny}`;
          if (universe.getQuadrant(nx, ny)) continue;
          if (buttonKeys.has(key)) continue;
          buttonKeys.add(key);
          // Place button at the border between quadrants
          let bx = offsetX + (x - minX) * quadW;
          let by = offsetY + (y - minY) * quadH;
          if (dir.dx === -1) bx -= 40; // left edge
          if (dir.dx === 1) bx += quadW - 40; // right edge
          if (dir.dy === -1) by -= 16; // top edge
          if (dir.dy === 1) by += quadH - 16; // bottom edge
          // Center button along the orthogonal axis
          if (dir.dx === 0) bx += quadW / 2 - 40;
          if (dir.dy === 0) by += quadH / 2 - 16;
          const btn = document.createElement('button');
          btn.textContent = 'Extend';
          btn.style.position = 'absolute';
          btn.style.left = bx + 'px';
          btn.style.top = by + 'px';
          btn.style.width = '80px';
          btn.style.height = '32px';
          btn.style.background = '#333';
          btn.style.color = '#fff';
          btn.style.border = '2px solid #888';
          btn.style.borderRadius = '8px';
          btn.style.cursor = 'pointer';
          btn.style.zIndex = '10';
          btn.onclick = () => {
            universe.getOrCreateQuadrant(nx, ny);
            rerender();
          };
          container.appendChild(btn);
        }
      }
    }
    rerender();
    return container;
  }
} 