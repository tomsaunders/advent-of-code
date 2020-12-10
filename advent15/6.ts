#!/usr/bin/env ts-node
import * as fs from "fs";
const input = fs.readFileSync("input6.txt", "utf8");

const lines = input.split("\n");

const grid: boolean[][] = [];
const twog: number[][] = [];
for (let a = 0; a < 1000; a++) {
  const row: boolean[] = [];
  const two: number[] = [];
  for (let b = 0; b < 1000; b++) {
    row.push(false);
    two.push(0);
  }
  grid.push(row);
  twog.push(two);
}

for (let line of lines) {
  const match = line.match(
    /(toggle|turn on|turn off) (\d*),(\d*) through (\d*),(\d*)/
  );
  if (!match) continue;
  const instruction = match[1];
  const [, , fx, fy, tx, ty] = match.map((v) => parseInt(v, 10));
  for (let y = fy; y <= ty; y++) {
    for (let x = fx; x <= tx; x++) {
      if (instruction === "toggle") {
        grid[y][x] = !grid[y][x];
        twog[y][x] += 2;
      } else if (instruction === "turn on") {
        grid[y][x] = true;
        twog[y][x] += 1;
      } else {
        grid[y][x] = false;
        twog[y][x] = Math.max(0, twog[y][x] - 1);
      }
    }
  }
}

console.log(
  grid.reduce(
    (count, row) => row.reduce((rc, cell) => (cell ? rc + 1 : rc), count),
    0
  )
);
console.log(
  twog.reduce((count, row) => row.reduce((rc, cell) => rc + cell, count), 0)
);
