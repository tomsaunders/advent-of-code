#!/usr/bin/env npx ts-node --pretty
// Lesson: sort returns an array but affects it in place, therefore the order of the inputs was affected
// and part 2 gave the wrong answer because things were no longer in the expected column

import * as fs from "fs";
const input = fs.readFileSync("input3.txt", "utf8");
const lines = input.split("\n");

const isPossible = (sides: number[]): boolean => {
  const sort = sides.slice(0).sort((a, b) => b - a);
  return sort[0] < sort[1] + sort[2];
};

const triangles: number[][] = [];

for (const line of lines) {
  const match = line.match(/\s*(\d*)\s*(\d*)\s*(\d*)\s*/);
  if (!match) continue;
  match.shift();
  triangles.push(match.map((v) => parseInt(v, 10)));
}

console.log(triangles.filter(isPossible).length);

let colPoss = 0;
for (let c = 0; c < 3; c++) {
  for (let r = 0; r < triangles.length; r += 3) {
    if (isPossible([triangles[r][c], triangles[r + 1][c], triangles[r + 2][c]])) {
      colPoss++;
    }
  }
}
console.log(colPoss);
