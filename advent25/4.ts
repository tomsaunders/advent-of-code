#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

function part1(input: string): number {
  const grid = parseInput(input);

  return grid.cells
    .filter((c) => c.type === "@")
    .filter((c) => {
      const adjacentRolls = c.allNeighbours.filter((n) => n.type === "@");
      return adjacentRolls.length < 4;
    }).length;
}

function part2(input: string): number {
  const grid = parseInput(input);

  function getRemovableCells(): Cell[] {
    return grid.cells
      .filter((c) => c.type === "@")
      .filter((c) => {
        const adjacentRolls = c.allNeighbours.filter((n) => n.type === "@");
        return adjacentRolls.length < 4;
      });
  }

  let remove = getRemovableCells();
  console.log("found x removable", remove.length);
  while (remove.length > 0) {
    remove.forEach((r) => {
      r.type = ".";
      r.visited = true;
    });
    grid.cells.forEach((c) => c.init(false));
    remove = getRemovableCells();
  }

  return grid.cells.filter((c) => c.visited).length;
}

const t = part1(test);
if (t == 13) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 43) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
