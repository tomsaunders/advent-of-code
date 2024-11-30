#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 2
 *
 * Summary: Count instances of a list of strings having repeated letter counts of two and three
 * Escalation: Find the two strings which differ only by one character
 * Solution: Part 1 - make a function that checks whether a given string has a particular character code repeated exactly n times.
 * Part 2 - Double loop and check whether the intersection of two strings is only one char off the length of one string
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`;

const test2 = `abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`;

function parseInput(input: string): string[] {
  return input.split("\n");
}

function part1(input: string): number {
  const boxIDs = parseInput(input);
  function hasCount(count: number, str: string): boolean {
    const m: number[] = new Array(200).fill(0);
    str.split("").forEach((c) => m[c.charCodeAt(0)]++);
    return !!m.find((x) => x === count);
  }
  const twos = boxIDs.filter((x) => hasCount(2, x));
  const threes = boxIDs.filter((x) => hasCount(3, x));
  return twos.length * threes.length;
}

function part2(input: string): string {
  const boxIDs = parseInput(input);

  function diff(a: string, b: string): string {
    let d = "";
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) {
        d += a[i];
      }
    }
    return d;
  }

  for (let i = 0; i < boxIDs.length; i++) {
    for (let j = i + 1; j < boxIDs.length; j++) {
      const d = diff(boxIDs[i], boxIDs[j]);
      if (d.length === boxIDs[i].length - 1) {
        return d;
      }
    }
  }

  return "0";
}

const t = part1(test);
if (t === 12) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === "fgij") {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
