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
const input = fs.readFileSync("input.txt", "utf8");
const test = ``;

function parseInput(input: string): string[] {
  return input.split("\n");
}

function part1(input: string): number {
  const x = parseInput(input);
  return 0;
}

function part2(input: string): number {
  const x = parseInput(input);
  return 0;
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
