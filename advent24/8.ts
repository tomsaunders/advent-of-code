#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
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
const input = fs.readFileSync("input8.txt", "utf8");
const test = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

function parseInput(input: string): Grid {
  return Grid.fromLines(input);
}

function part1(input: string): number {
  const g = parseInput(input);
  const uniqueFreqs = new Set(g.cells.map((c) => c.type));
  uniqueFreqs.delete(".");
  let found = new Set<string>();
  Array.from(uniqueFreqs.values()).forEach((k) => {
    const kCells = g.cells.filter((c) => c.type === k);
    for (let i = 0; i < kCells.length; i++) {
      for (let j = i + 1; j < kCells.length; j++) {
        const a = kCells[i];
        const b = kCells[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const aCell = g.getCell(a.x - dx, a.y - dy);
        const bCell = g.getCell(b.x + dx, b.y + dy);
        if (aCell) {
          found.add(aCell.xy);
        }
        if (bCell) {
          found.add(bCell.xy);
        }
      }
    }
  });
  return found.size;
}

function part2(input: string): number {
  const g = parseInput(input);
  const uniqueFreqs = new Set(g.cells.map((c) => c.type));
  uniqueFreqs.delete(".");
  let found = new Set<string>();
  Array.from(uniqueFreqs.values()).forEach((k) => {
    const kCells = g.cells.filter((c) => c.type === k);
    for (let i = 0; i < kCells.length; i++) {
      for (let j = i + 1; j < kCells.length; j++) {
        const a = kCells[i];
        const b = kCells[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let aCell: Cell | undefined = b;
        let bCell: Cell | undefined = a;
        while (aCell) {
          aCell = aCell.getCell(-dx, -dy);
          if (aCell) {
            found.add(aCell.xy);
          }
        }
        while (bCell) {
          bCell = bCell.getCell(dx, dy);
          if (bCell) {
            found.add(bCell.xy);
          }
        }
      }
    }
  });
  return found.size;
}

const t = part1(test);
if (t == 14) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 34) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
