#!/usr/bin/env ts-node
/**
 * Advent of Code 2024 - Day x
 *
 * Summary:
 * Escalation:
 * Naive:  N/A
 * Solution:
 *  1.
 *  2.
 *
 * Keywords: grid, word search
 * References: N/A
 */
import * as fs from "fs";
import { arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input19.txt", "utf8");
const test = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

function parseInput(input: string): {
  towelPatterns: string[];
  desiredDesigns: string[];
} {
  const lines = input.split("\n");
  const towels = lines.shift()!;
  lines.shift(); //empty
  return { towelPatterns: towels.split(", "), desiredDesigns: lines };
}

function part1(input: string): number {
  const { desiredDesigns, towelPatterns } = parseInput(input);

  const cache: Record<string, boolean> = {};
  function isPossible(design: string): boolean {
    if (!cache[design]) {
      cache[design] = calcIsPossible(design);
    }
    return cache[design];
  }

  function calcIsPossible(design: string): boolean {
    if (design.length === 0) return true;

    for (let i = 0; i < towelPatterns.length; i++) {
      const towel = towelPatterns[i];
      if (design.startsWith(towel)) {
        const poss = isPossible(design.substring(towel.length));
        if (poss) {
          return true;
        }
      }
    }
    return false;
  }

  return desiredDesigns.filter((design) => isPossible(design)).length;
}

function part2(input: string): number {
  const { desiredDesigns, towelPatterns } = parseInput(input);

  const cache: Record<string, number> = {};
  function howManyPossible(design: string): number {
    if (!cache[design]) {
      cache[design] = calcHowManyPossible(design);
    }
    return cache[design];
  }

  function calcHowManyPossible(design: string): number {
    if (design.length === 0) return 1;

    let count = 0;
    for (let i = 0; i < towelPatterns.length; i++) {
      const towel = towelPatterns[i];
      if (design.startsWith(towel)) {
        count += howManyPossible(design.substring(towel.length));
      }
    }
    return count;
  }

  return arrSum(desiredDesigns.map((design) => howManyPossible(design)));
}

const t = part1(test);
if (t == 6) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 16) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
