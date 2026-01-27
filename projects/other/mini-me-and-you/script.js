console.log("Felix & Marita loaded!");

// Kiss overlay
let kissOverlay = null;
let kissCooldown = 0;

// Horse chaos
let horseMode = false;
let horseInterval = null;
let contextMenu = null;

function getCurrentKissSprite() {
  return felix.currentSprite === 'felix2.png' ? 'kiss2.png' : 'kiss.png';
}

function showKiss(x, y) {
  const kissSprite = getCurrentKissSprite();

  if (!kissOverlay) {
    kissOverlay = document.createElement('div');
    kissOverlay.className = 'kiss-overlay';
    document.body.appendChild(kissOverlay);
  }

  kissOverlay.style.backgroundImage = `url(${kissSprite})`;
  kissOverlay.style.left = x + 'px';
  kissOverlay.style.top = y + 'px';
  kissOverlay.style.display = 'block';
}

function hideKiss() {
  if (kissOverlay) {
    kissOverlay.style.display = 'none';
  }
}

function spawnHorse() {
  const horse = document.createElement('div');
  horse.className = 'horse-chaos';
  const size = 50 + Math.random() * 300;
  horse.style.width = size + 'px';
  horse.style.height = size + 'px';
  horse.style.left = Math.random() * window.innerWidth + 'px';
  horse.style.top = Math.random() * window.innerHeight + 'px';
  horse.style.backgroundImage = `url(horse.png)`;
  horse.style.backgroundSize = 'contain';
  horse.style.backgroundRepeat = 'no-repeat';
  horse.style.opacity = 0.7 + Math.random() * 0.3;
  document.body.appendChild(horse);
}

function startHorseChaos() {
  horseMode = true;
  felix.element.style.visibility = 'hidden';
  marita.element.style.visibility = 'hidden';
  hideKiss();

  horseInterval = setInterval(() => {
    spawnHorse();
    spawnHorse();
    spawnHorse();
  }, 100);
}

function stopHorseChaos() {
  // This function exists but won't be called
  // Horses are eternal
  horseMode = false;
  if (horseInterval) {
    clearInterval(horseInterval);
    horseInterval = null;
  }
  felix.element.style.visibility = 'visible';
  marita.element.style.visibility = 'visible';
}

function showContextMenu(x, y, character) {
  if (contextMenu) contextMenu.remove();

  contextMenu = document.createElement('div');
  contextMenu.className = 'buddy-context-menu';
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';

  if (character.name === 'marita') {
    const horseItem = document.createElement('div');
    horseItem.className = 'buddy-context-menu-item';
    horseItem.textContent = 'horse';
    horseItem.addEventListener('click', () => {
      startHorseChaos();
      contextMenu.remove();
    });
    contextMenu.appendChild(horseItem);
  } else if (character.name === 'felix') {
    const swapItem = document.createElement('div');
    swapItem.className = 'buddy-context-menu-item';
    swapItem.textContent = character.currentSprite === 'felix.png' ? 'piplup' : 'albinauric';
    swapItem.addEventListener('click', () => {
      character.swapSprite();
      contextMenu.remove();
    });
    contextMenu.appendChild(swapItem);
  }

  document.body.appendChild(contextMenu);

  setTimeout(() => {
    document.addEventListener('click', () => {
      if (contextMenu) contextMenu.remove();
    }, { once: true });
  }, 10);
}

// Character class
class BuddyCharacter {
  constructor(name, spriteUrl) {
    this.name = name;
    this.currentSprite = spriteUrl;
    this.alternateSprite = name === 'felix' ? 'felix2.png' : null;

    this.element = document.createElement('div');
    this.element.className = 'buddy-character';
    this.element.style.backgroundImage = `url(${spriteUrl})`;
    this.element.dataset.character = name;
    document.body.appendChild(this.element);

    this.x = Math.random() * (window.innerWidth - 250);
    this.y = -225;
    this.speedX = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
    this.speedY = 0;

    this.state = 'falling';
    this.frame = 0;
    this.frameDelay = 0;
    this.idleTime = 0;
    this.kissingTime = 0;

    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.updateFrame();
  }

  swapSprite() {
    if (this.alternateSprite) {
      const temp = this.currentSprite;
      this.currentSprite = this.alternateSprite;
      this.alternateSprite = temp;
      this.element.style.backgroundImage = `url(${this.currentSprite})`;
    }
  }

  getFrameForState() {
    switch(this.state) {
      case 'falling':
      case 'dropped':
        return 4;
      case 'walking':
        return this.frame % 3;
      case 'idle':
      case 'kissing':
        return 1;
      case 'grabbed':
        return 3;
      default:
        return 1;
    }
  }

  updateFrame() {
    const frameIndex = this.getFrameForState();
    this.element.style.backgroundPosition = `-${frameIndex * 250}px 0px`;
    this.element.style.transform = `scaleX(${this.speedX > 0 ? -1 : 1})`;
  }

