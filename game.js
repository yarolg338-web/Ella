const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScreen = document.getElementById("finalScreen");

let player;
let obstacles;
let clouds;
let score;
let speed;
let gravity;
let gameRunning;
let gameOver;
let winScore;
let animationId;

function resetValues() {
  player = {
    x: 60,
    y: 190,
    width: 42,
    height: 42,
    velocityY: 0,
    jumping: false
  };

  obstacles = [];
  clouds = [];

  score = 0;
  speed = 6;
  gravity = 0.9;
  winScore = 1800;

  gameRunning = true;
  gameOver = false;
}

function startGame() {
  resetValues();

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");

  canvas.style.display = "block";

  loop();
}

function restartGame() {
  cancelAnimationFrame(animationId);
  startGame();
}

function jump() {
  if (!player.jumping && gameRunning) {
    player.velocityY = -16;
    player.jumping = true;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("touchstart", jump);
document.addEventListener("mousedown", jump);

function createObstacle() {
  const height = Math.random() > 0.5 ? 35 : 55;

  obstacles.push({
    x: canvas.width,
    y: 220 - height,
    width: 24 + Math.random() * 18,
    height: height
  });
}

function createCloud() {
  clouds.push({
    x: canvas.width,
    y: 30 + Math.random() * 70,
    width: 45,
    height: 18,
    speed: 1 + Math.random()
  });
}

function update() {
  score++;

  speed = 6 + score / 350;

  player.y += player.velocityY;
  player.velocityY += gravity;

  if (player.y >= 190) {
    player.y = 190;
    player.velocityY = 0;
    player.jumping = false;
  }

  if (score % Math.max(45, Math.floor(105 - speed * 6)) === 0) {
    createObstacle();
  }

  if (score % 140 === 0) {
    createCloud();
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= speed;
  });

  clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
  });

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
  clouds = clouds.filter(cloud => cloud.x + cloud.width > 0);

  for (let obstacle of obstacles) {
    if (collision(player, obstacle)) {
      loseGame();
    }
  }

  if (score >= winScore) {
    winGame();
  }
}

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function loseGame() {
  gameRunning = false;
  gameOver = true;
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
  cancelAnimationFrame(animationId);
}

function winGame() {
  gameRunning = false;
  canvas.style.display = "none";
  finalScreen.classList.remove("hidden");
  cancelAnimationFrame(animationId);
}

function drawPlayer() {
  ctx.fillStyle = "#e91e63";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("❤", player.x + 8, player.y + 29);
}

function drawObstacles() {
  ctx.fillStyle = "#333";

  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawGround() {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 232);
  ctx.lineTo(canvas.width, 232);
  ctx.stroke();
}

function drawClouds() {
  ctx.fillStyle = "#f2b6c6";

  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, cloud.width, cloud.height, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = "#e91e63";
  ctx.font = "20px Arial";
  ctx.fillText("Puntos: " + score, 650, 35);
}

function drawMessage() {
  ctx.fillStyle = "#e91e63";
  ctx.font = "18px Arial";

  if (score < 500) {
    ctx.fillText("Corre hacia mí 💕", 30, 35);
  } else if (score < 1000) {
    ctx.fillText("Cada obstáculo vale la pena por ti 💖", 30, 35);
  } else if (score < 1500) {
    ctx.fillText("Ya casi llegas a la sorpresa ✨", 30, 35);
  } else {
    ctx.fillText("Un poquito más, mi amor 💘", 30, 35);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawClouds();
  drawGround();
  drawPlayer();
  drawObstacles();
  drawScore();
  drawMessage();
}

function loop() {
  if (!gameRunning) return;

  update();
  draw();

  animationId = requestAnimationFrame(loop);
}