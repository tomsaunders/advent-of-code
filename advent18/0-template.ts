#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 1
 *
 * Summary:
 * Escalation:
 * Solution:
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const test = ``;

function parseInput(input: string): string {
  return input + input; // handle wrap around case
}

function part1(input: string): number {
  const things = parseInput(input);
  return 0;
}

function part2(input: string): number {
  const things = parseInput(input);
  return 0;
}

const t = part1(test);
if (t === 1) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 1) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
