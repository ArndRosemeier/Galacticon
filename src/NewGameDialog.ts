import { Game } from './Game';
import { ChooseRaceDialog } from './ChooseRaceDialog';
import { Race } from './Race';

/**
 * Shows a modal dialog for creating a new game, allowing up to 8 players (normal or AI).
 * Calls onGameCreated with the created Game instance when confirmed.
 */
export function showNewGameDialog(onGameCreated: (game: Game) => void) {
  // Modal overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f3460 100%)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Modal content
  const modal = document.createElement('div');
  modal.style.background = 'rgba(20,30,60,0.98)';
  modal.style.border = '2px solid #00fff7';
  modal.style.borderRadius = '24px';
  modal.style.boxShadow = '0 0 48px #00fff799, 0 0 8px #0ff';
  modal.style.padding = '40px 48px 32px 48px';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';
  modal.style.minWidth = '400px';
  modal.style.maxWidth = '90vw';

  // Title
  const title = document.createElement('h2');
  title.textContent = 'New Game Setup';
  title.style.color = '#00fff7';
  title.style.letterSpacing = '0.15em';
  title.style.marginBottom = '24px';
  modal.appendChild(title);

  // Player list
  const playerList = document.createElement('ul');
  playerList.style.listStyle = 'none';
  playerList.style.padding = '0';
  playerList.style.margin = '0 0 24px 0';
  modal.appendChild(playerList);

  // Add player controls
  const addRow = document.createElement('div');
  addRow.style.display = 'flex';
  addRow.style.gap = '12px';
  addRow.style.marginBottom = '16px';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Player name';
  nameInput.style.padding = '8px 12px';
  nameInput.style.borderRadius = '8px';
  nameInput.style.border = '1px solid #00fff7';
  nameInput.style.background = '#222a';
  nameInput.style.color = '#fff';
  nameInput.style.fontSize = '1.1em';

  const addHumanBtn = document.createElement('button');
  addHumanBtn.textContent = 'Add Human';
  addHumanBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0f3460 100%)';
  addHumanBtn.style.color = '#181818';
  addHumanBtn.style.fontWeight = 'bold';
  addHumanBtn.style.border = 'none';
  addHumanBtn.style.borderRadius = '8px';
  addHumanBtn.style.padding = '8px 18px';
  addHumanBtn.style.cursor = 'pointer';
  addHumanBtn.style.boxShadow = '0 0 8px #00fff7aa';

  const addAIBtn = document.createElement('button');
  addAIBtn.textContent = 'Add AI';
  addAIBtn.style.background = 'linear-gradient(90deg, #0ff 0%, #0f3460 100%)';
  addAIBtn.style.color = '#181818';
  addAIBtn.style.fontWeight = 'bold';
  addAIBtn.style.border = 'none';
  addAIBtn.style.borderRadius = '8px';
  addAIBtn.style.padding = '8px 18px';
  addAIBtn.style.cursor = 'pointer';
  addAIBtn.style.boxShadow = '0 0 8px #00fff7aa';

  addRow.appendChild(nameInput);
  addRow.appendChild(addHumanBtn);
  addRow.appendChild(addAIBtn);
  modal.appendChild(addRow);

  // Game instance
  const game = new Game();
  // Track player names for display
  const playerInfos: { name: string, isAI: boolean, race: Race | null }[] = [];

  function updatePlayerList() {
    playerList.innerHTML = '';
    playerInfos.forEach((p, i) => {
      const li = document.createElement('li');
      li.style.color = '#fff';
      li.style.fontSize = '1.1em';
      li.style.marginBottom = '6px';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      // Race image (if chosen)
      if (p.race && p.race.image) {
        const img = document.createElement('img');
        img.src = p.race.image;
        img.style.width = '2em';
        img.style.height = '2em';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '0.5em';
        img.style.marginRight = '0.7em';
        li.appendChild(img);
      }
      let label = `${p.name} ${p.isAI ? '(AI)' : ''}`;
      if (p.race && p.race.name) {
        label += ` — ${p.race.name}`;
      }
      li.appendChild(document.createTextNode(label));
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.style.marginLeft = '12px';
      removeBtn.style.background = 'none';
      removeBtn.style.color = '#00fff7';
      removeBtn.style.border = 'none';
      removeBtn.style.cursor = 'pointer';
      removeBtn.onclick = () => {
        playerInfos.splice(i, 1);
        game.players.splice(i, 1);
        updatePlayerList();
      };
      li.appendChild(removeBtn);
      playerList.appendChild(li);
    });
  }

  async function addPlayer(isAI: boolean) {
    const name = nameInput.value.trim() || `Player ${playerInfos.length + 1}`;
    const player = new (await import('./Player')).Player(0, isAI, name);
    // Show race chooser dialog
    const chosenRace = await ChooseRaceDialog.show((game as any).races || []);
    player.race = chosenRace;
    if (game.addPlayer(player)) {
      playerInfos.push({ name, isAI, race: chosenRace });
      updatePlayerList();
      nameInput.value = '';
    } else {
      const btn = isAI ? addAIBtn : addHumanBtn;
      btn.disabled = true;
      btn.textContent = 'Max 8 players';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = isAI ? 'Add AI' : 'Add Human';
      }, 1200);
    }
  }

  addHumanBtn.onclick = () => addPlayer(false);
  addAIBtn.onclick = () => addPlayer(true);

  // Confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Start Game';
  confirmBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0f3460 100%)';
  confirmBtn.style.color = '#181818';
  confirmBtn.style.fontWeight = 'bold';
  confirmBtn.style.border = 'none';
  confirmBtn.style.borderRadius = '8px';
  confirmBtn.style.padding = '12px 32px';
  confirmBtn.style.marginTop = '24px';
  confirmBtn.style.fontSize = '1.2em';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.style.boxShadow = '0 0 12px #00fff7aa';
  confirmBtn.onclick = () => {
    if (game.players.length === 0) {
      confirmBtn.textContent = 'Add at least one player!';
      setTimeout(() => { confirmBtn.textContent = 'Start Game'; }, 1200);
      return;
    }
    overlay.remove();
    onGameCreated(game);
  };
  modal.appendChild(confirmBtn);

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.background = 'none';
  cancelBtn.style.color = '#00fff7';
  cancelBtn.style.fontWeight = 'bold';
  cancelBtn.style.border = '2px solid #00fff7';
  cancelBtn.style.borderRadius = '8px';
  cancelBtn.style.padding = '10px 32px';
  cancelBtn.style.marginTop = '12px';
  cancelBtn.style.fontSize = '1.1em';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.onclick = () => {
    overlay.remove();
  };
  modal.appendChild(cancelBtn);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
} 