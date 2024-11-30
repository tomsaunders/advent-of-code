#!/usr/bin/env ts-node

import { knothash } from "./knothash";
import { Cell, Grid, WALL } from "./util";

/**
 * Advent of Code 2017 - Day 14
 *
 * Summary: Generate a 128x128 grid based on an input string and day 10's knothash function
 * Escalation: Count the groups of connected grid cells
 * Solution: Export knothash function and follow the rules to generate the grid, then leverage the grid utilities to do trivial BFS one unprocessed cell at a time.
 *
 * Keywords: Grid
 * References: Day 10
 */
const input: string = "ljoxqyyw";
const test: string = `flqrgnkx`;

function buildRows(input: string): string[] {
  return new Array(128)
    .fill(0)
    .map((v, i) => knothash(`${input}-${i}`))
    .map((hash) => {
      return hash
        .split("")
        .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
        .join("");
    });
}

function part1(input: string): number {
  const rows = buildRows(input);
  return rows.reduce((carry, row) => row.split("").filter((c) => c === "1").length + carry, 0);
}

function part2(input: string): number {
  const rows = buildRows(input);
  const grid = Grid.fromLines(rows);
  let unprocessed = grid.cells.find((g) => g.type === "1") as Cell;
  let count = 0;
  while (unprocessed) {
    const queue = [unprocessed];
    unprocessed.type = WALL;
    while (queue.length) {
      const next = queue.shift()!;
      next.directNeighbours.forEach((n) => {
        if (n.type === "1") {
          n.type = WALL;
          queue.push(n);
        }
      });
    }
    count++;
    unprocessed = grid.cells.find((g) => g.type === "1") as Cell;
  }

  return count;
}

const t = part1(test);
if (t === 8108) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 1242) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
