#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 2
 *
 * Summary: Parse instructions to see if a series of rows of numbers match a rule
 * Escalation: Also see if a row matches if a single element is removed
 * Naive:  N/A
 * Solution:
 *  1.  Turn the rule into an array filter and fix silly bugs
 *  2.  Extract rule into reusable function and apply it to the row + all permutations of removing a single element
 *
 * Keywords: simple rules, permutations
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

function parseInput(input: string): number[][] {
  return input.split("\n").map((line) => line.split(" ").map(mapNum));
}

function isSafe(row: number[]): boolean {
  const isAscending = row[0] < row[1];
  for (let i = 1; i < row.length; i++) {
    const left = row[i - 1];
    const right = row[i];
    if (isAscending && left > right) {
      return false; // 1 3 2 is not safe
    } else if (!isAscending && right > left) {
      return false; // 3 1 2 is not safe
    }
    const diff = Math.abs(right - left);
    if (diff == 0 || diff > 3) {
      return false;
    }
  }
  return true;
}

function part1(input: string): number {
  const rows = parseInput(input);
  return rows.filter(isSafe).length;
}

function part2(input: string): number {
  const rows = parseInput(input);

  return rows.filter((row) => {
    const poss = [row]; // start with the row itself
    // created all possible rows by removing one element
    for (let i = 0; i < row.length; i++) {
      const r = row.slice();
      r.splice(i, 1);
      poss.push(r);
    }
    // a row is safe if any of the possible rows is safe when a single item is removed
    return poss.find(isSafe);
  }).length;
}

const t = part1(test);
if (t == 2) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 4) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
