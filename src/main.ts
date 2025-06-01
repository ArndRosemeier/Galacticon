import './style.css'
import { UniverseRenderTest } from './UniverseRenderTest';
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

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
    // Create universe render UI
    const universeUI = UniverseRenderTest.create(Math.floor(viewPanelWidth), Math.floor(innerPanelHeight));
    viewPanel.appendChild(universeUI);
    container.appendChild(viewPanel);
    // Create UI panel
    const uiPanel = document.createElement('div');
    uiPanel.style.position = 'absolute';
    uiPanel.style.left = `${uiPanelX}px`;
    uiPanel.style.top = `${uiPanelY}px`;
    uiPanel.style.width = `${uiPanelWidth}px`;
    uiPanel.style.height = `${innerPanelHeight}px`;
    uiPanel.style.background = '#0a1020';
    uiPanel.style.borderRadius = `${innerPanelRadius}px`;
    container.appendChild(uiPanel);
  }
  window.addEventListener('resize', resizePanels);
  resizePanels();
}
