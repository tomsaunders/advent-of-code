#!/usr/bin/env ts-node
/**
 * Advent of Code 2017 - Day 2
 *
 * Summary: Sum the differences of numbers in a row
 * Escalation: Sum the even divisors in a row
 * Solution: Basic parsing and looping
 *
 * Keywords: Easy
 * References: N/A
 */
import * as fs from "fs";
import { mapNum } from "./util";
const input = fs.readFileSync("input2.txt", "utf8");
const test = `5 1 9 5
7 5 3
2 4 6 8`;

const test2 = `5 9 2 8
9 4 7 3
3 8 6 5`;

function parseInput(input: string): number[][] {
  return input.split("\n").map((line) =>
    line
      .replace(/\t/g, " ")
      .split(" ")
      .filter((x) => !!x)
      .map(mapNum)
  );
}

function part1(input: string): number {
  return parseInput(input).reduce((sum, row) => sum + Math.max(...row) - Math.min(...row), 0);
}

function part2(input: string): number {
  return parseInput(input).reduce((sum, row) => sum + evenDivisors(row), 0);
}

function evenDivisors(row: number[]): number {
  row.sort((a, b) => b - a);
  for (let i = 0; i < row.length; i++) {
    for (let j = i + 1; j < row.length; j++) {
      if (row[i] % row[j] === 0) {
        // console.log(row, row[i], row[j]);
        return row[i] / row[j];
      }
    }
  }
  console.log("ERRORRRRR", row);
  return 0;
}

const t = part1(test);
if (t === 18) {
  console.log("part 1 answer", part1(input));
  const t2 = part2(test2);
  if (t2 === 9) {
    console.log("part 2 answer", part2(input));
  } else {
    console.log("part 2 test fail", t2);
  }
} else {
  console.log("part 1 test fail", t);
}
