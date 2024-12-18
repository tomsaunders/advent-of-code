#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  Rerun part 1 many times
 * Solution:
 *  1.
 *  2. Use path algorithm which includes info on whether or not a cell is on a path and only recalc if a new wall is on the path
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid, mapNum, SPACE, WALL, XYCoord } from "./util";
const input = fs.readFileSync("input18.txt", "utf8");
const test = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

function parseInput(input: string): XYCoord[] {
  return input.split("\n").map((l) => l.split(",").map(mapNum) as XYCoord);
}

function part1(input: string, size: number, slice: number): number {
  const walls = parseInput(input);
  const grid = new Grid();
  for (let x = 0; x <= size; x++) {
    for (let y = 0; y <= size; y++) {
      grid.addCell(new Cell(grid, x, y, 0, SPACE));
    }
  }

  walls.slice(0, slice).forEach(([x, y]) => {
    const c = grid.getCell(x, y)!;
    c.type = WALL;
  });
  grid.init();
  // grid.draw();
  return grid.shortestPath(grid.getCell(0, 0)!, grid.getCell(size, size)!);
}

function part2(input: string, size: number): string {
  const x = parseInput(input);
  for (let i = Math.round(x.length / 2); i < x.length; i++) {
    // just added
    const ans = x[i].join(",");
    const p = part1(input, size, i + 1);
    if (p === 9999) {
      return ans;
    }
  }
  return "error";
}

const t = part1(test, 6, 12);
if (t == 22) {
  console.log("part 1 answer", part1(input, 70, 1024));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test, 6);
if (t2 == "6,1") {
  console.log("part 2 answer", part2(input, 70));
} else {
  console.log("part 2 test fail", t2);
}
