#!/usr/bin/env npx ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var input = fs
    .readFileSync("input20.txt", "utf8")
    .replace("^", "")
    .replace("$", "");
var test = "#####\n#.|.#\n#-###\n#.|X#\n#####";
var ROOM = ".";
var WALL = "#";
var DOOR = "|";
var DOOR2 = "-";
var POS = "X";
var UNK = "?";
function key(x, y) {
    return x + ":" + y;
}
var Grid = /** @class */ (function () {
    function Grid() {
        this.minY = 9;
        this.minX = 9;
        this.maxY = 0;
        this.maxX = 0;
        this.cells = new Map();
    }
    Object.defineProperty(Grid.prototype, "yRange", {
        get: function () {
            return this.maxY - this.minY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "xRange", {
        get: function () {
            return this.maxX - this.minX;
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.getCell = function (x, y) {
        var k = key(x, y);
        if (!this.cells.has(k)) {
            var cell = new Cell(x, y, this);
            this.cells.set(cell.key, cell);
            // console.log("making cell at ", k);
            this.maxX = Math.max(this.maxX, x);
            this.maxY = Math.max(this.maxY, y);
            this.minX = Math.min(this.minX, x);
            this.minY = Math.min(this.minY, y);
        }
        return this.cells.get(k);
    };
    Grid.prototype.finish = function () {
        var max = 0;
        var thouCount = 0;
        this.cells.forEach(function (cell) {
            if (cell.i === UNK)
                cell.icon(WALL);
            if (cell.i === ROOM) {
                max = Math.max(cell.dist, max);
                if (cell.dist >= 1000)
                    thouCount++;
            }
        });
        console.log("Maximum distance is", max);
        console.log("Exceed 1000:", thouCount); //8580 too low
    };
    return Grid;
}());
var Cell = /** @class */ (function () {
    function Cell(x, y, map) {
        this.x = x;
        this.y = y;
        this.map = map;
        this.i = UNK;
        this.dist = 99999;
    }
    Object.defineProperty(Cell.prototype, "key", {
        get: function () {
            return key(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "up", {
        get: function () {
            if (!this._up) {
                var up = this.map.getCell(this.x, this.y - 1);
                up.down = this;
                this._up = up;
            }
            return this._up;
        },
        set: function (cell) {
            this._up = cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "hasUp", {
        get: function () {
            return !!this._up;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "down", {
        get: function () {
            if (!this._down) {
                var down = this.map.getCell(this.x, this.y + 1);
                down.up = this;
                this._down = down;
            }
            return this._down;
        },
        set: function (cell) {
            this._down = cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "hasDown", {
        get: function () {
            return !!this._down;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "left", {
        get: function () {
            if (!this._left) {
                var left = this.map.getCell(this.x - 1, this.y);
                left.right = this;
                this._left = left;
            }
            return this._left;
        },
        set: function (cell) {
            this._left = cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "hasLeft", {
        get: function () {
            return !!this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "right", {
        get: function () {
            // console.log("cell right");
            if (!this._right) {
                var right = this.map.getCell(this.x + 1, this.y);
                right.left = this;
                this._right = right;
            }
            return this._right;
        },
        set: function (cell) {
            this._right = cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "hasRight", {
        get: function () {
            return !!this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "isDoor", {
        get: function () {
            return this.i === DOOR || this.i === DOOR2;
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.icon = function (i) {
        this.i = i;
        return this;
    };
    Cell.prototype.wall = function () {
        return this.icon(WALL);
    };
    Cell.prototype.room = function (oldDist) {
        this.map.getCell(this.x - 1, this.y - 1).wall();
        this.map.getCell(this.x + 1, this.y - 1).wall();
        this.map.getCell(this.x - 1, this.y + 1).wall();
        this.map.getCell(this.x + 1, this.y + 1).wall();
        this.left;
        this.right;
        this.up;
        this.down;
        this.dist = Math.min(this.dist, oldDist + 1);
        return this.icon(ROOM);
    };
    Cell.prototype.follow = function (regex, context) {
        if (context === void 0) { context = []; }
        // console.log("following ", regex);
        var current = this;
        while (regex.length) {
            // console.log("\n", regex.join(""), "context ", context.map((cell) => cell.key).join(", "));
            print(this.map);
            var c = regex.shift();
            if (c.match(/[NSEW]/)) {
                current = current.move(c);
                // console.log("match ", c, " now ", current.key);
            }
            else if (c === "(") {
                context = context.concat([current]);
                // console.log("new branch from ", current.key);
            }
            else if (c === "|") {
                var last = context.pop();
                // console.log("switch - back to ", last.key);
                last.follow(regex.slice(), context.concat([last]));
                // skip ahead until we're at the correct depth for this path
                // console.log("skipping ahead from ", regex.length);
                var depth = 1;
                while (depth) {
                    var d = regex.shift();
                    if (d === "(")
                        depth++;
                    if (d === ")")
                        depth--;
                }
                // console.log("to ", regex.length);
            }
            else if (c === ")") {
                // console.log("pop)");
                context.pop();
            }
        }
    };
    Cell.prototype.cheat = function (regex) {
        var current = this;
        var stack = [current];
        for (var _i = 0, regex_1 = regex; _i < regex_1.length; _i++) {
            var c = regex_1[_i];
            print(this.map);
            if (c.match(/[NSEW]/)) {
                current = current.move(c);
            }
            else if (c === "(") {
                stack.push(current);
            }
            else if (c === ")") {
                current = stack.pop();
            }
            else if (c === "|") {
                current = stack[stack.length - 1];
            }
        }
    };
    Cell.prototype.move = function (dir) {
        switch (dir) {
            case "N":
                return this.upDoor();
            case "E":
                // console.log("move e");
                return this.rightDoor();
            case "S":
                return this.downDoor();
            case "W":
                return this.leftDoor();
        }
        return this; // just to shut up TypeScript
    };
    Cell.prototype.upDoor = function () {
        var door = this.up.icon(DOOR2);
        door.left.wall();
        door.right.wall();
        return door.up.room(this.dist);
    };
    Cell.prototype.downDoor = function () {
        var door = this.down.icon(DOOR2);
        door.left.wall();
        door.right.wall();
        return door.down.room(this.dist);
    };
    Cell.prototype.leftDoor = function () {
        var door = this.left.icon(DOOR);
        door.up.wall();
        door.down.wall();
        return door.left.room(this.dist);
    };
    Cell.prototype.rightDoor = function () {
        var door = this.right.icon(DOOR);
        door.up.wall();
        door.down.wall();
        return door.right.room(this.dist);
    };
    return Cell;
}());
function print(map) {
    var out = [];
    for (var y = 0; y <= map.yRange; y++) {
        var row = [];
        for (var x = 0; x <= map.xRange; x++) {
            row.push(" ");
        }
        out.push(row);
    }
    map.cells.forEach(function (cell) {
        var x = cell.x - map.minX;
        var y = cell.y - map.minY;
        out[y][x] = cell.i;
    });
    out.unshift([]);
    out.push([]);
    console.log(out.map(function (row) { return row.join(""); }).join("\n"));
}
var tests = [
    "^WNE$",
    "ENWWW(NEEE|SSE(EE|N))",
    "ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN",
    "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$",
    "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$",
    input
];
for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
    var test_1 = tests_1[_i];
    test_1 = test_1.replace("^", "").replace("$", "");
    console.log(test_1.substr(0, 100));
    var map = new Grid();
    var start = map
        .getCell(0, 0)
        .room(0)
        .icon(POS);
    start.dist = 0;
    start.cheat(test_1.split(""));
    map.finish();
    // print(map);
}
//# sourceMappingURL=20.js.map