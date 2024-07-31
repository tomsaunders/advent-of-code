#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 11
 *
 * Summary: Grid traversal in a hexagonal shape
 * Escalation:
 * Solution:
 *
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input11.txt", "utf8");
const test: Record<string, number> = {
  "ne,ne,ne": 3,
  "ne,ne,sw,sw": 0,
  "ne,ne,s,s": 2,
  "se,sw,se,sw,sw": 3,
};

type HexDir = "n" | "ne" | "nw" | "s" | "se" | "sw";
type D = 0 | -1 | 1;
// Q R S
const vMap: Record<HexDir, [D, D, D]> = {
  n: [0, -1, 1],
  ne: [1, -1, 0],
  nw: [-1, 0, 1],
  s: [0, 1, -1],
  se: [1, 0, -1],
  sw: [-1, 1, 0],
};

function parseInput(input: string): HexDir[] {
  return input.split(",") as HexDir[];
}

function part1(input: string): number {
  const steps = parseInput(input);
  let q = 0,
    r = 0,
    s = 0;
  steps.forEach((h) => {
    const [dq, dr, ds] = vMap[h];
    q += dq;
    r += dr;
    s += ds;
  });
  const max = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
  return max;
}

function part2(input: string): number {
  const steps = parseInput(input);
  let q = 0,
    r = 0,
    s = 0;
  let max = 0;
  steps.forEach((h) => {
    const [dq, dr, ds] = vMap[h];
    q += dq;
    r += dr;
    s += ds;
    max = Math.max(max, Math.abs(q), Math.abs(r), Math.abs(s));
  });
  return max;
}

if (Object.entries(test).every(([input, result]) => part1(input) === result)) {
  console.log("part 1 answer", part1(input));
  console.log("part 2 answer", part2(input));
} else {
  console.log(
    "part 1 test fail",
    Object.entries(test).map(([input, result]) => [part1(input), "=", result])
  );
}
