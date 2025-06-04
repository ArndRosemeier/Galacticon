import { Race } from './Race';

export class ChooseRaceDialog {
  static async show(races: Race[]): Promise<Race | null> {
    return new Promise<Race | null>((resolve) => {
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
      dialog.style.width = '65vw';
      dialog.style.height = '80vh';
      dialog.style.maxWidth = '80vw';
      dialog.style.maxHeight = '96vh';
      dialog.style.display = 'flex';
      dialog.style.flexDirection = 'row';
      dialog.style.background = 'linear-gradient(135deg, #0ff 0%, #0af 100%)';
      dialog.style.border = '0.2vw solid #00f6ff';
      dialog.style.borderRadius = '2vw';
      dialog.style.boxShadow = '0 0 4vw #00fff799, 0 0 0.7vw #0ff';
      dialog.style.overflow = 'hidden';
      dialog.style.color = '#fff';
      dialog.style.fontSize = '2vh';
      dialog.style.paddingBottom = '2vw';

      // Layout: sidebar + mainArea + buttonRow in a column flex container
      const contentCol = document.createElement('div');
      contentCol.style.display = 'flex';
      contentCol.style.flexDirection = 'column';
      contentCol.style.flex = '1 1 0';
      contentCol.style.height = '100%';
      contentCol.style.justifyContent = 'flex-end';

      // Sidebar: grid of race images
      const sidebar = document.createElement('div');
      sidebar.style.display = 'grid';
      sidebar.style.gridTemplateColumns = '1fr 1fr';
      sidebar.style.gap = '0.5vh 0.5vw';
      sidebar.style.background = 'transparent';
      sidebar.style.padding = '0.5vh 0.5vw';
      sidebar.style.height = '100%';
      sidebar.style.alignContent = 'start';
      sidebar.style.justifyItems = 'center';
      sidebar.style.width = '18vw';
      sidebar.style.minWidth = '12vw';
      sidebar.style.boxSizing = 'border-box';
      // Main area
      const mainArea = document.createElement('div');
      mainArea.style.flex = '1 1 auto';
      mainArea.style.height = '100%';
      mainArea.style.display = 'flex';
      mainArea.style.alignItems = 'center';
      mainArea.style.justifyContent = 'center';
      mainArea.style.background = '#021a2a';
      mainArea.style.overflow = 'hidden';
      mainArea.style.position = 'relative';
      mainArea.style.borderRadius = '2vw';
      mainArea.style.marginBottom = '0';
      // State
      let selectedRace: Race | null = null;
      let isPlaying = false;
      let currentVideo: HTMLVideoElement | null = null;
      // Helper to show image in main area
      function showImage(race: Race) {
        mainArea.innerHTML = '';
        currentVideo = null;
        const img = document.createElement('img');
        img.src = race.image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.borderRadius = '2vw';
        mainArea.appendChild(img);
      }
      // Helper to play animation in main area
      function playAnimation(race: Race) {
        mainArea.innerHTML = '';
        const video = document.createElement('video');
        video.src = race.animationUrl;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.display = 'block';
        video.style.borderRadius = '2vw';
        video.autoplay = true;
        video.controls = false;
        video.onended = () => {
          isPlaying = false;
          showImage(race);
        };
        video.onpause = () => {
          if (isPlaying) {
            isPlaying = false;
            showImage(race);
          }
        };
        // If another video is playing, stop it
        if (currentVideo) {
          currentVideo.pause();
          currentVideo.src = '';
        }
        currentVideo = video;
        mainArea.appendChild(video);
        isPlaying = true;
      }
      // Sidebar: add race images
      races.forEach(race => {
        const imgBtn = document.createElement('button');
        imgBtn.style.background = 'none';
        imgBtn.style.border = 'none';
        imgBtn.style.padding = '0';
        imgBtn.style.cursor = 'pointer';
        imgBtn.style.outline = 'none';
        imgBtn.style.display = 'flex';
        imgBtn.style.flexDirection = 'column';
        imgBtn.style.alignItems = 'center';
        imgBtn.style.justifyContent = 'center';
        imgBtn.style.width = '8vw';
        imgBtn.style.height = 'auto';
        imgBtn.style.maxWidth = '9.6vh';
        imgBtn.style.maxHeight = 'none';
        imgBtn.style.borderRadius = '0.8vw';
        imgBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
        imgBtn.style.margin = '0.2vh 0';
        const img = document.createElement('img');
        img.src = race.image;
        img.style.width = '100%';
        img.style.height = '8vw';
        img.style.maxWidth = '9.6vh';
        img.style.maxHeight = '9.6vh';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '0.8vw';
        imgBtn.appendChild(img);
        const nameLabel = document.createElement('div');
        nameLabel.textContent = race.name;
        nameLabel.style.marginTop = '0.5vh';
        nameLabel.style.fontSize = '1.3vh';
        nameLabel.style.color = '#fff';
        nameLabel.style.textAlign = 'center';
        nameLabel.style.textShadow = '0 0 0.5vw #021a2a, 0 0 0.2vw #00fff7aa';
        imgBtn.appendChild(nameLabel);
        imgBtn.onclick = () => {
          selectedRace = race;
          playAnimation(race);
        };
        sidebar.appendChild(imgBtn);
      });
      // Buttons
      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '2vw';
      btnRow.style.justifyContent = 'flex-end';
      btnRow.style.alignItems = 'center';
      btnRow.style.width = '100%';
      btnRow.style.paddingRight = '2vw';
      btnRow.style.paddingTop = '0';
      btnRow.style.boxSizing = 'border-box';
      btnRow.style.marginTop = '1.2vh';
      const buttonStyle = {
        maxWidth: '12vw',
        minWidth: '9.6em',
        width: 'auto',
      };
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.background = 'linear-gradient(90deg, #222 0%, #00fff7 100%)';
      cancelBtn.style.color = '#fff';
      cancelBtn.style.fontWeight = 'bold';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '1vw';
      cancelBtn.style.padding = '0.35em 0.7em';
      cancelBtn.style.fontSize = '2vh';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
      Object.assign(cancelBtn.style, buttonStyle);
      const okBtn = document.createElement('button');
      okBtn.textContent = 'OK';
      okBtn.style.background = 'linear-gradient(90deg, #00fff7 0%, #0af 100%)';
      okBtn.style.color = '#181818';
      okBtn.style.fontWeight = 'bold';
      okBtn.style.border = 'none';
      okBtn.style.borderRadius = '1vw';
      okBtn.style.padding = '0.35em 0.7em';
      okBtn.style.fontSize = '2vh';
      okBtn.style.cursor = 'pointer';
      okBtn.style.boxShadow = '0 0 0.8vw #00fff7aa';
      Object.assign(okBtn.style, buttonStyle);
      btnRow.appendChild(cancelBtn);
      btnRow.appendChild(okBtn);

      // Compose content column
      contentCol.appendChild(mainArea);
      contentCol.appendChild(btnRow);

      // Layout: sidebar + contentCol
      dialog.appendChild(sidebar);
      dialog.appendChild(contentCol);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      // Show blank view area with 'Choose race' text at startup
      mainArea.innerHTML = '';
      const chooseText = document.createElement('div');
      chooseText.textContent = 'Choose race';
      chooseText.style.color = '#fff';
      chooseText.style.fontSize = '2.5vh';
      chooseText.style.fontWeight = 'bold';
      chooseText.style.textAlign = 'center';
      chooseText.style.width = '100%';
      chooseText.style.height = '100%';
      chooseText.style.display = 'flex';
      chooseText.style.alignItems = 'center';
      chooseText.style.justifyContent = 'center';
      mainArea.appendChild(chooseText);
      // Remove showing first race image by default
      // if (races.length > 0) showImage(races[0]);
      // Relabel the OK button
      okBtn.textContent = 'OK';

      cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve(null);
      };
      okBtn.onclick = () => {
        if (selectedRace) {
          document.body.removeChild(overlay);
          resolve(selectedRace);
        }
      };
    });
  }
} 