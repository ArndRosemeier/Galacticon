import { currentGame } from './main';
import { ShipConstructor } from './ShipConstructor';

/**
 * Creates the sidebar UI panel. Shows game info and player list with active player highlight.
 */
export function createSidebar(): HTMLDivElement {
  const sidebar = document.createElement('div');
  sidebar.style.position = 'relative';
  sidebar.style.width = '100%';
  sidebar.style.height = '100%';
  sidebar.style.background = '#0a1020';
  sidebar.style.borderRadius = 'inherit';
  sidebar.style.boxShadow = '0 0 48px #00fff799, 0 0 8px #0ff';
  // Game info
  const info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '32px';
  info.style.left = '24px';
  info.style.color = '#00fff7';
  info.style.fontSize = '1.1em';
  info.style.fontWeight = 'bold';
  function updateInfo() {
    if (currentGame) {
      info.textContent = `Turn: ${currentGame.gameTurn} | Active Player: ${currentGame.activePlayer + 1}`;
    } else {
      info.textContent = 'No game started.';
    }
  }
  updateInfo();
  sidebar.appendChild(info);
  // Show current player's race (if any)
  if (currentGame && currentGame.players.length > 0 && currentGame.activePlayer >= 0 && currentGame.activePlayer < currentGame.players.length) {
    const player = currentGame.players[currentGame.activePlayer];
    if (player.race) {
      const raceRow = document.createElement('div');
      raceRow.style.display = 'flex';
      raceRow.style.alignItems = 'center';
      raceRow.style.margin = '12px 0 0 0';
      raceRow.style.position = 'absolute';
      raceRow.style.top = '48px';
      raceRow.style.left = '24px';
      raceRow.style.zIndex = '2';
      const img = document.createElement('img');
      img.src = player.race.image;
      img.style.width = '2.2em';
      img.style.height = '2.2em';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '0.5em';
      img.style.marginRight = '0.7em';
      raceRow.appendChild(img);
      const name = document.createElement('span');
      name.textContent = player.race.name;
      name.style.color = '#00fff7';
      name.style.fontWeight = 'bold';
      name.style.fontSize = '1.1em';
      raceRow.appendChild(name);
      sidebar.appendChild(raceRow);
    }
  }
  // Player list
  if (currentGame && currentGame.players.length > 0 && currentGame.activePlayer >= 0 && currentGame.activePlayer < currentGame.players.length) {
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '24px 0 0 0';
    list.style.position = 'absolute';
    list.style.top = '64px';
    list.style.left = '24px';
    list.style.right = '24px';
    list.style.width = 'auto';
    const game = currentGame!;
    game.players.forEach((player, idx) => {
      const li = document.createElement('li');
      // Icon: 👤 for human, 🤖 for AI
      const icon = document.createElement('span');
      icon.textContent = player.isAI ? '🤖' : '👤';
      icon.style.marginRight = '10px';
      li.appendChild(icon);
      let label = player.name || `Player ${idx + 1}`;
      if (player.race && player.race.name) {
        label += ` (${player.race.name})`;
      }
      li.appendChild(document.createTextNode(label));
      li.style.fontSize = '1.1em';
      li.style.marginBottom = '10px';
      li.style.padding = '8px 18px';
      li.style.borderRadius = '16px';
      li.style.transition = 'box-shadow 0.2s, background 0.2s';
      if (idx === game.activePlayer) {
        li.style.background = 'rgba(0,255,247,0.12)';
        li.style.boxShadow = '0 0 16px 4px #00fff7cc, 0 0 0 2px #00fff7';
        li.style.color = '#00fff7';
        li.style.fontWeight = 'bold';
      } else {
        li.style.background = 'rgba(255,255,255,0.04)';
        li.style.color = '#fff';
      }
      list.appendChild(li);
    });
    sidebar.appendChild(list);
  }
  // Add Construct ship button
  const constructBtn = document.createElement('button');
  constructBtn.textContent = 'Construct ship';
  constructBtn.style.position = 'absolute';
  constructBtn.style.bottom = '32px';
  constructBtn.style.left = '24px';
  constructBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0af 100%)';
  constructBtn.style.color = '#181818';
  constructBtn.style.fontWeight = 'bold';
  constructBtn.style.border = 'none';
  constructBtn.style.borderRadius = '8px';
  constructBtn.style.padding = '10px 24px';
  constructBtn.style.fontSize = '1.1em';
  constructBtn.style.cursor = 'pointer';
  constructBtn.style.boxShadow = '0 0 8px #00fff7aa';
  constructBtn.onclick = async () => {
    if (currentGame && currentGame.players.length > 0 && currentGame.activePlayer >= 0) {
      const player = currentGame.players[currentGame.activePlayer];
      await ShipConstructor.show(player, currentGame);
    }
  };
  sidebar.appendChild(constructBtn);
  // Add Choose Race button for testing
  const chooseRaceBtn = document.createElement('button');
  chooseRaceBtn.textContent = 'Choose Race (Test)';
  chooseRaceBtn.style.position = 'absolute';
  chooseRaceBtn.style.bottom = '80px';
  chooseRaceBtn.style.left = '24px';
  chooseRaceBtn.style.background = 'linear-gradient(90deg, #0af 0%, #00fff7 100%)';
  chooseRaceBtn.style.color = '#181818';
  chooseRaceBtn.style.fontWeight = 'bold';
  chooseRaceBtn.style.border = 'none';
  chooseRaceBtn.style.borderRadius = '8px';
  chooseRaceBtn.style.padding = '10px 24px';
  chooseRaceBtn.style.fontSize = '1.1em';
  chooseRaceBtn.style.cursor = 'pointer';
  chooseRaceBtn.style.boxShadow = '0 0 8px #00fff7aa';
  chooseRaceBtn.onclick = async () => {
    if (!currentGame || !currentGame.races) {
      alert('No game or races available. Start a game first.');
      return;
    }
    const { ChooseRaceDialog } = await import('./ChooseRaceDialog');
    const selected = await ChooseRaceDialog.show(currentGame.races);
    console.log('Selected race:', selected);
  };
  sidebar.appendChild(chooseRaceBtn);
  // Optionally, expose a way to update info externally
  (sidebar as any).updateInfo = updateInfo;
  return sidebar;
} 