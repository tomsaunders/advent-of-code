#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 1
 *
 * Summary: Sum the input numbers
 * Escalation: Loop the inputs until a sum is repeated
 * Solution: Simple loops
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, mapNum } from "./util";
const input = fs.readFileSync("input1.txt", "utf8");
const test = `-1, -2, -3`.split(", ").join("\n");
const test2 = `7, +7, -2, -7, -4`.split(", ").join("\n");

function parseInput(input: string): number[] {
  return input.split("\n").map(mapNum);
}

function part1(input: string): number {
  const numbers = parseInput(input);
  return arrSum(numbers);
}

function part2(input: string): number {
  const numbers = parseInput(input);
  let sum = numbers[0];
  let i = 1;
  const seen: Record<number, true> = {};
  while (!seen[sum]) {
    seen[sum] = true;
    sum += numbers[i % numbers.length];
    i++;
  }
  return sum;
}

const t = part1(test);
if (t === -6) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === 14) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
