#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const lines = input.split("\n").map((line) => parseInt(line.trim(), 10));

let diff = 0;
let last = 0;
for (const d of lines) {
  if (d > last) {
    diff++;
  }
  last = d;
}
console.log(diff - 1);

diff = 0;
let windowSum = lines[0] + lines[1] + lines[2];
for (let i = 1; i < lines.length - 2; i++) {
  const thisSum = lines[i] + lines[i + 1] + lines[i + 2];
  if (thisSum > windowSum) {
    diff++;
  }
  windowSum = thisSum;
}
console.log(diff);
