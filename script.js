//Board

const blockSize = 25;
const rows = 25;
const cols = 35;
const boardHeight = blockSize * rows;
const boardWidth = blockSize * cols;
let snakeX = 1 * blockSize;
let snakeY = 1 * blockSize;
const snake = [];
let velocityX = 0;
let velocityY = 0;

let foodX = 5 * blockSize;
let foodY = 8 * blockSize;

//SET Sounds
const eatSound = new Audio("./sounds/eat2.mp3");
const gameOverSound = new Audio("./sounds/fail.wav");
const leftSound = new Audio("./sounds/left.mp3");
const rightSound = new Audio("./sounds/right.mp3");
const upSound = new Audio("./sounds/up.mp3");
const downSound = new Audio("./sounds/down.mp3");

//DRAW BOARD
const canvas = document.getElementById("snakeCanvas");
canvas.width = boardWidth;
canvas.height = boardHeight;
const ctx = canvas.getContext("2d");

//DRAW APPLE
const image = new Image();
image.src = "./img/apple.png";

function drawApple() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;

  if (snake.length) {
    for (let i = 0; i < snake.length; i++) {
      if (foodX === snake[i][0] && foodY === snake[i][1]) {
        return drawApple();
      }
    }
  }

  ctx.drawImage(image, foodX, foodY, blockSize, blockSize);
}

//DRAW SNAKE
ctx.fillStyle = "green";
ctx.fillRect(snakeX, snakeY, blockSize, blockSize);

//SCORE
const scoreDom = document.querySelector("span");
let score = 1;
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (velocityX !== 1) {
        leftSound.play();
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "ArrowRight":
      if (velocityX !== -1) {
        rightSound.play();

        velocityX = 1;
        velocityY = 0;
      }
      break;
    case "ArrowUp":
      if (velocityY !== 1) {
        upSound.play();

        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "ArrowDown":
      if (velocityY !== -1) {
        downSound.play();

        velocityX = 0;
        velocityY = 1;
      }
      break;
    default:
      return;
  }
});

function redraw() {
  //create board
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  //create apple
  ctx.drawImage(image, foodX, foodY, blockSize, blockSize);
  //create snake
  ctx.fillStyle = "green";
  //snake eats apple
  if (snakeX === foodX && snakeY === foodY) {
    eatSound.play();
    scoreDom.innerHTML = score++;
    snake.push([foodX, foodY]);
    drawApple();
  }
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }

  if (snake.length) {
    snake[0] = [snakeX, snakeY];
  }
  //check for wall collision
  if (
    snakeX >= 0 &&
    snakeX <= blockSize * (cols - 1) &&
    snakeY >= 0 &&
    snakeY <= blockSize * (rows - 1)
  ) {
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    ctx.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i][0], snake[i][1], blockSize, blockSize);
      //check for body collision
      if (snakeX === snake[i][0] && snakeY === snake[i][1]) {
        return gameOver();
      }
    }
  } else {
    return gameOver();
  }
}

const interval = setInterval(redraw, 100);
interval();

function gameOver() {
  clearInterval(interval);
  gameOverSound.play();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  ctx.font = "50px Silkscreen";
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", boardWidth / 2 - 165, boardHeight / 2);
}
