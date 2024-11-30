#!/usr/bin/env ts-node
/**
 * Advent of Code 2018 - Day 5
 *
 * Summary: Process a 'polymer' string until it no longer changes
 * Escalation: For each letter in the alphabet, remove it from the input and see what the lowest score is
 * Solution: Use a while (last !== current) loop to handle 'until it no longer changes'. Then re-run part1 26 times to solve part2.
 * Performance: A naive string replacement function took 10s to run the whole answer, a basic regex took 3s.
 *
 * Keywords: Performance, RegEx
 * References: N/A
 */
import * as fs from "fs";
const input = fs.readFileSync("input5.txt", "utf8");
const test = `dabAcCaCBAcCcaDA`;

function replace(str: string, search: string): string {
  return str.replace(new RegExp(search, "g"), "");
}

function part1(input: string): number {
  function react(str: string): string {
    // A is 65 a is 97
    for (let i = 0; i < 26; i++) {
      const low = String.fromCharCode(97 + i);
      const cap = low.toUpperCase();
      str = replace(str, low + cap);
      str = replace(str, cap + low);
    }
    return str;
  }

  let last = "";
  let current = input;
  while (last !== current) {
    last = current;
    current = react(current);
  }
  return current.length;
}

function part2(input: string): number {
  const polymerLengths: number[] = [];
  for (let i = 0; i < 26; i++) {
    let tmp = replace(input, String.fromCharCode(65 + i));
    tmp = replace(tmp, String.fromCharCode(97 + i));
    polymerLengths.push(part1(tmp));
  }
  return Math.min(...polymerLengths);
}

const t = part1(test);
if (t === 10) {
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
