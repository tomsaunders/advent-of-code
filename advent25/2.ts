#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day 2
 *
 * Summary: Parse a series of start and finish ranges to work out which numbers match a rule. Sum the numbers.
 * Escalation: Change the rule.
 * Naive:  N/A
 * Solution:
 *  1. Is the number identical in the first and second half? Split the string and check.
 *  2. Is the number a smaller number repeated n times with no additional numbers? Remove the smaller number until it can't be found and see if there's any remainder.
 * Bugs introduced by using includes to search the rest of the string instead of whether the rest of the string started with the sequence.
 *
 * Keywords: input parsing, string searching
 * References: N/A
 */
import * as fs from "fs";
import { Cell, Grid } from "./util";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

function parseInput(input: string): [number, number][] {
  return input.split(",").map((s) => {
    const [start, end] = s
      .split("-")
      .map((n) => n.trim())
      .map((n) => parseInt(n, 10));
    return [start, end];
  });
}

function isInvalid(numberString: string): boolean {
  const halfLength = numberString.length / 2;
  return (
    numberString.substring(0, halfLength) === numberString.substring(halfLength)
  );
}

function isInvalid2(numberString: string): boolean {
  const halfLength = numberString.length / 2;
  for (let i = 1; i <= halfLength; i++) {
    const seq = numberString.substring(0, i);
    let x = numberString;
    while (x.indexOf(seq) === 0) {
      x = x.replace(seq, "");
    }
    if (x.length === 0) {
      return true;
    }
  }
  return false;
}

function part1(input: string): number {
  const x = parseInput(input);
  let invalidSum = 0;

  x.forEach(([start, end]) => {
    for (let n = start; n <= end; n++) {
      const s = n.toString();
      if (isInvalid(s)) {
        invalidSum += n;
      }
    }
  });
  return invalidSum;
}

function part2(input: string): number {
  const x = parseInput(input);
  let invalidSum = 0;

  x.forEach(([start, end]) => {
    for (let n = start; n <= end; n++) {
      const s = n.toString();
      if (isInvalid2(s)) {
        invalidSum += n;
      }
    }
  });
  return invalidSum;
}

const t = part1(test);
if (t == 1227775554) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 4174379265) {
  console.log("------");
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
