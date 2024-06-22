#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input11.txt", "utf8");
const test = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

class Galaxy {
  public x: number;
  public y: number;

  constructor(public c: Cell) {
    this.x = c.x;
    this.y = c.y;
  }
}

function cosmicExpansion(input: string, expandBy: number): number {
  const grid = Grid.fromLines(input);

  const galaxies = grid.cells.filter((c) => c.type == "#").map((c) => new Galaxy(c));

  for (let x = grid.minX; x <= grid.maxX; x++) {
    const colCells = grid.cells.filter((c) => c.x == x);
    if (!colCells.find((c) => c.type == "#")) {
      galaxies.forEach((g) => {
        if (g.c.x > x) {
          g.x += expandBy;
        }
      });
    }
  }
  for (let y = grid.minY; y <= grid.maxY; y++) {
    const rowCells = grid.cells.filter((c) => c.y == y);
    if (!rowCells.find((c) => c.type == "#")) {
      galaxies.forEach((g) => {
        if (g.c.y > y) {
          g.y += expandBy;
        }
      });
    }
  }

  const dists: number[] = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const a = galaxies[i];
      const b = galaxies[j];
      dists.push(Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    }
  }

  return arrSum(dists);
}

function part1(input: string): number {
  return cosmicExpansion(input, 1);
}

function part2(input: string): number {
  return cosmicExpansion(input, 1000000 - 1);
}

const t = part1(test);
if (t == 374) {
  console.log("part 1 answer", part1(input));
  // 10 times bigger is adding 9 rows, so do -1
  const t2a = cosmicExpansion(test, 10 - 1);
  const t2b = cosmicExpansion(test, 100 - 1);

  if (t2a == 1030 && t2b == 8410) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2a, t2b);
  }
} else {
  console.log("part 1 test fail", t);
}
