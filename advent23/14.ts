#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, SPACE, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input14.txt", "utf8");
const test = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const ROCK = "O";

function rollNorth(g: Grid): void {
  for (let x = g.minX; x <= g.maxX; x++) {
    for (let y = g.minY; y <= g.maxY; y++) {
      const cell = g.getCell(x, y);

      if (cell?.type == ROCK) {
        let n = cell.north;
        let c = cell;
        while (n?.isSpace) {
          n.type = ROCK;
          c.type = SPACE;
          c = n;
          n = n.north;
        }
      }
    }
  }
}

function rollEast(g: Grid): void {
  for (let y = g.minY; y <= g.maxY; y++) {
    for (let x = g.maxX; x >= g.minX; x--) {
      const cell = g.getCell(x, y);

      if (cell?.type == ROCK) {
        let n = cell.east;
        let c = cell;
        while (n?.isSpace) {
          n.type = ROCK;
          c.type = SPACE;
          c = n;
          n = n.east;
        }
      }
    }
  }
}

function rollSouth(g: Grid): void {
  for (let x = g.minX; x <= g.maxX; x++) {
    for (let y = g.maxY; y >= g.minY; y--) {
      const cell = g.getCell(x, y);

      if (cell?.type == ROCK) {
        let n = cell.south;
        let c = cell;
        while (n?.isSpace) {
          n.type = ROCK;
          c.type = SPACE;
          c = n;
          n = n.south;
        }
      }
    }
  }
}

function rollWest(g: Grid): void {
  for (let y = g.minY; y <= g.maxY; y++) {
    for (let x = g.minX; x <= g.maxX; x++) {
      const cell = g.getCell(x, y);

      if (cell?.type == ROCK) {
        let n = cell.west;
        let c = cell;
        while (n?.isSpace) {
          n.type = ROCK;
          c.type = SPACE;
          c = n;
          n = n.west;
        }
      }
    }
  }
}

function part1(input: string): number {
  const grid = Grid.fromLines(input);
  rollNorth(grid);

  const rocks = grid.cells.filter((c) => c.type == ROCK);
  const floorDist = grid.maxY + 1;

  return arrSum(rocks.map((r) => floorDist - r.y));
}

function part2(input: string): number {
  const grid = Grid.fromLines(input);

  const cycles = 1000000000;
  const seen: Record<string, number> = {};
  for (let i = 0; i < cycles; i++) {
    rollNorth(grid);
    rollWest(grid);
    rollSouth(grid);
    rollEast(grid);
    const hash = grid.hash;
    if (seen[hash]) {
      const diff = i - seen[hash];
      // console.log("Seen this before!", diff);
      const rem = cycles - i;
      const whole = Math.floor(rem / diff) * diff;
      i += whole;
      // console.log("Skipping forward ", whole);
    }
    seen[hash] = i;
    // grid.draw();
  }

  const rocks = grid.cells.filter((c) => c.type == ROCK);
  const floorDist = grid.maxY + 1;

  return arrSum(rocks.map((r) => floorDist - r.y));
}

const t = part1(test);
if (t == 136) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 64) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
