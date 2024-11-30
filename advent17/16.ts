#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 16
 *
 * Summary: Simulate 'dance moves' that shuffle an array
 * Escalation: Do it a billion times
 * Naive: Attempt memoisation for the dance - not the answer because the billion loops still take a lot of time
 * Solution: Calculate the cycle length and skip forward until just before the billionth time.
 *
 * Keywords: Cycle
 * References:
 */
import * as fs from "fs";
const input = fs.readFileSync("input16.txt", "utf8");
const test: string = `s1,x3/4,pe/b`;

type Move = "s" | "x" | "p";

function parseInput(input: string): [Move, string][] {
  return input.split(",").map((line) => {
    return [line[0] as Move, line.slice(1)];
  });
}

function dance(steps: [Move, string][], programs: string[]) {
  steps.forEach(([step, target]) => {
    if (step === "s") {
      const end = programs.slice(-parseInt(target));
      const front = programs.slice(0, -parseInt(target));
      programs = end.concat(front);
    } else {
      let idxA = 0;
      let idxB = 0;
      if (step === "p") {
        const [a, b] = target.split("/");
        idxA = programs.findIndex((p) => p === a);
        idxB = programs.findIndex((p) => p === b);
      }
      if (step === "x") {
        const [a, b] = target.split("/");
        idxA = parseInt(a);
        idxB = parseInt(b);
      }
      const temp = programs[idxA];
      programs[idxA] = programs[idxB];
      programs[idxB] = temp;
    }
  });
  return programs;
}

function part1(input: string, line: string = "abcdefghijklmnop"): string {
  const steps = parseInput(input);
  const programs = dance(steps, line.split(""));
  return programs.join("");
}

function part2(input: string, line: string = "abcdefghijklmnop"): string {
  const steps = parseInput(input);
  const seen = new Map<string, number>();
  for (let i = 0; i < 1000000000; i++) {
    line = dance(steps, line.split("")).join("");
    if (seen.has(line)) {
      const cycle = i - seen.get(line)!;
      i += Math.floor(1000000000 / cycle) * cycle - cycle;
    } else {
      seen.set(line, i);
    }
  }
  return line;
}

const t1 = part1(test, "abcde");
if (t1 === "baedc") {
  console.log("part 1 answer", part1(input));
  const t2 = part1(test, t1);
  if (t2 === "ceadb") {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t1);
}
