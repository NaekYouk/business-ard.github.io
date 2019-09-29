let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;
//Делим игровое поле на 10-пиксельную сетку
let blockSize = 20;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;
//Рисуем рамку
let drawBorder = () => {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};
//Рисуем очечи
let drawScore = () => {
    $("#score").text("Score: " + score);
}
let gameOver = () => {
    interval = 3000;
    ctx.font = "80px Arial";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
    setTimeout(() => {location.reload();}, interval);
    
}

// Рисуем окружность
let circle = function (x, y, radius, fillCircle) {
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
    this.row = row;
    //Отрисовка блока(туловища)
    this.drawSquare = function (color) {
        let x = this.col * blockSize;
        let y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    };
    //Отрисовка окружности(яблока)
    this.drawCircle = function (color) {
        let centerX = this.col * blockSize + blockSize / 2;
        let centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize / 2, true);
    };
    //Проверочка на позиции объектов
    this.equal = function (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };
};

function Snake() {
    this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5)
        
    ];
    this.direction = "right";
    this.nextDirection = "right";
    
    this.draw = function () {
        for (let i = 0; i < this.segments.length; i++)
            this.segments[i].drawSquare("#8cd98c");
        };
    //Двигаем змею 
    this.move = function () {
        let head = this.segments[0];
        let newHead;    //тут храним голову хмеи
        this.direction = this.nextDirection; 
        if (this.direction === "right") {
            newHead = new Block(head.col + 1, head.row);
        } else if (this.direction === "down") {
            newHead = new Block(head.col, head.row + 1);
        } else if (this.direction === "left") {
            newHead = new Block(head.col - 1, head.row);
        } else if (this.direction === "up") {
            newHead = new Block(head.col, head.row - 1);
        }
        //А также проверяем знание ПДД(столкновение)
        if (this.checkCollision(newHead)) {
            gameOver();
            return;
        }
        //Удаляем хвост и добавляем голову(смещение массива вперед)
        this.segments.unshift(newHead); //добавлем голову
        if (newHead.equal(apple.position)) {
            score++;
            let flag;
            //Чтоб яблочко не падало на змейку
            do{
                flag = false;
                apple.move(); 
                for (let i = 0; i < this.segments.length; i++) {
                    if (this.segments[i].equal(apple.position)) { //GENIUSSSS
                    flag = true;
                    }
                }
            }while(flag);   

            //наращиваем скорость
            if (score > intervalScore){
                intervalScore += 20;
                interval -= 10;
            }
        } else {
            this.segments.pop();    //отнимаем хвост
        }
    };
    //Пдд
    this.checkCollision = function (head) {
        let leftCollision = (head.col === 0);   //Если голова ветает в стену, то true
        let topCollision = (head.row === 0);    //Если голова ветает в потолок, то true
        let rightCollision = (head.col === widthInBlocks - 1);
        let bottomCollision = (head.row === heightInBlocks - 1);
        let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
        let selfCollision = false;
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    };
    //Запрещаем давать заднюю
    this.setDirection = function (newDirection) {
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
};

function Apple() {
    this.position = new Block(10, 10);
    
    this.draw = function () {
    this.position.drawCircle("#ff8080");
    };

    this.move = function () {
        let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        this.position = new Block(randomCol, randomRow);
    };

};

let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    27: "pause",
    8: "pause"
};
$("body").keydown(function (event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});

// SWIPE
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            snake.setDirection("left");
        } else {
            snake.setDirection("right");
        }                       
    } else {
        if ( yDiff > 0 ) {
            snake.setDirection("up");
        } else { 
            snake.setDirection("down");
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};


let snake = new Snake();
let apple = new Apple();
let interval = 110;
let intervalScore = 10;
// Запускаем функцию анимации через setInterval
function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    setTimeout(gameLoop, interval);
};
gameLoop();

