const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScreen = document.getElementById("finalScreen");

const dinoImg = new Image();
dinoImg.src = "assets/dino.png";

const cactusImg = new Image();
cactusImg.src = "assets/cactus.png";

let player, obstacles, score, speed, gravity, gameRunning, winScore;

function resetGame() {
  player = {
    x: 60,
    y: 190,
    width: 44,
    height: 44,
    velocityY: 0,
    jumping: false
  };

  obstacles = [];
  score = 0;
  speed = 6;
  gravity = 1;
  winScore = 2500;
  gameRunning = true;
}

function startGame() {
  resetGame();

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");

  canvas.style.display = "block";

  loop();
}

function restartGame() {
  location.reload();
}

function jump() {
  if (!player.jumping && gameRunning) {
    player.velocityY = -18;
    player.jumping = true;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("mousedown", jump);
document.addEventListener("touchstart", jump);

function createObstacle() {
  const size = Math.random() > 0.5 ? 40 : 60;

  obstacles.push({
    x: canvas.width,
    y: 220 - size,
    width: size / 2,
    height: size
  });
}

function update() {
  score++;

  speed = 6 + score / 200;

  player.y += player.velocityY;
  player.velocityY += gravity;

  if (player.y >= 190) {
    player.y = 190;
    player.velocityY = 0;
    player.jumping = false;
  }

  if (score % 60 === 0) {
    createObstacle();
  }

  obstacles.forEach(ob => ob.x -= speed);

  obstacles = obstacles.filter(ob => ob.x > -50);

  for (let ob of obstacles) {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      lose();
    }
  }

  if (score >= winScore) {
    win();
  }
}

function lose() {
  gameRunning = false;
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
}

function win() {
  gameRunning = false;
  canvas.style.display = "none";
  finalScreen.classList.remove("hidden");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // suelo
  ctx.strokeStyle = "#555";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, 232);
  ctx.lineTo(canvas.width, 232);
  ctx.stroke();
  ctx.setLineDash([]);

  // dino
  ctx.drawImage(dinoImg, player.x, player.y, player.width, player.height);

  // obstáculos
  obstacles.forEach(ob => {
    ctx.drawImage(cactusImg, ob.x, ob.y, ob.width, ob.height);
  });

  // score
  ctx.fillStyle = "#555";
  ctx.font = "20px monospace";
  ctx.fillText(("00000" + score).slice(-5), 650, 30);
}

function loop() {
  if (!gameRunning) return;

  update();
  draw();
  requestAnimationFrame(loop);
}