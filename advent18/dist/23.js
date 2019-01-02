#!/usr/bin/env npx ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var input = fs.readFileSync("input23.txt", "utf8");
var test = "pos=<0,0,0>, r=4\npos=<1,0,0>, r=1\npos=<4,0,0>, r=3\npos=<0,2,0>, r=1\npos=<0,5,0>, r=3\npos=<0,0,3>, r=1\npos=<1,1,1>, r=1\npos=<1,1,2>, r=1\npos=<1,3,1>, r=1";
var test2 = "pos=<10,12,12>, r=2\npos=<12,14,12>, r=2\npos=<16,12,12>, r=4\npos=<14,14,14>, r=6\npos=<50,50,50>, r=200\npos=<10,10,10>, r=5";
// const lines = test2.split("\n");
var lines = input.split("\n");
var Nanobot = /** @class */ (function () {
    function Nanobot(x, y, z, radius) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
    }
    Nanobot.prototype.canSee = function (other) {
        return this.dist(other.z, other.y, other.x) <= this.radius;
    };
    Nanobot.prototype.dist = function (z, y, x) {
        return Math.abs(this.y - y) + Math.abs(this.x - x) + Math.abs(this.z - z);
    };
    Nanobot.prototype.toString = function () {
        return this.x + "," + this.y + "," + this.z + " r" + this.radius;
    };
    return Nanobot;
}());
var bots = [];
var big = 0;
var b;
// let maxY = 0;
// let minY = 0;
// let maxX = 0;
// let minX = 0;
// let minZ = 0;
// let maxZ = 0;
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    line = line
        .replace("pos=<", "")
        .replace(">", "")
        .replace(" r=", "");
    var _a = line.split(",").map(function (value) { return parseInt(value, 10); }), x = _a[0], y = _a[1], z = _a[2], radius = _a[3];
    var bot = new Nanobot(x, y, z, radius);
    bots.push(bot);
    if (radius > big) {
        big = radius;
        b = bot;
    }
    // maxY = Math.max(maxY, y);
    // minY = Math.min(minY, y);
    // maxX = Math.max(maxX, x);
    // minX = Math.min(minX, x);
    // minZ = Math.min(minZ, z);
    // maxZ = Math.max(maxZ, z);
}
var inRange = bots.filter(function (bot) {
    return b.canSee(bot);
});
var key = function (x, y, z) {
    return [x, y, z].join(":");
};
var cells = new Map();
var max = 0;
var m = "";
var i = 0;
for (var _b = 0, bots_1 = bots; _b < bots_1.length; _b++) {
    var bot = bots_1[_b];
    var r = bot.radius;
    console.log("Checking " + i + " " + bot);
    for (var z = bot.z - r; z <= bot.z + r; z++) {
        for (var y = bot.y - r; y <= bot.y + r; y++) {
            for (var x = bot.x - r; x <= bot.x + r; x++) {
                if (bot.dist(z, y, z) <= r) {
                    var k = key(x, y, z);
                    var count = cells.has(k) ? cells.get(k) + 1 : 1;
                    cells.set(k, count);
                    if (count > max) {
                        max = count;
                        m = k;
                    }
                }
            }
        }
    }
    i++;
}
console.log(max + " at " + m);
//# sourceMappingURL=23.js.map