#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 13
 *
 * Summary: Simulate 'firewall' state and evaluate how many intersections a 'packet' has with it.
 * Escalation: Find a time delay so that there are no intersections
 * Naive: Just loop through every possible delay - 140s
 * Solution: p1 modulo - but be careful to note that the movement is back and forth not wrapping around.
 * p2 faster (8s) - only check potential intersections with firewall, abort as soon as an intersection is found
 * p2 fasterer (4s) - compile to JS and run in browser. Interesting to see the overhead of ts-node.
 *
 * Keywords: Performance
 * References:
 */
import * as fs from "fs";
const input = fs.readFileSync("input13.txt", "utf8");
const test: string = `0: 3
1: 2
4: 4
6: 4`;

function parseInput(input: string): Record<string, number> {
  const firewalls: Record<string, number> = {};
  input.split("\n").forEach((line) => {
    const [lhs, rhs] = line.split(": ");
    firewalls[lhs] = parseInt(rhs);
  });
  return firewalls;
}

function part1(input: string): number {
  const firewalls = parseInput(input);
  let sev = 0;
  Object.keys(firewalls).forEach((idx) => {
    const depth = parseInt(idx);
    const range = firewalls[idx];
    const backforthRange = range * 2 - 2; // the range is the time taken to go back and forth top to bottom, but lose 2 for only being at each end once
    const time = depth;
    if (time % backforthRange === 0) {
      sev += depth * range;
    }
  });
  return sev;
}

function part2(input: string): number {
  console.time("part2");
  const firewalls = parseInput(input);
  let delay = 0;

  while (
    Object.keys(firewalls).find((idx) => {
      const backforthRange = firewalls[idx] * 2 - 2; // the range is the time taken to go back and forth top to bottom, but lose 2 for only being at each end once
      const time = parseInt(idx) + delay;
      return time % backforthRange === 0;
    })
  ) {
    delay++;
  }
  console.timeEnd("part2");
  return delay;
}

const t = part1(test);
if (t === 24) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test);
  if (t2 === 10) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
