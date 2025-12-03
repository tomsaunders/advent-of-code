#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day 3
 *
 * Summary: Parse input into lines of digits, work out the largest 2 digit number that can be represented by the numbers in the line in some order
 * Escalation: Largest 12 digit number
 * Naive:
 * Solution:
 *  1. Hard coded first and second digit
 *  2. Array loop approach finding the largest digit at least n spaces from the end
 *
 * Keywords: looping, array slices
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input3.txt", "utf8");
const test = `987654321111111
811111111111119
234234234234278
818181911112111`;

type Bank = number[];

function parseInput(input: string): Bank[] {
  return input
    .split("\n")
    .map((line) => line.split("").map((n) => parseInt(n, 10)));
}

function part1(input: string): number {
  const banks = parseInput(input);
  const joltages = banks.map((bank) => {
    const leading = Math.max(...bank.slice(0, -1));
    const leadPos = bank.indexOf(leading);
    const second = Math.max(...bank.slice(leadPos + 1));
    return leading * 10 + second;
  });
  return arrSum(joltages);
}

function part2(input: string): number {
  const banks = parseInput(input);
  const joltages = banks.map((bank) => {
    const digits: number[] = [];
    let lastPos = -1;
    for (let i = 0; i < 12; i++) {
      const end = -11 + i;

      const leading = Math.max(
        ...bank.slice(lastPos + 1, end === 0 ? undefined : end),
      );
      lastPos = bank.indexOf(leading, lastPos + 1);
      digits.push(leading);
    }

    return parseInt(digits.join(""));
  });
  return arrSum(joltages);
}

const t = part1(test);
if (t == 357) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 3121910778619) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
