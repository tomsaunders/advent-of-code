#!/usr/bin/env npx ts-node --pretty
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var input = fs.readFileSync("input1.txt", "utf8");
var ins = input.split(", ");
var Dir;
(function (Dir) {
    Dir[Dir["N"] = 0] = "N";
    Dir[Dir["E"] = 1] = "E";
    Dir[Dir["S"] = 2] = "S";
    Dir[Dir["W"] = 3] = "W";
    Dir["R"] = "R";
    Dir["L"] = "L";
})(Dir || (Dir = {}));
var dir = Dir.N;
var right = new Map();
right.set(Dir.N, Dir.E);
right.set(Dir.E, Dir.S);
right.set(Dir.S, Dir.W);
right.set(Dir.W, Dir.N);
var left = new Map();
left.set(Dir.N, Dir.W);
left.set(Dir.W, Dir.S);
left.set(Dir.S, Dir.E);
left.set(Dir.E, Dir.N);
var px = 0;
var py = 0;
for (var _i = 0, ins_1 = ins; _i < ins_1.length; _i++) {
    var turn = ins_1[_i];
    var t = turn.substring(0, 1);
    var l = parseInt(turn.substring(1), 10);
    if (t === Dir.R) {
        dir = right.get(dir);
    }
    else if (t === Dir.L) {
        dir = left.get(dir);
    }
    switch (dir) {
        case Dir.N:
            py -= l;
            break;
        case Dir.E:
            px += l;
            break;
        case Dir.S:
            py += l;
            break;
        case Dir.W:
            px -= l;
            break;
    }
    console.log(turn, t, l, "Now at " + px + "," + py);
}
console.log(Math.abs(px) + Math.abs(py));
//# sourceMappingURL=1.js.map