#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day 5
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

type RangeNum = {
  dir: "F" | "T";
  num: number;
};
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
      let [from, to, u] = oldRanges[r];
      if (u) continue;
      for (let n = r + 1; n < oldRanges.length; n++) {
        const [fromN, toN, used] = oldRanges[n];
        console.log("comparing", [from, to], "and", [fromN, toN]);
        if (used) continue;
        if (fromN < from && toN > to) {
          // 10-30 overtakes 15-20 to become 10-30
          from = fromN;
          to = toN;
          oldRanges[n][2] = true;
        } else if (fromN > from && fromN < to && toN > to) {
          // 12-20 overtakes 10-14 to become 10-20
          to = toN;
          oldRanges[n][2] = true;
        } else if (fromN < from && toN > fromN && toN > to) {
          // 10-14 overtakes 12-20 to become 10-20
          from = fromN;
          oldRanges[n][2] = true;
          // } else if (fromN < from && to > from) {
          //   // 10-14 overtakes 12-16 to become 10-16
          //   from = fromN;
          //   console.log("from is now", fromN);
          //   oldRanges[n][2] = true;
          // } else if (toN > to && from > fromN) {
          //   to = toN;
          //   console.log("to is now", toN);
          //   oldRanges[n][2] = true;
        }
      }
      ranges.push([from, to, false]);
    }
    console.log(ranges);
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
