#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 10
 *
 * Summary: Rearrange an array according to some rules
 * Escalation:
 * Solution: Create a new array and handle the subreverse by a second loop
 *
 *
 * Keywords:
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input10.txt", "utf8");

function parseInput(input: string): number[] {
  return input.split(",").map(mapNum);
}

function part1(len: number, input: string): number {
  let list = new Array(len).fill(0).map((v, i) => i);
  // Reverse the order of that length of elements in the list, starting with the element at the current position.
  // Move the current position forward by that length plus the skip size.
  // Increase the skip size by one.
  let skipSize = 0;
  let idx = 0;

  const instructions = parseInput(input);
  for (let i = 0; i < instructions.length; i++) {
    const length = instructions[i];
    const nu = list.slice(0);
    for (let j = 0; j < length; j++) {
      const jdx = idx + j;
      const rdx = idx + length - 1 - j;
      nu[jdx % list.length] = list[rdx % list.length];
    }
    list = nu;
    idx += length + skipSize;
    skipSize++;
  }
  return list[0] * list[1];
}

function part2(len: number, input: string): number {
  const instructions = parseInput(input);
  return 0;
}

const t = part1(5, "3, 4, 1, 5");
if (t === 12) {
  console.log("part 1 answer", part1(256, input));
  const t2 = part2(5, "1");
  if (t2 === 10) {
    console.log("part 2 answer", part2(256, input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
