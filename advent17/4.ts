#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 4
 *
 * Summary: Parse strings to work out if they are valid passphrases according to a no-duplicates rule
 * Escalation: Change the rule
 * Solution: Basic parsing and looping, use a set to check uniqueness of phrases
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input4.txt", "utf8");
const test = `aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`;

const test2 = `abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio`;

function parseInput(input: string): string[] {
  return input.split("\n");
}

function part1(input: string): number {
  const lines = parseInput(input);
  return lines.filter((line) => {
    const bits = line.split(" ");
    const unique = new Set<string>(bits);
    return bits.length === unique.size;
  }).length;
}

function part2(input: string): number {
  const lines = parseInput(input);
  return lines.filter((line) => {
    const bits = line.split(" ").map((b) => b.split("").sort().join(""));
    const unique = new Set<string>(bits);
    return bits.length === unique.size;
  }).length;
}

const t = part1(test);
if (t === 2) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === 3) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
