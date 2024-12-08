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
import { arrSum, Cell, Grid, mapNum } from "./util";
const input = fs.readFileSync("input7.txt", "utf8");
const test = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

type Equation = {
  total: number;
  nums: number[];
};

function parseInput(input: string): Equation[] {
  return input.split("\n").map((line) => {
    const [left, right] = line.split(": ");
    const total = parseInt(left);
    const nums = right.split(" ").map(mapNum);
    return { total, nums };
  });
}

function canWork(e: Equation, canConcat = false): boolean {
  const queue: { acc: number; rem: number[] }[] = [
    { acc: 0, rem: e.nums.slice(0) },
  ];
  while (queue.length) {
    const { acc, rem } = queue.pop()!;
    if (acc === e.total && rem.length === 0) {
      return true;
    }
    const next = rem.shift();
    if (next) {
      queue.push({ acc: acc + next, rem: rem.slice(0) });
      queue.push({ acc: acc * next, rem: rem.slice(0) });
      if (canConcat) {
        queue.push({
          acc: parseInt(acc.toString() + next.toString()),
          rem: rem.slice(0),
        });
      }
    }
  }
  return false;
}

function part1(input: string): number {
  const equations = parseInput(input);
  return arrSum(equations.filter((e) => canWork(e)).map((e) => e.total));
}

function part2(input: string): number {
  const equations = parseInput(input);
  return arrSum(equations.filter((e) => canWork(e, true)).map((e) => e.total));
}

const t = part1(test);
// 2437272033619 too high
if (t == 3749) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 11387) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
