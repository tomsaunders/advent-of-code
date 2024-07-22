#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 1
 *
 * Summary: Sum the numbers in a string that are the same as the number in the next position
 * Escalation: Increase the offset of the number
 * Solution: Simple loops, handle wrap around by repeating the string.
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input1.txt", "utf8");
const test: Record<string, number> = {
  "1122": 3,
  "1111": 4,
  "1234": 0,
  "91212129": 9,
};
const test2: Record<string, number> = {
  "1212": 6,
  "1221": 0,
  "123425": 4,
  "123123": 12,
  "12131415": 4,
};

function parseInput(input: string): string {
  return input + input; // handle wrap around case
}

function sumDigitMatches(input: string, offset = 1): number {
  const str = parseInput(input);
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    if (str[i] === str[i + offset]) {
      sum += parseInt(str[i]);
    }
  }
  return sum;
}

function part1(input: string): number {
  return sumDigitMatches(input);
}

function part2(input: string): number {
  return sumDigitMatches(input, input.length / 2);
}

if (Object.entries(test).every(([input, result]) => part1(input) === result)) {
  console.log("part 1 answer", part1(input));
  if (Object.entries(test2).every(([input, result]) => part2(input) === result)) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail");
  }
} else {
  console.log("part 1 test fail");
}
