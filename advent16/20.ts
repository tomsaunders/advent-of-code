#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input20.txt", "utf8");
const lines = input.split("\n");
const ranges = lines.map((l) => l.split("-").map((s) => parseInt(s, 10)));
ranges.sort((a, b) => a[0] - b[0]);
let lowest = 1;

let part1 = 0;
let allowed = 0;
for (const r of ranges) {
  if (r[0] <= lowest) {
    lowest = Math.max(lowest, r[1] + 1);
  } else {
    if (!part1) part1 = lowest;
    allowed += r[0] - lowest;
    lowest = r[1] + 1;
  }
}
console.log("Part 1:", part1);
console.log("Part 2:", allowed);