  update() {
    if (this.state === 'falling' || this.state === 'dropped') {
      this.speedY += 0.2;
      this.y += this.speedY;

      if (this.y >= window.innerHeight - 225) {
        this.y = window.innerHeight - 225;
        this.state = 'walking';
        this.speedY = 0;
      }
    }

    else if (this.state === 'kissing') {
      this.kissingTime--;
      this.element.style.visibility = 'hidden';
      if (this.kissingTime <= 0) {
        this.state = 'walking';
        if (!horseMode) {
          this.element.style.visibility = 'visible';
        }
      }
    }

    else if (this.state === 'walking' || this.state === 'idle') {
      if (!horseMode) {
        this.element.style.visibility = 'visible';
      }

      if (Math.random() < 0.005) {
        this.idleTime = Math.random() * 120 + 60;
        this.state = 'idle';
      }

      if (this.idleTime > 0) {
        this.idleTime--;
        this.state = 'idle';
      } else {
        this.state = 'walking';
        this.frameDelay++;
        if (this.frameDelay > 18) {
          this.frameDelay = 0;
          this.frame++;
        }

        this.x += this.speedX;

        if (this.x <= 0 || this.x >= window.innerWidth - 250) {
          this.speedX *= -1;
        }

        if (Math.random() < 0.003) {
          this.speedX *= -1;
        }
      }

      this.y = window.innerHeight - 225;
    }

    this.updateFrame();
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  startKissing() {
    this.state = 'kissing';
    this.kissingTime = 120;
  }

  release() {
    this.isDragging = false;
    this.state = 'dropped';
    this.speedY = 0;
    this.element.classList.remove('dragging');
  }
}

// Collision detection
function checkCollision(char1, char2) {
  const dx = Math.abs(char1.x - char2.x);
  const dy = Math.abs(char1.y - char2.y);
  return dx < 100 && dy < 50;
}

// Initialize both characters
const felix = new BuddyCharacter('felix', 'felix.png');
const marita = new BuddyCharacter('marita', 'marita.png');

// Right-click on Marita
marita.element.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  showContextMenu(e.clientX, e.clientY, marita);
});

// Right-click on Felix
felix.element.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  showContextMenu(e.clientX, e.clientY, felix);
});

// Global mouse events for dragging
document.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;

  const felixHit = e.target === felix.element || felix.element.contains(e.target);
  const maritaHit = e.target === marita.element || marita.element.contains(e.target);

  let selectedChar = null;

  if (felixHit && maritaHit) {
    selectedChar = Math.random() > 0.5 ? felix : marita;
  } else if (felixHit) {
    selectedChar = felix;
  } else if (maritaHit) {
    selectedChar = marita;
  }

  if (selectedChar) {
    selectedChar.isDragging = true;
    selectedChar.state = 'grabbed';
    selectedChar.element.classList.add('dragging');
    selectedChar.dragOffsetX = e.clientX - selectedChar.x;
    selectedChar.dragOffsetY = e.clientY - selectedChar.y;
    selectedChar.updateFrame();
    e.preventDefault();
  }
});

document.addEventListener('mousemove', (e) => {
  if (felix.isDragging) {
    felix.x = e.clientX - felix.dragOffsetX;
    felix.y = e.clientY - felix.dragOffsetY;
    felix.element.style.left = felix.x + 'px';
    felix.element.style.top = felix.y + 'px';
  }
  if (marita.isDragging) {
    marita.x = e.clientX - marita.dragOffsetX;
    marita.y = e.clientY - marita.dragOffsetY;
    marita.element.style.left = marita.x + 'px';
    marita.element.style.top = marita.y + 'px';
  }
});

document.addEventListener('mouseup', () => {
  if (felix.isDragging) {
    felix.release();
  }
  if (marita.isDragging) {
    marita.release();
  }
});

// Main animation loop
function animate() {
  if (!horseMode) {
    felix.update();
    marita.update();
  }

  if (kissCooldown > 0) {
    kissCooldown--;
  }

  if (!horseMode &&
      kissCooldown === 0 &&
      checkCollision(felix, marita) &&
      felix.state !== 'kissing' && marita.state !== 'kissing' &&
      felix.state !== 'falling' && marita.state !== 'falling' &&
      felix.state !== 'dropped' && marita.state !== 'dropped' &&
      felix.state !== 'grabbed' && marita.state !== 'grabbed') {
    felix.startKissing();
    marita.startKissing();
    kissCooldown = 600;
  }

  if (!horseMode && felix.state === 'kissing' && marita.state === 'kissing') {
    const kissX = (felix.x + marita.x) / 2;
    const kissY = (felix.y + marita.y) / 2 - 12.5;
    showKiss(kissX, kissY);
  } else {
    hideKiss();
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
