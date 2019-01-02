#!/usr/bin/env npx ts-node --pretty
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8");
const lines = input.split("\n");

enum Dir {
  U = "U",
  D = "D",
  R = "R",
  L = "L"
}

const grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const twog = [
  [null, null, 1, null, null],
  [null, 2, 3, 4, null],
  [5, 6, 7, 8, 9],
  [null, "A", "B", "C", null],
  [null, null, "D", null, null]
];

const getCode = (grid: any[][], lines: string[], px: number, py: number): string => {
  let code = "";
  for (const line of lines) {
    for (let m = 0; m < line.length; m++) {
      let c = line[m];
      let tx = px;
      let ty = py;
      if (c == Dir.U) {
        ty--;
      } else if (c == Dir.L) {
        tx--;
      } else if (c == Dir.D) {
        ty++;
      } else if (c == Dir.R) {
        tx++;
      }
      if (grid[ty] && grid[ty][tx]) {
        px = tx;
        py = ty;
      }
    }
    code += grid[py][px];
  }
  return code;
};

console.log(getCode(grid, lines, 1, 1));
console.log(getCode(twog, lines, 0, 2));
