#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day 5
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2. Unify overlapping ranges
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

type Range = [number, number, boolean];

type Database = {
  ranges: Range[];
  available: number[];
};

function parseInput(input: string): Database {
  const lines = input.split("\n");
  const database: Database = { ranges: [], available: [] };
  for (const line of lines) {
    if (line.includes("-")) {
      const [from, to] = line.split("-").map((x) => parseInt(x));
      database.ranges.push([from, to, false]);
    } else if (line.trim() === "") {
    } else {
      database.available.push(parseInt(line));
    }
  }
  return database;
}

function part1(input: string): number {
  const d = parseInput(input);

  return d.available.filter((i) => {
    return !!d.ranges.find(([from, to]) => {
      return from <= i && to >= i;
    });
  }).length;
}

function part2(input: string): number {
  const d = parseInput(input);
  const s = new Set<number>();

  let ranges: Range[] = d.ranges;
  let oldCount = 0;
  let oldRanges = ranges.slice(0);

  while (oldCount != oldRanges.length) {
    oldCount = oldRanges.length;
    ranges = [];
    for (let r = 0; r < oldRanges.length; r++) {
      let [A1, A2, u] = oldRanges[r];
      if (u) continue;
      for (let n = r + 1; n < oldRanges.length; n++) {
        const [B1, B2, used] = oldRanges[n];
        if (used) continue;
        console.log("comparing", [A1, A2], "and", [B1, B2]);
        if (A1 <= B1 && A2 >= B2) {
          // A fully encloses B. Drop B.
          oldRanges[n][2] = true;
        } else if (B1 <= A1 && B2 >= A2) {
          // B fully encloses A. Make A B. Drop B.
          A1 = B1;
          A2 = B2;
          oldRanges[n][2] = true;
        } else if (A1 <= B1 && A2 >= B1 && A2 <= B2) {
          // overlap, increase A by the B end
          A2 = B2;
          oldRanges[n][2] = true;
        } else if (B1 <= A1 && A1 <= B2 && A2 >= B2) {
          // overlap, increase A by the B start
          A1 = B1;
          oldRanges[n][2] = true;
        }
      }
      ranges.push([A1, A2, false]);
    }
    oldRanges = ranges.slice(0);
  }

  return arrSum(ranges.map(([from, to]) => to - from + 1));
}

const t = part1(test);
if (t == 3) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 14) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
