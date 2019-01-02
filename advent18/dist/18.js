#!/usr/bin/env npx ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var input = fs.readFileSync("input18.txt", "utf8");
var test = ".#.#...|#.\n.....#|##|\n.|..|...#.\n..|#.....#\n#.#|||#|#|\n...#.||...\n.|....|...\n||...#|.#|\n|.||||..|.\n...#.|..|.";
var size = 50;
var OPEN = ".";
var TREE = "|";
var YARD = "#";
var Cell = /** @class */ (function () {
    function Cell(x, y, icon, grid) {
        this.x = x;
        this.y = y;
        this.icon = icon;
        this.grid = grid;
        this.next = "";
    }
    Object.defineProperty(Cell.prototype, "neighbours", {
        get: function () {
            var ns = [];
            for (var dy = -1; dy < 2; dy++) {
                for (var dx = -1; dx < 2; dx++) {
                    if (dy !== 0 || dx !== 0) {
                        var n = this.grid.getCell(this.x + dx, this.y + dy);
                        if (n) {
                            ns.push(n);
                        }
                    }
                }
            }
            return ns;
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.move = function () {
        var neighbours = this.neighbours;
        // console.log("moving " + this, " ... neighbours are" + neighbours.join(" : "));
        var trees = neighbours.filter(function (n) { return n.icon === TREE; }).length;
        var yards = neighbours.filter(function (n) { return n.icon === YARD; }).length;
        // const opens = neighbours.filter(n => n.icon === OPEN).length;
        // console.log("there are ", trees, " trees and ", yards, " yards out of ", neighbours.length);
        this.next = this.icon;
        if (this.icon === OPEN && trees >= 3) {
            this.next = TREE;
        }
        else if (this.icon === TREE && yards >= 3) {
            this.next = YARD;
        }
        else if (this.icon === YARD) {
            if (yards >= 1 && trees >= 1) {
                // stay
                this.next = YARD;
            }
            else {
                this.next = OPEN;
            }
        }
        // console.log("moving from ", this.icon, " to ", this.next);
    };
    Cell.prototype.toString = function () {
        return this.icon + "@ " + this.x + "," + this.y;
    };
    return Cell;
}());
var Grid = /** @class */ (function () {
    function Grid(lines) {
        this.arr = [];
        this.cells = [];
        this.minutes = 0;
        this.areadySeen = new Map();
        this.arr = [];
        for (var y = 0; y < lines.length; y++) {
            var row = [];
            var line = lines[y];
            for (var x = 0; x < line.length; x++) {
                var cell = new Cell(x, y, line[x], this);
                this.cells.push(cell);
                row.push(cell);
            }
            this.arr.push(row);
        }
    }
    Object.defineProperty(Grid.prototype, "score", {
        get: function () {
            var trees = this.cells.filter(function (n) { return n.icon === TREE; }).length;
            var yards = this.cells.filter(function (n) { return n.icon === YARD; }).length;
            return trees * yards;
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.getCell = function (x, y) {
        if (this.arr[y] && this.arr[y][x]) {
            return this.arr[y][x];
        }
        else {
            return null;
        }
    };
    Grid.prototype.play = function (count, part2) {
        if (part2 === void 0) { part2 = false; }
        while (this.minutes < count) {
            this.cells.forEach(function (cell) { return cell.move(); });
            this.cells.forEach(function (cell) { return (cell.icon = cell.next); });
            this.minutes++;
            if (part2) {
                var score = this.score;
                if (this.minutes > 1000 && this.minutes < 3000) {
                    if (this.areadySeen.has(score)) {
                        var wasAt = this.areadySeen.get(score);
                        var diff = this.minutes - wasAt;
                        var toGo = count - this.minutes;
                        var fullRoundsToSkip = Math.floor(toGo / diff) * diff;
                        this.minutes += fullRoundsToSkip;
                    }
                    else {
                        this.areadySeen.set(score, this.minutes);
                    }
                }
            }
            else {
                this.p();
            }
        }
    };
    Grid.prototype.p = function () {
        var out = "After " + this.minutes + " minutes:\n";
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var cell = row_1[_b];
                out += cell.icon;
            }
            out += "\n";
        }
        out += "\n";
        console.log(out);
    };
    return Grid;
}());
var testGrid = new Grid(test.split("\n"));
// testGrid.p();
testGrid.play(10);
console.log("Final score test", testGrid.score);
var grid = new Grid(input.split("\n"));
// grid.p();
grid.play(10);
console.log("Final score part 1", grid.score);
grid = new Grid(input.split("\n"));
// grid.p();
grid.play(1000000000, true);
console.log("Final score part 2", grid.score);
grid = new Grid(input.split("\n"));
grid.play(1000);
//# sourceMappingURL=18.js.map