#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day 3
 *
 * Summary: Regex to find and multiply pairs of numbers in a string
 * Escalation: Add Do and dont flags to filter the string
 * Naive:  N/A
 * Solution:
 *  1. Regex! Find all the valid instructions and multiply the pairs
 *  2. Pre-process the string to obey the do and dont instructions, then call the part 1 function
 *
 * Keywords: simple rules, regex
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input3.txt", "utf8");
const test = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const test2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

function parseInput(input: string): string[] {
  const regex = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/g);
  return input.match(regex) as string[];
}

function part1(input: string): number {
  const validMulInstructions = parseInput(input);
  const xyPairs = validMulInstructions.map((mul) =>
    mul.replace("mul(", "").replace(")", "").split(",").map(mapNum),
  );
  return xyPairs.reduce((sum, [x, y]) => sum + x * y, 0);
}

function part2(input: string): number {
  let inputCleaned = "";
  let on = true;
  for (let i = 0; i < input.length; i++) {
    if (input.slice(i, i + 7) === "don't()") {
      on = false;
      i += 6;
    } else if (input.slice(i, i + 4) === "do()") {
      on = true;
      i += 3;
    } else if (on) {
      inputCleaned += input[i];
    }
  }
  return part1(inputCleaned);
}

const t = part1(test);
if (t == 161) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test2);
if (t2 == 48) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
