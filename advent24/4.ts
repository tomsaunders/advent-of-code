#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 4
 *
 * Summary: Wordsearch "XMAS" in a 2D grid
 * Escalation: Wordsearch intersections of SAM on diagonals in the grid - an 'X-MAS'
 * Naive:  N/A
 * Solution:
 *  1. Parse into grid and search for lines of 4 cells in every direction from every X cell
 *  2. Same but lines of 3 that every A cell is in the middle of.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

function part1(input: string): number {
  const grid = parseInput(input);
  const xs = grid.cells.filter((c) => c.type === "X");

  function getWord(startCell: Cell, dx: number, dy: number): string {
    let cells: Cell[] = [startCell];
    let next = startCell.getCell(dx, dy);
    while (next && cells.length < 4) {
      cells.push(next);
      next = next.getCell(dx, dy);
    }
    return cells.map((c) => c.type).join("");
  }

  let count = 0;
  xs.forEach((xCell) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          const word = getWord(xCell, dx, dy);
          if (word === "XMAS") {
            count++;
          }
        }
      }
    }
  });
  return count;
}

function part2(input: string): number {
  const grid = parseInput(input);
  const aCells = grid.cells.filter((c) => c.type === "A");

  function getWord(a?: Cell, b?: Cell, c?: Cell): boolean {
    const w = `${a?.type}${b?.type}${c?.type}`;
    return w === "MAS" || w === "SAM";
  }

  return aCells.filter((aCell) => {
    const d1 = getWord(aCell.getCell(-1, -1), aCell, aCell.getCell(+1, 1));
    const d2 = getWord(aCell.getCell(+1, -1), aCell, aCell.getCell(-1, 1));

    return d1 && d2;
  }).length;
}

const t = part1(test);
if (t == 18) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 9) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
