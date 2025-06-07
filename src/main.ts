import './style.css'
import { UniverseRenderTest } from './UniverseRenderTest';
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { Game } from './Game';
import { showNewGameDialog } from './NewGameDialog';
import { createSidebar } from './Sidebar';

export let currentGame: Game | null = null;

// Remove default Vite content
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = '';
  // Create and append the main UI panels
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '100vw';
  container.style.height = '100vh';
  app.appendChild(container);

  function resizePanels() {
    container.innerHTML = '';
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Panel covers almost all space with 2% padding
    const panelPadding = Math.min(width, height) * 0.02;
    const panelWidth = width - panelPadding * 2;
    const panelHeight = height - panelPadding * 2;
    const panelRadius = Math.min(panelWidth, panelHeight) * 0.04;
    // Inner panels
    const innerPanelGap = panelWidth * 0.01;
    const innerPanelPadding = panelWidth * 0.01;
    const innerPanelRadius = panelRadius * 0.7;
    const innerPanelHeight = panelHeight - innerPanelPadding * 2;
    const viewPanelWidth = (panelWidth - innerPanelGap - innerPanelPadding * 2) * 0.65;
    const uiPanelWidth = (panelWidth - innerPanelGap - innerPanelPadding * 2) * 0.35;
    // View panel (left)
    const viewPanelX = panelPadding + innerPanelPadding;
    const viewPanelY = panelPadding + innerPanelPadding;
    // UI panel (right)
    const uiPanelX = viewPanelX + viewPanelWidth + innerPanelGap;
    const uiPanelY = viewPanelY;
    // Create view panel
    const viewPanel = document.createElement('div');
    viewPanel.style.position = 'absolute';
    viewPanel.style.left = `${viewPanelX}px`;
    viewPanel.style.top = `${viewPanelY}px`;
    viewPanel.style.width = `${viewPanelWidth}px`;
    viewPanel.style.height = `${innerPanelHeight}px`;
    viewPanel.style.background = '#000';
    viewPanel.style.borderRadius = `${innerPanelRadius}px`;
    viewPanel.style.overflow = 'hidden';
    viewPanel.style.boxShadow = '0 0 48px #00fff799, 0 0 8px #0ff';

    // Show Title.png at start
    const titleImg = document.createElement('img');
    titleImg.src = '/Title.png';
    titleImg.style.position = 'absolute';
    titleImg.style.left = '0';
    titleImg.style.top = '0';
    titleImg.style.width = '100%';
    titleImg.style.height = '100%';
    titleImg.style.objectFit = 'cover';
    titleImg.style.borderRadius = `${innerPanelRadius}px`;
    viewPanel.appendChild(titleImg);

    // Placeholder for universe UI
    let universeUI: HTMLDivElement | null = null;
    function renderUniverse(game: Game) {
      if (universeUI) universeUI.remove();
      if (titleImg.parentElement) titleImg.parentElement.removeChild(titleImg);
      universeUI = UniverseRenderTest.create(Math.floor(viewPanelWidth), Math.floor(innerPanelHeight));
      viewPanel.appendChild(universeUI);
    }
    // Create UI panel
    const uiPanel = document.createElement('div');
    uiPanel.style.position = 'absolute';
    uiPanel.style.left = `${uiPanelX}px`;
    uiPanel.style.top = `${uiPanelY}px`;
    uiPanel.style.width = `${uiPanelWidth}px`;
    uiPanel.style.height = `${innerPanelHeight}px`;
    uiPanel.style.background = '#0a1020';
    uiPanel.style.borderRadius = `${innerPanelRadius}px`;
    uiPanel.style.boxShadow = '0 0 48px #00fff799, 0 0 8px #0ff';
    // Sidebar (game info) and New Game button
    let currentSidebar: HTMLDivElement | null = null;
    let newGameBtn: HTMLButtonElement | null = null;
    function redrawSidebar() {
      // Remove old sidebar and button
      if (currentSidebar) currentSidebar.remove();
      if (newGameBtn) newGameBtn.remove();
      // Sidebar
      currentSidebar = createSidebar();
      currentSidebar.style.zIndex = '1';
      uiPanel.appendChild(currentSidebar);
      // New Game button
      newGameBtn = document.createElement('button');
      newGameBtn.textContent = 'New Game';
      newGameBtn.style.position = 'absolute';
      newGameBtn.style.top = '16px';
      newGameBtn.style.right = '24px';
      newGameBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0f3460 100%)';
      newGameBtn.style.color = '#181818';
      newGameBtn.style.fontWeight = 'bold';
      newGameBtn.style.border = 'none';
      newGameBtn.style.borderRadius = '8px';
      newGameBtn.style.padding = '10px 24px';
      newGameBtn.style.fontSize = '1.1em';
      newGameBtn.style.cursor = 'pointer';
      newGameBtn.style.boxShadow = '0 0 8px #00fff7aa';
      newGameBtn.style.zIndex = '2';
      newGameBtn.onclick = () => {
        showNewGameDialog((game) => {
          currentGame = game;
          renderUniverse(game);
          redrawSidebar();
          game.start();
          game.onChange(() => {
            redrawSidebar();
          });
          // Debug: log player names
          console.log('Players in new game:', game.players.map(p => p.name));
        });
      };
      uiPanel.appendChild(newGameBtn);
    }
    redrawSidebar();
    container.appendChild(viewPanel);
    container.appendChild(uiPanel);
  }
  window.addEventListener('resize', resizePanels);
  resizePanels();
}

// Example usage: show the dialog and start the game
// Only show the dialog when the New Game button is clicked
