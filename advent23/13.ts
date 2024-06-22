#!/usr/bin/env ts-node
import * as fs from "fs";
import { Cell, Grid, PURP, RED, RESET, YELLOW, arrSum } from "./util";
const input = fs.readFileSync("input13.txt", "utf8");
const test = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

function getCol(lines: string[], col: number): string {
  const colarr = [""];

  lines.forEach((l) => {
    colarr.push(l[col]);
  });

  return colarr.join("");
}

function isReflection(rows: string[], index: number): boolean {
  let leftI = index;
  let rightI = index + 1;

  while (rows[leftI] && rows[rightI]) {
    if (rows[leftI] != rows[rightI]) {
      return false; // no match
    }
    leftI--;
    rightI++;
  }
  return true;
}

function isReflectionDiff(rows: string[], index: number): number {
  let leftI = index;
  let rightI = index + 1;

  let diff = 0;
  while (rows[leftI] && rows[rightI] && diff < 2) {
    for (let i = 0; i < rows[leftI].length; i++) {
      if (rows[leftI][i] !== rows[rightI][i]) diff++;
    }
    leftI--;
    rightI++;
  }
  return diff;
}

function makeCols(rows: string[]): string[] {
  const cols = [];
  for (let c = 0; c < rows[0].length; c++) {
    cols.push(getCol(rows, c));
  }
  return cols;
}

function checkBlock(rows: string[]): number {
  const cols = makeCols(rows);

  for (let r = 0; r < rows.length - 1; r++) {
    if (isReflection(rows, r)) {
      return (r + 1) * 100;
    }
  }

  for (let c = 0; c < cols.length - 1; c++) {
    if (isReflection(cols, c)) {
      return c + 1;
    }
  }

  return 0;
}

function checkBlock2(rows: string[]): number {
  const cols = makeCols(rows);

  for (let r = 0; r < rows.length - 1; r++) {
    if (isReflectionDiff(rows, r) === 1) {
      return (r + 1) * 100;
    }
  }

  for (let c = 0; c < cols.length - 1; c++) {
    if (isReflectionDiff(cols, c) === 1) {
      return c + 1;
    }
  }

  return 0;
}

function makeBlocks(input: string): string[][] {
  const lines = input.split("\n");
  const blocks: string[][] = [];
  let block = [];
  while (lines.length) {
    const line = lines.shift();
    if (line?.length) {
      block.push(line);
    } else {
      blocks.push(block);
      block = [];
    }
  }
  blocks.push(block);
  return blocks;
}

function part1(input: string): number {
  const blocks = makeBlocks(input);
  return arrSum(blocks.map(checkBlock));
}

function part2(input: string, borderX = 0, borderY = 0): number {
  const blocks = makeBlocks(input);
  return arrSum(blocks.map(checkBlock2));
}

const t = part1(test);
if (t == 405) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 == 400) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
