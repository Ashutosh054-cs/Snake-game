const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const leaderboard = document.getElementById("leaderboard");
const highScores = document.getElementById("highScores");

const gridSize = 20;
const tileCount = 20;
let xVelocity = 0;
let yVelocity = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 200;

playBtn.addEventListener("click", startGame);
leaderboardBtn.addEventListener("click", showLeaderboard);
backToMenuBtn.addEventListener("click", backToMenu);

function startGame() {
  menu.style.display = "none";
  gameContainer.style.display = "block";
  resetGame();
  setTimeout(gameLoop, speed);
}

function showLeaderboard() {
  menu.style.display = "none";
  leaderboard.style.display = "block";
  displayHighScores();
}

function backToMenu() {
  leaderboard.style.display = "none";
  gameContainer.style.display = "none";
  menu.style.display = "block";
}

function gameLoop() {
  update();
  draw();
  if (gameContainer.style.display === "block") {
    setTimeout(gameLoop, speed);
  }
}

function update() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    resetGame();
  }

  document.getElementById("score").innerText = `Score: ${score}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function resetGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  snake = [{ x: 10, y: 10 }];
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
}

function displayHighScores() {
  highScores.innerHTML = `<li>High Score: ${highScore}</li>`;
}

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      if (yVelocity === 0) {
        xVelocity = 0;
        yVelocity = -1;
      }
      break;
    case "ArrowDown":
      if (yVelocity === 0) {
        xVelocity = 0;
        yVelocity = 1;
      }
      break;
    case "ArrowLeft":
      if (xVelocity === 0) {
        xVelocity = -1;
        yVelocity = 0;
      }
      break;
    case "ArrowRight":
      if (xVelocity === 0) {
        xVelocity = 1;
        yVelocity = 0;
      }
      break;
  }
});

resetGame();
displayHighScores();
