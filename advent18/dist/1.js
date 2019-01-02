#!/usr/bin/env npx ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var input = fs.readFileSync("input1.txt", "utf8");
var floor = 0;
var UP = "(";
var DOWN = ")";
var BASEMENT = -1;
var ups = input.replace(/\)/g, "");
var downs = input.replace(/\(/g, "");
floor = ups.length - downs.length;
console.log("Floor: ", floor);
floor = 0;
for (var p = 0; p < input.length; p++) {
    var c = input[p];
    if (c === UP)
        floor++;
    else
        floor--;
    if (floor === BASEMENT) {
        console.log("Basement reached at: ", p + 1);
        break;
    }
}
//# sourceMappingURL=1.js.map