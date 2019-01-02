"use strict";
exports.__esModule = true;
var ROCKY = ".";
var WET = "=";
var NARROW = "|";
var MOUTH = "M";
var TARGET = "T";
var TORCH = "H";
var GEAR = "G";
var NEITHER = "O";
// INPUT
var depth = 4080;
var target = [14, 785];
// TEST
// const depth = 510;
// const target = [10, 10];
var Cave = /** @class */ (function() {
  function Cave(depth, targetX, targetY) {
    this.depth = depth;
    this.targetX = targetX;
    this.targetY = targetY;
    this.cells = [];
    var risk = 0;
    for (var y = 0; y <= targetY; y++) {
      this.cells.push([]);
      for (var x = 0; x <= targetX; x++) {
        var cell = new Cell(x, y, this);
        this.cells[y].push(cell);
        risk += cell.risk;
      }
    }
    this.print();
  }
  Cave.prototype.getCell = function(x, y) {
    if (!this.cells[y] || !this.cells[y][x]) {
      return undefined;
    }
    return this.cells[y][x];
  };
  Cave.prototype.getMove = function(cell, cost, tool) {
    // todo cache??
    return new Move(cell, cost, tool);
  };
  Cave.prototype.print = function() {
    var out = [];
    for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
      var row = _a[_i];
      var r = [];
      for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
        var cell = row_1[_b];
        r.push(cell.icon);
      }
      out.push(r.join(""));
    }
    out.push("");
    console.log(out.join("\n"));
  };
  return Cave;
})();
var Cell = /** @class */ (function() {
  function Cell(x, y, cave) {
    this.x = x;
    this.y = y;
    this.cave = cave;
    var g = 0;
    if (this.x === 0 && this.y === 0) {
      g = 0;
    } else if (this.x === this.cave.targetX && this.y === this.cave.targetY) {
      g = 0;
    } else if (this.y === 0) {
      g = this.x * 16807;
    } else if (this.x === 0) {
      g = this.y * 48271;
    } else {
      g = this.cave.getCell(this.x - 1, this.y).erosion * this.cave.getCell(this.x, this.y - 1).erosion;
    }
    this.geologic = g;
  }
  Object.defineProperty(Cell.prototype, "erosion", {
    get: function() {
      return (this.geologic + this.cave.depth) % 20183;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Cell.prototype, "type", {
    get: function() {
      switch (this.erosion % 3) {
        case 0:
          return ROCKY;
        case 1:
          return WET;
        case 2:
          return NARROW;
      }
      return "";
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Cell.prototype, "icon", {
    get: function() {
      if (this.x === 0 && this.y === 0) {
        return MOUTH;
      } else if (this.x === this.cave.targetX && this.y === this.cave.targetY) {
        return TARGET;
      }
      return this.type;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Cell.prototype, "risk", {
    get: function() {
      return this.erosion % 3;
    },
    enumerable: true,
    configurable: true
  });
  Cell.prototype.canAccess = function(tool) {
    switch (this.erosion % 3) {
      case 0:
        return tool === GEAR || tool === TORCH;
      case 1:
        return tool === GEAR || tool === NEITHER;
      case 2:
        return tool === TORCH || tool === NEITHER;
    }
    return false;
  };
  Object.defineProperty(Cell.prototype, "validTools", {
    get: function() {
      switch (this.erosion % 3) {
        case 0:
          return [TORCH, GEAR];
        case 1:
          return [GEAR, NEITHER];
        case 2:
          return [TORCH, NEITHER];
      }
      return [];
    },
    enumerable: true,
    configurable: true
  });
  Cell.prototype.toString = function() {
    return this.x + "," + this.y;
  };
  Cell.prototype.equals = function(other) {
    return this.x === other.x && this.y === other.y;
  };
  Object.defineProperty(Cell.prototype, "d", {
    get: function() {
      var t = this.validTools.join(",");
      return this.icon + " @ " + this.toString() + " (" + t + ")";
    },
    enumerable: true,
    configurable: true
  });
  return Cell;
})();
var Move = /** @class */ (function() {
  function Move(cell, cost, tool) {
    this.cell = cell;
    this.cost = cost;
    this.tool = tool;
  }
  Object.defineProperty(Move.prototype, "neighbours", {
    get: function() {
      var moves = [];
      var cave = this.cell.cave;
      var x = this.cell.x;
      var y = this.cell.y;
      var cells = [cave.getCell(x, y + 1), cave.getCell(x + 1, y), cave.getCell(x, y - 1), cave.getCell(x - 1, y)];
      for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
        var cell = cells_1[_i];
        if (!cell) {
          continue;
        }
        if (cell.canAccess(this.tool)) {
          moves.push(cave.getMove(cell, 1, this.tool));
        } else {
          for (var _a = 0, _b = cell.validTools; _a < _b.length; _a++) {
            var valid = _b[_a];
            moves.push(cave.getMove(cell, 7, valid));
          }
        }
      }
      return moves;
    },
    enumerable: true,
    configurable: true
  });
  Move.prototype.dist = function(other) {
    return Math.abs(this.cell.y - other.cell.y) + Math.abs(this.cell.x - other.cell.x);
  };
  Move.prototype.canAccess = function(other) {
    return other.cell.canAccess(this.tool);
  };
  Move.prototype.heuristic = function(other) {
    var dist = this.dist(goal); // optimistic manhattan
    if (!this.canAccess(goal)) {
      // cant access with the current tool, would have to switch at least once
      return dist + 7;
    }
    {
      return dist;
    }
  };
  Move.prototype.toString = function() {
    return "Moving to " + this.cell.d + " with " + this.tool + " and cost " + this.cost + "\n";
  };
  Move.prototype.equals = function(other) {
    return this.cell.equals(other.cell) && this.tool === other.tool;
  };
  Object.defineProperty(Move.prototype, "key", {
    get: function() {
      return this.cell + " - " + this.tool;
    },
    enumerable: true,
    configurable: true
  });
  return Move;
})();
var MoveSet = /** @class */ (function() {
  function MoveSet() {
    this.arr = [];
  }
  MoveSet.prototype.add = function(value) {
    var found = this.has(value);
    if (!found) {
      this.arr.push(value);
    }
    return this;
  };
  MoveSet.prototype.has = function(value) {
    var found = false;
    this.arr.forEach(function(move) {
      if (move.equals(value)) {
        found = true;
      }
    });
    return found;
  };
  MoveSet.prototype["delete"] = function(value) {
    this.arr = this.arr.filter(function(move) {
      return !move.equals(value);
    });
    return this;
  };
  Object.defineProperty(MoveSet.prototype, "size", {
    get: function() {
      return this.arr.length;
    },
    enumerable: true,
    configurable: true
  });
  return MoveSet;
})();
var MoveMap = /** @class */ (function() {
  function MoveMap() {
    this.keyMap = new Map();
    this.objMap = new Map();
  }
  MoveMap.prototype.set = function(key, value) {};
  return MoveMap;
})();
var tx = target[0];
var ty = target[1];
var cave = new Cave(depth, tx, ty);
var start = new Move(cave.getCell(0, 0), 0, TORCH);
var goal = new Move(cave.getCell(tx, ty), 1, TORCH);
var Path = /** @class */ (function() {
  function Path(start, goal) {
    this.start = start;
    this.goal = goal;
    this.arr = [];
    this.arr.push(start);
  }
  Object.defineProperty(Path.prototype, "end", {
    get: function() {
      return this.arr[this.arr.length - 1];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "heuristic", {
    get: function() {
      return this.end.dist(this.goal);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "score", {
    get: function() {
      return this.arr.reduce(function(cost, move) {
        return cost + move.cost;
      }, 0);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "goalScore", {
    get: function() {
      var score = this.score;
      if (this.end.tool !== TORCH) {
        score += 7;
      }
      return score;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "optimistic", {
    get: function() {
      return this.score + this.end.heuristic(this.goal);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "short", {
    get: function() {
      var prevTool = "";
      var out = this.arr.length + " move path with cost " + this.score + "\n ";
      for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
        var move = _a[_i];
        var c = "";
        if (prevTool !== move.tool) {
          prevTool = move.tool;
          c = move.tool + " ";
        }
        c += "(" + move.cell.x + "," + move.cell.y + ")";
        out += c;
      }
      return out;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Path.prototype, "vshort", {
    get: function() {
      return this.arr.length + " move path with cost " + this.score;
    },
    enumerable: true,
    configurable: true
  });
  Path.prototype.toString = function() {
    return this.arr.length + " move path with cost " + this.score + "\n" + this.arr.join("->");
  };
  Path.prototype.move = function(next) {
    var found = false;
    this.arr.forEach(function(move) {
      if (move.equals(next)) {
        found = true;
      }
    });
    if (found) {
      return undefined;
    }
    var np = new Path(this.start, this.goal);
    np.arr = this.arr.concat([next]);
    return np;
  };
  return Path;
})();
var nav = function(start, goal) {
  var closed = new Set();
  var open = new Set();
  open.add(new Path(start, goal));
  var prev = new Map();
  prev.set(start.key, 0);
  var getNext = function(open) {
    var min = 9999;
    var mm;
    open.forEach(function(path) {
      // console.log(`${path}`);
      var value = path.heuristic;
      if (value < min) {
        mm = path;
        min = value;
      }
    });
    return mm;
  };
  var e = 0;
  var minFound = 9999;
  var paths = [];
  while (open.size) {
    e++;
    var path = getNext(open);
    // console.log(`${e} ${path} ...  H ${path.heuristic} M ${minFound}`);
    var current = path.end;
    open["delete"](path);
    closed.add(path);
    if (current.cell.equals(goal.cell)) {
      var score = path.goalScore;
      if (score < minFound) {
        minFound = score;
      }
      paths.push(path);
      continue;
    }
    for (var _i = 0, _a = current.neighbours; _i < _a.length; _i++) {
      var n = _a[_i];
      var np = path.move(n);
      if (!np || closed.has(np)) {
        continue;
      }
      var previousToHere = prev.has(n.key) ? prev.get(n.key) : 9999;
      if (np.optimistic < minFound && np.score < previousToHere) {
        open.add(np);
        prev.set(n.key, np.score);
      }
    }
  }
  return paths;
};
var paths = nav(start, goal);
paths.forEach(function(path) {
  console.log(path.vshort + " To goal " + path.goalScore);
});
