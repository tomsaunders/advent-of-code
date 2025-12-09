#!/usr/bin/env ts-node
/**
 * Advent of Code 2025 - Day x
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
import { arrProd, arrSum, Cell, Grid } from "./util";
const input = fs.readFileSync("input6.txt", "utf8");
const test = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

type Problem = {
  nums: number[];
  strings: string[];
  operation: "+" | "*";
};

function parseInput(input: string): Problem[] {
  const lines = input.split("\n").map((line) => {
    return line.split(" ").filter((x) => !!x);
  });
  const o = lines.length - 1;
  const count = lines[o].length;
  const problems: Problem[] = [];
  for (let n = 0; n < count; n++) {
    const problem: Problem = {
      nums: [],
      strings: [],
      operation: lines[o][n] as "+" | "*",
    };
    for (let l = 0; l < o; l++) {
      problem.strings.push(lines[l][n]);
      problem.nums.push(parseInt(lines[l][n]));
    }
    problems.push(problem);
  }

  return problems;
}

function part1(input: string): number {
  const problems = parseInput(input);
  return arrSum(
    problems.map((problem) => {
      if (problem.operation === "+") {
        return arrSum(problem.nums);
      } else if (problem.operation === "*") {
        return arrProd(problem.nums);
      }
      return 0;
    }),
  );
}

function getNums(problem: Problem): number[] {
  const longest = Math.max(...problem.strings.map((s) => s.length));
  const nums: string[] = [];
  for (let i = 0; i < longest; i++) {
    let num = "";
    for (let n = 0; n < problem.strings.length; n++) {
      if (problem.strings[n][i] !== undefined) {
        num += problem.strings[n][i];
      }
    }
  }
  return nums.map((n) => parseInt(n));
}

function part2(input: string): number {
  const problems = parseInput(input);
  return arrSum(
    problems.map((problem) => {
      const nums = getNums(problem);
      console.log("get nums", problem, nums);
      if (problem.operation === "+") {
        return arrSum(nums);
      } else if (problem.operation === "*") {
        return arrProd(nums);
      }
      return 0;
    }),
  );
}

const t = part1(test);
if (t == 4277556) {
  console.log("part 1 answer", part1(input));
} else {
  console.log("part 1 test fail", t);
}
const t2 = part2(test);
if (t2 == 3263827) {
  console.log("part 2 answer", part2(input));
} else {
  console.log("part 2 test fail", t2);
}
