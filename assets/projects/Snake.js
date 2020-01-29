"use strict";

var size =
  window.innerHeight < window.innerWidth
    ? window.innerHeight
    : window.innerWidth;
size = Math.floor(size / 100) * 100;
size -= 100;
$("body").prepend(
  "<canvas id=" + "canvas" + " width=" + size + " height=" + size + "></canvas>"
);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height; //Делим игровое поле на N-пиксельную сетку

var blockSize = Math.floor(size / 25);
var widthInBlocks = Math.floor(width / blockSize);
var heightInBlocks = Math.floor(height / blockSize);
var score = 0; //Рисуем рамку

var drawBorder = function drawBorder() {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
}; //Рисуем очечи

var drawScore = function drawScore() {
  $("#score").text("Score: " + score);
};

var gameOver = function gameOver() {
  interval = 3000;
  ctx.font = "80px Arial";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  $(".message-score").text("Score: " + score);
  $(".message").fadeIn(1000);
  $(".message-content").fadeIn(1400);
  interval = 1000000;
}; // Рисуем окружность

var circle = function circle(x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);

  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

function Block(col, row) {
  this.col = col;
  this.row = row; //Отрисовка блока(туловища)

  this.drawSquare = function(color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  }; //Отрисовка окружности(яблока)

  this.drawCircle = function(color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  }; //Проверочка на позиции объектов

  this.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  };
}

function Snake() {
  this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
  this.direction = "right";
  this.nextDirection = "right";

  this.draw = function() {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare("#8cd98c");
    }
  }; //Двигаем змею

  this.move = function() {
    var head = this.segments[0];
    var newHead; //тут храним голову хмеи

    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1);
    } //А также проверяем знание ПДД(столкновение)

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    } //Удаляем хвост и добавляем голову(смещение массива вперед)

    this.segments.unshift(newHead); //добавлем голову

    if (newHead.equal(apple.position)) {
      score++;
      var flag; //Чтоб яблочко не падало на змейку

      do {
        flag = false;
        apple.move();

        for (var i = 0; i < this.segments.length; i++) {
          if (this.segments[i].equal(apple.position)) {
            //GENIUSSSS
            flag = true;
          }
        }
      } while (flag); //наращиваем скорость

      if (score >= intervalScore) {
        intervalScore += 10;
        interval -= 10;
      }
    } else {
      this.segments.pop(); //отнимаем хвост
    }
  }; //Пдд

  this.checkCollision = function(head) {
    var leftCollision = head.col === 0; //Если голова ветает в стену, то true

    var topCollision = head.row === 0; //Если голова ветает в потолок, то true

    var rightCollision = head.col === widthInBlocks - 1;
    var bottomCollision = head.row === heightInBlocks - 1;
    var wallCollision =
      leftCollision || topCollision || rightCollision || bottomCollision;
    var selfCollision = false;

    for (var i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  }; //Запрещаем давать заднюю

  this.setDirection = function(newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }

    this.nextDirection = newDirection;
  };
}

function Apple() {
  this.position = new Block(10, 10);

  this.draw = function() {
    this.position.drawCircle("#ff8080");
  };

  this.move = function() {
    var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
  };
}

var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};
$("body").keydown(function(event) {
  var newDirection = directions[event.keyCode];

  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
}); // SWIPE

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  var firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      snake.setDirection("left");
    } else {
      snake.setDirection("right");
    }
  } else {
    if (yDiff > 0) {
      snake.setDirection("up");
    } else {
      snake.setDirection("down");
    }
  }
  /* reset values */

  xDown = null;
  yDown = null;
}

var snake = new Snake();
var apple = new Apple();
var interval = 120;
var intervalScore = 10; // Запускаем функцию анимации через setInterval

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
  setTimeout(gameLoop, interval);
}

$(document).delegate(".message-button", "click", function() {
  location.reload();
});
{
  /* <canvas id="canvas" width="650" height="650"></canvas> */
}
gameLoop();
