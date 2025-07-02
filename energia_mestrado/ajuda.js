// Efeitos sonoros
const bgSound = document.getElementById('bg-sound');
const hoverSound = document.getElementById('hover-sound');
const startSound = document.getElementById('start-sound');

window.onload = () => {
  bgSound.volume = 0.18;
  bgSound.play();
};

// Botões
const backBtn = document.getElementById('back-btn');
const startGameBtn = document.getElementById('start-game-btn');

[backBtn, startGameBtn].forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
  });
});

backBtn.addEventListener('click', () => {
  startSound.play();
  document.body.classList.add('fade-out');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
});

startGameBtn.addEventListener('click', () => {
  startSound.play();
  document.body.classList.add('fade-out');
  
  setTimeout(() => {
    window.location.href = 'fase1.html';
  }, 600);
});

// Cidade minimalista com prédios estáticos e janelas animadas (mesmo código da tela inicial)
const canvas = document.getElementById('city-canvas');
const ctx = canvas.getContext('2d');
const canvasBg = document.getElementById('city-canvas-bg');
const ctxBg = canvasBg.getContext('2d');
let buildings = [];
let bgBuildings = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.5;
  canvas.style.bottom = '0';
  canvasBg.width = window.innerWidth;
  canvasBg.height = window.innerHeight * 0.7;
  canvasBg.style.bottom = '0';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createBuildings() {
  buildings = [];
  bgBuildings = [];
  // Prédios do fundo (maiores, mais altos, blur via CSS)
  const nBg = 12;
  const wBg = canvasBg.width / nBg;
  for (let i = 0; i < nBg; i++) {
    let bx = i * wBg + wBg * 0.1;
    let bw = wBg * (0.7 + Math.random() * 0.3);
    let bh = canvasBg.height * (0.65 + Math.random() * 0.25);
    let rows = Math.floor(bh / 36);
    let cols = Math.floor(bw / 28);
    let windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          x: bx + 14 + c * 18,
          y: canvasBg.height - bh + 18 + r * 24,
          lit: Math.random() < 0.06,
          timer: Math.random() * 4
        });
      }
    }
    bgBuildings.push({x: bx, y: canvasBg.height - bh, w: bw, h: bh, windows});
  }
  // Prédios principais (menos janelas, centralizadas)
  const n = 8;
  const w = canvas.width / n;
  for (let i = 0; i < n; i++) {
    let bx = i * w + w * 0.18;
    let bw = w * 0.64;
    let bh = canvas.height * (0.38 + Math.random() * 0.32);
    let windows = [];
    let rows = Math.max(1, Math.floor(bh / 38));
    let cols = Math.max(1, Math.floor(bw / 32));
    // Centralizar janelas
    let totalWinW = cols * 16 + (cols - 1) * 8;
    let startX = bx + (bw - totalWinW) / 2;
    let totalWinH = rows * 18 + (rows - 1) * 10;
    let startY = canvas.height - bh + (bh - totalWinH) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          x: startX + c * 24,
          y: startY + r * 28,
          lit: Math.random() < 0.18,
          timer: Math.random() * 5
        });
      }
    }
    buildings.push({x: bx, y: canvas.height - bh, w: bw, h: bh, windows});
  }
}

function drawCityBg() {
  ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
  // Prédios do fundo
  bgBuildings.forEach(b => {
    ctxBg.fillStyle = '#2d2e42';
    ctxBg.fillRect(b.x, b.y, b.w, b.h);
    // Janelas
    b.windows.forEach(win => {
      ctxBg.fillStyle = win.lit ? '#ffe06633' : '#23243a';
      ctxBg.fillRect(win.x, win.y, 11, 14);
    });
  });
}

function drawCityMinimal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Prédios principais
  buildings.forEach(b => {
    ctx.fillStyle = '#23243a';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    // Janelas
    b.windows.forEach(win => {
      ctx.fillStyle = win.lit ? '#fff200' : '#2d2e42';
      ctx.fillRect(win.x, win.y, 13, 16);
    });
  });
}

function animateMinimal() {
  // Animação sutil das janelas
  bgBuildings.forEach(b => {
    b.windows.forEach(win => {
      win.timer -= 0.016;
      if (win.timer < 0) {
        win.lit = !win.lit && Math.random() < 0.2 ? true : false;
        win.timer = 3 + Math.random() * 4;
      }
    });
  });
  buildings.forEach(b => {
    b.windows.forEach(win => {
      win.timer -= 0.016;
      if (win.timer < 0) {
        win.lit = !win.lit && Math.random() < 0.3 ? true : false;
        win.timer = 2.5 + Math.random() * 4.5;
      }
    });
  });
  drawCityBg();
  drawCityMinimal();
  requestAnimationFrame(animateMinimal);
}

createBuildings();
animateMinimal();
window.addEventListener('resize', () => {
  createBuildings();
});