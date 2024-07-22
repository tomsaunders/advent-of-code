#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 5
 *
 * Summary: CPU instruction parsing
 * Escalation: Sum the even divisors in a row
 * Solution: Basic parsing and looping
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `0
3
0
1
-3`;

function parseInput(input: string): number[] {
  return input.split("\n").map(mapNum);
}

function part1(input: string): number {
  const jumps = parseInput(input);
  let offset = 0;
  let steps = 0;
  while (offset >= 0 && offset < jumps.length) {
    let i = offset;
    offset += jumps[i];
    jumps[i]++;
    steps++;
  }
  return steps;
}

function part2(input: string): number {
  const jumps = parseInput(input);
  let offset = 0;
  let steps = 0;
  while (offset >= 0 && offset < jumps.length) {
    let i = offset;
    offset += jumps[i];
    if (jumps[i] >= 3) {
      jumps[i]--;
    } else {
      jumps[i]++;
    }
    steps++;
  }
  return steps;
}

const t = part1(test);
if (t === 5) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 10) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
