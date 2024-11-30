#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 6
 *
 * Summary: Given a memory reallocation routine between blocks, calculate how long before it's in a loop.
 * Escalation: Once in a loop, how long is the loop cycle?
 * Solution: Basic parsing and looping. Part 1 needed a set because we just had to know a previously seen state, part 2 needed a map because the step # needed to be recorded with the state
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `0 2 7 0`;

function parseInput(input: string): number[] {
  return input
    .replace(/\t/g, " ")
    .split(" ")
    .filter((x) => !!x)
    .map(mapNum);
}

function part1(input: string): number {
  const banks = parseInput(input);
  const key = () => banks.join("-");
  const seen = new Set<string>();
  seen.add(key());

  const maxIdx = () => {
    const max = Math.max(...banks);
    return banks.findIndex((b) => b === max);
  };

  let k = key();
  seen.add(k);
  let m = 0,
    spread = 0,
    steps = 0;

  while (true) {
    m = maxIdx();
    spread = banks[m];
    banks[m] = 0;
    while (spread > 0) {
      m++;
      banks[m % banks.length]++;
      spread--;
    }

    steps++;
    k = key();
    if (seen.has(k)) {
      return steps;
    }
    seen.add(k);
  }
}

function part2(input: string): number {
  const banks = parseInput(input);
  const key = () => banks.join("-");
  const seen = new Map<string, number>();
  seen.set(key(), 0);

  const maxIdx = () => {
    const max = Math.max(...banks);
    return banks.findIndex((b) => b === max);
  };

  let k = key();

  let m = 0,
    spread = 0,
    steps = 0;
  seen.set(k, steps);

  while (true) {
    m = maxIdx();
    spread = banks[m];
    banks[m] = 0;
    while (spread > 0) {
      m++;
      banks[m % banks.length]++;
      spread--;
    }

    steps++;
    k = key();
    if (seen.has(k)) {
      return steps - seen.get(k)!;
    }
    seen.set(k, steps);
  }
}

const t = part1(test);
if (t === 5) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 4) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
