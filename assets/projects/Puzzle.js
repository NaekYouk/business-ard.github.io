"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var grid = $(".grid");
var button = $(".grid-button");

var Cell =
  /*#__PURE__*/
  (function() {
    function Cell(ind, x, y) {
      _classCallCheck(this, Cell);

      this.name = ind;
      this.absName = ind;
      this.x = x;
      this.y = y;

      if (ind == 16) {
        this.name = " ";
        this.absName = " ";
      }

      grid.append('<button class = "grid-button">' + this.name + "</button>");
    }

    _createClass(Cell, [
      {
        key: "upd",
        value: function upd() {
          grid.append(
            '<button class = "grid-button">' + this.name + "</button>"
          );
        }
      }
    ]);

    return Cell;
  })();

function Game() {
  this.start = function() {
    this.Cells = [];

    for (var _i = 0; _i < 4; _i++) {
      this.Cells.push([]);
    }

    var count = 1;

    for (var _i2 = 0; _i2 < 4; _i2++) {
      for (var j = this.Cells[_i2].length; j < 4; j++) {
        this.Cells[_i2].push(new Cell(count++, j, _i2));
      }
    }
  };

  this.getIndex = function(name) {
    for (var _i3 = 0; _i3 < 4; _i3++) {
      for (var j = 0; j < 4; j++) {
        if (this.Cells[_i3][j].name == name) {
          this.checkSwap(this.Cells[_i3][j].x, this.Cells[_i3][j].y);
          return 0;
        }
      }
    }
  };

  this.checkSwap = function(x, y) {
    if (x + 1 < 4 && this.Cells[y][x + 1].name == " ") {
      this.cellsSwap(y, y, x, x + 1);
      return 0;
    }

    if (x - 1 >= 0 && this.Cells[y][x - 1].name == " ") {
      this.cellsSwap(y, y, x, x - 1);
      return 0;
    }

    if (y + 1 < 4 && this.Cells[y + 1][x].name == " ") {
      this.cellsSwap(y, y + 1, x, x);
      return 0;
    }

    if (y - 1 >= 0 && this.Cells[y - 1][x].name == " ") {
      this.cellsSwap(y, y - 1, x, x);
      return 0;
    }
  };

  this.cellsSwap = function(y1, y2, x1, x2) {
    this.Cells[y2][x2].name = this.Cells[y1][x1].name;
    this.Cells[y1][x1].name = " ";
    this.update();
  };

  this.update = function() {
    grid.empty();

    for (var _i4 = 0; _i4 < 4; _i4++) {
      for (var j = 0; j < 4; j++) {
        this.Cells[_i4][j].upd();
      }
    }

    $(".steps").text("steps: " + ++steps);
    this.isSolved();
  };

  this.isSolved = function() {
    for (var _i5 = 0; _i5 < 4; _i5++) {
      for (var j = 0; j < 4; j++) {
        if (this.Cells[_i5][j].name != this.Cells[_i5][j].absName) return 0;
      }
    }

    this.message();
  };

  this.getRandom = function() {
    steps = -1;
    var I = 0,
      J = 0;
    var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, " "];

    for (a, i = a.length; i--; ) {
      var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
      this.Cells[I][J].name = random;
      J++;

      if (J > 3) {
        J = 0;
        I++;
      }
    }

    this.update();
  };

  this.message = function() {
    $(".message").fadeIn(1000);
    $(".message-content").fadeIn(1400);
  };
}

var puzzle = new Game();
var steps = 0;
var flag = false,
  startFlag = true; // puzzle.start();

$(document).delegate(".grid-button", "click", function() {
  if (flag == true) puzzle.getIndex($(this).text());
});
$(document).delegate(".mix", "click", function() {
  puzzle.getRandom();
  flag = true;
});

function startPuzzle() {
  if (startFlag == true) {
    $(".game").slideDown(1500);
    puzzle.start();
    startFlag = false;
  }
} // setTimeout(()=>{$('.game').show(2000); puzzle.start();}, 500);

$(document).delegate(".close", "click", function() {
  $(".game").slideUp(1500);
  startFlag = true;
  grid.empty();
  steps = 0;
  flag = false;
  $(".steps").text("steps: " + steps);
});
$(document).delegate(".message-button", "click", function() {
  // $('.message-content').hide(500);
  $(".message").fadeOut(1000);
  $(".game").slideUp(1500);
  startFlag = true;
  grid.empty();
  steps = 0;
  flag = false;
  $(".steps").text("steps: " + steps);
});
