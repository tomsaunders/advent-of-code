#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");

let floor = 0;
const UP = "(";
const DOWN = ")";
const BASEMENT = -1;
const ups = input.replace(/\)/g, "");
const downs = input.replace(/\(/g, "");

floor = ups.length - downs.length;
console.log("Floor: ", floor);

floor = 0;
for (let p = 0; p < input.length; p++) {
  const c = input[p];
  if (c === UP) floor++;
  else floor--;
  if (floor === BASEMENT) {
    console.log("Basement reached at: ", p + 1);
    break;
  }
}
