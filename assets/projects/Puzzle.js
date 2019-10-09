let grid = $(".grid");
let button = $('.grid-button');
class Cell {
    constructor(ind, x, y) {
        this.name = ind;
        this.absName = ind;
        this.x = x;
        this.y = y;
        if (ind == 16) {
            this.name = ' ';
            this.absName = ' ';
        }
        grid.append('<button class = "grid-button">' + this.name + '</button>');
    }
    upd() {
        grid.append('<button class = "grid-button">' + this.name + '</button>');
    }

}


function Game() {
    this.start = function () {
        this.Cells = [];

        for (let i = 0; i < 4; i++) {
            this.Cells.push([]);
        }

        let count = 1;

        for (let i = 0; i < 4; i++)
            for (let j = this.Cells[i].length; j < 4; j++)
                this.Cells[i].push(new Cell(count++, j, i));
    };

    this.getIndex = function (name) {
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (this.Cells[i][j].name == name) {
                    this.checkSwap(this.Cells[i][j].x, this.Cells[i][j].y);
                    return 0;
                }
    };

    this.checkSwap = function (x, y) {

        if ((x + 1) < 4 && this.Cells[y][x + 1].name == ' ') {
            this.cellsSwap(y, y, x, x + 1);
            return 0;
        }

        if ((x - 1) >= 0 && this.Cells[y][x - 1].name == ' ') {
            this.cellsSwap(y, y, x, x - 1);
            return 0;
        }

        if ((y + 1) < 4 && this.Cells[y + 1][x].name == ' ') {
            this.cellsSwap(y, y + 1, x, x);
            return 0;
        }
        if ((y - 1) >= 0 && this.Cells[y - 1][x].name == ' ') {
            this.cellsSwap(y, y - 1, x, x);
            return 0;
        }

    };

    this.cellsSwap = function (y1, y2, x1, x2) {
        this.Cells[y2][x2].name = this.Cells[y1][x1].name;
        this.Cells[y1][x1].name = ' ';
        this.update();
    };

    this.update = function () {
        grid.empty();
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                this.Cells[i][j].upd();
        $('.steps').text('steps: ' + (++steps));
        this.isSolved();
    };

    this.isSolved = function () {
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (this.Cells[i][j].name != this.Cells[i][j].absName)
                    return 0;
        this.message();
    };

    this.getRandom = function () {
        steps = -1;
        let I = 0,
            J = 0;
        let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ' '];
        for (a, i = a.length; i--;) {
            let random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
            this.Cells[I][J].name = random;
            J++;
            if (J > 3) {
                J = 0;
                I++;
            }
        }
        this.update();
    };

    this.message = function () {
        $('.message').fadeIn(1000);
        $('.message-content').fadeIn(1400);
    };
}
let puzzle = new Game();
let steps = 0;
let flag = false,
    startFlag = true; //

// puzzle.start();

$(document).delegate('.grid-button', 'click', function () {
    if (flag == true)
        puzzle.getIndex($(this).text());
});

$(document).delegate('.mix', 'click', function () {
    puzzle.getRandom();
    flag = true;
});

function startPuzzle() {
    if (startFlag == true) {
        $('.game').slideDown(1500);
        puzzle.start();
        startFlag = false;
    }
}
// setTimeout(()=>{$('.game').show(2000); puzzle.start();}, 500);

$(document).delegate('.close', 'click', function () {
    $('.game').slideUp(1500);
    startFlag = true;
    grid.empty();
    steps = 0;
    flag = false;
    $('.steps').text('steps: ' + steps);
});

$(document).delegate('.message-button', 'click', function () {
    // $('.message-content').hide(500);
    $('.message').fadeOut(1000);
    $('.game').slideUp(1500);
    startFlag = true;
    grid.empty();
    steps = 0;
    flag = false;
    $('.steps').text('steps: ' + steps);
});